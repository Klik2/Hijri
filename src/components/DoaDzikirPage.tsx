
import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon, ShareIcon, MicIcon } from './Icons';
import { DoaItem } from '../types';
import { ShareContentModal } from './ShareContentModal';

type Category = {
    category: string;
    items: DoaItem[];
};

const DOA_COLLECTION: Category[] = [
    {
      "category": "Dzikir Pagi & Petang",
      "items": [
        {
          "no": 1,
          "judul": "Dzikir Pagi dan Petang (Tasbih) dibaca 100X",
          "arab": "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
          "artinya": "Maha Suci Allah, aku memuji-Nya.",
          "referensi": "HR. Muslim no. 2731"
        },
        {
          "no": 2,
          "judul": "Dzikir Pagi dan Petang (Tahlil) dibaca 1X atau 10X atau 100X",
          "arab": "لاَ إلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَ هُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
          "artinya": "Tidak ada Ilah yang berhak disembah dengan benar kecuali Allah Yang Maha Esa, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan segala pujian. Dan Dia Maha Kuasa atas segala sesuatu.",
          "referensi": "HR. Al-Bukhari no. 6403 & Muslim no. 2691"
        },
        {
          "no": 3,
          "judul": "Sayyidul Istighfar dibaca 1X",
          "arab": "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوْبَ إِلا أَنْتَ",
          "artinya": "Ya Allah, Engkau adalah Rabb-ku, tiada Ilah yang berhak disembah dengan benar selain-Mu. Engkau yang menciptakanku. Aku adalah hamba-Mu. Aku (yakin) dengan janji-Mu dan aku akan setia pada perjanjianku dengan-Mu semampuku. Aku berlindung kepada-Mu dari keburukan perbuatanku. Aku mengakui nikmat-Mu (yang Engkau berikan) kepadaku dan aku mengakui dosaku, maka ampunilah aku. Sesungguhnya tidak ada yang dapat mengampuni dosa selain Engkau.",
          "referensi": "HR. Al-Bukhari no. 6306"
        },
        {
          "no": 4,
          "judul": "Dzikir Pagi dibaca 1X",
          "arab": "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوْتُ، وَإِلَيْكَ النُّشُوْرُ",
          "artinya": "Ya Allah, dengan rahmat dan pertolongan-Mu kami berada di waktu pagi, serta dengan rahmat dan pertolongan-Mu kami memasuki waktu sore, dengan rahmat dan kehendak-Mu kami hidup, dengan rahmat dan kehendak-Mu kami mati, dan kepada-Mu kebangkitan (bagi semua makhluk).",
          "referensi": "HR. At-Tirmidzi no. 3391"
        },
        {
          "no": 5,
          "judul": "Dzikir Petang dibaca 1X",
          "arab": "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوْتُ، وَإِلَيْكَ الْمَصِيرُ",
          "artinya": "Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu sore, serta dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi, dengan rahmat dan kehendak-Mu kami hidup, dengan rahmat dan kehendak-Mu kami mati, dan kepada-Mu seluruh makhluk kembali.",
          "referensi": "HR. At-Tirmidzi no. 3391"
        },
        {
          "no": 6,
          "judul": "Dzikir Pagi dan Petang (Perlindungan) dibaca 3X",
          "arab": "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
          "artinya": "Dengan menyebut Nama Allah, yang dengan nama-Nya tidak ada sesuatu yang dapat membahayakan, baik di bumi maupun di langit. Dan Dia Maha Mendengar lagi Maha Mengetahui.",
          "referensi": "HR. At-Tirmidzi no. 3388"
        },
        {
          "no": 7,
          "judul": "Dzikir Pagi dan Petang (Mohon Perbaikan) dibaca 3X",
          "arab": "يَا حَيُّ يَا قَيُّوْمُ بِرَحْمَتِكَ أَسْتَغِيْتُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
          "artinya": "Wahai Rabb Yang Maha Hidup, wahai Rabb Yang Maha Berdiri sendiri, dengan rahmat-Mu aku meminta pertolongan, perbaikilah segala keadaanku dan jangan Engkau serahkan diriku kepadaku meski hanya sekejap mata.",
          "referensi": "HR. An-Nasa'i dalam al-Kubra no. 10330"
        },
        {
          "no": 8,
          "judul": "Dzikir Petang (Kerajaan Allah) dibaca 1X",
          "arab": "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ للهِ، لاَ إلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ...",
          "artinya": "Kami telah memasuki waktu sore dan kerajaan hanya milik Allah, segala puji hanya milik Allah. Tidak ada Ilah yang berhak disembah dengan benar kecuali Allah Yang Maha Esa...",
          "referensi": "HR. Muslim no. 2723"
        },
        {
          "no": 9,
          "judul": "Dzikir Pagi dan Petang (Perlindungan Syirik) dibaca 1X",
          "arab": "اللَّهُمَّ فَاطِرَ السَّمَوَاتِ وَالْأَرْضِ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوْذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ",
          "artinya": "Ya Allah, Yang Maha Menciptakan langit dan bumi, Yang Maha Mengetahui yang ghaib dan yang nyata, Rabb segala sesuatu dan yang merajainya. Aku bersaksi bahwa tidak ada Ilah yang berhak disembah dengan benar kecuali Engkau. Aku berlindung kepada-Mu dari keburukan diriku, kejahatan setan dan ajakannya untuk menyekutukan-Mu.",
          "referensi": "HR. At-Tirmidzi no. 3392"
        },
        {
          "no": 10,
          "judul": "Dzikir Pagi dan Petang (Mohon Keselamatan) dibaca 1X",
          "arab": "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي...",
          "artinya": "Ya Allah, sesungguhnya aku mohon keselamatan di dunia dan akhirat. Ya Allah, sesungguhnya aku mohon ampunan dan keselamatan dalam urusan agama, dunia, keluarga dan hartaku...",
          "referensi": "HR. Abu Dawud no. 5074"
        },
        {
          "no": 11,
          "judul": "Dzikir Pagi (Tasbih Kelipatan) dibaca 3X",
          "arab": "سُبْحَانَ اللهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
          "artinya": "Maha Suci Allah, aku memuji-Nya sebanyak bilangan makhluk-Nya, sejauh keridhaan-Nya, seberat timbangan arsy-Nya dan sebanyak tinta (yang menulis) kalimat-Nya.",
          "referensi": "HR. Muslim no. 2726"
        },
        {
          "no": 12,
          "judul": "Dzikir Pagi (Fitrah Islam) dibaca 1X",
          "arab": "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِيْنِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَمِلَّةِ أَبِيْنَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ",
          "artinya": "Di waktu pagi kami berada di atas fitrah agama Islam, kalimat ikhlas, agama Nabi kami Muhammad SAW dan agama ayah kami Ibrahim yang berdiri di atas jalan lurus, Muslim dan tidak tergolong orang-orang Musyrik.",
          "referensi": "HR. Ahmad no. 15367"
        },
        {
          "no": 13,
          "judul": "Dzikir Pagi (Setelah Shubuh) dibaca 1X",
          "arab": "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً",
          "artinya": "Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rizki yang baik dan amal yang diterima.",
          "referensi": "HR. Ahmad no. 26602"
        },
        {
          "no": 14,
          "judul": "Ayat Kursi (Pagi & Petang) dibaca 1X",
          "arab": "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ",
          "artinya": "Allah, tidak ada Tuhan (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafa'at di sisi Allah tanpa izin-Nya? Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, dan Allah Maha Tinggi lagi Maha Besar.",
          "referensi": "QS. Al-Baqarah [2]: 255"
        },
        {
          "no": 15,
          "judul": "Surah Al Ikhlas (Pagi & Petang) dibaca 3X",
          "arab": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\nقُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ",
          "artinya": "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: \"Dialah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan, dan tidak ada seorangpun yang setara dengan Dia.\"",
          "referensi": "QS. Al-Ikhlas [112]: 1-4"
        },
        {
          "no": 16,
          "judul": "Surah Al Falaq (Pagi & Petang) dibaca 3X",
          "arab": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
          "artinya": "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: \"Aku berlindung kepada Tuhan Yang Menguasai subuh, dari kejahatan makhluk-Nya, dan dari kejahatan malam apabila telah gelap gulita, dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul, dan dari kejahatan pendengki bila ia dengki.\"",
          "referensi": "QS. Al-Falaq [113]: 1-5"
        },
        {
          "no": 17,
          "judul": "Surah An Nas (Pagi & Petang) dibaca 3X",
          "arab": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ ۝ مَلِكِ ٱلنَّاسِ ۝ إِلَٰهِ ٱلنَّاسِ ۝ مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ ۝ ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ ۝ مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ",
          "artinya": "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: \"Aku berlindung kepada Tuhan (yang memelihara dan menguasai) manusia. Raja manusia. Sembahan manusia. Dari kejahatan (bisikan) syaitan yang biasa bersembunyi, yang membisikkan (kejahatan) ke dalam dada manusia, dari (golongan) jin dan manusia.\"",
          "referensi": "QS. An-Nas [114]: 1-6"
        }
      ]
    },
    // ... existing categories ...
    {
      "category": "Dzikir Seputar Tidur & Bangun",
      "items": [
        {
          "no": 1,
          "judul": "Dzikir Seputar Tidur (Sebelum Tidur)",
          "arab": "بِاسْمِكَ اللَّهُمَّ أَمُوْتُ وَأَحْيَا",
          "artinya": "Dengan nama-Mu ya Allah aku mati dan aku hidup.",
          "referensi": "HR. Al-Bukhari no. 6312"
        },
        // ... previous items preserved but truncated for brevity in change block (assuming user has full file context)
        {
          "no": 2,
          "judul": "Dzikir Seputar Tidur (Bangun Tidur)",
          "arab": "اَلْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
          "artinya": "Segala puji bagi Allah yang telah menghidupkan kami setelah Ia mematikan kami dan kepada-Nya kami dibangkitkan.",
          "referensi": "HR. Al-Bukhari no. 6312"
        },
        {
          "no": 3,
          "judul": "Dzikir Seputar Tidur (Perlindungan)",
          "arab": "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
          "artinya": "Dengan nama-Mu, wahai Rabb-ku, aku meletakkan lambungku. Dan dengan nama-Mu pula aku terbangun. Apabila Engkau mencabut nyawaku, maka rahmatilah ia. Dan bila Engkau membiarkannya hidup, maka jagalah ia sebagaimana Engkau menjaga orang-orang yang shalih.",
          "referensi": "HR. Al-Bukhari no. 6320"
        }
      ]
    }
    // ... rest of file
];

