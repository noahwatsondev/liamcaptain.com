import { prisma } from "@/lib/prisma";
import { uploadImage, deleteImage } from "@/app/actions";

import CopyButton from "@/components/CopyButton";

export default async function ImagesPage() {
    const images = await prisma.image.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '24px' }}>Image Library</h1>

                <form action={uploadImage} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        required
                        style={{ fontSize: '14px' }}
                    />
                    <button type="submit" className="btn" style={{ background: '#000', color: '#fff', fontSize: '13px', padding: '8px 16px', border: 'none', borderRadius: '4px' }}>
                        Upload Image
                    </button>
                </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {images.map((image) => (
                    <div key={image.id} style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        <div style={{ height: '150px', background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            <img src={image.url} alt={image.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '15px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {image.filename}
                            </div>
                            <div style={{ fontSize: '10px', color: '#666', marginBottom: '10px', wordBreak: 'break-all', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                                <span>{image.url}</span>
                                <CopyButton text={image.url} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <form action={deleteImage.bind(null, image.id, image.url)}>
                                    <button style={{ color: '#c00', border: 'none', background: 'transparent', fontSize: '11px', cursor: 'pointer', padding: 0 }}>
                                        Delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ))}

                {images.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '8px', color: '#666', fontStyle: 'italic' }}>
                        No images uploaded yet. Start uploading above!
                    </div>
                )}
            </div>
        </div>
    );
}
