'use client'

import { setFeaturedArticle } from "@/app/actions";
import { useTransition } from "react";

export default function FeaturedRadioButton({ articleId, isFeatured }: { articleId: number, isFeatured: boolean }) {
    const [isPending, startTransition] = useTransition();

    const handleClick = (e: React.MouseEvent) => {
        if (isFeatured) {
            e.preventDefault();
            return;
        }

        // Prevent the radio button from changing state immediately
        e.preventDefault();

        if (window.confirm("Are you sure you want to feature this article? It will replace the currently featured one.")) {
            startTransition(async () => {
                try {
                    await setFeaturedArticle(articleId);
                } catch (error) {
                    console.error('Failed to set featured article:', error);
                    alert("Failed to update featured article. Please try again.");
                }
            });
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <input
                type="radio"
                name="featured_article"
                checked={isFeatured}
                readOnly
                onClick={handleClick}
                disabled={isPending}
                style={{
                    cursor: isPending ? 'wait' : 'pointer',
                    width: '16px',
                    height: '16px',
                    accentColor: 'var(--color-accent)',
                    opacity: isPending ? 0.6 : 1
                }}
            />
        </div>
    );
}
