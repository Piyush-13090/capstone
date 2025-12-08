'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Image, Video, X, Loader2 } from 'lucide-react';

export default function CreatePost({ user }) {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        setMediaFile(file);
        const type = file.type.startsWith('image/') ? 'image' : 'video';
        setMediaType(type);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setMediaPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeMedia = () => {
        setMediaFile(null);
        setMediaPreview(null);
        setMediaType(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !mediaFile) return;

        setLoading(true);
        try {
            let mediaUrl = null;
            let uploadedMediaType = null;

            // Upload media if present
            if (mediaFile) {
                const formData = new FormData();
                formData.append('file', mediaFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    mediaUrl = uploadData.url;
                    uploadedMediaType = uploadData.type;
                }
            }

            // Create post
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: content.trim() || '📷',
                    mediaUrl,
                    mediaType: uploadedMediaType,
                }),
            });

            if (response.ok) {
                setContent('');
                removeMedia();
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to create post:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass rounded-2xl p-6 shadow-sm bg-white">
            <form onSubmit={handleSubmit}>
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex-shrink-0 flex items-center justify-center font-bold text-white text-lg shadow-md">
                        {user.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind? ✨"
                            className="w-full p-4 bg-secondary/30 rounded-xl resize-none focus:ring-2 focus:ring-primary outline-none text-base border border-border/50 transition-all font-medium placeholder:text-muted-foreground"
                            rows={3}
                        />

                        {/* Media Preview */}
                        {mediaPreview && (
                            <div className="mt-4 relative rounded-xl overflow-hidden border-2 border-primary/20 shadow-md">
                                {mediaType === 'image' ? (
                                    <img
                                        src={mediaPreview}
                                        alt="Preview"
                                        className="w-full max-h-96 object-cover"
                                    />
                                ) : (
                                    <video
                                        src={mediaPreview}
                                        controls
                                        className="w-full max-h-96"
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={removeMedia}
                                    className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black/90 text-white rounded-xl transition-all shadow-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-1">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="media-upload"
                                />
                                <label
                                    htmlFor="media-upload"
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 rounded-xl cursor-pointer transition-all"
                                >
                                    <Image className="w-5 h-5" strokeWidth={2} />
                                    <span className="hidden sm:inline">Photo</span>
                                </label>
                                <label
                                    htmlFor="media-upload"
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 rounded-xl cursor-pointer transition-all"
                                >
                                    <Video className="w-5 h-5" strokeWidth={2} />
                                    <span className="hidden sm:inline">Video</span>
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={(!content.trim() && !mediaFile) || loading}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-600 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Post'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
