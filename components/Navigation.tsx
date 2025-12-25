'use client';

import { useState } from 'react';

interface SocialLink {
    app: string;
    url: string;
    iconUrl: string;
    id: number;
}

interface NavigationProps {
    socialLinks: SocialLink[];
}

export default function Navigation({ socialLinks }: NavigationProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="nav-wrapper">
            <button
                className={`mobile-toggle ${isOpen ? 'open' : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle Menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
                <nav style={{ display: 'flex', gap: '20px', flexDirection: 'inherit', alignItems: 'inherit' }}>
                    <a href="/" className="font-sans" style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Home
                    </a>
                    <a href="/articles" className="font-sans" style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Articles
                    </a>
                    <a href="/recipes" className="font-sans" style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Recipes
                    </a>
                </nav>

                {socialLinks.length > 0 && (
                    <div style={{ display: 'flex', gap: '15px' }}>
                        {socialLinks.map((link) => (
                            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={link.iconUrl} alt={link.app} style={{ height: '20px', width: 'auto' }} />
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Overlay for mobile when menu is open */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 80, background: 'rgba(0,0,0,0.2)' }}
                    className="mobile-overlay"
                />
            )}
        </div>
    );
}
