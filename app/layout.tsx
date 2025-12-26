import type { Metadata } from "next";
import "./globals.css";
import { prisma } from "@/lib/prisma";
import Navigation from "@/components/Navigation";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findFirst();
  const title = settings?.logoText || "The Articles App";

  return {
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: "A comprehensive publication for thoughtful reading.",
    icons: {
      icon: settings?.faviconUrl || settings?.logoUrl || '/favicon.ico',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await prisma.siteSettings.findFirst();
  const socialLinks = await prisma.socialLink.findMany({
    orderBy: { order: 'asc' }
  });

  // Extract class name from Google Font CSS if present (e.g. .classname { ... })
  const fontClassMatch = settings?.googleFontCss?.match(/\.([a-zA-Z0-9_-]+)\s*\{/);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Dynamic Site Settings Styles */}
        {/* Dynamic Site Settings Styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
          ${settings?.googleFontImport?.replace(/<\/?style>/g, '') || ''}
          ${settings?.googleFontCss || ''}
          #site-logo { 
            height: 32px; 
            width: auto;
            ${settings?.logoStyles || ''} 
          }
          #site-logo-text { 
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
            ${settings?.logoTextStyles || ''} 
          }
        `}} />

        <header className="container site-header">
          <a href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {settings?.logoUrl && (
              <img
                id="site-logo"
                src={settings.logoUrl}
                alt={settings.logoText || "The Articles App"}
                style={{ maxHeight: '40px', width: 'auto' }}
                className={fontClassMatch ? fontClassMatch[1] : undefined}
              />
            )}
            <span
              id="site-logo-text"
              className={`font-serif ${fontClassMatch ? fontClassMatch[1] : ''}`}
            >
              {settings?.logoText || "The Articles App"}
            </span>
          </a>

          <Navigation socialLinks={socialLinks} />
        </header>

        <main style={{ minHeight: '80vh' }}>
          {children}
        </main>

        <footer style={{ borderTop: '1px solid var(--color-border)', padding: '40px 0', textAlign: 'center', marginTop: '60px' }}>
          <div className="container">
            {socialLinks.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                {socialLinks.map((link) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={link.iconUrl} alt={link.app} style={{ height: '24px', width: 'auto', opacity: 0.6 }} />
                  </a>
                ))}
              </div>
            )}
            <div className="font-sans" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              &copy; {new Date().getFullYear()} {settings?.logoText || "The Articles App"}. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
