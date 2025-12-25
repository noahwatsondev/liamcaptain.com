'use client'

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useState } from "react";

export default function BlockNoteEditor({ initialContent, onChange }: { initialContent: string, onChange: (html: string) => void }) {
    const editor = useCreateBlockNote();
    const [isReady, setIsReady] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Load initial HTML content once
    useEffect(() => {
        const loadInitial = async () => {
            if (initialContent && !isReady) {
                const blocks = await editor.tryParseHTMLToBlocks(initialContent);
                editor.replaceBlocks(editor.document, blocks);
                setIsReady(true);
            } else if (!initialContent) {
                setIsReady(true);
            }
        };
        if (mounted) {
            loadInitial();
        }
    }, [editor, initialContent, isReady, mounted]);

    if (!mounted) {
        return <div style={{ minHeight: '400px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading editor...</div>;
    }

    return (
        <MantineProvider>
            <div style={{ minHeight: '400px' }}>
                <BlockNoteView
                    editor={editor}
                    theme="light"
                    onChange={async () => {
                        const html = await editor.blocksToHTMLLossy(editor.document);
                        onChange(html);
                    }}
                />
            </div>
        </MantineProvider>
    );
}
