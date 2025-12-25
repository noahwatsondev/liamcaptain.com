
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
    return await prisma.article.findUnique({
        where: { slug },
    });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticle(slug);
    if (!article) return { title: "Article Not Found" };

    return {
        title: article.seoTitle || article.title,
        description: article.seoDescription || article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt || "",
            images: article.featuredImage ? [article.featuredImage] : [],
        },
    };
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    return (
        <article className="article-container" style={{ marginTop: '60px' }}>
            <header style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ fontSize: '48px', marginBottom: '20px', lineHeight: 1.1 }}>{article.title}</h1>
                {article.excerpt && (
                    <p style={{ fontSize: '20px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        {article.excerpt}
                    </p>
                )}
                <div style={{ marginTop: '30px', fontFamily: 'var(--font-sans)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888' }}>
                    {article.author && (
                        <div style={{ color: 'var(--color-text-main)', fontWeight: 600, marginBottom: '8px' }}>
                            By {article.author}
                        </div>
                    )}
                    Published {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                </div>
            </header>

            {article.featuredImage && (
                <div style={{ width: '100%', height: 'auto', marginBottom: '50px' }}>
                    <img src={article.featuredImage} alt={article.title} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }} />
                </div>
            )}

            <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: article.content }}
                style={{ fontSize: '19px', lineHeight: 1.8, fontFamily: 'var(--font-serif)' }}
            />

            {/* Styles for article content specifically */}
            <style>{`
                .article-content p { margin-bottom: 24px; }
                .article-content h2 { font-size: 32px; margin-top: 48px; margin-bottom: 24px; }
                .article-content h3 { font-size: 24px; margin-top: 32px; margin-bottom: 16px; font-family: var(--font-sans); }
                .article-content blockquote { border-left: 2px solid var(--color-accent); padding-left: 20px; font-style: italic; color: #555; margin: 30px 0; }
                .article-content img { max-width: 100%; height: auto; margin: 30px 0; display: block; border-radius: 4px; }
                .article-content figure { margin: 30px 0; max-width: 100%; }
                .article-content figcaption { text-align: center; font-family: var(--font-sans); font-size: 13px; color: #777; margin-top: 10px; }
                .article-content a { color: var(--color-text-main); text-decoration: underline; text-decoration-color: var(--color-accent); text-underline-offset: 4px; }
            `}</style>
        </article>
    );
}
