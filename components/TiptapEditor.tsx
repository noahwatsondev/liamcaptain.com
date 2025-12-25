'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { useState, useEffect } from 'react'

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null
    }

    const addImage = () => {
        const url = window.prompt('URL')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const addYoutube = () => {
        const url = window.prompt('YouTube URL')
        if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run()
        }
    }

    return (
        <div className="editor-menu-bar" style={{ padding: '10px', borderBottom: '1px solid #ddd', marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
                type="button"
            >
                Bold
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
                type="button"
            >
                Italic
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                type="button"
            >
                H2
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                type="button"
            >
                H3
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'is-active' : ''}
                type="button"
            >
                Quote
            </button>
            <button onClick={addImage} type="button">Image</button>
            <button onClick={addYoutube} type="button">Video</button>

            <style jsx>{`
        button {
          padding: 6px 10px;
          background: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
          font-family: sans-serif;
          font-size: 13px;
        }
        button.is-active {
          background: #333;
          color: white;
          border-color: #333;
        }
        button:hover {
          background: #f0f0f0;
        }
        button.is-active:hover {
          background: #555;
        }
      `}</style>
        </div>
    )
}

export default function TiptapEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
    const [isMounted, setIsMounted] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Youtube.configure({
                controls: false,
            }),
        ],
        immediatelyRender: false,
        content,
        editorProps: {
            attributes: {
                class: 'prose-editor', // Style this in globals or module
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    // Ensure hydration match
    useEffect(() => {
        if (editor && content && editor.getHTML() !== content) {
            // Only set content if significantly different to avoid cursor jumps, 
            // but for initial load it's fine.
            // editor.commands.setContent(content)
        }
    }, [content, editor])

    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}>
            <MenuBar editor={editor} />
            <div style={{ padding: '0 20px 20px', minHeight: '300px' }}>
                <EditorContent editor={editor} />
            </div>

            <style jsx global>{`
        .prose-editor {
          outline: none;
          min-height: 300px;
          font-family: var(--font-serif); /* Match article font */
          font-size: 18px;
          line-height: 1.8;
        }
        .prose-editor p { margin-bottom: 1em; }
        .prose-editor h2 { font-size: 1.5em; font-weight: bold; margin-top: 1em; }
        .prose-editor blockquote { border-left: 3px solid #ccc; padding-left: 1em; color: #666; font-style: italic; }
        .prose-editor img { max-width: 100%; height: auto; }
        .prose-editor iframe { width: 100%; aspect-ratio: 16/9; }
      `}</style>
        </div>
    )
}
