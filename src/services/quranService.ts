
import { Surah, Ayah } from '../types';

const API_BASE = 'https://api.alquran.cloud/v1';

async function retryFetch(url: string, retries = 3, delay = 1500): Promise<Response> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Koneksi internet terputus (Offline).');
    }

    try {
        const response = await fetch(url);
        if (!response.ok && (response.status >= 500 || response.status === 429)) {
             throw new Error(`Retryable HTTP Error: ${response.status}`);
        }
        return response;
    } catch (error: any) {
        if (retries > 0) {
            console.warn(`Retrying fetch for ${url}... (${retries} left). Error: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return retryFetch(url, retries - 1, delay * 2);
        }
        throw error;
    }
}

// --- Caching Helpers ---
const setCache = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn("Cache storage failed (quota exceeded likely)", e);
        // Optional: Clear old cache items strategy could go here
    }
};

const getCache = <T>(key: string): T | null => {
    try {
        const cached = localStorage.getItem(key);
        return cached ? JSON.parse(cached) : null;
    } catch (e) {
        return null;
    }
};

// Fetches list of all Surahs
export const fetchSurahs = async (): Promise<Surah[]> => {
    const cacheKey = 'quran_surahs';
    const cached = getCache<Surah[]>(cacheKey);
    if (cached) return cached;

    try {
        const response = await retryFetch(`${API_BASE}/surah`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const data = await response.json();
        if (data.code === 200 && Array.isArray(data.data)) {
            setCache(cacheKey, data.data);
            return data.data;
        }
        throw new Error('API Error: Failed to fetch Surahs');
    } catch (error) {
        console.error("fetchSurahs error:", error);
        throw error;
    }
};

export interface QuranEdition {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
}

// Fetches available Quran editions
export const fetchQuranEditions = async (type?: 'translation' | 'tafsir'): Promise<QuranEdition[]> => {
    const cacheKey = `quran_editions_${type || 'all'}`;
    const cached = getCache<QuranEdition[]>(cacheKey);
    if (cached) return cached;

    try {
        const url = type ? `${API_BASE}/edition?format=text&type=${type}` : `${API_BASE}/edition?format=text`;
        const response = await retryFetch(url);
        const data = await response.json();
        if (data.code === 200 && Array.isArray(data.data)) {
            setCache(cacheKey, data.data);
            return data.data;
        }
        return [];
    } catch (e) {
        console.error("fetchQuranEditions error", e);
        return [];
    }
}

// Fetches Quran Metadata
export const fetchQuranMeta = async (): Promise<any> => {
    const cacheKey = 'quran_meta';
    const cached = getCache<any>(cacheKey);
    if (cached) return cached;
    
    try {
        const response = await retryFetch(`${API_BASE}/meta`);
        const data = await response.json();
        if(data.code === 200) {
            setCache(cacheKey, data.data);
            return data.data;
        }
        return null;
    } catch(e) {
        console.error("fetchQuranMeta error", e);
        return null;
    }
}

// Fetches Tafsir text for a specific ayah
export const fetchTafsir = async (surahNumber: number, ayahNumber: number, editionIdentifier: string = 'ar.aljalalayn'): Promise<string> => {
    const cacheKey = `quran_tafsir_${surahNumber}_${ayahNumber}_${editionIdentifier}`;
    const cached = getCache<string>(cacheKey);
    if (cached) return cached;

    try {
        const response = await retryFetch(`${API_BASE}/ayah/${surahNumber}:${ayahNumber}/${editionIdentifier}`);
        const data = await response.json();
        if (data.code === 200) {
            const text = data.data.text;
            setCache(cacheKey, text);
            return text;
        }
        return "";
    } catch (e) {
        console.error("fetchTafsir error", e);
        return "Tafsir tidak tersedia. Periksa koneksi internet.";
    }
}

// Helper to fetch details generically
const fetchGenericDetails = async (endpoint: string, editionIdentifier: string, cacheKeyBase: string): Promise<Ayah[]> => {
    const cacheKey = `quran_details_${cacheKeyBase}_${editionIdentifier}`;
    const cached = getCache<Ayah[]>(cacheKey);
    if (cached) return cached;

    try {
        const [arabicResponse, transResponse, latinResponse] = await Promise.all([
            retryFetch(`${API_BASE}/${endpoint}/ar.alafasy`),
            retryFetch(`${API_BASE}/${endpoint}/${editionIdentifier}`),
            retryFetch(`${API_BASE}/${endpoint}/en.transliteration`)
        ]);

        if (!arabicResponse.ok) throw new Error(`Arabic fetch error`);
        if (!transResponse.ok) throw new Error(`Translation fetch error`);
        
        const arabicData = await arabicResponse.json();
        const transData = await transResponse.json();
        const latinData = await latinResponse.ok ? await latinResponse.json() : { data: { ayahs: [] } };

        if (arabicData.code === 200 && transData.code === 200) {
            const ayahs: Ayah[] = arabicData.data.ayahs.map((ayah: any, index: number) => ({
                ...ayah,
                translation: transData.data.ayahs[index] ? transData.data.ayahs[index].text : '',
                latin: latinData.data?.ayahs?.[index] ? latinData.data.ayahs[index].text : ''
            }));
            
            setCache(cacheKey, ayahs);
            return ayahs;
        }
        throw new Error('API Error: Failed to fetch details');
    } catch (error) {
        console.error(`fetchGenericDetails error for ${endpoint}:`, error);
        throw error; 
    }
}

// Exported fetchers using the generic helper
export const fetchSurahDetails = (surahNumber: number, edition: string = 'id.indonesian') => fetchGenericDetails(`surah/${surahNumber}`, edition, `surah_${surahNumber}`);
export const fetchJuzDetails = (juzNumber: number, edition: string = 'id.indonesian') => fetchGenericDetails(`juz/${juzNumber}`, edition, `juz_${juzNumber}`);
export const fetchPageDetails = (pageNumber: number, edition: string = 'id.indonesian') => fetchGenericDetails(`page/${pageNumber}`, edition, `page_${pageNumber}`);
export const fetchManzilDetails = (manzilNumber: number, edition: string = 'id.indonesian') => fetchGenericDetails(`manzil/${manzilNumber}`, edition, `manzil_${manzilNumber}`);
export const fetchRukuDetails = (rukuNumber: number, edition: string = 'id.indonesian') => fetchGenericDetails(`ruku/${rukuNumber}`, edition, `ruku_${rukuNumber}`);
export const fetchHizbQuarterDetails = (hizbNumber: number, edition: string = 'id.indonesian') => fetchGenericDetails(`hizbQuarter/${hizbNumber}`, edition, `hizb_${hizbNumber}`);
export const fetchSajdaDetails = (edition: string = 'id.indonesian') => fetchGenericDetails(`sajda`, edition, `sajda`);
