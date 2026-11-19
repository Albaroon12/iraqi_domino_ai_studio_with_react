import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTranslations, LanguageCode, Translations } from '../l10n/translations';
import { TileSkin, tileSkinById } from '../rendering/tileSkin';

export const SUPPORTED_LANGUAGES: readonly LanguageCode[] = ['ar', 'en'];
export const TARGET_SCORE_OPTIONS: readonly number[] = [151, 200, 250];

export interface SettingsState {
  readonly languageCode: LanguageCode;
  readonly targetScore: number;
  readonly tileSkinId: string;
  readonly soundEnabled: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  languageCode: 'ar',
  targetScore: 151,
  tileSkinId: 'ivory',
  soundEnabled: true,
};

const STORAGE_KEYS = {
  language: 'settings.language',
  targetScore: 'settings.target_score',
  tileSkin: 'settings.tile_skin',
  sound: 'settings.sound',
} as const;

function loadSettings(): SettingsState {
  try {
    const rawLang = localStorage.getItem(STORAGE_KEYS.language);
    const rawScore = localStorage.getItem(STORAGE_KEYS.targetScore);
    const rawSkin = localStorage.getItem(STORAGE_KEYS.tileSkin);
    const rawSound = localStorage.getItem(STORAGE_KEYS.sound);

    const parsedScore = rawScore !== null ? Number.parseInt(rawScore, 10) : NaN;

    return {
      languageCode:
        rawLang === 'ar' || rawLang === 'en'
          ? rawLang
          : DEFAULT_SETTINGS.languageCode,
      targetScore: TARGET_SCORE_OPTIONS.includes(parsedScore)
        ? parsedScore
        : DEFAULT_SETTINGS.targetScore,
      tileSkinId: rawSkin ?? DEFAULT_SETTINGS.tileSkinId,
      soundEnabled:
        rawSound === 'true'
          ? true
          : rawSound === 'false'
            ? false
            : DEFAULT_SETTINGS.soundEnabled,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

interface SettingsContextValue {
  settings: SettingsState;
  l10n: Translations;
  skin: TileSkin;
  isRtl: boolean;
  setLanguage: (code: LanguageCode) => void;
  setTargetScore: (score: number) => void;
  setTileSkin: (id: string) => void;
  setSound: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<SettingsState>(loadSettings);

  useEffect(() => {
    const dir = settings.languageCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.languageCode;
    document.documentElement.dir = dir;
  }, [settings.languageCode]);

  const setLanguage = (languageCode: LanguageCode) => {
    setSettings((prev) => ({ ...prev, languageCode }));
    try {
      localStorage.setItem(STORAGE_KEYS.language, languageCode);
    } catch {
      // Ignore storage failures
    }
  };

  const setTargetScore = (targetScore: number) => {
    setSettings((prev) => ({ ...prev, targetScore }));
    try {
      localStorage.setItem(STORAGE_KEYS.targetScore, String(targetScore));
    } catch {
      // Ignore storage failures
    }
  };

  const setTileSkin = (tileSkinId: string) => {
    setSettings((prev) => ({ ...prev, tileSkinId }));
    try {
      localStorage.setItem(STORAGE_KEYS.tileSkin, tileSkinId);
    } catch {
      // Ignore storage failures
    }
  };

  const setSound = (soundEnabled: boolean) => {
    setSettings((prev) => ({ ...prev, soundEnabled }));
    try {
      localStorage.setItem(STORAGE_KEYS.sound, String(soundEnabled));
    } catch {
      // Ignore storage failures
    }
  };

  const l10n = getTranslations(settings.languageCode);
  const skin = tileSkinById(settings.tileSkinId);
  const isRtl = settings.languageCode === 'ar';

  return (
    <SettingsContext.Provider
      value={{
        settings,
        l10n,
        skin,
        isRtl,
        setLanguage,
        setTargetScore,
        setTileSkin,
        setSound,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }
  return ctx;
}
