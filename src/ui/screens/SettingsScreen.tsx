import React from 'react';
import { getTileSkinName } from '../../l10n/translations';
import { DominoTile } from '../../rendering/DominoTile';
import { allTileSkins } from '../../rendering/tileSkin';
import { WoodTable } from '../../rendering/WoodTable';
import { TARGET_SCORE_OPTIONS, useSettings } from '../../state/settingsContext';
import { AppHeader } from '../widgets/AppHeader';

export interface SettingsScreenProps {
  onBack: () => void;
}

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section
    style={{
      backgroundColor: 'rgba(29, 17, 10, 0.80)',
      border: '1px solid rgba(201, 162, 75, 0.25)',
      borderRadius: 14,
    }}
    className="p-4 mb-4"
  >
    <h2 className="text-[#C9A24B] text-base font-bold mb-3">{title}</h2>
    {children}
  </section>
);

/** Settings screen: language, target score, tile skin and sound. */
export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const {
    settings,
    l10n,
    skin,
    setLanguage,
    setTargetScore,
    setTileSkin,
    setSound,
  } = useSettings();

  return (
    <div className="w-full h-full flex flex-col">
      <AppHeader title={l10n.settings} onBack={onBack} />
      <div className="flex-1 min-h-0">
        <WoodTable>
          <div className="flex-1 overflow-y-auto px-7 py-6">
            <div className="max-w-lg mx-auto">
              <SectionCard title={l10n.settingsLanguage}>
                <div className="inline-flex rounded-xl border border-[#C9A24B]/35 overflow-hidden bg-[#2B1B12]/70">
                  {(
                    [
                      { code: 'ar', label: 'العربية' },
                      { code: 'en', label: 'English' },
                    ] as const
                  ).map((item) => {
                    const selected = settings.languageCode === item.code;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => setLanguage(item.code)}
                        className={`px-5 py-2 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                          selected
                            ? 'bg-[#C9A24B] text-[#2B1B12]'
                            : 'text-[#F5EFE0] hover:bg-white/10'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </SectionCard>

              <SectionCard title={l10n.settingsTargetScore}>
                <div className="flex flex-wrap gap-2">
                  {TARGET_SCORE_OPTIONS.map((score) => {
                    const selected = settings.targetScore === score;
                    return (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setTargetScore(score)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold border transition-colors cursor-pointer tabular-nums ${
                          selected
                            ? 'bg-[#C9A24B] text-[#2B1B12] border-[#C9A24B]'
                            : 'bg-[#2B1B12]/70 text-[#F5EFE0] border-[#C9A24B]/30 hover:border-[#C9A24B]/70'
                        }`}
                      >
                        {score}
                      </button>
                    );
                  })}
                </div>
              </SectionCard>

              <SectionCard title={l10n.settingsTileSkin}>
                <div className="flex flex-wrap gap-2">
                  {allTileSkins.map((s) => {
                    const selected = settings.tileSkinId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setTileSkin(s.id)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold border transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#C9A24B] text-[#2B1B12] border-[#C9A24B]'
                            : 'bg-[#2B1B12]/70 text-[#F5EFE0] border-[#C9A24B]/30 hover:border-[#C9A24B]/70'
                        }`}
                      >
                        {getTileSkinName(l10n, s.id)}
                      </button>
                    );
                  })}
                </div>

                {/* Live preview of the chosen skin */}
                <div className="mt-4 flex items-center justify-center gap-3.5" dir="ltr">
                  <DominoTile top={6} bottom={6} width={40} skin={skin} />
                  <DominoTile top={2} bottom={5} width={40} skin={skin} />
                </div>
              </SectionCard>

              <SectionCard title={l10n.settingsSound}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.soundEnabled}
                  onClick={() => setSound(!settings.soundEnabled)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${
                    settings.soundEnabled ? 'bg-[#C9A24B]' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-[#2B1B12] transition-transform ${
                      settings.soundEnabled
                        ? 'ltr:translate-x-6 rtl:-translate-x-6'
                        : 'ltr:translate-x-1 rtl:-translate-x-1'
                    }`}
                  />
                </button>
              </SectionCard>
            </div>
          </div>
        </WoodTable>
      </div>
    </div>
  );
};
