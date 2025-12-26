import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ArticleEditorForm from "./ArticleEditorForm";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await prisma.article.findUnique({
        where: { id: parseInt(id) },
    });

    if (!article) {
        notFound();
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '24px' }}>Edit Article</h1>
                <div style={{ fontSize: '13px', color: article.published ? 'green' : '#888' }}>
                    {article.published ? 'Live' : 'Draft'}
                </div>
            </div>

            <ArticleEditorForm article={article} />
        </div>
    );
}
