'use client'
import { useState } from "react";
import dynamic from "next/dynamic";

const BlockNoteEditor = dynamic(() => import("@/components/BlockNoteEditor"), { ssr: false });

export default function BlockNoteEditorWrapper({ initialContent }: { initialContent: string }) {
    const [content, setContent] = useState(initialContent);

    return (
        <>
            <input type="hidden" name="content" value={content} />
            <BlockNoteEditor initialContent={initialContent} onChange={setContent} />
        </>
    );
}
