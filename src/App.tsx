
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Location, CalendarData, Day, CountdownTarget, NextPrayer, PrayerTimes, PrayerName, CustomEvent, HijriDate, UserSettings, Theme, AlarmSettings, FilterSettings, CustomHijriEvent, SunnahFastingNotifications, AdhanAlarms, CalendarFormat, AlarmSound, AppView, UserProfile } from './types';
import { fetchCalendarData, getNextCountdownTarget, fetchLocationAndPrayerTimes, convertGToH, fetchHijriHolidays, convertHijriToGregorian, getSpecificCountdownTarget } from './services/calendarService';
import { getNationalHolidays } from './services/holidayService';
import { getDailyFact } from './services/geminiService';
import { translateToIndonesian, ALARM_MESSAGES, getLanguageFromCookie, PRAYER_NAMES_TRANSLATION } from './utils';
import { CalendarGrid } from './components/CalendarGrid';
import { YearlyView } from './components/YearlyView';
import { DailyView } from './components/DailyView';
import { CountdownTimer } from './components/CountdownTimer';
import { ChatBot } from './components/ChatBot';
import { Settings } from './components/Settings';
import { ShareModal } from './components/ShareModal';
import { HeaderInfo } from './components/HeaderInfo';
import { DateDetailModal } from './components/DateDetailModal';
import { SettingsIcon, ChevronLeftIcon, ChevronRightIcon, AlarmIcon, CloseIcon, MenuIcon, QiblaIcon, RamadanModeIcon, PinIcon, SearchIcon, PaletteIcon, SparklesIcon, ReadingModeIcon, ContactIcon, VolumeUpIcon, MapIcon, MicIcon, InstallIcon, LanguageIcon, CloudSunIcon, SunriseIcon, SunIcon, SunsetIcon, MoonIcon } from './components/Icons';
import { DropdownMenu } from './components/DropdownMenu';
import { InfoModal, InfoListItem } from './components/InfoModal';
import { ContactUsModal } from './components/ContactUsModal';
import { QiblaCompass } from './components/QiblaCompass';
import { VoiceAssistant } from './components/VoiceAssistant';
import { PUASA_SUB_PAGES, HARI_RAYA_SUB_PAGES, INFO_DETAILS, FAQ_CONTENT, INFO_CONTENT } from './infoContent';
import { WEEKDAY_MAP, COUNTRIES, PRAYER_METHODS, LANGUAGES } from './constants';
import { CountdownEvent } from './types';
import ConversionForm from './components/ConversionForm';
import ResultCard from './components/ResultCard';
import { Dashboard } from './components/Dashboard';
import { PrayerTimesPage } from './components/PrayerTimesPage';
import { DoaDzikirPage } from './components/DoaDzikirPage';
import { QuranPlayer } from './components/QuranPlayer';
import { LoginScreen } from './components/LoginScreen';

type CalendarView = 'monthly' | 'weekly' | 'yearly' | 'daily';

// Helper Components
const WelcomeScreen: React.FC<{onDismiss: () => void}> = ({onDismiss}) => {
    const [message, setMessage] = useState('');
    const [hijriDate, setHijriDate] = useState('');
    const [gregorianDate, setGregorianDate] = useState('');

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const hours = now.getHours();

            if (hours < 4) setMessage('Selamat Dini Hari');
            else if (hours < 11) setMessage('Selamat Pagi');
            else if (hours < 15) setMessage('Selamat Siang');
            else if (hours < 19) setMessage('Selamat Sore');
            else setMessage('Selamat Malam');

            setGregorianDate(now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

            convertGToH(now).then(hDate => {
                const translatedMonth = translateToIndonesian(hDate.month.en, 'hijri');
                setHijriDate(`${hDate.day} ${translatedMonth} ${hDate.year} H`);
            });
        };

        updateDateTime();
        const timerId = setInterval(updateDateTime, 60000); 
        return () => clearInterval(timerId);
    }, []);

    const handleStart = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            if (window.AudioContext || (window as any).webkitAudioContext) {
                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                await ctx.resume();
            }
        } catch (e) {
            console.warn("Microphone permission denied or ignored");
        }
        onDismiss();
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex flex-col items-center justify-center fade-in p-4 text-center"
            style={{
                backgroundImage: `url('https://raw.githubusercontent.com/vandratop/Yuk/3ca087bbe1dfa3822dc66f60ba3f8c2cdf0772b0/DoaKu_back_mtrx.png')`,
                backgroundColor: 'rgba(0, 43, 37, 0.5)',
                backgroundBlendMode: 'overlay',
                backgroundSize: 'cover'
            }}
        >
            <div className="flex-grow flex flex-col items-center justify-center">
                <h1 
                    className="font-amiri text-4xl sm:text-5xl md:text-6xl text-white"
                    style={{ textShadow: '0 0 8px #fff, 0 0 15px #fff, 0 0 25px #00ffdf', animation: 'zoom-in-out-welcome 4s ease-in-out infinite' }}
                >
                    ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ
                </h1>
                <p 
                    className="font-amiri text-2xl sm:text-3xl text-white mt-4 typewriter-text"
                    style={{ textShadow: '0 0 5px #fff, 0 0 10px #fff' }}
                >
                    أَهْلًا وَسَهْلًا
                </p>
                <button 
                    onClick={handleStart}
                    className="mt-8 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold shadow-lg neon-button flex items-center gap-2"
                >
                    <MicIcon className="w-5 h-5" /> Mulai & Izinkan Mikrofon
                </button>
            </div>
            <footer className="w-full p-4 text-white text-sm bg-black/50 rounded-lg cyber-border">
                <p>{message}</p>
                <p>{gregorianDate} / {hijriDate}</p>
            </footer>
        </div>
    );
};

