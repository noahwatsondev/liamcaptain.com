import { prisma } from "@/lib/prisma";
import { updateSiteSettings } from "@/app/actions";

export default async function StylePage() {
    const settings = await prisma.siteSettings.findFirst();

    return (
        <div>
            <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '24px', marginBottom: '30px' }}>Style Settings</h1>

            <form action={updateSiteSettings} style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', maxWidth: '600px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Favicon URL (upload .ico to Images page first)</label>
                    <input
                        type="text"
                        name="faviconUrl"
                        defaultValue={settings?.faviconUrl || ''}
                        placeholder="https://..."
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Logo URL</label>
                    <input
                        type="text"
                        name="logoUrl"
                        defaultValue={settings?.logoUrl || ''}
                        placeholder="https://..."
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                    />
                    {settings?.logoUrl && (
                        <div style={{ marginTop: '10px' }}>
                            <p style={{ fontSize: '11px', marginBottom: '5px', color: '#666' }}>Current Preview:</p>
                            <img src={settings.logoUrl} alt="Logo Preview" style={{ maxHeight: '50px' }} />
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Logo Styles (CSS)</label>
                    <textarea
                        name="logoStyles"
                        defaultValue={settings?.logoStyles || ''}
                        placeholder="height: 40px; margin-right: 10px;"
                        rows={2}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'monospace' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Logo Text</label>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>
                        Leave blank to show "The Articles" or if using a Logo URL without text.
                    </div>
                    <input
                        type="text"
                        name="logoText"
                        defaultValue={settings?.logoText || ''}
                        placeholder="The Articles"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Google Font Import Code</label>
                    <textarea
                        name="googleFontImport"
                        defaultValue={settings?.googleFontImport || ''}
                        placeholder={`<style>\n@import url('https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap');\n</style>`}
                        rows={2}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'monospace' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Google Font CSS</label>
                    <textarea
                        name="googleFontCss"
                        defaultValue={settings?.googleFontCss || ''}
                        placeholder={`.alegreya-regular {\n  font-family: "Alegreya", serif;\n}`}
                        rows={4}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'monospace' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Logo Text Styles (CSS)</label>
                    <textarea
                        name="logoTextStyles"
                        defaultValue={settings?.logoTextStyles || ''}
                        placeholder="color: #333; font-weight: 700;"
                        rows={2}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'monospace' }}
                    />
                </div>

                <button type="submit" className="btn" style={{ background: '#000', color: '#fff', height: '44px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Save Settings
                </button>
            </form>
        </div>
    );
}
