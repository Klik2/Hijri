import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon, ShareIcon } from './Icons';

type DoaItem = {
    no: number;
    judul: string;
    arab: string;
    artinya: string;
    referensi: string;
};

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
          "judul": "Dzikir Pagi dan Petang (Tasbih)",
          "arab": "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
          "artinya": "Maha Suci Allah, aku memuji-Nya.",
          "referensi": "HR. Muslim no. 2731"
        },
        {
          "no": 2,
          "judul": "Dzikir Pagi dan Petang (Tahlil)",
          "arab": "لاَ إلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَ هُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
          "artinya": "Tidak ada Ilah yang berhak disembah dengan benar kecuali Allah Yang Maha Esa, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan segala pujian. Dan Dia Maha Kuasa atas segala sesuatu.",
          "referensi": "HR. Al-Bukhari no. 6403 & Muslim no. 2691"
        },
        {
          "no": 3,
          "judul": "Sayyidul Istighfar",
          "arab": "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوْبَ إِلا أَنْتَ",
          "artinya": "Ya Allah, Engkau adalah Rabb-ku, tiada Ilah yang berhak disembah dengan benar selain-Mu. Engkau yang menciptakanku. Aku adalah hamba-Mu. Aku (yakin) dengan janji-Mu dan aku akan setia pada perjanjianku dengan-Mu semampuku. Aku berlindung kepada-Mu dari keburukan perbuatanku. Aku mengakui nikmat-Mu (yang Engkau berikan) kepadaku dan aku mengakui dosaku, maka ampunilah aku. Sesungguhnya tidak ada yang dapat mengampuni dosa selain Engkau.",
          "referensi": "HR. Al-Bukhari no. 6306"
        },
        {
          "no": 4,
          "judul": "Dzikir Pagi",
          "arab": "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوْتُ، وَإِلَيْكَ النُّشُوْرُ",
          "artinya": "Ya Allah, dengan rahmat dan pertolongan-Mu kami berada di waktu pagi, serta dengan rahmat dan pertolongan-Mu kami memasuki waktu sore, dengan rahmat dan kehendak-Mu kami hidup, dengan rahmat dan kehendak-Mu kami mati, dan kepada-Mu kebangkitan (bagi semua makhluk).",
          "referensi": "HR. At-Tirmidzi no. 3391"
        },
        {
          "no": 5,
          "judul": "Dzikir Petang",
          "arab": "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوْتُ، وَإِلَيْكَ الْمَصِيرُ",
          "artinya": "Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu sore, serta dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi, dengan rahmat dan kehendak-Mu kami hidup, dengan rahmat dan kehendak-Mu kami mati, dan kepada-Mu seluruh makhluk kembali.",
          "referensi": "HR. At-Tirmidzi no. 3391"
        },
        {
          "no": 48,
          "judul": "Dzikir Pagi dan Petang (Perlindungan)",
          "arab": "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
          "artinya": "Dengan menyebut Nama Allah, yang dengan nama-Nya tidak ada sesuatu yang dapat membahayakan, baik di bumi maupun di langit. Dan Dia Maha Mendengar lagi Maha Mengetahui. (3x)",
          "referensi": "HR. At-Tirmidzi no. 3388"
        },
        {
          "no": 49,
          "judul": "Dzikir Pagi dan Petang (Mohon Perbaikan)",
          "arab": "يَا حَيُّ يَا قَيُّوْمُ بِرَحْمَتِكَ أَسْتَغِيْتُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
          "artinya": "Wahai Rabb Yang Maha Hidup, wahai Rabb Yang Maha Berdiri sendiri, dengan rahmat-Mu aku meminta pertolongan, perbaikilah segala keadaanku dan jangan Engkau serahkan diriku kepadaku meski hanya sekejap mata.",
          "referensi": "HR. An-Nasa'i dalam al-Kubra no. 10330"
        },
        {
          "no": 50,
          "judul": "Dzikir Petang (Kerajaan Allah)",
          "arab": "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ للهِ، لاَ إلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ...",
          "artinya": "Kami telah memasuki waktu sore dan kerajaan hanya milik Allah, segala puji hanya milik Allah. Tidak ada Ilah yang berhak disembah dengan benar kecuali Allah Yang Maha Esa...",
          "referensi": "HR. Muslim no. 2723"
        },
        {
          "no": 51,
          "judul": "Dzikir Pagi dan Petang (Perlindungan Syirik)",
          "arab": "اللَّهُمَّ فَاطِرَ السَّمَوَاتِ وَالْأَرْضِ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوْذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ",
          "artinya": "Ya Allah, Yang Maha Menciptakan langit dan bumi, Yang Maha Mengetahui yang ghaib dan yang nyata, Rabb segala sesuatu dan yang merajainya. Aku bersaksi bahwa tidak ada Ilah yang berhak disembah dengan benar kecuali Engkau. Aku berlindung kepada-Mu dari keburukan diriku, kejahatan setan dan ajakannya untuk menyekutukan-Mu.",
          "referensi": "HR. At-Tirmidzi no. 3392"
        },
        {
          "no": 52,
          "judul": "Dzikir Pagi dan Petang (Mohon Keselamatan)",
          "arab": "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي...",
          "artinya": "Ya Allah, sesungguhnya aku mohon keselamatan di dunia dan akhirat. Ya Allah, sesungguhnya aku mohon ampunan dan keselamatan dalam urusan agama, dunia, keluarga dan hartaku...",
          "referensi": "HR. Abu Dawud no. 5074"
        },
        {
          "no": 53,
          "judul": "Dzikir Pagi (Tasbih Kelipatan)",
          "arab": "سُبْحَانَ اللهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
          "artinya": "Maha Suci Allah, aku memuji-Nya sebanyak bilangan makhluk-Nya, sejauh keridhaan-Nya, seberat timbangan arsy-Nya dan sebanyak tinta (yang menulis) kalimat-Nya. (3x)",
          "referensi": "HR. Muslim no. 2726"
        },
        {
          "no": 54,
          "judul": "Dzikir Pagi (Fitrah Islam)",
          "arab": "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِيْنِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَمِلَّةِ أَبِيْنَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ",
          "artinya": "Di waktu pagi kami berada di atas fitrah agama Islam, kalimat ikhlas, agama Nabi kami Muhammad SAW dan agama ayah kami Ibrahim yang berdiri di atas jalan lurus, Muslim dan tidak tergolong orang-orang Musyrik.",
          "referensi": "HR. Ahmad no. 15367"
        },
        {
          "no": 55,
          "judul": "Dzikir Pagi (Setelah Shubuh)",
          "arab": "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً",
          "artinya": "Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rizki yang baik dan amal yang diterima.",
          "referensi": "HR. Ahmad no. 26602"
        }
      ]
    },
    {
      "category": "Dzikir Seputar Tidur & Bangun",
      "items": [
        {
          "no": 6,
          "judul": "Dzikir Seputar Tidur (Sebelum Tidur)",
          "arab": "بِاسْمِكَ اللَّهُمَّ أَمُوْتُ وَأَحْيَا",
          "artinya": "Dengan nama-Mu ya Allah aku mati dan aku hidup.",
          "referensi": "HR. Al-Bukhari no. 6312"
        },
        {
          "no": 7,
          "judul": "Dzikir Seputar Tidur (Bangun Tidur)",
          "arab": "اَلْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
          "artinya": "Segala puji bagi Allah yang telah menghidupkan kami setelah Ia mematikan kami dan kepada-Nya kami dibangkitkan.",
          "referensi": "HR. Al-Bukhari no. 6312"
        },
        {
          "no": 8,
          "judul": "Dzikir Seputar Tidur (Perlindungan)",
          "arab": "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
          "artinya": "Dengan nama-Mu, wahai Rabb-ku, aku meletakkan lambungku. Dan dengan nama-Mu pula aku terbangun. Apabila Engkau mencabut nyawaku, maka rahmatilah ia. Dan bila Engkau membiarkannya hidup, maka jagalah ia sebagaimana Engkau menjaga orang-orang yang shalih.",
          "referensi": "HR. Al-Bukhari no. 6320"
        },
        {
          "no": 9,
          "judul": "Doa Ketika Terkejut Saat Tidur",
          "arab": "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ غَضَبِهِ وَعِقَابِهِ وَشَرِّ عِبَادِهِ وَمِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَنْ يَحْضُرُونِ",
          "artinya": "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari murka-Nya, siksa-Nya dan dari kejahatan hamba-hambaNya serta dari godaan para setan dan dari kedatangan mereka kepadaku.",
          "referensi": "HR. Abu Dawud no. 3893"
        },
        {
          "no": 56,
          "judul": "Dzikir Sebelum Tidur (Penyerahan Diri)",
          "arab": "اللَّهُمَّ أَسْلَمْتُ وَجْهِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ",
          "artinya": "Ya Allah, sesungguhnya aku menyerahkan diriku kepada-Mu, aku serahkan seluruh urusanku kepada-Mu, aku sandarkan punggungku kepada-Mu. Karena hanya mengharap dan takut kepada-Mu. Tidak ada tempat berlindung dan menyelamatkan diri dari (ancaman)-Mu kecuali kepada-Mu. Aku beriman kepada Kitab yang Engkau turunkan dan kepada Nabi yang Engkau utus.",
          "referensi": "HR. Al-Bukhari no. 6311"
        },
        {
          "no": 57,
          "judul": "Dzikir Sebelum Tidur (Perlindungan Adzab)",
          "arab": "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
          "artinya": "Ya Allah, lindungilah aku dari adzab-Mu pada hari ketika Engkau bangkitkan hamba-hamba-Mu.",
          "referensi": "HR. Al-Bukhari (Adab al-Mufrad no. 1215)"
        },
        {
          "no": 58,
          "judul": "Dzikir Sebelum Tidur (Syukur)",
          "arab": "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَكَفَانَا وَآوَانَا، فَكَمْ مِمَّنْ لَا كَافِيَ لَهُ وَلَا مُؤْوِيَ",
          "artinya": "Segala puji hanya milik Allah yang telah memberi kami makan dan minum, mencukupi kami dan memberi kami tempat berlindung. Betapa banyak orang yang tidak ada yang mencukupinya lagi tidak ada yang memberikannya tempat berlindung.",
          "referensi": "HR. Muslim no. 2715"
        },
        {
          "no": 59,
          "judul": "Dzikir Sebelum Tidur (Hidup & Mati)",
          "arab": "اللَّهُمَّ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ",
          "artinya": "Ya Allah, sesungguhnya Engkau telah menciptakan diriku, dan Engkau-lah yang akan mewafatkannya. Mati dan hidupnya hanya milik-Mu. Jika Engkau menghidupkannya, maka peliharalah ia. Dan jika Engkau mewafatkannya, maka ampunilah ia. Ya Allah, aku mohon keselamatan kepada-Mu.",
          "referensi": "HR. Muslim no. 2712"
        },
        {
          "no": 60,
          "judul": "Dzikir Sebelum Tidur (Hutang & Fakir)",
          "arab": "اللَّهُمَّ رَبَّ السَّمَوَاتِ السَّبْعِ وَرَبَّ الْأَرْضِ وَرَبَّ الْعَرْشِ الْعَظِيمِ... اقْضِ عَنَّا الدَّيْنَ وَأَغْنِنَا مِنَ الْفَقْرِ",
          "artinya": "Ya Allah, Rabb langit yang tujuh, Rabb bumi, Rabb arsy yang agung... Lunasilah hutang kami dan cukupkanlah kami dari kefakiran (kemiskinan).",
          "referensi": "HR. Muslim no. 2713"
        },
        {
          "no": 61,
          "judul": "Dzikir Bangun Tidur (Syukur Kesehatan)",
          "arab": "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي وَأَذِنَ لِي بِذِكْرِهِ",
          "artinya": "Segala puji hanya milik Allah yang telah membuat badanku sehat, yang telah mengembalikan ruhku dan membimbingku untuk berdzikir kepada-Nya.",
          "referensi": "HR. At-Tirmidzi no. 3401"
        }
      ]
    },
    {
      "category": "Doa Kegiatan Sehari-hari",
      "items": [
        {
          "no": 10,
          "judul": "Doa Keluar Rumah",
          "arab": "بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ",
          "artinya": "Dengan Nama Allah, Aku bertawakal kepada Allah, tidak ada daya dan upaya kecuali dengan pertolongan Allah.",
          "referensi": "HR. Abu Dawud no. 5095"
        },
        {
          "no": 62,
          "judul": "Doa Keluar Rumah (Perlindungan Kesesatan)",
          "arab": "اللَّهُمَّ إِنِّي أَعُوْذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ، أَوْ أَزِلَّ أَوْ أُزَلَّ، أَوْ أَظْلِمَ أَوْ أُظْلَمَ، أَوْ أَجْهَلَ أَوْ يُجْهَلَ عَلَيَّ",
          "artinya": "Ya Allah, sesungguhnya aku berlindung kepada-Mu, jangan sampai aku sesat atau disesatkan, tergelincir atau digelincirkan orang, menganiaya atau dianiaya orang dan berbuat bodoh atau dibodohi.",
          "referensi": "HR. Abu Dawud no. 5094"
        },
        {
          "no": 11,
          "judul": "Doa Masuk Rumah (Salam)",
          "arab": "السَّلَامُ عَلَيْكُمْ",
          "artinya": "Semoga keselamatan terlimpahkan kepada kalian (Penghuni rumah).",
          "referensi": "QS. An-Nur: 61"
        },
        {
          "no": 12,
          "judul": "Doa Masuk Kamar Mandi/WC",
          "arab": "اللَّهُمَّ إِنِّي أَعُوْذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
          "artinya": "Ya Allah, sesungguhnya aku berlindung kepada-Mu dari godaan setan laki-laki dan setan perempuan.",
          "referensi": "HR. Al-Bukhari no. 142"
        },
        {
          "no": 13,
          "judul": "Doa Keluar Kamar Mandi/WC",
          "arab": "غُفْرَانَكَ",
          "artinya": "Aku memohon ampunan kepada-Mu.",
          "referensi": "HR. Abu Dawud no. 30"
        },
        {
          "no": 39,
          "judul": "Dzikir Makan (Lupa Bismillah)",
          "arab": "بِسْمِ اللهِ أَوَّلَهُ وَآخِرَهُ",
          "artinya": "Dengan menyebut nama Allah pada awal dan akhirnya.",
          "referensi": "HR. Abu Dawud no. 3767"
        },
        {
          "no": 40,
          "judul": "Dzikir Setelah Makan",
          "arab": "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
          "artinya": "Segala puji hanya bagi Allah yang telah memberi makanan ini dan yang telah memberi rizki kepadaku tanpa daya dan kekuatan dariku.",
          "referensi": "HR. Abu Dawud no. 4023"
        },
        {
          "no": 95,
          "judul": "Doa Selesai Makan (Banyak Pujian)",
          "arab": "الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ، غَيْرَ مَكْفِيٍّ وَلَا مُوَدَّعٍ وَلَا مُسْتَغْنًى عَنْهُ رَبَّنَا",
          "artinya": "Segala puji hanya bagi Allah, pujian yang banyak, yang baik dan penuh berkah, yang selalu dibutuhkan, dan tidak dapat ditinggalkan, wahai Rabb kami.",
          "referensi": "HR. Al-Bukhari no. 5458"
        },
        {
          "no": 96,
          "judul": "Doa Untuk Pengundang Makan",
          "arab": "اللَّهُمَّ بَارِكْ لَهُمْ فِيمَا رَزَقْتَهُمْ، وَاغْفِرْ لَهُمْ وَارْحَمْهُمْ",
          "artinya": "Ya Allah, berkahilah apa yang Engkau berikan kepada mereka serta ampuni dan rahmatilah mereka.",
          "referensi": "HR. Muslim no. 2042"
        },
        {
          "no": 97,
          "judul": "Doa Untuk Pengundang Makan (Buka Puasa)",
          "arab": "أَفْطَرَ عِنْدَكُمُ الصَّائِمُونَ، وَأَكَلَ طَعَامَكُمُ الْأَبْرَارُ، وَصَلَّتْ عَلَيْكُمُ الْمَلَائِكَةُ",
          "artinya": "Orang-orang yang berpuasa telah berbuka di rumahmu dan orang-orang yang baik memakan makananmu serta para Malaikat mendoakan agar kalian mendapat rahmat.",
          "referensi": "HR. Abu Dawud no. 3854"
        },
        {
          "no": 43,
          "judul": "Doa Memakai Pakaian Baru",
          "arab": "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ، أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ...",
          "artinya": "Ya Allah, hanya Engkau yang memilik segala pujian, Engkaulah yang memberikan pakaian ini kepadaku. Aku mohon kepada-Mu untuk memperoleh kebaikannya...",
          "referensi": "HR. Abu Dawud no. 4030"
        },
        {
          "no": 98,
          "judul": "Doa Untuk Orang Pakai Baju Baru",
          "arab": "إِلْبَسْ جَدِيدًا، وَعِشْ حَمِيدًا، وَمُتْ شَهِيدًا",
          "artinya": "Kenakanlah pakaian baru, hiduplah dengan terpuji dan matilah dalam keadaan syahid.",
          "referensi": "HR. Ibnu Majah no. 3558 (Matan mirip)"
        },
        {
          "no": 44,
          "judul": "Doa Kaffaratul Majelis",
          "arab": "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
          "artinya": "Mahasuci Engkau, ya Allah, aku memuji-Mu. Aku bersaksi tiada Ilah yang berhak disembah dengan benar kecuali Engkau. Aku memohon ampunan dan bertaubat kepada-Mu.",
          "referensi": "HR. At-Tirmidzi no. 3433"
        },
        {
          "no": 45,
          "judul": "Dzikir Masuk Pasar",
          "arab": "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ...",
          "artinya": "Tidak ada Ilah yang berhak disembah dengan benar kecuali Allah Yang Maha Esa, tiada sekutu bagi-Nya. Milik-Nya segala kerajaan dan bagi-Nya segala puji. Dialah Yang Menghidup dan Mematikan...",
          "referensi": "HR. At-Tirmidzi no. 3428"
        },
        {
          "no": 101,
          "judul": "Ucapan Cinta Karena Allah",
          "arab": "إِنِّي أُحِبُّكَ فِي اللهِ",
          "artinya": "Sesungguhnya aku mencintaimu karena Allah.",
          "referensi": "HR. Abu Dawud no. 5125"
        },
        {
          "no": 102,
          "judul": "Jawaban Cinta Karena Allah",
          "arab": "أَحَبَّكَ الَّذِي أَحْبَبْتَنِي لَهُ",
          "artinya": "Semoga Allah mencintaimu sebagaimana engkau mencintaiku karena-Nya.",
          "referensi": "HR. Abu Dawud no. 5125"
        },
        {
          "no": 103,
          "judul": "Ucapan Terima Kasih (Jazakallah)",
          "arab": "جَزَاكَ اللَّهُ خَيْرًا",
          "artinya": "Semoga Allah membalasmu dengan kebaikan.",
          "referensi": "HR. At-Tirmidzi no. 2035"
        }
      ]
    },
    {
      "category": "Dzikir & Doa Shalat",
      "items": [
        {
          "no": 14,
          "judul": "Doa Wudhu (Setelah Wudhu)",
          "arab": "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
          "artinya": "Aku bersaksi bahwa tiada Ilah yang berhak disembah dengan benar kecuali Allah, dan bahwa Muhammad adalah hamba dan utusan-Nya.",
          "referensi": "HR. Muslim no. 234"
        },
        {
          "no": 15,
          "judul": "Doa Berangkat ke Masjid",
          "arab": "اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا، وَفِي لِسَانِي نُورًا، وَفِي سَمْعِي نُورًا، وَفِي بَصَرِي نُورًا...",
          "artinya": "Ya Allah, jadikanlah cahaya di hatiku, cahaya di lidahku, cahaya di pendengaranku, cahaya di penglihatanku... (dan seterusnya).",
          "referensi": "HR. Muslim no. 763"
        },
        {
          "no": 16,
          "judul": "Doa Masuk Masjid",
          "arab": "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
          "artinya": "Ya Allah, bukakanlah pintu-pintu rahmat-Mu untukku.",
          "referensi": "HR. Muslim no. 713"
        },
        {
          "no": 17,
          "judul": "Doa Keluar Masjid",
          "arab": "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
          "artinya": "Ya Allah, sesungguhnya aku memohon karunia-Mu.",
          "referensi": "HR. Muslim no. 713"
        },
        {
          "no": 18,
          "judul": "Doa Setelah Adzan",
          "arab": "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ",
          "artinya": "Ya Allah, Rabb Pemilik seruan yang sempurna (adzan) ini dan shalat (wajib) yang ditegakkan. Berilah al-wasilah (derajat di surga) dan keutamaan kepada Muhammad serta berikanlah beliau kedudukan terpuji sebagaimana yang telah Engkau janjikan.",
          "referensi": "HR. Al-Bukhari no. 614"
        },
        {
          "no": 63,
          "judul": "Doa Setelah Adzan (Ridha)",
          "arab": "رَضِيتُ بِاللهِ رَبًّا، وَبِمُحَمَّدٍ رَسُولًا، وَبِالْإِسْلَامِ دِينًا",
          "artinya": "Aku ridha Allah sebagai Rabb, Muhammad sebagai Rasul dan Islam sebagai agamaku.",
          "referensi": "HR. Muslim no. 386"
        },
        {
          "no": 19,
          "judul": "Doa Istiftah",
          "arab": "اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ...",
          "artinya": "Ya Allah, jauhkanlah antara diriku dan kesalahan-kesalahanku sebagaimana Engkau jauhkan antara timur dan barat...",
          "referensi": "HR. Al-Bukhari no. 744"
        },
        {
          "no": 64,
          "judul": "Doa Istiftah (Pujian)",
          "arab": "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ",
          "artinya": "Maha Suci Engkau ya Allah, aku memuji-Mu dan Maha Berkah nama-Mu, Maha Tinggi kekayaan dan kehormatan-Mu, tiada Ilah yang berhak disembah dengan benar selain Engkau.",
          "referensi": "HR. Abu Dawud no. 776"
        },
        {
          "no": 65,
          "judul": "Doa Istiftah (Wajah)",
          "arab": "وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَوَاتِ وَالْأَرْضَ حَنِيفًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ... (إلى آخر الحديث)",
          "artinya": "Aku hadapkan wajahku kepada Rabb Pencipta langit dan bumi, dengan (agama) yang lurus dan aku bukanlah orang-orang yang Musyrik... (dan seterusnya).",
          "referensi": "HR. Muslim no. 771"
        },
        {
          "no": 66,
          "judul": "Doa Istiftah (Tahajjud - Jibril)",
          "arab": "اللَّهُمَّ رَبَّ جِبْرَائِيلَ وَمِيكَائِيلَ وَإِسْرَافِيلَ، فَاطِرَ السَّمَوَاتِ وَالْأَرْضِ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ... اهْدِنِي لِمَا اخْتُلِفَ فِيهِ مِنَ الْحَقِّ بِإِذْنِكَ",
          "artinya": "Ya Allah, Rabb Jibril, Mika`il dan Israfil, Rabb pencipta langit dan bumi, Rabb Yang mengetahui yang ghaib dan yang nyata... Berilah aku petunjuk untuk memilih kebenaran dari apa yang mereka perselisihkan dengan seizin-Mu.",
          "referensi": "HR. Muslim no. 770"
        },
        {
          "no": 67,
          "judul": "Doa Istiftah (Tahajjud - Pujian)",
          "arab": "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ نُورُ السَّمَوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الْحَمْدُ أَنْتَ قَيِّمُ السَّمَوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ... (إلى آخر الحديث)",
          "artinya": "Ya Allah, bagi-Mu segala puji, Engkau adalah cahaya langit dan bumi serta seluruh makhluk yang ada padanya. Bagi-Mu segala puji, Engkau-lah Yang merajai langit dan bumi... (dan seterusnya).",
          "referensi": "HR. Al-Bukhari no. 1120"
        },
        {
          "no": 20,
          "judul": "Doa Ruku",
          "arab": "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
          "artinya": "Maha Suci Rabb-ku Yang Maha Agung.",
          "referensi": "HR. Muslim no. 772"
        },
        {
          "no": 68,
          "judul": "Doa Ruku (Pujian & Ampunan)",
          "arab": "سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ اللَّهُمَّ اغْفِرْ لِي",
          "artinya": "Mahasuci Engkau ya Allah, Rabb kami, dengan memuji-Mu ya Allah, ampunilah dosaku.",
          "referensi": "HR. Al-Bukhari no. 817"
        },
        {
          "no": 69,
          "judul": "Doa Ruku/Sujud (Malaikat)",
          "arab": "سُبُّوحٌ قُدُّوسٌ، رَبُّ الْمَلَائِكَةِ وَالرُّوحِ",
          "artinya": "Engkau Rabb Yang Maha Suci dan Maha Quddus (terlepas dari segala kekurangan), Rabb para Malaikat dan Jibril (Ar-Ruh).",
          "referensi": "HR. Muslim no. 487"
        },
        {
          "no": 21,
          "judul": "Doa Bangkit dari Ruku (I'tidal)",
          "arab": "رَبَّنَا وَلَكَ الْحَمْدُ، حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ",
          "artinya": "Wahai Rabb kami, bagi-Mu segala puji, aku memuji-Mu dengan pujian yang banyak, yang baik dan penuh dengan berkah.",
          "referensi": "HR. Al-Bukhari no. 799"
        },
        {
          "no": 70,
          "judul": "Doa I'tidal (Langit & Bumi)",
          "arab": "مِلْءَ السَّمَوَاتِ وَمِلْءَ الْأَرْضِ وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ... (إلى آخر الحديث)",
          "artinya": "Sepenuh langit dan bumi dan sepenuh apa yang Engkau kehendaki setelahnya... (dan seterusnya).",
          "referensi": "HR. Muslim no. 477"
        },
        {
          "no": 22,
          "judul": "Doa Sujud",
          "arab": "سُبْحَانَ رَبِّيَ الْأَعْلَى",
          "artinya": "Maha Suci Rabb-ku Yang Maha Tinggi.",
          "referensi": "HR. Muslim no. 772"
        },
        {
          "no": 71,
          "judul": "Doa Sujud (Ampunan Menyeluruh)",
          "arab": "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ",
          "artinya": "Ya Allah, ampunilah seluruh dosaku, yang kecil maupun yang besar, yang terdahulu dan yang akan datang dan yang dilakukan terang-terangan atau sembunyi-sembunyi.",
          "referensi": "HR. Muslim no. 483"
        },
        {
          "no": 72,
          "judul": "Doa Sujud (Perlindungan Ridha)",
          "arab": "اللَّهُمَّ إِنِّي أَعُوْذُ بِرِضَاكَ مِنْ سَخَطِكَ، وَبِمُعَافَاتِكَ مِنْ عُقُوبَتِكَ، وَأَعُوْذُ بِكَ مِنْكَ...",
          "artinya": "Ya Allah, aku berlindung dengan keridhaan-Mu dari kemurkaan-Mu, dan (aku berlindung) dengan pengampunan-Mu dari siksa-Mu...",
          "referensi": "HR. Muslim no. 486"
        },
        {
          "no": 23,
          "judul": "Doa Duduk Antara Dua Sujud",
          "arab": "اللَّهُمَّ اغْفِرْ لِي، وَارْحَمْنِي، وَعَافِنِي، وَاهْدِنِي، وَارْزُقْنِي",
          "artinya": "Ya Allah, ampunilah aku, sayangilah aku, maafkanlah aku, berilah aku petunjuk dan berilah aku rizki.",
          "referensi": "HR. Abu Dawud no. 850"
        },
        {
          "no": 24,
          "judul": "Tasyahhud",
          "arab": "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ...",
          "artinya": "Segala ucapan penghormatan hanyalah milik Allah, begitu juga shalat dan semua amal shalih. Semoga kesejahteraan senantiasa terlimpahkan atasmu, wahai Nabi...",
          "referensi": "HR. Al-Bukhari no. 831"
        },
        {
          "no": 25,
          "judul": "Shalawat Nabi (Dalam Shalat)",
          "arab": "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ...",
          "artinya": "Ya Allah, curahkanlah shalawat kepada Muhammad dan keluarga Muhammad sebagaimana Engkau telah mencurahkan shalawat kepada Ibrahim dan keluarga Ibrahim...",
          "referensi": "HR. Al-Bukhari no. 3370"
        },
        {
          "no": 73,
          "judul": "Doa Setelah Tasyahhud (Kezhaliman)",
          "arab": "اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ",
          "artinya": "Ya Allah, sesungguhnya aku telah banyak menganiaya diriku sendiri, sementara tidak ada yang dapat mengampuni dosa-dosa kecuali Engkau. Karena itu, ampunilah dosa-dosaku dengan ampunan dari sisi-Mu dan berikanlah rahmat kepadaku. Sesungguhnya Engkau Maha Pengampun lagi Maha Penyayang.",
          "referensi": "HR. Al-Bukhari no. 834"
        },
        {
          "no": 26,
          "judul": "Doa Sebelum Salam (Perlindungan)",
          "arab": "اللَّهُمَّ إِنِّي أَعُوْذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",
          "artinya": "Ya Allah, sesungguhnya aku berlindung kepada-Mu dari siksa neraka jahannam, dari adzab kubur, dari fitnah kehidupan dan fitnah setelah kematian serta dari kejahatan fitnah dajjal.",
          "referensi": "HR. Al-Bukhari no. 1377"
        },
        {
          "no": 27,
          "judul": "Dzikir Setelah Salam (Istighfar)",
          "arab": "أَسْتَغْفِرُ اللهَ، أَسْتَغْفِرُ اللهَ، أَسْتَغْفِرُ اللهَ",
          "artinya": "Aku memohon ampun kepada Allah (3x).",
          "referensi": "HR. Muslim no. 591"
        },
        {
          "no": 28,
          "judul": "Dzikir Setelah Salam (Tasbih Tahmid Takbir)",
          "arab": "سُبْحَانَ اللهِ (33x)، الْحَمْدُ لِلَّهِ (33x)، اللهُ أَكْبَرُ (33x)",
          "artinya": "Maha Suci Allah, Segala Puji bagi Allah, Allah Maha Besar.",
          "referensi": "HR. Muslim no. 597"
        },
        {
          "no": 74,
          "judul": "Doa Qunut Witir",
          "arab": "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ...",
          "artinya": "Ya Allah, berilah aku petunjuk sebagaimana orang yang telah Engkau beri petunjuk, berilah aku perlindungan (dari segala penyakit) sebagaimana orang yang telah Engkau lindungi...",
          "referensi": "HR. Abu Dawud no. 1425"
        },
        {
          "no": 29,
          "judul": "Doa Istikharah",
          "arab": "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ...",
          "artinya": "Ya Allah, sesungguhnya aku meminta pilihan yang tepat kepada-Mu dengan ilmu-Mu dan aku memohon kekuatan kepada-Mu (untuk mengatasi masalahku) dengan kemahakuasaan-Mu...",
          "referensi": "HR. Al-Bukhari no. 1166"
        }
      ]
    },
    {
      "category": "Musibah, Kesempitan & Perlindungan",
      "items": [
        {
          "no": 30,
          "judul": "Doa Ketika Mengalami Kesusahan",
          "arab": "لَا إِلَهَ إِلَّا اللهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللهُ رَبُّ الْعَرْشِ الْعَظِيمِ...",
          "artinya": "Tiada Ilah yang berhak disembah dengan benar kecuali Allah Yang Maha Agung lagi Maha Lembut. Tiada Ilah yang berhak disembah dengan benar kecuali Allah Rabb (Pemilik) arsy yang agung...",
          "referensi": "HR. Al-Bukhari no. 6346"
        },
        {
          "no": 75,
          "judul": "Doa Kesusahan (Hasbalah)",
          "arab": "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
          "artinya": "Cukuplah Allah menjadi Penolong kami dan Allah adalah sebaik-baik Pelindung.",
          "referensi": "QS. Ali Imran: 173 / HR. Al-Bukhari"
        },
        {
          "no": 76,
          "judul": "Doa Kesusahan (Tauhid)",
          "arab": "اللَّهُ اللَّهُ رَبِّي لَا أُشْرِكُ بِهِ شَيْئًا",
          "artinya": "Allah, Allah adalah Rabb-ku. Aku tidak menyekutukan-Nya dengan sesuatu apa pun.",
          "referensi": "HR. Abu Dawud no. 1525"
        },
        {
          "no": 77,
          "judul": "Doa Kesusahan (Rahmat)",
          "arab": "اللَّهُمَّ رَحْمَتَكَ أَرْجُو، فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ، لَا إِلَهَ إِلَّا أَنْتَ",
          "artinya": "Ya Allah, hanya rahmat-Mu yang selalu aku harapkan. Karena itu, janganlah Engkau serahkan urusanku kepada diriku meski hanya sekejap mata dan perbaikilah seluruh urusanku. Tiada Ilah yang berhak disembah dengan benar kecuali Engkau.",
          "referensi": "HR. Abu Dawud no. 5090"
        },
        {
          "no": 78,
          "judul": "Doa Kesusahan (Nabi Yunus)",
          "arab": "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
          "artinya": "Tiada Ilah yang berhak disembah dengan benar kecuali Engkau. Maha Suci Engkau. Sesungguhnya aku termasuk orang-orang yang berbuat zhalim.",
          "referensi": "HR. At-Tirmidzi no. 3505"
        },
        {
          "no": 79,
          "judul": "Doa Kesedihan dan Galau",
          "arab": "اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ... (إلى آخر الحديث)",
          "artinya": "Ya Allah, sesungguhnya aku adalah hamba-Mu, anak hamba-Mu (Adam) dan anak hamba perempuan-Mu (Hawwa), ubun-ubunku berada di tangan-Mu. Hukum-Mu berlaku pada diriku dan ketetapan-Mu adil pada diriku...",
          "referensi": "HR. Ahmad no. 4318"
        },
        {
          "no": 80,
          "judul": "Doa Bertemu Musuh (Kitab)",
          "arab": "اللَّهُمَّ مُنْزِلَ الْكِتَابِ، وَمُجْرِيَ السَّحَابِ، وَهَازِمَ الْأَحْزَابِ، اهْزِمْهُمْ وَانْصُرْنَا عَلَيْهِمْ",
          "artinya": "Ya Allah, Yang menurunkan Kitab, Yang menjalankan awan, Yang menghancurkan pasukan sekutu, hancurkanlah mereka dan menangkanlah kami atas mereka.",
          "referensi": "HR. Al-Bukhari no. 2966 (Teks di PDF 147)"
        },
        {
          "no": 81,
          "judul": "Doa Bertemu Musuh (Leher)",
          "arab": "اللَّهُمَّ إِنَّا نَجْعَلُكَ فِي نُحُورِهِمْ، وَنَعُوذُ بِكَ مِنْ شُرُورِهِمْ",
          "artinya": "Ya Allah, sesungguhnya kami menjadikan Engkau di leher-leher mereka (agar kekuatan mereka tidak berdaya). Dan kami berlindung kepada-Mu dari keburukan mereka.",
          "referensi": "HR. Abu Dawud no. 1537"
        },
        {
          "no": 31,
          "judul": "Doa Ketika Tertimpa Musibah",
          "arab": "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا",
          "artinya": "Sesungguhnya kami milik Allah dan kepada-Nya kami akan kembali. Ya Allah, berikanlah pahala kepadaku dalam musibahku dan gantikanlah untukku yang lebih baik darinya.",
          "referensi": "HR. Muslim no. 918"
        },
        {
          "no": 32,
          "judul": "Doa Orang yang Memiliki Hutang",
          "arab": "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
          "artinya": "Ya Allah, cukupilah aku dengan rizki-Mu yang halal (hingga aku terhindar) dari yang haram. Cukupilah aku dengan karunia-Mu (hingga aku tidak meminta) kepada selain-Mu.",
          "referensi": "HR. At-Tirmidzi no. 3563"
        },
        {
          "no": 99,
          "judul": "Doa Ketika Marah",
          "arab": "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
          "artinya": "Aku berlindung kepada Allah dari godaan setan yang terkutuk.",
          "referensi": "HR. Al-Bukhari no. 6115"
        },
        {
          "no": 100,
          "judul": "Doa Melihat Orang Tertimpa Musibah",
          "arab": "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي مِمَّا ابْتَلَاكَ بِهِ، وَفَضَّلَنِي عَلَى كَثِيرٍ مِمَّنْ خَلَقَ تَفْضِيلًا",
          "artinya": "Segala puji hanya milik Allah yang menyelamatkan aku dari musibah yang Allah timpakan kepadamu. Dan Allah telah memberi kemuliaan kepadaku melebihi orang banyak.",
          "referensi": "HR. At-Tirmidzi no. 3432"
        },
        {
          "no": 105,
          "judul": "Perlindungan dari Sifat Buruk",
          "arab": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ مُنْكَرَاتِ الْأَخْلَاقِ، وَالْأَعْمَالِ، وَالْأَهْوَاءِ",
          "artinya": "Ya Allah, sesungguhnya aku berlindung kepada-Mu dari keterpurukan akhlak dan amal perbuatan serta dari (godaan) hawa nafsu.",
          "referensi": "HR. At-Tirmidzi no. 3591"
        },
        {
          "no": 106,
          "judul": "Perlindungan dari Ilmu Tak Bermanfaat",
          "arab": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ، وَمِنْ قَلْبٍ لَا يَخْشَعُ، وَمِنْ نَفْسٍ لَا تَشْبَعُ، وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا",
          "artinya": "Ya Allah, sesungguhnya aku berlindung kepada-Mu dari ilmu yang tidak bermanfaat, hati yang tidak khusyu`, nafsu yang tidak pernah puas dan do`a yang tidak dikabulkan.",
          "referensi": "HR. Muslim no. 2722"
        }
      ]
    },
    {
      "category": "Musibah, Kesempitan & Sakit (inc. Ruqyah)",
      "items": [
        {
          "no": 83,
          "judul": "Doa Sakit (Meruqyah Diri Sendiri)",
          "arab": "بِسْمِ اللهِ (3x)، أَعُوذُ بِاللهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ (7x)",
          "artinya": "Dengan nama Allah (3x). Aku berlindung kepada Allah dan kepada kekuasaan-Nya dari kejahatan apa yang aku rasakan dan yang aku khawatirkan (7x).",
          "referensi": "HR. Muslim no. 2202"
        },
        {
          "no": 84,
          "judul": "Doa Ruqyah (Jibril)",
          "arab": "بِسْمِ اللهِ أَرْقِيكَ، مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ، مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ، اللَّهُ يَشْفِيكَ، بِسْمِ اللهِ أَرْقِيكَ",
          "artinya": "Dengan menyebut Nama Allah aku meruqyahmu dari segala sesuatu yang menyakitimu dan dari kejahatan setiap jiwa atau mata orang yang dengki. Semoga Allah menyembuhkanmu. Dengan menyebut Nama Allah aku meruqyahmu.",
          "referensi": "HR. Muslim no. 2186"
        },
        {
          "no": 33,
          "judul": "Doa Menjenguk Orang Sakit",
          "arab": "لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللهُ",
          "artinya": "Tidak mengapa, jadi penggugur dosa, insya Allah.",
          "referensi": "HR. Al-Bukhari no. 3616"
        },
        {
          "no": 82,
          "judul": "Doa Menjenguk Orang Sakit (7x)",
          "arab": "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ",
          "artinya": "Aku mohon kepada Allah Yang Maha Agung Rabb arsy yang agung, agar Dia menyembuhkanmu. (Dibaca 7 kali)",
          "referensi": "HR. Abu Dawud no. 3106"
        },
        {
          "no": 46,
          "judul": "Doa Melihat Sesuatu yang Menakjubkan (Ain)",
          "arab": "اللَّهُمَّ بَارِكْ عَلَيْهِ / مَا شَاءَ اللهُ لَا قُوَّةَ إِلَّا بِاللهِ",
          "artinya": "Ya Allah, berkahilah dia / Masya Allah (Sungguh atas kehendak Allah), tiada kekuatan kecuali dengan pertolongan Allah.",
          "referensi": "HR. Ahmad / QS. Al-Kahfi: 39"
        }
      ]
    },
    {
      "category": "Kematian Seseorang",
      "items": [
        {
          "no": 85,
          "judul": "Doa Sakaratul Maut",
          "arab": "اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَأَلْحِقْنِي بِالرَّفِيقِ الْأَعْلَى",
          "artinya": "Ya Allah, ampunilah aku, kasihanilah aku dan tempatkanlah aku di Rafiq al-A'la (tertinggi).",
          "referensi": "HR. Al-Bukhari no. 5674"
        },
        {
          "no": 86,
          "judul": "Ucapan Takziah (Bela Sungkawa)",
          "arab": "إِنَّ لِلَّهِ مَا أَخَذَ، وَلَهُ مَا أَعْطَى، وَكُلُّ شَيْءٍ عِنْدَهُ بِأَجَلٍ مُسَمًّى، فَلْتَصْبِرْ وَلْتَحْتَسِبْ",
          "artinya": "Sesungguhnya kepunyaan Allah apa yang Dia ambil dan apa yang Dia berikan. Segala sesuatu di sisi-Nya telah ditentukan batasnya. Karenanya, bersabarlah dan berharaplah pahala dari Allah.",
          "referensi": "HR. Al-Bukhari no. 1284"
        },
        {
          "no": 34,
          "judul": "Doa Shalat Jenazah",
          "arab": "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ...",
          "artinya": "Ya Allah, ampunilah ia, berikanlah rahmat kepadanya, selamatkanlah ia (dari siksa kubur), maafkanlah ia...",
          "referensi": "HR. Muslim no. 963"
        },
        {
          "no": 35,
          "judul": "Doa Ziarah Kubur",
          "arab": "السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ...",
          "artinya": "Semoga kesejahteraan senantiasa tercurahkan atas kalian, wahai penghuni kubur dari kaum Mukminin dan muslimin...",
          "referensi": "HR. Muslim no. 974"
        }
      ]
    },
    {
      "category": "Terkait Fenomena Alam",
      "items": [
        {
          "no": 36,
          "judul": "Doa Istisqa (Meminta Hujan)",
          "arab": "اللَّهُمَّ أَغِثْنَا، اللَّهُمَّ أَغِثْنَا، اللَّهُمَّ أَغِثْنَا",
          "artinya": "Ya Allah, berikanlah kami hujan (3x).",
          "referensi": "HR. Al-Bukhari no. 1013"
        },
        {
          "no": 87,
          "judul": "Doa Angin Kencang",
          "arab": "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا، وَخَيْرَ مَا فِيهَا، وَخَيْرَ مَا أُرْسِلَتْ بِهِ، وَأَعُوذُ بِكَ مِنْ شَرِّهَا، وَشَرِّ مَا فِيهَا، وَشَرِّ مَا أُرْسِلَتْ بِهِ",
          "artinya": "Ya Allah, sesungguhnya aku memohon kepada-Mu kebaikan angin ini dan kebaikan yang ada padanya serta kebaikan tujuan angin ini dihembuskan. Aku berlindung kepada-Mu dari keburukannya...",
          "referensi": "HR. Muslim no. 899"
        },
        {
          "no": 88,
          "judul": "Doa Mendengar Petir",
          "arab": "سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ",
          "artinya": "Mahasuci Allah yang halilintar bertasbih dengan memuji-Nya, begitu pula para Malaikat karena takut kepada-Nya.",
          "referensi": "HR. Malik (Al-Muwaththa' no. 1822)"
        },
        {
          "no": 89,
          "judul": "Doa Turun Hujan",
          "arab": "اللَّهُمَّ صَيِّبًا نَافِعًا",
          "artinya": "Ya Allah, turunkanlah hujan yang bermanfaat.",
          "referensi": "HR. Al-Bukhari no. 1032"
        },
        {
          "no": 90,
          "judul": "Doa Melihat Hilal",
          "arab": "اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْإِيمَانِ، وَالسَّلَامَةِ وَالْإِسْلَامِ، رَبِّي وَرَبُّكَ اللَّهُ",
          "artinya": "Ya Allah, tampakkanlah bulan itu kepada kami dengan membawa keberkahan serta keimanan, keselamatan dan Islam. Rabb-ku dan Rabb-mu (wahai bulan) adalah Allah.",
          "referensi": "HR. At-Tirmidzi no. 3451"
        },
        {
          "no": 104,
          "judul": "Doa Melihat Putik Buah",
          "arab": "اللَّهُمَّ بَارِكْ لَنَا فِي ثَمَرِنَا، وَبَارِكْ لَنَا فِي مَدِينَتِنَا، وَبَارِكْ لَنَا فِي صَاعِنَا، وَبَارِكْ لَنَا فِي مُدِّنَا",
          "artinya": "Ya Allah, berkahilah buah-buahan kami, berkahilah kota Madinah kami, berkahilah takaran makanan kami dan berkahilah pada mudd kami.",
          "referensi": "HR. Muslim no. 1373"
        }
      ]
    },
    {
      "category": "Ketika Dalam Perjalanan (Safar)",
      "items": [
        {
          "no": 37,
          "judul": "Doa Naik Kendaraan",
          "arab": "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
          "artinya": "Mahasuci Rabb yang telah menundukkan kendaraan ini untuk kami, padahal kami sebelumnya tidak mampu menguasainya. Dan sesungguhnya kami pasti akan kembali kepada Rabb kami.",
          "referensi": "HR. Abu Dawud no. 2602"
        },
        {
          "no": 93,
          "judul": "Doa Safar (Titip Diri)",
          "arab": "أَسْتَوْدِعُ اللَّهَ دِينَكَ، وَأَمَانَتَكَ، وَخَوَاتِيمَ عَمَلِكَ",
          "artinya": "Aku titipkan kepada Allah agamamu, amanahmu dan akhir penutup amalmu.",
          "referensi": "HR. At-Tirmidzi no. 3443"
        },
        {
          "no": 38,
          "judul": "Doa Safar (Bepergian)",
          "arab": "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى...",
          "artinya": "Ya Allah, sesungguhnya kami memohon kebaikan dan ketakwaan dalam perjalanan ini...",
          "referensi": "HR. Muslim no. 1342"
        },
        {
          "no": 94,
          "judul": "Doa Masuk Kampung/Negeri",
          "arab": "اللَّهُمَّ رَبَّ السَّمَوَاتِ السَّبْعِ وَمَا أَظْلَلْنَ، وَرَبَّ الْأَرَضِينَ السَّبْعِ وَمَا أَقْلَلْنَ... أَسْأَلُكَ خَيْرَ هَذِهِ الْقَرْيَةِ وَخَيْرَ أَهْلِهَا...",
          "artinya": "Ya Allah, Rabb Yang Menguasai tujuh langit dan apa yang dinaunginya... Kami memohon kepada-Mu kebaikan kampung ini, kebaikan penduduknya dan apa yang ada di dalamnya...",
          "referensi": "HR. An-Nasa'i (Al-Kubra no. 8775)"
        }
      ]
    },
    {
      "category": "Ketika Ramadhan",
      "items": [
        {
          "no": 91,
          "judul": "Doa Berbuka Puasa",
          "arab": "ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
          "artinya": "Telah hilang rasa haus, urat-urat telah basah dan pahala telah tetap insya Allah.",
          "referensi": "HR. Abu Dawud no. 2357"
        },
        {
          "no": 92,
          "judul": "Doa Lailatul Qadar",
          "arab": "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
          "artinya": "Ya Allah, sesungguhnya Engkau Maha Pemaaf serta Suka memaafkan. Karenanya, berilah maaf kepadaku.",
          "referensi": "HR. At-Tirmidzi no. 3513"
        }
      ]
    },
    {
      "category": "Pernikahan & Keluarga",
      "items": [
        {
          "no": 41,
          "judul": "Doa Pengantin Baru",
          "arab": "بَارَكَ اللهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
          "artinya": "Semoga Allah memberi berkah kepadamu dan memberkahi (pernikahan)mu serta mengumpulkan kalian berdua dalam kebaikan.",
          "referensi": "HR. Abu Dawud no. 2130"
        },
        {
          "no": 42,
          "judul": "Doa Perlindungan untuk Anak",
          "arab": "أُعِيذُكُمَا بِكَلِمَاتِ اللهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ",
          "artinya": "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari setiap setan, binatang berbisa dan dari setiap mata yang jahat.",
          "referensi": "HR. Al-Bukhari no. 3371"
        }
      ]
    },
    {
      "category": "Lain-lain / Dzikir Setiap Saat",
      "items": [
        {
          "no": 47,
          "judul": "Doa Sapu Jagat",
          "arab": "اللَّهُمَّ رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً، وَفِي الْآخِرَةِ حَسَنَةً، وَقِنَا عَذَابَ النَّارِ",
          "artinya": "Ya Allah, Rabb kami, berikanlah kepada kami kebaikan di dunia dan kebaikan di akhirat serta lindungilah kami dari siksa neraka.",
          "referensi": "HR. Al-Bukhari no. 6389"
        }
      ]
    }
  ];

