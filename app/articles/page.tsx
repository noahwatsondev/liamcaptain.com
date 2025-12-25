import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from 'next';

export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: 'Articles',
};

async function getArticles() {
  const articles = await prisma.article.findMany({
    where: { published: true, type: 'ARTICLE' },
    orderBy: [
      { isFeatured: 'desc' },
      { publishedAt: 'desc' },
    ],
    take: 10,
  });
  return articles;
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  if (articles.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2 style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No articles published yet.</h2>
        <p style={{ marginTop: '20px' }}>
          <Link href="/mission-control" className="btn">
            Go to Mission Control
          </Link>
        </p>
      </div>
    );
  }

  const [featured, ...rest] = articles;

  return (
    <div className="container">
      {/* Featured Article */}
      <section className="featured-section" style={{ marginBottom: '60px' }}>
        <div className="article-card featured" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
          {featured.featuredImage && (
            <div className="image-wrapper" style={{ height: '400px', backgroundColor: '#eee' }}>
              <img src={featured.featuredImage} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div className="content">
            <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 600, letterSpacing: '1px' }}>
              Featured
            </span>
            <h1 style={{ fontSize: '42px', margin: '15px 0' }}>
              <Link href={`/read/${featured.slug}`} className="hover-underline">
                {featured.title}
              </Link>
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', marginBottom: '20px' }}>
              {featured.excerpt}
            </p>
            <Link href={`/read/${featured.slug}`} className="btn">
              Read Story
            </Link>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* Recent Articles Grid */}
      <section className="recent-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px' }}>
        {rest.map((article) => (
          <article key={article.id} className="article-card">
            {article.featuredImage && (
              <div style={{ height: '200px', backgroundColor: '#eee', marginBottom: '15px' }}>
                <img src={article.featuredImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>
              <Link href={`/read/${article.slug}`}>
                {article.title}
              </Link>
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.5 }}>
              {article.excerpt}
            </p>
            <div style={{ marginTop: '15px', fontSize: '12px', color: '#999', fontFamily: 'var(--font-sans)' }}>
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
