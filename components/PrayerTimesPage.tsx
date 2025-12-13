
import React from 'react';
import { ChevronLeftIcon } from './Icons';

interface PrayerTimesPageProps {
    onBack: () => void;
    children: React.ReactNode; 
}

export const PrayerTimesPage: React.FC<PrayerTimesPageProps> = ({ onBack, children }) => {
    // Theme Variables logic
    const isLight = document.body.classList.contains('light');
    const bgColor = isLight ? 'bg-[#E0F2F1]' : 'bg-[#002b25]';
    const textColor = isLight ? 'text-[#004D40]' : 'text-white';
    
    return (
        <div className={`p-4 min-h-screen ${bgColor} ${textColor} animate-fade-in`}>
            <div className={`flex items-center gap-2 mb-6 border-b border-current/20 pb-4 ${isLight ? 'border-teal-200' : ''}`}>
                <button onClick={onBack} className="p-2 rounded-full hover:bg-black/10 transition-colors">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold">Jadwal Shalat & Cuaca</h2>
            </div>
            <div className="animate-fade-in-up">
                {children}
            </div>
        </div>
    );
};
