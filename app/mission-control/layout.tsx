export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <aside style={{ width: '250px', backgroundColor: '#111', color: '#fff', padding: '30px', flexShrink: 0 }}>
                <div style={{ marginBottom: '40px', fontSize: '20px', fontWeight: 'bold' }}>
                    Mission Control
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <a href="/mission-control" style={{ color: '#ccc', textDecoration: 'none' }}>Articles</a>
                    <a href="/mission-control/recipes" style={{ color: '#ccc', textDecoration: 'none' }}>Recipes</a>
                    <a href="/mission-control/images" style={{ color: '#ccc', textDecoration: 'none' }}>Images</a>
                    <a href="/mission-control/style" style={{ color: '#ccc', textDecoration: 'none' }}>Style</a>
                    <a href="/mission-control/social" style={{ color: '#ccc', textDecoration: 'none' }}>Social</a>
                    <a href="/mission-control/analytics" style={{ color: '#ccc', textDecoration: 'none' }}>Analytics</a>
                    <a href="/" target="_blank" style={{ color: '#666', marginTop: 'auto', fontSize: '12px' }}>View Live Site ↗</a>
                </nav>
            </aside>
            <main style={{ flexGrow: 1, backgroundColor: '#f4f4f4', padding: '40px' }}>
                <div>
                    {children}
                </div>
            </main>
        </div>
    );
}
