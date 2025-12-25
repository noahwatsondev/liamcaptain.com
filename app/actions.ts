'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { cwd } from "process";

export async function createArticle(formData: FormData) {
    const title = formData.get('title') as string;
    const type = (formData.get('type') as string) || 'ARTICLE';
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();

    const article = await prisma.article.create({
        data: {
            title,
            slug,
            content: '', // Start empty
            published: false,
            updatedAt: new Date(),
            type,
        }
    });

    redirect(`/mission-control/write/${article.id}`);
}

export async function updateArticle(id: number, formData: FormData) {
    const data = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        excerpt: formData.get('excerpt') as string,
        author: formData.get('author') as string,
        content: formData.get('content') as string,
        featuredImage: formData.get('featuredImage') as string,
        seoTitle: formData.get('seoTitle') as string,
        seoDescription: formData.get('seoDescription') as string,
        updatedAt: new Date(),
    };

    await prisma.article.update({
        where: { id },
        data
    });

    revalidatePath(`/mission-control/write/${id}`);
    revalidatePath(`/read/${data.slug}`);
    revalidatePath('/');
}

export async function togglePublish(id: number, currentState: boolean) {
    const isUnpublishing = currentState === true;

    await prisma.article.update({
        where: { id },
        data: {
            published: !currentState,
            publishedAt: !currentState ? new Date() : null, // Set date on publish
            updatedAt: new Date(),
            // If unpublishing, also remove featured status
            ...(isUnpublishing ? { isFeatured: false } : {})
        }
    });

    await ensureFeaturedArticle();

    revalidatePath('/mission-control');
    revalidatePath('/');
}

export async function deleteArticle(id: number) {
    await prisma.article.delete({ where: { id } });
    await ensureFeaturedArticle();
    revalidatePath('/mission-control');
    revalidatePath('/');
}

export async function setFeaturedArticle(id: number) {
    // Get the type of the article being featured
    const article = await prisma.article.findUnique({
        where: { id },
        select: { type: true }
    });

    if (!article) return;

    // Transaction to ensure only one article OF THAT TYPE is featured
    await prisma.$transaction([
        // Unset featured for all of this type
        prisma.article.updateMany({
            where: { isFeatured: true, type: article.type },
            data: { isFeatured: false }
        }),
        // Set featured for selected
        prisma.article.update({
            where: { id },
            data: { isFeatured: true }
        })
    ]);

    revalidatePath('/mission-control');
    revalidatePath('/mission-control/recipes');
    revalidatePath('/');
    revalidatePath('/recipes');
}

async function ensureFeaturedArticle() {
    // Check for both types
    const types = ['ARTICLE', 'RECIPE'];

    for (const type of types) {
        // Check if there is a currently featured article of this type that is published
        const currentFeatured = await prisma.article.findFirst({
            where: { isFeatured: true, published: true, type }
        });

        // If no published article is featured, pick the most recently published one of this type
        if (!currentFeatured) {
            const latest = await prisma.article.findFirst({
                where: { published: true, type },
                orderBy: { publishedAt: 'desc' }
            });

            if (latest) {
                await prisma.article.update({
                    where: { id: latest.id },
                    data: { isFeatured: true }
                });
            }
        }
    }
}

export async function updateSiteSettings(formData: FormData) {
    const logoUrl = formData.get('logoUrl') as string;
    const faviconUrl = formData.get('faviconUrl') as string;
    const logoStyles = formData.get('logoStyles') as string;
    const logoText = formData.get('logoText') as string;
    const googleFontImport = formData.get('googleFontImport') as string;
    const googleFontCss = formData.get('googleFontCss') as string;
    const logoTextStyles = formData.get('logoTextStyles') as string;

    const existing = await prisma.siteSettings.findFirst();

    if (existing) {
        await prisma.siteSettings.update({
            where: { id: existing.id },
            data: {
                logoUrl,
                faviconUrl,
                logoStyles,
                logoText,
                googleFontImport,
                googleFontCss,
                logoTextStyles
            }
        });
    } else {
        await prisma.siteSettings.create({
            data: {
                logoUrl,
                faviconUrl,
                logoStyles,
                logoText,
                googleFontImport,
                googleFontCss,
                logoTextStyles
            }
        });
    }

    revalidatePath('/');
    revalidatePath('/mission-control/style');
}

export async function uploadImage(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('No file uploaded');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.name);
    const basename = path.basename(file.name, extension).replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const filename = `${basename}-${uniqueSuffix}${extension}`;

    // Ensure upload directory exists
    const uploadDir = path.join(cwd(), 'public', 'uploads');
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // Ignore error if directory exists
    }

    // Write file
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Save to DB
    const url = `/uploads/${filename}`;
    await prisma.image.create({
        data: {
            url,
            filename: file.name
        }
    });

    revalidatePath('/mission-control/images');
}

export async function deleteImage(id: number, url: string) {
    // Delete from DB
    await prisma.image.delete({
        where: { id }
    });

    // Delete file from filesystem
    try {
        const filename = url.split('/').pop();
        if (filename) {
            const filePath = path.join(cwd(), 'public', 'uploads', filename);
            await unlink(filePath);
        }
    } catch (e) {
        console.error('Failed to delete file:', e);
    }

    revalidatePath('/mission-control/images');
}

export async function updateSocialLinks(formData: FormData) {
    // 1. Delete all existing social links (simplest way to handle updates/removals)
    await prisma.socialLink.deleteMany({});

    // 2. Parse form data to extract links
    const apps = formData.getAll('app[]') as string[];
    const urls = formData.getAll('url[]') as string[];
    const iconUrls = formData.getAll('iconUrl[]') as string[];

    // 3. Create new links if data exists
    if (apps.length > 0) {
        const linksToCreate = apps.map((app, index) => ({
            app,
            url: urls[index],
            iconUrl: iconUrls[index],
            order: index
        })).filter(link => link.app && link.url && link.iconUrl); // Basic validation

        if (linksToCreate.length > 0) {
            await prisma.socialLink.createMany({
                data: linksToCreate
            });
        }
    }

    revalidatePath('/');
    revalidatePath('/mission-control/social');
}
