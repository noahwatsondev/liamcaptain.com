import { prisma } from "@/lib/prisma";
import { createArticle, deleteArticle, togglePublish } from "@/app/actions";
import Link from "next/link";
import FeaturedRadioButton from "@/components/FeaturedRadioButton";

export const revalidate = 0; // Always dynamic

export default async function RecipesDashboard() {
    const articles = await prisma.article.findMany({
        where: { type: 'RECIPE' },
        orderBy: [
            { publishedAt: 'desc' },
            { updatedAt: 'desc' }
        ]
    });

    const formatDateTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(new Date(date));
    };

    return (
        <div>
            {/* ... header ... */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '24px' }}>Recipes</h1>

                <form action={createArticle} style={{ display: 'flex', gap: '10px' }}>
                    <input type="hidden" name="type" value="RECIPE" />
                    <input
                        type="text"
                        name="title"
                        placeholder="New Recipe Title"
                        required
                        style={{ padding: '0 12px', height: '40px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '300px' }}
                    />
                    <button type="submit" style={{ height: '40px', padding: '0 20px', background: '#000', color: '#fff', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
                        Create Draft
                    </button>
                </form>
            </div>

            <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '15px', fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#777' }}>TITLE</th>
                            <th style={{ padding: '15px', fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#777', textAlign: 'center' }}>FEATURED</th>
                            <th style={{ padding: '15px', fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#777' }}>STATUS</th>
                            <th style={{ padding: '15px', fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#777' }}>CREATED</th>
                            <th style={{ padding: '15px', fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#777' }}>UPDATED</th>
                            <th style={{ padding: '15px', fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#777', textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((article) => (
                            <tr key={article.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px', fontWeight: 500 }}>
                                    <Link href={`/mission-control/write/${article.id}`} style={{ color: 'inherit' }}>
                                        {article.title}
                                    </Link>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {article.published && (
                                        <FeaturedRadioButton articleId={article.id} isFeatured={article.isFeatured} />
                                    )}
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            background: article.published ? '#e6f4ea' : '#f1f3f4',
                                            color: article.published ? '#1e8e3e' : '#5f6368',
                                            fontSize: '11px', fontWeight: 600,
                                            width: 'fit-content'
                                        }}>
                                            {article.published ? 'PUBLISHED' : 'DRAFT'}
                                        </span>
                                        {article.published && article.publishedAt && (
                                            <span style={{ fontSize: '10px', color: '#777' }}>
                                                {formatDateTime(article.publishedAt)}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td style={{ padding: '15px', fontSize: '13px', color: '#666' }}>
                                    {formatDateTime(article.createdAt)}
                                </td>
                                <td style={{ padding: '15px', fontSize: '13px', color: '#666' }}>
                                    {formatDateTime(article.updatedAt)}
                                </td>
                                <td style={{ padding: '15px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <Link href={`/mission-control/write/${article.id}`} style={{ height: '32px', padding: '0 12px', display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', background: '#fff' }}>
                                        Edit
                                    </Link>
                                    <form action={togglePublish.bind(null, article.id, article.published)}>
                                        <button style={{ height: '32px', padding: '0 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                            {article.published ? 'Unpublish' : 'Publish'}
                                        </button>
                                    </form>
                                    <form action={deleteArticle.bind(null, article.id)}>
                                        <button style={{ height: '32px', padding: '0 12px', border: 'none', borderRadius: '4px', fontSize: '12px', background: '#fee', color: '#c00', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                            Delete
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {articles.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#999' }}>No recipes yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
