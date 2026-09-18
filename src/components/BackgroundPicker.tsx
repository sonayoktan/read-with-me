import React, { useState, useRef } from 'react';
import { Image, Upload, Sliders, Check, Sparkles, Tv, Sun, Focus } from 'lucide-react';
import type { BackgroundPreset } from '../types';
import { audioManager } from '../utils/audio';

import cozyIllustration from '../assets/illustration.jpg';
import rainyWindowBg from '../assets/backgrounds/rainy-window.jpg';
import nightLibraryBg from '../assets/backgrounds/night-library.jpg';
import openBookCoffeeBg from '../assets/backgrounds/open-book-coffee.jpg';
import sunsetWindowBg from '../assets/backgrounds/sunset-window.jpg';
import fireplaceCabinBg from '../assets/backgrounds/fireplace-cabin.jpg';

export const PRESET_BACKGROUNDS: BackgroundPreset[] = [
  {
    id: 'cozy-girl-cat',
    name: 'Cozy Oda: Kız & Kedi',
    url: cozyIllustration,
    thumbnail: cozyIllustration,
    type: 'image',
  },
  {
    id: 'rainy-window-coffee',
    name: 'Yağmurlu Pencere & Kahve',
    url: rainyWindowBg,
    thumbnail: rainyWindowBg,
    type: 'image',
  },
  {
    id: 'night-library-study',
    name: 'Gece Kütüphanesi & Çalışma',
    url: nightLibraryBg,
    thumbnail: nightLibraryBg,
    type: 'image',
  },
  {
    id: 'open-book-latte',
    name: 'Açık Kitap & Sıcak Kahve',
    url: openBookCoffeeBg,
    thumbnail: openBookCoffeeBg,
    type: 'image',
  },
  {
    id: 'sunset-reading-nook',
    name: 'Sıcak Günbatımı & Pencere',
    url: sunsetWindowBg,
    thumbnail: sunsetWindowBg,
    type: 'image',
  },
  {
    id: 'fireplace-cabin-retreat',
    name: 'Orman Evi & Şömine Ateşi',
    url: fireplaceCabinBg,
    thumbnail: fireplaceCabinBg,
    type: 'image',
  }
];

interface BackgroundPickerProps {
  currentBgUrl: string;
  onSelectBg: (url: string) => void;
  overlayOpacity: number;
  onOverlayOpacityChange: (opacity: number) => void;
  warmFilter: boolean;
  onToggleWarmFilter: () => void;
  vignette: boolean;
  onToggleVignette: () => void;
  retroScanlines: boolean;
  onToggleRetroScanlines: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const BackgroundPicker: React.FC<BackgroundPickerProps> = ({
  currentBgUrl,
  onSelectBg,
  overlayOpacity,
  onOverlayOpacityChange,
  warmFilter,
  onToggleWarmFilter,
  vignette,
  onToggleVignette,
  retroScanlines,
  onToggleRetroScanlines,
  isOpen,
  onClose,
}) => {
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    let target = customUrl.trim();
    // Normalize path to local project illustration if desktop path is provided
    if (target.includes('Gemini_Generated_Image_rh8r29rh8r29rh8r.jpg')) {
      target = cozyIllustration;
    }
    onSelectBg(target);
    audioManager.playSoftClick();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          onSelectBg(result);
          audioManager.playSoftClick();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 border border-white/10 shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Image className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Arka Plan & Atmosfer</h2>
              <p className="text-xs text-zinc-400">Okuma ortamınızı dilediğiniz gibi özelleştirin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Presets Grid */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Hazır Cozy Temalar
          </div>
          <div className="grid grid-cols-3 gap-3">
            {PRESET_BACKGROUNDS.map((preset) => {
              const isSelected = currentBgUrl === preset.url;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    onSelectBg(preset.url);
                    audioManager.playSoftClick();
                  }}
                  className={`group relative rounded-2xl overflow-hidden aspect-video border-2 transition-all text-left ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/30'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={preset.thumbnail}
                    alt={preset.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[11px] font-medium text-white truncate w-full flex items-center justify-between">
                      {preset.name}
                      {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom URL or File Upload */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            Kendi Görselinizi Belirleyin
          </div>

          <form onSubmit={handleCustomUrlSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Görsel bağlantısı yapıştırın (https://...jpg, png, gif)"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold rounded-xl border border-amber-500/30 transition-colors"
            >
              Uygula
            </button>
          </form>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Bilgisayarımdan Görsel Seç
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Display Settings: Dim / Opacity & Scanlines */}
        <div className="pt-2 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Arka Plan Karartma (Okunabilirlik)</span>
            </div>
            <span className="text-xs font-mono text-amber-300">%{Math.round(overlayOpacity * 100)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.85"
            step="0.05"
            value={overlayOpacity}
            onChange={(e) => onOverlayOpacityChange(parseFloat(e.target.value))}
            className="w-full accent-amber-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
          />

          {/* Warm Filter Toggle (Task 1.3) */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <span>Sıcak Akşam Filtresi (Warm Glow)</span>
                <p className="text-[10px] text-zinc-500">Ilık lo-fi okuma lambası tonu</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleWarmFilter}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                warmFilter ? 'bg-amber-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  warmFilter ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Vignette Toggle (Task 1.3) */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <Focus className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <span>Hafif Loşluk / Odak Vignette</span>
                <p className="text-[10px] text-zinc-500">Görseli boğmadan kenarları yumuşatır</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleVignette}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                vignette ? 'bg-amber-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  vignette ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <Tv className="w-3.5 h-3.5 text-amber-400" />
              <span>Retro Lo-Fi Scanlines Efekti</span>
            </div>
            <button
              type="button"
              onClick={onToggleRetroScanlines}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                retroScanlines ? 'bg-amber-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  retroScanlines ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-3">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-amber-500/80 hover:bg-amber-500 text-stone-900 font-bold rounded-2xl text-xs transition-colors"
          >
            Kaydet & Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