export const DoaDzikirPage: React.FC<{onBack: () => void}> = ({onBack}) => {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedItem, setSelectedItem] = useState<DoaItem | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showLatin, setShowLatin] = useState(true);
    const [translationLang, setTranslationLang] = useState("id");
    const [shareModalData, setShareModalData] = useState<{title: string, content: any} | null>(null);

    const handleCategoryClick = (category: Category) => {
        setSelectedCategory(category);
        setSelectedItem(null);
        setSearchQuery("");
    };

    const handleItemClick = (item: DoaItem) => {
        setSelectedItem(item);
    };

    const handleBack = () => {
        if (selectedItem) {
            setSelectedItem(null);
        } else if (selectedCategory) {
            setSelectedCategory(null);
            setSearchQuery("");
        } else {
            onBack();
        }
    };

    const handlePlayLatinTTS = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    const openShareModal = (item: DoaItem) => {
        setShareModalData({
            title: item.judul,
            content: {
                arabic: item.arab,
                latin: item.latin,
                translation: item.artinya,
                source: item.referensi
            }
        });
    };

    // Theme Variables Logic
    const isLight = document.body.classList.contains('light');
    const bgColor = isLight ? 'bg-[#E0F2F1]' : 'bg-[#002b25]';
    const textColor = isLight ? 'text-[#004D40]' : 'text-white';
    const secondaryText = isLight ? 'text-[#00796B]' : 'text-[#00ffdf]';
    const cardBg = isLight ? 'bg-white border-[#00796B]/20 shadow-md' : 'bg-black/20 border-[#00ffdf]/20';
    const headerBg = isLight ? 'bg-[#B2DFDB]' : 'bg-[#00594C]';
    const inputBg = isLight ? 'bg-white border-[#00796B]/30' : 'bg-black/10 border-current/30';
    
    // Content Colors
    const arabicColor = isLight ? 'text-[#004D40]' : 'text-[#00ffdf]';
    const latinColor = isLight ? 'text-[#D84315]' : 'text-yellow-300';
    const translationColor = isLight ? 'text-gray-700' : 'text-gray-300';

    // Filter logic
    const filteredItems = selectedCategory 
        ? selectedCategory.items.filter(item => item.judul.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    return (
        <div className={`fixed inset-0 z-[60] flex flex-col ${bgColor} ${textColor} font-jannah animate-fade-in h-[100dvh]`}>
            {/* Header */}
            <div className={`p-4 border-b border-current/20 flex justify-between items-center ${headerBg} shadow-md shrink-0 z-20`}>
                <button onClick={handleBack} className="p-2 rounded-full hover:bg-black/10 flex items-center gap-2 transition-colors text-white">
                    <ChevronLeftIcon className="w-6 h-6" />
                    <span className="hidden sm:inline text-sm font-bold">Kembali</span>
                </button>
                <h2 className="text-xl font-bold font-amiri tracking-wider truncate px-2 text-white">
                    {selectedItem ? 'Detail Doa' : (selectedCategory ? selectedCategory.category : 'Doa & Dzikir')}
                </h2>
                <div className="w-8"></div> 
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 relative">
                
                {shareModalData && (
                    <ShareContentModal 
                        isOpen={!!shareModalData} 
                        onClose={() => setShareModalData(null)}
                        title={shareModalData.title}
                        content={shareModalData.content}
                    />
                )}

                {/* View 1: Main Categories */}
                {!selectedCategory && !selectedItem && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-20">
                        {DOA_COLLECTION.map((cat, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => handleCategoryClick(cat)}
                                className={`p-4 ${cardBg} border rounded-xl text-left hover:bg-current/5 transition-all group relative overflow-hidden`}
                            >
                                <h3 className={`font-bold text-lg ${secondaryText} mb-1`}>{cat.category}</h3>
                                <p className="text-xs opacity-70">{cat.items.length} Doa</p>
                                <ChevronRightIcon className={`w-5 h-5 absolute bottom-4 right-4 ${secondaryText}`} />
                            </button>
                        ))}
                    </div>
                )}

                {/* View 2: List */}
                {selectedCategory && !selectedItem && (
                    <div className="space-y-3 pb-20">
                        {/* Search & Settings for List */}
                        <div className="sticky top-0 z-10 py-2 backdrop-blur-sm">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Cari doa..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full ${inputBg} rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:border-current`}
                                />
                                <SearchIcon className="w-4 h-4 absolute left-3.5 top-3.5 opacity-50" />
                            </div>
                        </div>

                        {filteredItems.map((item, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => handleItemClick(item)}
                                className={`w-full p-4 ${cardBg} border rounded-xl text-left hover:bg-current/5 transition-all flex items-center justify-between group`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full ${isLight ? 'bg-teal-100 text-teal-800' : 'bg-current/10'} ${secondaryText} flex items-center justify-center text-xs font-bold shrink-0 border border-current/20`}>
                                        {item.no}
                                    </div>
                                    <span className="text-sm font-medium line-clamp-2">
                                        {item.judul}
                                    </span>
                                </div>
                                <ChevronRightIcon className={`w-5 h-5 opacity-50 group-hover:opacity-100 ${secondaryText}`} />
                            </button>
                        ))}
                    </div>
                )}

                {/* View 3: Detail Item */}
                {selectedItem && (
                    <div className="animate-fade-in-up pb-20 max-w-2xl mx-auto">
                        
                        {/* Tools Bar */}
                        <div className={`flex justify-between items-center mb-4 p-2 rounded-lg border border-current/10 ${isLight ? 'bg-gray-100' : 'bg-black/10'}`}>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setShowLatin(!showLatin)}
                                    className={`px-3 py-1 rounded text-xs border ${showLatin ? `${isLight ? 'bg-teal-200 text-teal-900 border-teal-600' : 'bg-current/10 border-current text-white'}` : 'border-transparent opacity-60'}`}
                                >
                                    Latin
                                </button>
                                <select 
                                    value={translationLang} 
                                    onChange={(e) => setTranslationLang(e.target.value)}
                                    className="bg-transparent border border-current/30 rounded px-2 py-1 text-xs outline-none"
                                >
                                    <option value="id" className="text-black">Indonesia</option>
                                    <option value="en" className="text-black">English</option>
                                </select>
                            </div>
                            <button onClick={() => openShareModal(selectedItem)} className={`p-2 rounded-full hover:bg-black/10 ${secondaryText}`}>
                                <ShareIcon className="w-5 h-5"/>
                            </button>
                        </div>

                        <div className={`${cardBg} border rounded-2xl p-6 shadow-lg relative overflow-hidden`}>
                            <div className="mb-6 border-b border-current/20 pb-4">
                                <span className={`inline-block px-3 py-1 rounded-full ${isLight ? 'bg-teal-100' : 'bg-current/10'} ${secondaryText} text-xs font-bold mb-2`}>
                                    No. {selectedItem.no}
                                </span>
                                <h3 className="text-xl font-bold leading-relaxed">{selectedItem.judul}</h3>
                            </div>

                            <div className="mb-8">
                                <p className={`text-right font-amiri text-3xl sm:text-4xl md:text-5xl leading-[2.2] ${arabicColor} drop-shadow-sm mb-6`} dir="rtl">
                                    {selectedItem.arab}
                                </p>
                            </div>

                            {showLatin && (
                                <div className={`mb-6 p-4 border-l-4 rounded-r-lg flex justify-between items-start gap-4 ${isLight ? 'bg-orange-50 border-orange-400' : 'bg-yellow-500/10 border-yellow-500/50'}`}>
                                    <p className={`text-sm italic opacity-90 font-medium ${latinColor}`}>
                                        {selectedItem.latin || "Latin text not available."}
                                    </p>
                                    {selectedItem.latin && (
                                        <button onClick={() => handlePlayLatinTTS(selectedItem.latin!)} className="p-2 bg-black/10 rounded-full hover:bg-black/20 shrink-0">
                                            <MicIcon className={`w-4 h-4 ${latinColor}`} />
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className={`p-4 rounded-xl border-l-4 border-current/30 ${isLight ? 'bg-gray-50' : 'bg-current/5'}`}>
                                    <h4 className="text-xs font-bold opacity-60 uppercase tracking-wider mb-1">Artinya ({translationLang.toUpperCase()})</h4>
                                    <p className={`text-sm italic leading-relaxed opacity-90 ${translationColor}`}>
                                        "{selectedItem.artinya}"
                                    </p>
                                </div>

                                <div className="flex justify-end items-center gap-2 mt-4 pt-4 border-t border-current/10">
                                    <span className="text-[10px] uppercase opacity-50 font-bold tracking-wider">Referensi:</span>
                                    <span className="text-xs opacity-80 bg-current/10 px-2 py-1 rounded">{selectedItem.referensi}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
