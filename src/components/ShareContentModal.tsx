
import React, { useState, useRef } from 'react';
import { CloseIcon, ShareIcon, PrintIcon } from './Icons';

declare const html2canvas: any;

interface ShareContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: {
        arabic: string;
        latin?: string;
        translation: string;
        source: string;
    };
}

export const ShareContentModal: React.FC<ShareContentModalProps> = ({ isOpen, onClose, title, content }) => {
    const [mode, setMode] = useState<'text' | 'image'>('text');
    const [fontSize, setFontSize] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handleShare = async () => {
        if (mode === 'text') {
            const textToShare = `${title}\n\n${content.arabic}\n\n${content.latin ? content.latin + '\n\n' : ''}Artinya: ${content.translation}\n\n(${content.source})\n\nShare via Qur'an Digital Calendar Hijri 🌐 s.id/Hijria`;
            try {
                if (navigator.share) {
                    await navigator.share({ title: title, text: textToShare });
                } else {
                    await navigator.clipboard.writeText(textToShare);
                    alert("Teks berhasil disalin!");
                }
                onClose();
            } catch (e) {}
        } else {
            // Image Share
            if (!previewRef.current) return;
            setIsProcessing(true);
            try {
                // Ensure fonts and styles are ready
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Determine background color based on current theme to ensure contrast
                const isLight = document.body.classList.contains('light');
                const bgColor = isLight ? '#ffffff' : '#002b25';

                const canvas = await html2canvas(previewRef.current, { 
                    scale: 2, 
                    backgroundColor: bgColor,
                    useCORS: true
                });
                
                const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
                
                if (blob && navigator.share) {
                    const file = new File([blob], 'share-image.jpg', { type: 'image/jpeg' });
                    await navigator.share({ 
                        title: title, 
                        files: [file],
                        text: "Share via Qur'an Digital Calendar Hijri 🌐 s.id/Hijria"
                    });
                } else if(blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `share-${title.replace(/[: ]/g, '-')}.jpg`;
                    a.click();
                }
                onClose();
            } catch(e) {
                console.error("Share image error", e);
                alert("Gagal memproses gambar.");
            } finally {
                setIsProcessing(false);
            }
        }
    };

    // Dynamic styles for preview based on theme
    const isLight = document.body.classList.contains('light');
    const containerClass = isLight ? 'bg-white border-gray-300 text-gray-900' : 'bg-[#002b25] border-[#00ffdf] text-white';
    const arabicColor = isLight ? '#004D40' : '#ffffff';
    const latinColor = isLight ? '#D84315' : '#f0e68c'; // Deep orange for light, Gold for dark
    const translationColor = isLight ? '#333333' : '#e0e0e0';
    const footerColor = isLight ? '#555555' : '#aaaaaa';

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[70] p-4 fade-in" onClick={onClose}>
            <div className={`border border-[#00ffdf]/30 rounded-xl w-full max-w-md flex flex-col relative max-h-[90vh] ${isLight ? 'bg-gray-100 text-gray-900' : 'bg-[#00352e] text-white'}`} onClick={e => e.stopPropagation()}>
                <div className={`p-4 border-b ${isLight ? 'border-gray-300' : 'border-[#00ffdf]/20'} flex justify-between items-center shrink-0`}>
                    <h3 className="font-bold">Bagikan</h3>
                    <button onClick={onClose}><CloseIcon className="w-5 h-5 opacity-70" /></button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto flex flex-col">
                    {/* Mode Selector */}
                    <div className={`flex gap-2 mb-4 p-1 rounded-lg shrink-0 ${isLight ? 'bg-gray-200' : 'bg-black/30'}`}>
                        <button 
                            onClick={() => setMode('text')}
                            className={`flex-1 py-2 text-sm font-bold rounded transition-colors ${mode === 'text' ? (isLight ? 'bg-white shadow text-cyan-700' : 'bg-[#00ffdf] text-[#002b25]') : 'opacity-50'}`}
                        >
                            Button Only Text
                        </button>
                        <button 
                            onClick={() => setMode('image')}
                            className={`flex-1 py-2 text-sm font-bold rounded transition-colors ${mode === 'image' ? (isLight ? 'bg-white shadow text-cyan-700' : 'bg-[#00ffdf] text-[#002b25]') : 'opacity-50'}`}
                        >
                            Button Image
                        </button>
                    </div>

                    {mode === 'image' && (
                        <div className="mb-4 shrink-0">
                            <label className="text-xs opacity-70 block mb-1">Zoom Size Font (+/-)</label>
                            <input 
                                type="range" 
                                min="0.8" 
                                max="1.5" 
                                step="0.1" 
                                value={fontSize} 
                                onChange={(e) => setFontSize(parseFloat(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-500"
                            />
                        </div>
                    )}

                    <div className={`rounded-lg p-4 overflow-y-auto border flex justify-center ${isLight ? 'bg-gray-200 border-gray-300' : 'bg-black/20 border-[#00ffdf]/10'}`}>
                        <div 
                            ref={previewRef}
                            className={`p-6 rounded-xl border-2 w-full max-w-sm ${containerClass}`}
                            style={{ transformOrigin: 'top center' }}
                        >
                            <h2 className="text-center font-bold text-lg mb-4 border-b pb-2 border-current opacity-70">{title}</h2>
                            <p className="text-right font-amiri leading-[2.2] mb-4" dir="rtl" style={{ fontSize: `${1.8 * fontSize}rem`, color: arabicColor }}>
                                {content.arabic}
                            </p>
                            {content.latin && (
                                <p className="text-sm italic mb-3 font-medium" style={{ fontSize: `${1 * fontSize}rem`, color: latinColor }}>
                                    {content.latin}
                                </p>
                            )}
                            <p className="text-sm font-light leading-relaxed text-justify" style={{ fontSize: `${0.9 * fontSize}rem`, color: translationColor }}>
                                "{content.translation}"
                            </p>
                            <div className="mt-6 pt-4 border-t border-current opacity-50 text-[10px] text-center font-bold" style={{ color: footerColor }}>
                                Share via Qur'an Digital Calendar Hijri 🌐 s.id/Hijria
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleShare}
                        disabled={isProcessing}
                        className={`w-full mt-4 py-3 font-bold rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0 ${isLight ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-[#00ffdf] hover:bg-cyan-400 text-[#002b25]'}`}
                    >
                        {isProcessing ? 'Memproses...' : (
                            <>
                                <ShareIcon className="w-5 h-5" />
                                <span>Bagikan Sekarang</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
