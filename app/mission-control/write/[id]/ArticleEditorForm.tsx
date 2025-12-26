'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateArticle } from "@/app/actions";
import BlockNoteEditorWrapper from "./EditorWrapper";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            className="btn"
            disabled={pending}
            style={{
                background: '#000',
                color: '#fff',
                width: '100%',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pending ? 0.7 : 1
            }}
        >
            {pending ? 'Saving...' : 'Save Changes'}
        </button>
    );
}

// Define a minimal interface for the article props we need
interface ArticleData {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    author: string | null;
    featuredImage: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    content: string | null;
    published: boolean;
}

export default function ArticleEditorForm({ article }: { article: ArticleData }) {
    // State for controlled inputs to enable auto-fill
    const [title, setTitle] = useState(article.title || '');
    const [seoTitle, setSeoTitle] = useState(article.seoTitle || '');
    const [excerpt, setExcerpt] = useState(article.excerpt || '');
    const [seoDescription, setSeoDescription] = useState(article.seoDescription || '');
    const [showMessage, setShowMessage] = useState(false);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        setSeoTitle(newTitle);
    };

    const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newExcerpt = e.target.value;
        setExcerpt(newExcerpt);
        setSeoDescription(newExcerpt);
    };

    // Intercept form action to show toast
    const handleSubmit = async (formData: FormData) => {
        await updateArticle(article.id, formData);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
    };

    return (
        <form action={handleSubmit} style={{ margin: '0 0' }}>

            {/* Article Settings */}
            <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={handleTitleChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Slug</label>
                        <input type="text" name="slug" defaultValue={article.slug} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Excerpt</label>
                    <textarea
                        name="excerpt"
                        value={excerpt}
                        onChange={handleExcerptChange}
                        rows={3}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit' }}
                    ></textarea>
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
                        <input
                            type="text"
                            name="seoTitle"
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>SEO Description</label>
                        <input
                            type="text"
                            name="seoDescription"
                            value={seoDescription}
                            onChange={(e) => setSeoDescription(e.target.value)}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                        />
                    </div>
                </div>

                <SubmitButton />

                {showMessage && (
                    <div style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        background: '#333',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '4px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        fontSize: '14px',
                        animation: 'fadeIn 0.3s ease-out'
                    }}>
                        Changes Saved Successfully!
                    </div>
                )}
            </div>

            {/* Main Editor */}
            <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <BlockNoteEditorWrapper initialContent={article.content || ''} />
            </div>

        </form>
    );
}