export const DoaDzikirPage: React.FC<{onBack: () => void}> = ({onBack}) => {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedItem, setSelectedItem] = useState<DoaItem | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

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

    // Filter logic
    const filteredCategories = searchQuery 
        ? DOA_COLLECTION.filter(cat => 
            cat.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
            cat.items.some(item => item.judul.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        : DOA_COLLECTION;

    const filteredItems = selectedCategory 
        ? selectedCategory.items.filter(item => item.judul.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    return (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[#002b25] text-white font-jannah animate-fade-in h-[100dvh]">
            {/* Header */}
            <div className="p-4 border-b border-[#00ffdf]/30 flex justify-between items-center bg-[#00594C] shadow-md shrink-0 z-20">
                <button onClick={handleBack} className="p-2 rounded-full hover:bg-black/20 flex items-center gap-2 transition-colors">
                    <ChevronLeftIcon className="w-6 h-6" />
                    <span className="hidden sm:inline text-sm font-bold">Kembali</span>
                </button>
                <h2 className="text-xl font-bold font-amiri tracking-wider truncate px-2">
                    {selectedItem ? 'Detail Doa' : (selectedCategory ? selectedCategory.category : 'Doa & Dzikir')}
                </h2>
                <div className="w-8"></div> 
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-[#00352e] to-[#002b25] relative">
                
                {/* Search Bar (Only in Main or Category View) */}
                {!selectedItem && (
                    <div className="sticky top-0 z-10 bg-[#00352e]/90 backdrop-blur-sm pb-4 pt-1">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder={selectedCategory ? `Cari di ${selectedCategory.category}...` : "Cari doa atau kategori..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/30 border border-[#00ffdf]/30 rounded-full py-3 px-4 pl-10 text-sm focus:outline-none focus:border-[#00ffdf] text-white placeholder-gray-400 transition-all focus:ring-1 focus:ring-[#00ffdf]"
                            />
                            <SearchIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                        </div>
                    </div>
                )}

                {/* View 1: Main Categories */}
                {!selectedCategory && !selectedItem && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-20">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => handleCategoryClick(cat)}
                                    className="p-4 bg-black/20 border border-[#00ffdf]/20 rounded-xl text-left hover:bg-[#00ffdf]/10 hover:border-[#00ffdf]/50 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#00ffdf]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
                                    <h3 className="font-bold text-lg text-[#00ffdf] mb-1 group-hover:text-white transition-colors">{cat.category}</h3>
                                    <p className="text-xs text-gray-400">{cat.items.length} Doa</p>
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRightIcon className="w-5 h-5 text-[#00ffdf]" />
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-400 mt-10">
                                <p>Tidak ada kategori yang cocok.</p>
                            </div>
                        )}
                        
                        {/* Footer Info */}
                        <div className="col-span-full text-center mt-8 text-xs text-gray-500">
                            <p>Sumber: Kitab adz-Dzkiru ad-Du'a' fi Dhau 'il Kitab wa ad-Sunnah</p>
                        </div>
                    </div>
                )}

                {/* View 2: List of Items in Category */}
                {selectedCategory && !selectedItem && (
                    <div className="space-y-3 pb-20">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => handleItemClick(item)}
                                    className="w-full p-4 bg-black/20 border border-[#00ffdf]/10 rounded-xl text-left hover:bg-[#00ffdf]/5 hover:border-[#00ffdf]/30 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#00ffdf]/10 text-[#00ffdf] flex items-center justify-center text-xs font-bold shrink-0 border border-[#00ffdf]/20">
                                            {item.no}
                                        </div>
                                        <span className="text-sm font-medium text-gray-100 group-hover:text-[#00ffdf] transition-colors line-clamp-2">
                                            {item.judul}
                                        </span>
                                    </div>
                                    <ChevronRightIcon className="w-5 h-5 text-gray-500 group-hover:text-[#00ffdf] transition-colors shrink-0" />
                                </button>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 mt-10">
                                <p>Tidak ada doa yang cocok dengan pencarian.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* View 3: Detail Item */}
                {selectedItem && (
                    <div className="animate-fade-in-up pb-20 max-w-2xl mx-auto">
                        <div className="bg-black/20 border border-[#00ffdf]/20 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 0L122.45 77.55L200 100L122.45 122.45L100 200L77.55 122.45L0 100L77.55 77.55L100 0Z" fill="#00ffdf"/>
                                </svg>
                            </div>

                            <div className="mb-6 border-b border-[#00ffdf]/20 pb-4">
                                <span className="inline-block px-3 py-1 rounded-full bg-[#00ffdf]/10 text-[#00ffdf] text-xs font-bold mb-2 border border-[#00ffdf]/20">
                                    No. {selectedItem.no}
                                </span>
                                <h3 className="text-xl font-bold text-white leading-relaxed">{selectedItem.judul}</h3>
                            </div>

                            <div className="mb-8">
                                <p className="text-right font-amiri text-3xl sm:text-4xl md:text-5xl leading-[2.2] text-[#00ffdf] drop-shadow-md mb-6" dir="rtl">
                                    {selectedItem.arab}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-black/30 p-4 rounded-xl border-l-4 border-[#00ffdf]">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Artinya</h4>
                                    <p className="text-sm text-gray-200 italic leading-relaxed">
                                        "{selectedItem.artinya}"
                                    </p>
                                </div>

                                <div className="flex justify-end items-center gap-2 mt-4 pt-4 border-t border-[#00ffdf]/10">
                                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Referensi:</span>
                                    <span className="text-xs text-gray-300 bg-white/5 px-2 py-1 rounded">{selectedItem.referensi}</span>
                                </div>
                            </div>
                            
                            <div className="absolute top-4 right-4">
                                <button 
                                    className="p-2 text-gray-500 hover:text-[#00ffdf] transition-colors"
                                    onClick={() => {
                                        const text = `${selectedItem.judul}\n\n${selectedItem.arab}\n\nArtinya: ${selectedItem.artinya}\n\n(${selectedItem.referensi})`;
                                        navigator.clipboard.writeText(text);
                                        alert('Teks doa disalin!');
                                    }}
                                    title="Salin Teks"
                                >
                                    <ShareIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
