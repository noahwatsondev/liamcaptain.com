import { prisma } from "@/lib/prisma";
import { updateArticle } from "@/app/actions";
import { notFound } from "next/navigation";
import BlockNoteEditorWrapper from "./EditorWrapper";

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

            <form action={updateArticle.bind(null, article.id)} style={{ margin: '0 0' }}>

                {/* Article Settings */}
                <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Title</label>
                            <input type="text" name="title" defaultValue={article.title} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Slug</label>
                            <input type="text" name="slug" defaultValue={article.slug} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Excerpt</label>
                        <textarea name="excerpt" defaultValue={article.excerpt || ''} rows={3} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit' }}></textarea>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Author</label>
                        <input type="text" name="author" defaultValue={article.author || 'Liam C. Watson'} placeholder="e.g. Liam Captain" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Featured Image URL</label>
                        <input type="text" name="featuredImage" defaultValue={article.featuredImage || ''} placeholder="https://..." style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
                        {article.featuredImage && (
                            <div style={{ marginTop: '10px', width: '200px', borderRadius: '4px', background: '#f4f4f4' }}>
                                <img src={article.featuredImage} alt="Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>SEO Title</label>
                            <input type="text" name="seoTitle" defaultValue={article.seoTitle || ''} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>SEO Description</label>
                            <input type="text" name="seoDescription" defaultValue={article.seoDescription || ''} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
                        </div>
                    </div>

                    <button type="submit" className="btn" style={{ background: '#000', color: '#fff', width: '100%', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Save Changes
                    </button>
                </div>

                {/* Main Editor */}
                <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <BlockNoteEditorWrapper initialContent={article.content} />
                </div>

            </form>
        </div>
    );
}
