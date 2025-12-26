
import React, { useState, useEffect, useRef } from 'react';
import { fetchSurahs, fetchSurahDetails, fetchQuranEditions, fetchQuranMeta, fetchTafsir, fetchJuzDetails, fetchPageDetails, fetchManzilDetails, fetchRukuDetails, fetchHizbQuarterDetails, fetchSajdaDetails, QuranEdition } from '../services/quranService';
import { Surah, Ayah } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon, VolumeUpIcon, CloseIcon, ShareIcon, TafsirIcon, MetadataIcon, MicIcon } from './Icons';
import { ShareContentModal } from './ShareContentModal';

interface QuranPlayerProps {
    onBack: () => void;
}

type ViewMode = 'surah' | 'juz' | 'page' | 'manzil' | 'ruku' | 'hizb' | 'sajda';

export const QuranPlayer: React.FC<QuranPlayerProps> = ({ onBack }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('surah');
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const [playingAyah, setPlayingAyah] = useState<number | null>(null);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    
    const [editions, setEditions] = useState<QuranEdition[]>([]);
    const [selectedEdition, setSelectedEdition] = useState('id.indonesian');
    const [metaData, setMetaData] = useState<any>(null);
    const [showMetaModal, setShowMetaModal] = useState(false);
    
    const [showLatin, setShowLatin] = useState(false);
    const [tafsirEditions, setTafsirEditions] = useState<QuranEdition[]>([]);
    const [selectedTafsirId, setSelectedTafsirId] = useState('ar.aljalalayn');
    const [activeTafsirAyah, setActiveTafsirAyah] = useState<{ numberInSurah: number, text: string, surah: number } | null>(null);
    const [loadingTafsir, setLoadingTafsir] = useState(false);
    
    const [shareModalData, setShareModalData] = useState<{title: string, content: any} | null>(null);
    
    const ayahsContainerRef = useRef<HTMLDivElement>(null);

    // Dynamic Theme Logic
    const isLight = document.body.classList.contains('light');
    const bgColor = isLight ? 'bg-[#F5F5F5]' : 'bg-[#002b25]';
    const sidebarBg = isLight ? 'bg-[#E0E0E0]' : 'bg-[#00352e]';
    const textColor = isLight ? 'text-gray-900' : 'text-white';
    const secondaryText = isLight ? 'text-[#00695C]' : 'text-[#00ffdf]'; // Dark teal vs Bright Cyan
    const cardBg = isLight ? 'bg-white border-gray-300' : 'bg-black/20 border-[#00ffdf]/20';
    const headerBg = isLight ? 'bg-[#B2DFDB]' : 'bg-[#00594C]';
    const subHeaderBg = isLight ? 'bg-[#E0F2F1]' : 'bg-[#00352e]';
    const borderColor = isLight ? 'border-gray-300' : 'border-[#00ffdf]/20';
    const inputBg = isLight ? 'bg-white border-gray-400 text-gray-900' : 'bg-black/10 border-[#00ffdf]/30 text-white';
    
    // Font Colors for Content
    const arabicColor = isLight ? 'text-[#004D40]' : 'text-[#00ffdf]';
    const latinColor = isLight ? 'text-[#D84315]' : 'text-yellow-300';
    const translationColor = isLight ? 'text-gray-700' : 'text-gray-300';

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setInitialLoading(true);
        try {
            const [surahData, editionData, meta, tafsirData] = await Promise.all([
                fetchSurahs(),
                fetchQuranEditions('translation'),
                fetchQuranMeta(),
                fetchQuranEditions('tafsir')
            ]);
            setSurahs(surahData);
            setEditions(editionData);
            setTafsirEditions(tafsirData);
            setMetaData(meta);
        } catch (err) {
            console.error(err);
            setError("Gagal memuat data.");
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSelection = async (id: number) => {
        if (selectedId === id) return;
        stopAudio();
        setSelectedId(id);
        setLoading(true);
        setAyahs([]);
        setActiveTafsirAyah(null);
        
        try {
            let data: Ayah[] = [];
            switch(viewMode) {
                case 'surah': data = await fetchSurahDetails(id, selectedEdition); break;
                case 'juz': data = await fetchJuzDetails(id, selectedEdition); break;
                case 'page': data = await fetchPageDetails(id, selectedEdition); break;
                case 'manzil': data = await fetchManzilDetails(id, selectedEdition); break;
                case 'ruku': data = await fetchRukuDetails(id, selectedEdition); break;
                case 'hizb': data = await fetchHizbQuarterDetails(id, selectedEdition); break;
                case 'sajda': data = await fetchSajdaDetails(selectedEdition); break;
            }
            setAyahs(data);
        } catch (err) {
            console.error(err);
            setError("Gagal memuat ayat.");
        } finally {
            setLoading(false);
            setSearchQuery('');
        }
    };

    const handleEditionChange = async (newEdition: string) => {
        setSelectedEdition(newEdition);
        if (selectedId !== null) {
            setLoading(true);
            try {
                let data: Ayah[] = [];
                switch(viewMode) {
                    case 'surah': data = await fetchSurahDetails(selectedId, newEdition); break;
                    case 'juz': data = await fetchJuzDetails(selectedId, newEdition); break;
                    case 'page': data = await fetchPageDetails(selectedId, newEdition); break;
                    case 'manzil': data = await fetchManzilDetails(selectedId, newEdition); break;
                    case 'ruku': data = await fetchRukuDetails(selectedId, newEdition); break;
                    case 'hizb': data = await fetchHizbQuarterDetails(selectedId, newEdition); break;
                    case 'sajda': data = await fetchSajdaDetails(newEdition); break;
                }
                setAyahs(data);
            } catch(e) {} finally { setLoading(false); }
        }
    };

    const handlePlayAudio = (ayah: Ayah) => {
        if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
        const audio = new Audio(ayah.audio);
        audio.preload = 'auto';
        audio.playbackRate = playbackSpeed;
        audio.onended = () => { setPlayingAyah(null); setCurrentAudio(null); };
        audio.onerror = () => { setPlayingAyah(null); alert("Gagal memutar audio."); };
        setCurrentAudio(audio);
        setPlayingAyah(ayah.number);
        audio.play().catch(e => setPlayingAyah(null));
    };

    const handleTTS = (text: string, lang: 'id-ID' | 'en-US' | 'ar-SA' = 'id-ID') => {
        if (currentAudio) { currentAudio.pause(); setPlayingAyah(null); }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = playbackSpeed;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    const handleShowTafsir = async (ayah: Ayah, surahNum: number) => {
        setLoadingTafsir(true);
        setActiveTafsirAyah({ numberInSurah: ayah.numberInSurah, text: "Memuat...", surah: surahNum });
        try {
            const tafsirText = await fetchTafsir(surahNum, ayah.numberInSurah, selectedTafsirId);
            setActiveTafsirAyah({ numberInSurah: ayah.numberInSurah, text: tafsirText, surah: surahNum });
        } catch(e) { alert("Gagal memuat tafsir."); } finally { setLoadingTafsir(false); }
    };

    const handleTafsirEditionChange = async (newTafsirId: string) => {
        setSelectedTafsirId(newTafsirId);
        // If there's an active tafsir open, reload it
        if (activeTafsirAyah) {
            setLoadingTafsir(true);
            try {
                const tafsirText = await fetchTafsir(activeTafsirAyah.surah, activeTafsirAyah.numberInSurah, newTafsirId);
                setActiveTafsirAyah(prev => prev ? { ...prev, text: tafsirText } : null);
            } catch(e) {} finally { setLoadingTafsir(false); }
        }
    };

    const openShareModal = (ayah: Ayah, surahName: string) => {
        setShareModalData({
            title: `QS ${surahName} : ${ayah.numberInSurah}`,
            content: {
                arabic: ayah.text,
                latin: ayah.latin,
                translation: ayah.translation || "",
                source: `QS ${surahName} : ${ayah.numberInSurah}`
            }
        });
    };

    const stopAudio = () => {
        if (currentAudio) { currentAudio.pause(); setPlayingAyah(null); }
        window.speechSynthesis.cancel();
    };

    const filteredAyahs = searchQuery && selectedId !== null
        ? ayahs.filter(a => a.translation?.toLowerCase().includes(searchQuery.toLowerCase())) 
        : ayahs;

    const getSurahForAyah = (ayah: Ayah) => {
        if (viewMode === 'surah' && selectedId) return surahs.find(s => s.number === selectedId);
        return (ayah as any).surah; 
    }

    const renderNavigationList = () => {
        if (viewMode === 'surah') {
            const filteredSurahs = surahs.filter(s => s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.includes(searchQuery) || String(s.number).includes(searchQuery));
            return filteredSurahs.map(surah => (
                <button key={surah.number} onClick={() => handleSelection(surah.number)} className={`w-full text-left p-4 border-b ${borderColor} hover:bg-black/5 transition-colors ${selectedId === surah.number ? `${isLight ? 'bg-teal-100 border-l-teal-600' : 'bg-[#00ffdf]/10 border-l-[#00ffdf]'} border-l-4` : ''}`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold ${selectedId === surah.number ? `${isLight ? 'bg-teal-200 text-teal-900 border-teal-600' : 'bg-[#00ffdf]/20 text-[#00ffdf] border-[#00ffdf]'}` : 'bg-transparent border-gray-500'}`}>{surah.number}</div>
                            <div><p className={`font-bold text-sm ${textColor}`}>{surah.englishName}</p><p className="text-xs opacity-70">{surah.englishNameTranslation}</p></div>
                        </div>
                        <div className="text-right"><p className={`font-amiri text-xl ${secondaryText}`}>{surah.name}</p><p className="text-[10px] opacity-60">{surah.numberOfAyahs} Ayat</p></div>
                    </div>
                </button>
            ));
        }
        
        let count = 0;
        let prefix = '';
        if (viewMode === 'juz') { count = 30; prefix = 'Juz'; }
        if (viewMode === 'page') { count = 604; prefix = 'Halaman'; }
        if (viewMode === 'manzil') { count = 7; prefix = 'Manzil'; }
        if (viewMode === 'ruku') { count = 556; prefix = 'Ruku'; }
        if (viewMode === 'hizb') { count = 240; prefix = 'Hizb Quarter'; }
        if (viewMode === 'sajda') { 
            return <button onClick={() => handleSelection(1)} className={`w-full text-left p-4 border-b ${borderColor} ${selectedId === 1 ? 'bg-black/10' : ''} ${textColor}`}>Tampilkan Semua Ayat Sajdah</button>;
        }

        return (
            <div className={`grid ${viewMode === 'page' ? 'grid-cols-4' : 'grid-cols-3'} gap-2 p-2`}>
                {Array.from({length: count}, (_, i) => i + 1).map(num => (
                    <button key={num} onClick={() => handleSelection(num)} className={`p-2 rounded border text-center text-xs ${textColor} ${selectedId === num ? `${secondaryText.replace('text-', 'bg-')}/20 border-current font-bold` : `hover:bg-black/5 ${borderColor}`}`}>
                        {prefix} {num}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className={`fixed inset-0 z-[60] flex flex-col ${bgColor} ${textColor} font-jannah animate-fade-in h-[100dvh]`}>
            {/* Header */}
            <div className={`p-4 border-b ${borderColor} flex justify-between items-center ${headerBg} shadow-md shrink-0 z-20`}>
                <button onClick={onBack} className="p-2 rounded-full hover:bg-black/10 flex items-center gap-2 text-white">
                    <ChevronLeftIcon className="w-6 h-6" />
                    <span className="hidden sm:inline text-sm font-bold">Kembali</span>
                </button>
                <h2 className="text-xl font-bold font-amiri tracking-wider text-white">Al-Qur'an Digital</h2>
                <div className="w-8"></div> 
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                
                {shareModalData && (
                    <ShareContentModal 
                        isOpen={!!shareModalData} 
                        onClose={() => setShareModalData(null)}
                        title={shareModalData.title}
                        content={shareModalData.content}
                    />
                )}

                {/* Sidebar Navigation */}
                <div className={`w-full md:w-1/3 lg:w-1/4 border-r ${borderColor} flex flex-col ${sidebarBg} transition-transform duration-300 absolute inset-0 md:relative z-10 ${selectedId ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
                    <div className={`p-4 border-b ${borderColor} space-y-3`}>
                        <select value={viewMode} onChange={(e) => { setViewMode(e.target.value as ViewMode); setSelectedId(null); setSearchQuery(''); }} className={`w-full ${inputBg} rounded px-3 py-2 text-sm outline-none`}>
                            <option value="surah">Surah</option>
                            <option value="juz">Juz</option>
                            <option value="page">Halaman (Page)</option>
                            <option value="manzil">Manzil</option>
                            <option value="ruku">Ruku</option>
                            <option value="hizb">Hizb Quarter</option>
                            <option value="sajda">Ayat Sajdah</option>
                        </select>

                        {viewMode === 'surah' && (
                            <div className="relative">
                                <input type="text" placeholder="Cari Surah..." value={!selectedId ? searchQuery : ''} onChange={(e) => !selectedId && setSearchQuery(e.target.value)} className={`w-full ${inputBg} rounded-full py-2 px-4 pl-10 text-xs outline-none`} disabled={!!selectedId && window.innerWidth < 768} />
                                <SearchIcon className="w-4 h-4 absolute left-3 top-2.5 opacity-50" />
                            </div>
                        )}
                        
                        {!selectedId && (
                            <div className="flex gap-2">
                                <select value={selectedEdition} onChange={(e) => handleEditionChange(e.target.value)} className={`flex-1 ${inputBg} rounded px-2 py-1 text-xs outline-none truncate`}>
                                    {editions.filter(e => e.type === 'translation').map(ed => <option key={ed.identifier} value={ed.identifier} className="text-black">{ed.language.toUpperCase()} - {ed.name}</option>)}
                                </select>
                                <button onClick={() => setShowMetaModal(true)} className={`p-2 ${inputBg} rounded`}><MetadataIcon className={`w-4 h-4 ${secondaryText}`} /></button>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {initialLoading ? <div className="p-4">Memuat data...</div> : renderNavigationList()}
                    </div>
                </div>

                {/* Content View */}
                <div className={`w-full md:w-2/3 lg:w-3/4 flex flex-col ${bgColor} absolute inset-0 md:relative z-10 transition-transform duration-300 ${selectedId ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
                    {selectedId ? (
                        <>
                            <div className={`p-3 border-b ${borderColor} flex flex-col sm:flex-row justify-between items-center gap-3 ${subHeaderBg} shadow-sm shrink-0`}>
                                <div className="flex items-center w-full sm:w-auto gap-3">
                                    <button onClick={() => setSelectedId(null)} className="md:hidden p-2 bg-black/10 rounded-full"><ChevronLeftIcon className="w-5 h-5"/></button>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg leading-tight">{viewMode === 'surah' ? surahs.find(s => s.number === selectedId)?.englishName : `${viewMode.toUpperCase()} ${selectedId}`}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                                    <button onClick={() => setShowLatin(!showLatin)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${showLatin ? `${isLight ? 'bg-teal-100 border-teal-500 text-teal-800' : 'bg-[#00ffdf]/20 border-[#00ffdf] text-[#00ffdf]'}` : 'border-gray-400 opacity-70'}`}>{showLatin ? 'Sembunyikan Latin' : 'Tampilkan Latin'}</button>
                                    
                                    {/* Tafsir Selector Dropdown */}
                                    <div className="relative">
                                        <select 
                                            value={selectedTafsirId} 
                                            onChange={(e) => handleTafsirEditionChange(e.target.value)} 
                                            className={`${inputBg} rounded px-2 py-1.5 text-xs outline-none max-w-[120px] truncate`}
                                            title="Pilih Sumber Tafsir"
                                        >
                                            {tafsirEditions.map(ed => <option key={ed.identifier} value={ed.identifier} className="text-black">{ed.name}</option>)}
                                        </select>
                                    </div>

                                    <select value={playbackSpeed} onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))} className={`${inputBg} rounded px-2 py-1.5 text-xs outline-none`}>
                                        <option value="1.0">1.0x</option>
                                        <option value="1.25">1.25x</option>
                                        <option value="1.5">1.5x</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth" ref={ayahsContainerRef}>
                                {loading ? (
                                    <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div></div>
                                ) : (
                                    <>
                                        {/* Bismillah Header for Surah View (except Fatihah/Taubah) */}
                                        {viewMode === 'surah' && selectedId && selectedId !== 1 && selectedId !== 9 && (
                                            <div className={`text-center py-6 font-amiri text-3xl sm:text-4xl opacity-80 mb-2 ${secondaryText}`}>
                                                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                                            </div>
                                        )}

                                        {filteredAyahs.map((ayah, index) => {
                                            const ayahSurah = getSurahForAyah(ayah);
                                            const isPlaying = playingAyah === ayah.number;
                                            
                                            // Handle Bismillah removal from text for first ayah of Surahs (except 1 & 9)
                                            let displayText = ayah.text;
                                            if (ayah.numberInSurah === 1 && ayahSurah && ayahSurah.number !== 1 && ayahSurah.number !== 9) {
                                                displayText = displayText.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s?/, '').replace(/^بِسْمِ ٱللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ\s?/, '');
                                            }
                                            
                                            // Visual Highlight Logic
                                            const activeClass = isPlaying 
                                                ? (isLight ? 'border-teal-500 bg-teal-50 shadow-md transform scale-[1.01]' : 'border-[#00ffdf] bg-[#00ffdf]/5 shadow-[0_0_15px_rgba(0,255,223,0.1)] transform scale-[1.01]')
                                                : `hover:border-gray-400 ${cardBg}`;

                                            return (
                                                <div key={ayah.number} className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 relative ${activeClass}`}>
                                                    <div className="flex justify-between items-start mb-6 pr-10 flex-wrap gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${isPlaying ? (isLight ? 'bg-teal-600 text-white' : 'bg-[#00ffdf] text-black') : 'bg-transparent border-gray-400'}`}>{ayah.numberInSurah}</div>
                                                            {viewMode !== 'surah' && ayahSurah && <span className={`text-xs px-2 py-1 rounded border opacity-70`}>{ayahSurah.englishName}</span>}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => ayahSurah && handleShowTafsir(ayah, ayahSurah.number)} className="p-2 rounded-full hover:bg-black/5 opacity-60 hover:opacity-100" title="Tafsir"><TafsirIcon className="w-4 h-4"/></button>
                                                            <button onClick={() => handlePlayAudio(ayah)} className={`p-2 rounded-full hover:bg-black/5 ${isPlaying ? secondaryText : 'opacity-60 hover:opacity-100'}`}><VolumeUpIcon className="w-4 h-4" /></button>
                                                            <button onClick={() => handleTTS(ayah.translation || '', selectedEdition.includes('id') ? 'id-ID' : 'en-US')} className="p-2 rounded-full hover:bg-black/5 opacity-60 hover:opacity-100" title="Baca Terjemahan"><span className="text-[10px] font-bold">TR</span></button>
                                                            <button onClick={() => ayahSurah && openShareModal(ayah, ayahSurah.englishName)} className="p-2 rounded-full hover:bg-black/5 opacity-60 hover:opacity-100"><ShareIcon className="w-4 h-4" /></button>
                                                        </div>
                                                    </div>
                                                    
                                                    <p className={`text-right font-amiri text-3xl sm:text-4xl leading-[2.5] mb-6 ${arabicColor}`} dir="rtl">{displayText}</p>
                                                    
                                                    {showLatin && ayah.latin && (
                                                        <div className="mb-4 pt-2 border-t border-gray-500/20 text-right">
                                                            <p className={`text-sm sm:text-base font-medium italic ${latinColor}`}>{ayah.latin}</p>
                                                        </div>
                                                    )}

                                                    <div className={`border-t border-gray-500/20 pt-4 ${showLatin ? '' : 'mt-4'}`}>
                                                        <p className={`text-sm sm:text-base opacity-90 leading-relaxed italic text-justify ${translationColor}`}>"{ayah.translation}"</p>
                                                    </div>

                                                    {/* Tafsir Display */}
                                                    {activeTafsirAyah?.numberInSurah === ayah.numberInSurah && activeTafsirAyah?.surah === ayahSurah?.number && (
                                                        <div className={`mt-4 p-4 rounded-lg border text-right animate-fade-in-up ${isLight ? 'bg-gray-100 border-gray-300' : 'bg-black/30 border-[#00ffdf]/30'}`}>
                                                            <div className="flex justify-between items-center mb-2 border-b border-gray-500/20 pb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <button onClick={() => setActiveTafsirAyah(null)} className="text-xs text-red-500 font-bold border border-red-500/30 px-2 py-1 rounded hover:bg-red-500/10">Tutup</button>
                                                                </div>
                                                                <span className="text-xs font-bold opacity-60">Tafsir: {tafsirEditions.find(t=>t.identifier===selectedTafsirId)?.name}</span>
                                                            </div>
                                                            {loadingTafsir ? <p className="text-center opacity-50 text-sm py-4">Memuat Tafsir...</p> : <p className={`text-sm leading-relaxed ${activeTafsirAyah.text.match(/[\u0600-\u06FF]/) ? 'font-amiri text-right' : 'text-justify font-sans'} ${translationColor}`} dir={activeTafsirAyah.text.match(/[\u0600-\u06FF]/) ? "rtl" : "ltr"}>{activeTafsirAyah.text}</p>}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex flex-col items-center justify-center h-full opacity-60 p-8 space-y-4">
                            <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${isLight ? 'bg-gray-200 border-gray-300' : 'bg-black/10 border-[#00ffdf]/20'}`}><span className="text-6xl">📖</span></div>
                            <h3 className={`text-2xl font-bold font-amiri ${secondaryText}`}>Al-Qur'an Digital</h3>
                            <p className="text-center max-w-xs">Silakan pilih menu di sebelah kiri untuk mulai membaca.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
