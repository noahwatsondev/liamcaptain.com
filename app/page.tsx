import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Homepage',
};

async function getData() {
    const featuredArticle = await prisma.article.findFirst({
        where: { published: true, isFeatured: true, type: 'ARTICLE' },
    });

    const featuredRecipe = await prisma.article.findFirst({
        where: { published: true, isFeatured: true, type: 'RECIPE' },
    });

    // If no featured item found, fallback to latest of that type
    const article = featuredArticle || await prisma.article.findFirst({
        where: { published: true, type: 'ARTICLE' },
        orderBy: { publishedAt: 'desc' }
    });

    const recipe = featuredRecipe || await prisma.article.findFirst({
        where: { published: true, type: 'RECIPE' },
        orderBy: { publishedAt: 'desc' }
    });

    // NEW: Fetch recent items (mixed)
    const excludeIds = [];
    if (article) excludeIds.push(article.id);
    if (recipe) excludeIds.push(recipe.id);

    const recentItems = await prisma.article.findMany({
        where: {
            published: true,
            id: { notIn: excludeIds }
        },
        orderBy: { publishedAt: 'desc' },
        take: 16
    });

    return { article, recipe, recentItems };
}

export default async function HomePage() {
    const { article, recipe, recentItems } = await getData();

    return (
        <div className="container">
            <div className="hero-grid">
                {/* Featured Article Card */}
                {article && (
                    <div className="hero-card">
                        <Link href={`/read/${article.slug}`}>
                            {article.featuredImage ? (
                                <img
                                    src={article.featuredImage}
                                    alt={article.title}
                                    className="hero-image"
                                />
                            ) : (
                                <div className="hero-image-placeholder" />
                            )}
                        </Link>
                        <span className="hero-type-label">Featured Article</span>
                        <h2 className="hero-title">
                            <Link href={`/read/${article.slug}`} className="hover-underline">{article.title}</Link>
                        </h2>
                        <p className="hero-excerpt">{article.excerpt}</p>
                        <Link href={`/read/${article.slug}`} className="btn">Read Article</Link>
                    </div>
                )}

                {/* Featured Recipe Card */}
                {recipe && (
                    <div className="hero-card">
                        <Link href={`/read/${recipe.slug}`}>
                            {recipe.featuredImage ? (
                                <img
                                    src={recipe.featuredImage}
                                    alt={recipe.title}
                                    className="hero-image"
                                />
                            ) : (
                                <div className="hero-image-placeholder" />
                            )}
                        </Link>
                        <span className="hero-type-label">Featured Recipe</span>
                        <h2 className="hero-title">
                            <Link href={`/read/${recipe.slug}`} className="hover-underline">{recipe.title}</Link>
                        </h2>
                        <p className="hero-excerpt">{recipe.excerpt}</p>
                        <Link href={`/read/${recipe.slug}`} className="btn">View Recipe</Link>
                    </div>
                )}

                {!article && !recipe && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}>
                        <p>Welcome! Content is being prepared.</p>
                    </div>
                )}
            </div>



            {/* Recent Grid */}
            {recentItems.length > 0 && (
                <>
                    <div className="recent-header">More Articles & Recipes</div>
                    <div className="recent-grid">
                        {recentItems.map(item => (
                            <div key={item.id} className="recent-card">
                                <Link href={`/read/${item.slug}`}>
                                    <div className="image-container">
                                        {item.featuredImage ? (
                                            <img src={item.featuredImage} alt={item.title} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }}></div>
                                        )}
                                    </div>
                                </Link>
                                <div className="recent-content">
                                    <span className="recent-type">{item.type === 'RECIPE' ? 'Recipe' : 'Article'}</span>
                                    <h3 className="recent-title">
                                        <Link href={`/read/${item.slug}`} className="hover-underline">
                                            {item.title}
                                        </Link>
                                    </h3>
                                    <div className="recent-date">
                                        {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )
            }
        </div >
    );
}
