'use client';

import { useState } from 'react';
import { updateSocialLinks } from "@/app/actions";

interface SocialLink {
    app: string;
    url: string;
    iconUrl: string;
}

export default function SocialLinksForm({ initialLinks }: { initialLinks: SocialLink[] }) {
    const [links, setLinks] = useState<SocialLink[]>(initialLinks);
    const [draggedItem, setDraggedItem] = useState<number | null>(null);

    const addLink = () => {
        setLinks([...links, { app: 'Instagram', url: '', iconUrl: '' }]);
    };

    const removeLink = (index: number) => {
        const newLinks = [...links];
        newLinks.splice(index, 1);
        setLinks(newLinks);
    };

    const handleChange = (index: number, field: keyof SocialLink, value: string) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedItem(index);
        // Required for Firefox
        e.dataTransfer.effectAllowed = 'move';
        // Set transparent drag image or similar if desired, but default is fine
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (draggedItem === null) return;
        if (draggedItem === index) return;

        // Move item
        const newLinks = [...links];
        const draggedLink = newLinks[draggedItem];
        newLinks.splice(draggedItem, 1);
        newLinks.splice(index, 0, draggedLink);

        setLinks(newLinks);
        setDraggedItem(index);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    return (
        <form action={updateSocialLinks} style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', maxWidth: '800px' }}>
            {links.map((link, index) => (
                <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    style={{
                        marginBottom: '20px',
                        padding: '20px',
                        border: '1px solid #eee',
                        borderRadius: '4px',
                        position: 'relative',
                        background: draggedItem === index ? '#f9f9f9' : '#fff',
                        opacity: draggedItem === index ? 0.5 : 1,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'move'
                    }}
                >
                    <div style={{ position: 'absolute', left: '-10px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab', color: '#ccc' }} title="Drag to reorder">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" /></svg>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) 2fr 1fr', gap: '15px', paddingLeft: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '5px', textTransform: 'uppercase' }}>App</label>
                            <input
                                type="text"
                                name="app[]"
                                value={link.app}
                                onChange={(e) => handleChange(index, 'app', e.target.value)}
                                placeholder="Instagram"
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '5px', textTransform: 'uppercase' }}>URL</label>
                            <input
                                type="url"
                                name="url[]"
                                value={link.url}
                                onChange={(e) => handleChange(index, 'url', e.target.value)}
                                placeholder="https://..."
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '5px', textTransform: 'uppercase' }}>Icon URL</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    name="iconUrl[]"
                                    value={link.iconUrl}
                                    onChange={(e) => handleChange(index, 'iconUrl', e.target.value)}
                                    placeholder="https://..."
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                                    required
                                />
                                {link.iconUrl && (
                                    <div style={{ width: '36px', height: '36px', flexShrink: 0, background: '#f4f4f4', borderRadius: '4px', padding: '4px' }}>
                                        <img src={link.iconUrl} alt="Icon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => removeLink(index)}
                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#c00', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        DELETE
                    </button>
                    {/* Hidden inputs to preserve order on submit if needed, though order of inputs in DOM usually suffices */}
                </div>
            ))}

            <div style={{ display: 'flex', gap: '15px' }}>
                <button
                    type="button"
                    onClick={addLink}
                    className="btn"
                    style={{ background: '#fff', border: '1px solid #ddd', color: '#333', fontSize: '12px' }}
                >
                    + New App
                </button>

                <button
                    type="submit"
                    className="btn"
                    style={{ background: '#000', color: '#fff', fontSize: '12px', border: 'none', marginLeft: 'auto' }}
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
}
