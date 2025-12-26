'use client';

import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { uploadImage } from '@/app/actions';

export default function ImageUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'compressing' | 'uploading' | 'done' | 'error'>('idle');
    const [progress, setProgress] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setProgress(0);
            setErrorMsg('');
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        try {
            // 1. Compression Phase
            // Only compress supported image types in browser (JPEG, PNG, WEBP)
            // Skip HEIC compression on client (server will handle conversion)
            const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');

            let fileToUpload = file;

            if (!isHeic) {
                setStatus('compressing');
                setProgress(0);

                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: false,
                    initialQuality: 0.8,
                    onProgress: (p: number) => setProgress(Math.round(p))
                };

                try {
                    fileToUpload = await imageCompression(file, options);
                } catch (e) {
                    console.warn("Client compression failed, uploading original:", e);
                }
            }

            // 2. Upload Phase
            setStatus('uploading');

            const formData = new FormData();
            formData.append('file', fileToUpload, fileToUpload.name);

            await uploadImage(formData);

            setStatus('done');
            setFile(null);
            // Reset after a moment
            setTimeout(() => {
                setStatus('idle');
                setProgress(0);
            }, 3000);

        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMsg('Failed to process image');
        }
    };

    return (
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <form onSubmit={handleUpload} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                    type="file"
                    accept="image/*, .heic, .heif"
                    onChange={handleFileChange}
                    disabled={status === 'compressing' || status === 'uploading'}
                    required
                    style={{ fontSize: '14px' }}
                />
                <button
                    type="submit"
                    className="btn"
                    disabled={!file || status === 'compressing' || status === 'uploading'}
                    style={{
                        background: '#000',
                        color: '#fff',
                        fontSize: '13px',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        opacity: (!file || status !== 'idle') ? 0.7 : 1,
                        cursor: (!file || status !== 'idle') ? 'not-allowed' : 'pointer'
                    }}
                >
                    {status === 'idle' ? 'Upload Image' :
                        status === 'compressing' ? 'Optimizing...' :
                            status === 'uploading' ? 'Uploading...' : 'Done!'}
                </button>
            </form>

            {(status === 'compressing' || status === 'uploading') && (
                <div style={{ flex: 1, minWidth: '200px', maxWidth: '300px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', fontWeight: 600 }}>
                        <span>{status === 'compressing' ? 'Optimizing...' : 'Finalizing Upload...'}</span>
                        <span>{status === 'compressing' ? `${progress}%` : ''}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                            width: status === 'uploading' ? '100%' : `${progress}%`,
                            height: '100%',
                            background: '#000',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                </div>
            )}

            {status === 'error' && (
                <div style={{ color: '#c00', fontSize: '12px' }}>{errorMsg}</div>
            )}
        </div>
    );
}