const MatrixBackground: React.FC<{theme: Theme}> = ({ theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        const characters = 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي0123456789';
        const fontSize = 12;
        const columns = canvas.width / fontSize;
        const drops: number[] = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const draw = () => {
            const bodyStyle = getComputedStyle(document.body);
            const bgColor = bodyStyle.getPropertyValue('--bg-color') || '#002b25';
            const secondaryColor = bodyStyle.getPropertyValue('--text-color-secondary') || '#00FFDF';

            ctx.fillStyle = `${bgColor}1A`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = secondaryColor;
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.985) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            animationFrameId = window.requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" style={{ opacity: 0.25 }} />;
};

const DateConverter: React.FC = () => {
    const [conversionResult, setConversionResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleConvert = async (date: { day: number; month: number; year: number }) => {
        setIsLoading(true);
        try {
            const gregorianDate = await convertHijriToGregorian(date.day, date.month, date.year);
            const formattedDate = gregorianDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            
            setConversionResult({
                gregorianDate: formattedDate,
                dayOfWeek: gregorianDate.toLocaleDateString('id-ID', { weekday: 'long' }),
                significance: "Hasil Konversi",
                historicalEvents: [] 
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="mt-4 px-2">
            <ConversionForm onConvert={handleConvert} isLoading={isLoading} />
            {conversionResult && <div className='mt-4'><ResultCard inputDate={null} result={conversionResult} /></div>}
        </div>
    );
};

const getFastingInfo = (day: Day): { isFasting: boolean, type: string, typeKey: keyof SunnahFastingNotifications | 'ramadan' | null } => {
    const hijri = day.hijri;
    const gregorian = day.gregorian;
    const hijriDay = parseInt(hijri.day, 10);
    const hijriMonth = hijri.month.number;

    if (hijriMonth === 9) return { isFasting: true, type: "Puasa Ramadhan", typeKey: 'ramadan' };
    if (hijriMonth === 12 && hijriDay === 9) return { isFasting: true, type: "Puasa Arafah", typeKey: 'arafah' };
    if (hijriMonth === 1 && hijriDay === 9) return { isFasting: true, type: "Puasa Tasu'a", typeKey: 'asyura' };
    if (hijriMonth === 1 && (hijriDay === 10 || hijriDay === 11)) return { isFasting: true, type: "Puasa Asyura", typeKey: 'asyura' };
    if (hijriMonth === 10 && hijriDay >= 3 && hijriDay <= 8) return { isFasting: true, type: "Puasa Syawal", typeKey: 'syawal' };
    if (hijriDay >= 13 && hijriDay <= 15) return { isFasting: true, type: "Puasa Ayyamul Bidh", typeKey: 'ayyamulBidh' };
    
    if (hijriMonth === 12 && (hijriDay >= 1 && hijriDay <= 8)) return { isFasting: true, type: "Puasa Awal Dzulhijjah", typeKey: null };
    if (hijriMonth === 8 && (hijriDay >= 1 && hijriDay <= 12)) return { isFasting: true, type: "Puasa Sunnah Sya'ban", typeKey: null };

    const isTashreeq = hijriMonth === 12 && (hijriDay >= 11 && hijriDay <= 13);
    if (['Monday', 'Thursday'].includes(gregorian.weekday.en) && !isTashreeq) return { isFasting: true, type: "Puasa Senin & Kamis", typeKey: 'seninKamis' };
    
    return { isFasting: false, type: "", typeKey: null };
};

const RamadanContainer: React.FC = () => (
    <div className="ramadan-container">
        <RamadanModeIcon className="w-12 h-12" />
    </div>
);

const ActiveAlarmPopup: React.FC<{ alarm: { name: string; text: string }; onDismiss: () => void }> = ({ alarm, onDismiss }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 fade-in p-4">
            <div className="main-container cyber-border rounded-lg p-6 w-full max-w-xs relative text-center bounce-in">
                <h3 className="font-bold text-2xl mb-4 neon-text capitalize">AI-HIJR ALARM</h3>
                <p className="text-lg mb-6 font-bold text-[var(--text-color-secondary)]">{alarm.text}</p>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-900/50 flex items-center justify-center animate-pulse">
                    <span className="text-3xl">🔊</span>
                </div>
                <button
                    onClick={onDismiss}
                    className="w-full p-2 bg-gradient-to-r from-[#00FFDF] to-[#0065AD] text-white font-bold rounded-md neon-button"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
};

const padZero = (num: number) => num.toString().padStart(2, '0');

const TimeBox: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <div className="countdown-box font-clock text-3xl sm:text-4xl neon-text-white rounded-lg px-1 sm:px-2 py-1 w-16 sm:w-20 text-center cyber-border">{padZero(value)}</div>
        <div className="text-xs uppercase mt-1">{label}</div>
    </div>
);

const CurrentTimeClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);
    
    return (
        <div className="my-4 pt-4 border-t border-[var(--border-color)]/20">
            <p className="text-xs text-center mb-2">waktu saat ini :</p>
            <div className="flex justify-center space-x-2 sm:space-x-4">
                <TimeBox value={time.getHours()} label="Jam" />
                <TimeBox value={time.getMinutes()} label="Menit" />
                <TimeBox value={time.getSeconds()} label="Detik" />
            </div>
        </div>
    );
};

const WeatherWidget: React.FC<{ locationName: string | null }> = ({ locationName }) => {
    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-4 rounded-xl shadow-lg mb-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg">{locationName || "Lokasi tidak terdeteksi"}</h3>
                    <p className="text-xs opacity-80">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-bold">--°C</span>
                    <p className="text-xs">Cuaca belum tersedia</p>
                </div>
            </div>
        </div>
    );
};

const HolidayCountrySelector: React.FC<{ settings: UserSettings; onSettingsChange: (s: UserSettings) => void }> = ({ settings, onSettingsChange }) => (
    <div className="px-2">
        <label className="text-xs text-gray-400 block mb-1">Negara Hari Libur:</label>
        <select 
            value={settings.holidayCountry} 
            onChange={(e) => onSettingsChange({ ...settings, holidayCountry: e.target.value })} 
            className="w-full bg-gray-700 border border-[var(--border-color)]/30 rounded px-2 py-1 text-xs text-white"
        >
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
    </div>
);

const DailyFact: React.FC<{ fact: string | null }> = ({ fact }) => {
    if (!fact) return null;
    return (
        <div className="mt-6 p-4 bg-yellow-50/10 border border-yellow-500/30 rounded-lg">
            <h4 className="font-bold text-yellow-500 mb-2 flex items-center gap-2">
                <SparklesIcon className="w-4 h-4" /> Fakta Menarik Hari Ini
            </h4>
            <p className="text-sm text-gray-300 italic">"{fact}"</p>
        </div>
    );
};

const PrayerInfo: React.FC<{
    prayerTimes: PrayerTimes | null;
    nextPrayer: NextPrayer;
    locationName: string | null;
    error: string | null;
    onRetry: () => void;
    adhanAlarms: AdhanAlarms;
    onToggleAdhanAlarm: (name: PrayerName) => void;
    onPlayAdhan: () => void;
    selectedAdhan: string;
    onAdhanChange: (sound: string) => void;
    userSettings: UserSettings;
    onSettingsChange: (settings: UserSettings) => void;
    countdownTarget: CountdownTarget | null;
    selectedCountdownEvent: CountdownEvent;
    onCountdownEventChange: (event: CountdownEvent) => void;
    showCountdown?: boolean;
}> = ({ 
    prayerTimes, nextPrayer, locationName, error, onRetry, 
    adhanAlarms, onToggleAdhanAlarm, onPlayAdhan, selectedAdhan, onAdhanChange,
    userSettings, onSettingsChange, countdownTarget, selectedCountdownEvent, onCountdownEventChange,
    showCountdown = true
}) => {

    const handleLocationChange = (field: 'city' | 'country', value: string) => {
        onSettingsChange({
            ...userSettings,
            manualLocation: {
                ...userSettings.manualLocation,
                [field]: value
            }
        });
    };

    const handleMethodChange = (id: number) => {
         onSettingsChange({
            ...userSettings,
            prayerMethod: id
        });
    }

    if (error) {
        return (
             <div className="text-center p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 mb-2">{error}</p>
                <button onClick={onRetry} className="px-4 py-2 bg-red-600 rounded text-white text-sm">Coba Lagi</button>
            </div>
        );
    }
    
    if (!prayerTimes) return <div className="text-center animate-pulse text-[var(--text-color)]">Memuat jadwal shalat...</div>;

    const prayerList: { name: PrayerName, icon: React.ReactNode }[] = [
        { name: 'Fajr', icon: <CloudSunIcon className="w-6 h-6"/> },
        { name: 'Sunrise', icon: <SunriseIcon className="w-6 h-6"/> },
        { name: 'Dhuhr', icon: <SunIcon className="w-6 h-6"/> },
        { name: 'Asr', icon: <SunIcon className="w-6 h-6 opacity-75"/> }, // Slightly different opacity for Asr
        { name: 'Maghrib', icon: <SunsetIcon className="w-6 h-6"/> },
        { name: 'Isha', icon: <MoonIcon className="w-6 h-6"/> }
    ];

    return (
        <div className="space-y-6">
            {/* Next Prayer - Conditional */}
            {showCountdown && (
                <div className="bg-gradient-to-r from-cyan-900 to-blue-900 p-4 rounded-xl border border-cyan-500/30 text-center relative overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl"></div>
                    <p className="text-sm text-cyan-200 uppercase tracking-widest font-bold mb-1">Waktu Shalat Berikutnya</p>
                    <h3 className="text-3xl font-bold text-white my-2">{nextPrayer.name === 'Sunrise' ? 'Syuruk' : nextPrayer.name || '--'}</h3>
                    <div className="text-4xl font-mono font-bold text-yellow-400 tracking-wider drop-shadow-md">{nextPrayer.countdown || '--:--:--'}</div>
                </div>
            )}

            {/* Prayer Times List */}
            <div className="bg-black/10 backdrop-blur-sm rounded-xl p-4 border border-[var(--border-color)]/20 shadow-lg">
                {prayerList.map(item => {
                    const name = item.name;
                    const time = prayerTimes[name];
                    const isActive = nextPrayer.name === name; 
                    const isAlarmOn = adhanAlarms[name]?.isOn;

                    return (
                        <div key={name} className={`flex justify-between items-center py-4 border-b border-[var(--border-color)]/10 last:border-0 ${isActive ? 'bg-[var(--text-color-secondary)]/10 -mx-4 px-4' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isActive ? 'bg-[var(--text-color-secondary)] text-[var(--bg-color)]' : 'bg-gray-700 text-gray-200'}`}>
                                    {item.icon}
                                </div>
                                <span className={`text-xl ${isActive ? 'text-[var(--text-color-secondary)] font-bold' : 'text-[var(--text-color)]'}`}>
                                    {name === 'Sunrise' ? 'Syuruk' : (PRAYER_NAMES_TRANSLATION['id'][name] || name)}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-mono text-2xl font-bold text-[var(--text-color)]">{time}</span>
                                {name !== 'Sunrise' && (
                                    <button onClick={() => onToggleAdhanAlarm(name)} className={`p-2 rounded-full transition-colors ${isAlarmOn ? 'bg-cyan-600/20 text-[var(--text-color-secondary)]' : 'text-gray-500 hover:text-[var(--text-color)]'}`}>
                                        <VolumeUpIcon className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Settings */}
            <div className="bg-black/10 backdrop-blur-sm rounded-xl p-4 border border-[var(--border-color)]/20 space-y-4">
                <h4 className="font-bold text-sm text-[var(--text-color-muted)] uppercase tracking-wider mb-2">Pengaturan Jadwal</h4>
                
                {/* Location */}
                <div>
                    <label className="text-xs font-semibold text-[var(--text-color)] block mb-1">Lokasi Manual (Kota, Negara)</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Kota (ex: Jakarta)" 
                            value={userSettings.manualLocation.city} 
                            onChange={e => handleLocationChange('city', e.target.value)}
                            className="w-1/2 bg-[var(--bg-color)] border border-[var(--border-color)]/50 rounded px-3 py-2 text-sm text-[var(--text-color)]"
                        />
                         <input 
                            type="text" 
                            placeholder="Negara (ex: ID)" 
                            value={userSettings.manualLocation.country} 
                            onChange={e => handleLocationChange('country', e.target.value)}
                            className="w-1/2 bg-[var(--bg-color)] border border-[var(--border-color)]/50 rounded px-3 py-2 text-sm text-[var(--text-color)]"
                        />
                    </div>
                    <p className="text-[10px] text-[var(--text-color-muted)] mt-1">*Biarkan kosong untuk menggunakan GPS otomatis.</p>
                </div>

                {/* Method */}
                <div>
                    <label className="text-xs font-semibold text-[var(--text-color)] block mb-1">Metode Perhitungan</label>
                    <select 
                        value={userSettings.prayerMethod} 
                        onChange={e => handleMethodChange(Number(e.target.value))}
                        className="w-full bg-[var(--bg-color)] border border-[var(--border-color)]/50 rounded px-3 py-2 text-sm text-[var(--text-color)]"
                    >
                        {PRAYER_METHODS.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </div>

                {/* Adhan Sound */}
                <div>
                    <label className="text-xs font-semibold text-[var(--text-color)] block mb-1">Suara Adzan</label>
                    <div className="flex gap-2 items-center">
                        <select 
                            value={selectedAdhan} 
                            onChange={e => onAdhanChange(e.target.value)}
                            className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)]/50 rounded px-3 py-2 text-sm text-[var(--text-color)]"
                        >
                            <option value="adhan1">Adzan 1 (Makkah)</option>
                            <option value="adhan2">Adzan 2 (Madinah)</option>
                            <option value="mishary">Mishary Rashid</option>
                            <option value="mustafa">Mustafa Ozcan</option>
                        </select>
                        <button onClick={onPlayAdhan} className="p-2 bg-cyan-600 rounded text-white">
                            <VolumeUpIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            </div>
            
             {/* Countdown Target Selector */}
             {countdownTarget && showCountdown && (
                <div className="bg-black/10 backdrop-blur-sm rounded-xl p-4 border border-[var(--border-color)]/20">
                    <h4 className="font-bold text-sm text-[var(--text-color-muted)] uppercase tracking-wider mb-2">Hitung Mundur</h4>
                     <select 
                        value={selectedCountdownEvent} 
                        onChange={e => onCountdownEventChange(e.target.value as CountdownEvent)}
                        className="w-full bg-[var(--bg-color)] border border-[var(--border-color)]/50 rounded px-3 py-2 text-sm text-[var(--text-color)]"
                    >
                        {(Object.values(CountdownEvent) as string[]).map(e => (
                             <option key={e} value={e}>{e}</option>
                        ))}
                    </select>
                </div>
             )}
        </div>
    );
};

// Legend Component
const Legend: React.FC = () => (
    <div className="flex flex-wrap gap-3 text-[10px] sm:text-xs mt-2 justify-center px-4">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#FF3131]"></div><span>Hari Raya/Libur</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#009688]"></div><span>Ramadhan</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#0D00FF]"></div><span>Ayyamul Bidh</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#21DEC4]"></div><span>Senin-Kamis</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#1FCB0A]"></div><span>Sunnah Lain</span></div>
    </div>
);

const App: React.FC = () => {
    // --- State Management ---
    const [viewDate, setViewDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState<CalendarView>('monthly');
    const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
    const [yearlyCalendarData, setYearlyCalendarData] = useState<(CalendarData | null)[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ holidays: '', calendar: '', prayer: '' });
    
    const [userSettings, setUserSettings] = useState<UserSettings>({
        manualLocation: { city: '', country: '' },
        prayerMethod: 3,
        holidayCountry: 'ID',
        sunnahFastingNotifications: {
            seninKamis: { isOn: false, time: '17:00' },
            ayyamulBidh: { isOn: false, time: '17:00' },
            arafah: { isOn: false, time: '17:00' },
            asyura: { isOn: false, time: '17:00' },
            syawal: { isOn: false, time: '17:00' },
        }
    });

    const [filters, setFilters] = useState<FilterSettings>({
        showCustomEvents: true,
        showNationalHolidays: true,
        showCustomHijriEvents: true
    });

    const [calendarFormat, setCalendarFormat] = useState<CalendarFormat>('hijri-masehi');
    const [isReadingMode, setIsReadingMode] = useState(false);
    const [calendarAnimationClass, setCalendarAnimationClass] = useState('fade-in');
    
    const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);
    const [customHijriEvents, setCustomHijriEvents] = useState<CustomHijriEvent[]>([]);
    const [nationalHolidays, setNationalHolidays] = useState<{[date: string]: string}>({});
    const [hijriHolidays, setHijriHolidays] = useState<Map<string, string>>(new Map());

    const [countdownTarget, setCountdownTarget] = useState<CountdownTarget | null>(null);
    const [selectedCountdownEvent, setSelectedCountdownEvent] = useState<CountdownEvent>(CountdownEvent.RAMADAN);

    // --- Added missing states from previous context ---
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [theme, setTheme] = useState<Theme>('auto');
    const [zoomLevel, setZoomLevel] = useState(1);
    const [alarmSettings, setAlarmSettings] = useState<AlarmSettings>({
        sahur: { isOn: false, time: '03:30' },
        tahajud: { isOn: false, time: '03:00' },
        dhuha: { isOn: false, time: '07:00' },
        jumat: { isOn: false, time: '11:00' },
        tidur: { isOn: false, time: '21:00' },
        shalat5Waktu: { isOn: true, time: '' }, 
        dzikirPagi: { isOn: false, time: '06:00' },
        dzikirPetang: { isOn: false, time: '17:30' },
        doaJumat: { isOn: false, time: '16:30' }
    });
    const [alarmSound, setAlarmSound] = useState<AlarmSound>('default');
    const [adhanAlarms, setAdhanAlarms] = useState<AdhanAlarms>({
        Fajr: { isOn: true }, Dhuhr: { isOn: true }, Asr: { isOn: true }, Maghrib: { isOn: true }, Isha: { isOn: true }
    });
    const [selectedAdhan, setSelectedAdhan] = useState('adhan1');
    const [location, setLocation] = useState<Location>({ latitude: 0, longitude: 0 });
    const [locationName, setLocationName] = useState<string | null>(null);
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
    const [nextPrayer, setNextPrayer] = useState<NextPrayer>({ name: null, time: null, countdown: '' });
    const [activeAlarm, setActiveAlarm] = useState<{ name: string; text: string } | null>(null);
    const [currentView, setCurrentView] = useState<AppView>('calendar');
    
    // Modal states
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
    const [isContactUsOpen, setIsContactUsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showDateDetailModal, setShowDateDetailModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState<Day | null>(null);
    const [selectedInfo, setSelectedInfo] = useState<{ title: string; content: React.ReactNode } | null>(null);
    const [infoTypeKey, setInfoTypeKey] = useState<string | null>(null);
    const [isWelcomeScreenOpen, setIsWelcomeScreenOpen] = useState(true);
    const [dailyFact, setDailyFact] = useState<string | null>(null);
    const [sahurPopupText, setSahurPopupText] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    const shareRef = useRef<HTMLDivElement>(null);

    // --- Derived Data ---
    const today = useMemo(() => {
        const d = new Date();
        // Placeholder, logic would use converted hijri if available
        return {
            gregorian: {
                date: d.toLocaleDateString('id-ID'),
                format: 'DD-MM-YYYY',
                day: String(d.getDate()),
                weekday: { en: d.toLocaleDateString('en-US', {weekday: 'long'}) },
                month: { number: d.getMonth() + 1, en: d.toLocaleDateString('en-US', {month: 'long'}) },
                year: String(d.getFullYear()),
                designation: { abbreviated: 'AD', expanded: 'Anno Domini' }
            },
            hijri: {
                date: '', format: '', day: '', weekday: {en: '', ar: ''}, month: {number: 0, en: '', ar: '', days: 0}, year: '', designation: {abbreviated: '', expanded: ''}, holidays: []
            }
        } as Day;
    }, []);

    const currentDayData = calendarData?.days.find(d => 
        parseInt(d.gregorian.day) === viewDate.getDate()
    );

    const currentWeekDays = useMemo(() => {
        if (!calendarData) return [];
        const startOfWeek = new Date(viewDate);
        startOfWeek.setDate(viewDate.getDate() - viewDate.getDay());
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            const dayData = calendarData.days.find(day => 
                parseInt(day.gregorian.day) === d.getDate() && 
                day.gregorian.month.number === d.getMonth() + 1
            );
            if (dayData) weekDays.push(dayData);
        }
        return weekDays;
    }, [calendarData, viewDate]);

    const filteredCustomEvents = filters.showCustomEvents ? customEvents : [];
    const filteredCustomHijriEvents = filters.showCustomHijriEvents ? customHijriEvents : [];
    const filteredNationalHolidays = filters.showNationalHolidays ? nationalHolidays : {};

    // --- Effects ---
    
    // Theme Effect
    useEffect(() => {
        document.body.className = theme === 'auto' ? '' : theme;
    }, [theme]);

    // Zoom Effect
    useEffect(() => {
        (document.body.style as any).zoom = `${zoomLevel}`;
    }, [zoomLevel]);

    // Initial Data Fetch
    useEffect(() => {
        const fetchBaseData = async () => {
            setLoading(true);
            try {
                const data = await fetchCalendarData(viewDate.getFullYear(), viewDate.getMonth() + 1);
                setCalendarData(data);
                
                const todayHijri = data.days.find(d => parseInt(d.gregorian.day) === new Date().getDate())?.hijri;
                if (todayHijri) {
                    const target = await getSpecificCountdownTarget(selectedCountdownEvent, todayHijri);
                    setCountdownTarget(target);
                }

                const holidays = await getNationalHolidays(userSettings.holidayCountry, viewDate.getFullYear());
                setNationalHolidays(holidays);
                const hHolidays = await fetchHijriHolidays(parseInt(data.hijriYear));
                setHijriHolidays(hHolidays);
                
                const fact = await getDailyFact();
                setDailyFact(fact);

            } catch (e: any) {
                setErrors(prev => ({ ...prev, calendar: e.message }));
            } finally {
                setLoading(false);
            }
        };
        fetchBaseData();
    }, [viewDate, userSettings.holidayCountry, selectedCountdownEvent]);

    // Yearly Data Fetch
    useEffect(() => {
        if (calendarView === 'yearly') {
            const fetchYearly = async () => {
                setLoading(true);
                const year = viewDate.getFullYear();
                const promises = [];
                for(let i=1; i<=12; i++) {
                    promises.push(fetchCalendarData(year, i).catch(() => null));
                }
                const results = await Promise.all(promises);
                setYearlyCalendarData(results);
                setLoading(false);
            };
            fetchYearly();
        }
    }, [calendarView, viewDate]);

    // Location & Prayer Times
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                try {
                    const { timings, location: locName } = await fetchLocationAndPrayerTimes(latitude, longitude, userSettings);
                    setPrayerTimes(timings);
                    setLocationName(locName);
                } catch (e: any) {
                    setErrors(prev => ({ ...prev, prayer: e.message }));
                }
            }, () => {
                setErrors(prev => ({ ...prev, prayer: 'Gagal mendapatkan lokasi GPS.' }));
            });
        }
    }, [userSettings]);

    // Clock, Next Prayer, Alarms
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
            
            // Prayer Logic
            if (prayerTimes) {
                // Determine next prayer and update state (simplified logic here)
                // Check for adhan alarms
            }

            // Custom Alarms Logic
            Object.entries(alarmSettings).forEach(([key, setting]) => {
                const s = setting as { isOn: boolean; time: string };
                if (key !== 'shalat5Waktu' && s.isOn && s.time === currentTime && now.getSeconds() === 0) {
                    setActiveAlarm({ name: key, text: ALARM_MESSAGES.id[key] || "Waktunya ibadah." });
                    playAlarmSound(alarmSound);
                }
            });

        }, 1000);
        return () => clearInterval(interval);
    }, [prayerTimes, alarmSettings, alarmSound]);


    // --- Handlers ---
    const handleNavigation = (direction: number) => {
        setCalendarAnimationClass(direction > 0 ? 'slide-left' : 'slide-right');
        setTimeout(() => setCalendarAnimationClass('fade-in'), 300);

        const newDate = new Date(viewDate);
        if (calendarView === 'monthly' || calendarView === 'daily') {
            newDate.setMonth(newDate.getMonth() + direction);
        } else if (calendarView === 'yearly') {
            newDate.setFullYear(newDate.getFullYear() + direction);
        } else if (calendarView === 'weekly') {
            newDate.setDate(newDate.getDate() + (direction * 7));
        }
        setViewDate(newDate);
    };

    const getCalendarTitle = () => {
        if (calendarView === 'yearly') return viewDate.getFullYear().toString();
        const hijriMonth = calendarData?.hijriMonthName ? translateToIndonesian(calendarData.hijriMonthName, 'hijri') : '';
        const hijriYear = calendarData?.hijriYear || '';
        const gregorianMonth = translateToIndonesian(viewDate.toLocaleDateString('en-US', { month: 'long' }), 'gregorian');
        const gregorianYear = viewDate.getFullYear();
        
        return (
            <>
                <span className="text-lg font-bold">{hijriMonth} {hijriYear}</span>
                <span className="text-sm">{gregorianMonth} {gregorianYear}</span>
            </>
        );
    };

    const handleDayClick = (day: Day, infoKey: string | null) => {
        setSelectedDay(day);
        setInfoTypeKey(infoKey);
        setShowDateDetailModal(true);
    };

    const handleUpdateSettings = (newSettings: UserSettings) => setUserSettings(newSettings);
    const handleFilterChange = (change: Partial<FilterSettings>) => setFilters(prev => ({ ...prev, ...change }));
    const onCountdownEventChange = (event: CountdownEvent) => setSelectedCountdownEvent(event);
    const retryHolidays = () => setErrors(prev => ({ ...prev, holidays: '' }));
    
    // Missing handlers implementation
    const handleThemeChange = (t: Theme) => setTheme(t);
    const handleZoomChange = (z: number) => setZoomLevel(z);
    const handleDateJump = (d: Date) => setViewDate(d);
    const handleAlarmToggle = (name: string, isOn: boolean) => setAlarmSettings(prev => ({ ...prev, [name]: { ...prev[name as keyof AlarmSettings], isOn } }));
    const handleAlarmTimeChange = (name: string, time: string) => setAlarmSettings(prev => ({ ...prev, [name]: { ...prev[name as keyof AlarmSettings], time } }));
    const handleAlarmSoundChange = (s: AlarmSound) => setAlarmSound(s);
    const playAlarmSound = (s: AlarmSound) => { 
        const audio = new Audio(s === 'thaha' ? 'https://server8.mp3quran.net/thubti/001.mp3' : 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3');
        audio.play().catch(console.error);
    };
    const handleAdhanAlarmToggle = (name: PrayerName) => setAdhanAlarms(prev => ({ ...prev, [name]: { isOn: !prev[name]?.isOn } }));
    const handleAdhanChange = (s: string) => setSelectedAdhan(s);
    const handlePlayAdhan = () => { /* Play logic */ };
    const handleAction = (action: string) => {
        if (action === 'share') setIsShareModalOpen(true);
        if (action === 'contact-us') setIsContactUsOpen(true);
        if (action === 'auth') setUserProfile(null); // Logout logic
    };

    // --- Render ---
    if (!userProfile && !isWelcomeScreenOpen) {
        return <LoginScreen onLogin={(user) => setUserProfile(user)} />;
    }

    return (
        <>
            {isWelcomeScreenOpen && <WelcomeScreen onDismiss={() => setIsWelcomeScreenOpen(false)} />}
            {!isWelcomeScreenOpen && (
                <div className={`min-h-screen ${theme} overflow-x-hidden`}>
                    <MatrixBackground theme={theme} />
                    
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 bg-[var(--header-bg-color)] shadow-md sticky top-0 z-30">
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsDropdownOpen(true)} className="p-2"><MenuIcon className="w-6 h-6 text-[var(--header-text-color)]" /></button>
                            <h1 className="font-amiri font-bold text-xl text-[var(--header-text-color)]">Kalender Hijriah</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsSettingsOpen(true)} className="p-2"><SettingsIcon className="w-6 h-6 text-[var(--header-text-color)]" /></button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="pb-20">
                        {currentView === 'calendar' && (
                            <div id="calendar-view" className={calendarAnimationClass}>
                                <div className={`flex items-center my-2 px-2 ${isReadingMode ? 'justify-center' : 'justify-between'}`}>
                                    {!isReadingMode && (
                                        <button onClick={() => handleNavigation(-1)} className="p-2 bg-gradient-to-r from-[#00FFDF] to-[#0065AD] text-white font-bold rounded-md neon-button flex items-center justify-center w-10 h-10 sm:w-12 sm:h-10">
                                            <ChevronLeftIcon />
                                        </button>
                                    )}
                                    <div className="text-center font-jannah flex flex-col items-center">
                                       {getCalendarTitle()}
                                    </div>
                                     {!isReadingMode && (
                                        <button onClick={() => handleNavigation(1)} className="p-2 bg-gradient-to-r from-[#00FFDF] to-[#0065AD] text-white font-bold rounded-md neon-button flex items-center justify-center w-10 h-10 sm:w-12 sm:h-10">
                                            <ChevronRightIcon />
                                        </button>
                                    )}
                                </div>

                                {calendarView === 'yearly' ? (
                                    <YearlyView 
                                        yearData={yearlyCalendarData}
                                        todayHijriDate={today.hijri.date}
                                        customEvents={filteredCustomEvents}
                                        customHijriEvents={filteredCustomHijriEvents}
                                        nationalHolidays={filteredNationalHolidays}
                                        onMonthClick={(monthDate) => {
                                            setViewDate(monthDate);
                                            setCalendarView('monthly');
                                        }}
                                        isLoading={loading}
                                    />
                                ) : calendarView === 'daily' && currentDayData ? (
                                    <DailyView 
                                        day={currentDayData} 
                                        format={calendarFormat} 
                                        onDayClick={handleDayClick}
                                        customEvents={filteredCustomEvents}
                                        customHijriEvents={filteredCustomHijriEvents}
                                        nationalHolidays={filteredNationalHolidays}
                                        hijriHolidays={hijriHolidays}
                                    />
                                ) : (
                                    calendarData && (
                                        <CalendarGrid 
                                            days={calendarView === 'monthly' ? calendarData.days : currentWeekDays}
                                            view={calendarView === 'weekly' ? 'weekly' : 'monthly'}
                                            todayHijriDate={today.hijri.date} 
                                            onDayClick={handleDayClick} 
                                            customEvents={filteredCustomEvents}
                                            customHijriEvents={filteredCustomHijriEvents}
                                            nationalHolidays={filteredNationalHolidays}
                                            hijriHolidays={hijriHolidays}
                                            calendarFormat={calendarFormat}
                                        />
                                    )
                                )}

                                {['monthly', 'weekly'].includes(calendarView) && (
                                    <div className="mt-4 space-y-4">
                                        <Legend />
                                        <HolidayCountrySelector settings={userSettings} onSettingsChange={handleUpdateSettings} />
                                        
                                        {!isReadingMode && (
                                            <div className="flex flex-col gap-3 bg-black/10 p-3 rounded-lg border border-[var(--border-color)]/10 mx-2">
                                                {/* Dropdowns */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <div className="flex items-center space-x-1">
                                                        <span className="text-xs text-gray-400">Format:</span>
                                                        <select value={calendarFormat} onChange={(e) => setCalendarFormat(e.target.value as CalendarFormat)} className="bg-gray-700 border border-[var(--border-color)]/30 rounded px-2 py-1 text-xs text-white">
                                                            <option value="hijri-masehi">Hijriah & Masehi</option>
                                                            <option value="hijri">Hijriah</option>
                                                            <option value="masehi">Masehi</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <span className="text-xs text-gray-400">Tampilan:</span>
                                                        <select value={calendarView} onChange={(e) => setCalendarView(e.target.value as CalendarView)} className="bg-gray-700 border border-[var(--border-color)]/30 rounded px-2 py-1 text-xs text-white">
                                                            <option value="daily">Harian</option>
                                                            <option value="weekly">Mingguan</option>
                                                            <option value="monthly">Bulanan</option>
                                                            <option value="yearly">Tahunan</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Checklist Filters */}
                                                <div className="flex flex-wrap gap-3 text-xs text-gray-300">
                                                    <label className="flex items-center space-x-1 cursor-pointer"><input type="checkbox" checked={filters.showCustomHijriEvents} onChange={(e) => handleFilterChange({ showCustomHijriEvents: e.target.checked })}/><span>Catatan Hijriah</span></label>
                                                    <label className="flex items-center space-x-1 cursor-pointer"><input type="checkbox" checked={filters.showCustomEvents} onChange={(e) => handleFilterChange({ showCustomEvents: e.target.checked })}/><span>Catatan Masehi</span></label>
                                                    <label className="flex items-center space-x-1 cursor-pointer"><input type="checkbox" checked={filters.showNationalHolidays} onChange={(e) => handleFilterChange({ showNationalHolidays: e.target.checked })}/><span>Libur Nasional</span></label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {errors.holidays && !isReadingMode && (
                                    <div className="text-center text-yellow-400 text-xs p-2 bg-black/30 rounded-md my-2 mx-2">
                                        {errors.holidays}
                                        <button onClick={retryHolidays} className="ml-2 underline font-bold">Coba Lagi</button>
                                    </div>
                                )}
                                
                                {!isReadingMode && (
                                    <>
                                        {countdownTarget && <CountdownTimer target={countdownTarget} selectedEvent={selectedCountdownEvent} onEventChange={onCountdownEventChange} />}
                                        <div className="my-6">
                                            <DateConverter />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {currentView === 'prayer' && (
                            <PrayerTimesPage onBack={() => setCurrentView('calendar')}>
                                <PrayerInfo 
                                    prayerTimes={prayerTimes} nextPrayer={nextPrayer} locationName={locationName} error={errors.prayer} onRetry={() => {}}
                                    adhanAlarms={adhanAlarms} onToggleAdhanAlarm={handleAdhanAlarmToggle} onPlayAdhan={handlePlayAdhan} selectedAdhan={selectedAdhan} onAdhanChange={handleAdhanChange}
                                    userSettings={userSettings} onSettingsChange={handleUpdateSettings} countdownTarget={countdownTarget} selectedCountdownEvent={selectedCountdownEvent} onCountdownEventChange={onCountdownEventChange}
                                />
                            </PrayerTimesPage>
                        )}
                        
                        {currentView === 'qibla' && <QiblaCompass isOpen={true} onClose={() => setCurrentView('calendar')} location={location} />}
                        {currentView === 'doa' && <DoaDzikirPage onBack={() => setCurrentView('calendar')} />}
                        {currentView === 'quran' && <QuranPlayer onBack={() => setCurrentView('calendar')} />}
                    </div>

                    {/* Global Elements */}
                    <RamadanContainer />
                    <VoiceAssistant isOpen={isVoiceAssistantOpen} onClose={() => setIsVoiceAssistantOpen(false)} alarms={alarmSettings} onToggleAlarm={handleAlarmToggle} />
                    <ChatBot 
                        location={location} prayerTimes={prayerTimes} sahurPopupText={sahurPopupText} 
                        isOpen={!isReadingMode} setIsOpen={() => {}} initialMessage={null} 
                        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)} 
                    />
                    
                    {/* Modals */}
                    <Settings 
                        isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} 
                        theme={theme} onThemeChange={handleThemeChange} 
                        zoom={zoomLevel} onZoomChange={handleZoomChange}
                        settings={userSettings} onSettingsChange={handleUpdateSettings} onDateJump={handleDateJump}
                        isReadingMode={isReadingMode} onReadingModeChange={setIsReadingMode}
                        alarms={alarmSettings} onToggleAlarm={handleAlarmToggle} onAlarmTimeChange={handleAlarmTimeChange}
                        alarmSound={alarmSound} onAlarmSoundChange={handleAlarmSoundChange} playAlarmSound={playAlarmSound}
                    />
                    <DropdownMenu isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} onAction={handleAction} isLoggedIn={!!userProfile} isGuest={userProfile?.isGuest} />
                    <ShareModal 
                        isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} targetRef={shareRef}
                        calendarData={calendarData} yearlyCalendarData={yearlyCalendarData} viewDate={viewDate} today={calendarData?.days[0] || null} // Simplified today logic
                        prayerTimes={prayerTimes} nextPrayer={nextPrayer} locationName={locationName} customEvents={customEvents}
                        nationalHolidays={nationalHolidays} userSettings={userSettings}
                    />
                    <ContactUsModal isOpen={isContactUsOpen} onClose={() => setIsContactUsOpen(false)} />
                    {showDateDetailModal && selectedDay && (
                        <DateDetailModal 
                            isOpen={showDateDetailModal} onClose={() => setShowDateDetailModal(false)} day={selectedDay}
                            events={customEvents} onAddEvent={(e) => setCustomEvents(prev => [...prev, { ...e, id: Date.now().toString() }])}
                            onDeleteEvent={() => {}} onUpdateEvent={() => {}}
                            customHijriEvents={customHijriEvents} onAddHijriEvent={() => {}} onDeleteHijriEvent={() => {}} onUpdateHijriEvent={() => {}}
                            fastingInfo={getFastingInfo(selectedDay)} onOpenInfo={(k) => { setInfoTypeKey(k); setSelectedInfo(INFO_DETAILS[k] || null); }}
                            infoTypeKey={infoTypeKey}
                        />
                    )}
                    {selectedInfo && (
                        <InfoModal title={selectedInfo.title} content={selectedInfo.content} onClose={() => setSelectedInfo(null)} />
                    )}
                    {activeAlarm && <ActiveAlarmPopup alarm={activeAlarm} onDismiss={() => setActiveAlarm(null)} />}
                </div>
            )}
        </>
    );
};

export default App;
