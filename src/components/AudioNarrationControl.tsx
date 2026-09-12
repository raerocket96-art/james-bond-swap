import { useState, useEffect, useRef } from 'react';
import { BondActor } from '../types';
import { Volume2, VolumeX, Play, Pause, Square, Radio, Sliders, RotateCcw, Activity } from 'lucide-react';

export interface ActorVoiceProfile {
  actorId: string;
  actorName: string;
  styleLabel: string;
  pitch: number;
  rate: number;
  voiceKeywords: string[];
  accentDescription: string;
}

export const ACTOR_VOICE_PROFILES: Record<string, ActorVoiceProfile> = {
  connery: {
    actorId: 'connery',
    actorName: 'Sean Connery',
    styleLabel: 'Authoritative Scottish-British Rogue',
    pitch: 0.85,
    rate: 0.92,
    voiceKeywords: ['daniel', 'george', 'uk english male', 'en-gb', 'british', 'male'],
    accentDescription: 'Deep, commanding cadence with dry authority.',
  },
  lazenby: {
    actorId: 'lazenby',
    actorName: 'George Lazenby',
    styleLabel: 'Kinetic & Passionate Operative',
    pitch: 1.05,
    rate: 1.0,
    voiceKeywords: ['australian', 'en-au', 'en-gb', 'uk english', 'daniel'],
    accentDescription: 'Dynamic pitch with a raw, emotional edge.',
  },
  moore: {
    actorId: 'moore',
    actorName: 'Roger Moore',
    styleLabel: 'Suave Aristocratic Gentleman',
    pitch: 1.15,
    rate: 0.95,
    voiceKeywords: ['serena', 'uk english', 'en-gb', 'british', 'oliver'],
    accentDescription: 'Lighter, refined, unflappable gentleman tone.',
  },
  dalton: {
    actorId: 'dalton',
    actorName: 'Timothy Dalton',
    styleLabel: 'Dark Shakespearean Intensity',
    pitch: 0.80,
    rate: 1.05,
    voiceKeywords: ['daniel', 'uk english male', 'en-gb', 'male', 'british'],
    accentDescription: 'Focused, brooding intensity with crisp cadence.',
  },
  brosnan: {
    actorId: 'brosnan',
    actorName: 'Pierce Brosnan',
    styleLabel: 'Polished Tech-Era Elegance',
    pitch: 1.0,
    rate: 1.0,
    voiceKeywords: ['google uk english male', 'daniel', 'en-gb', 'british'],
    accentDescription: 'Smooth, polished, modern MI6 intelligence delivery.',
  },
  craig: {
    actorId: 'craig',
    actorName: 'Daniel Craig',
    styleLabel: 'Gritty Tactical Coldness',
    pitch: 0.72,
    rate: 0.88,
    voiceKeywords: ['daniel', 'uk english male', 'en-gb', 'male'],
    accentDescription: 'Low, guttural, stoic, and relentless pace.',
  },
};

interface AudioNarrationControlProps {
  actor: BondActor;
  simulation: any;
  isNarrationEnabled: boolean;
  onToggleNarrationMode: (enabled: boolean) => void;
}

export default function AudioNarrationControl({
  actor,
  simulation,
  isNarrationEnabled,
  onToggleNarrationMode,
}: AudioNarrationControlProps) {
  const profile = ACTOR_VOICE_PROFILES[actor.id] || ACTOR_VOICE_PROFILES['craig'];
  
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voicePreset, setVoicePreset] = useState<'actor' | 'soft_male' | 'deep_male' | 'warm_narrator'>('soft_male');
  const [autoRead, setAutoRead] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentlySpeakingSection, setCurrentlySpeakingSection] = useState<string | null>(null);
  const [customPitch, setCustomPitch] = useState<number>(0.88);
  const [customRate, setCustomRate] = useState<number>(0.85);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const prevSimulationRef = useRef<any>(null);

  // Apply voice preset parameters
  const applyVoicePreset = (
    preset: 'actor' | 'soft_male' | 'deep_male' | 'warm_narrator',
    availableVoices: SpeechSynthesisVoice[] = voices
  ) => {
    setVoicePreset(preset);
    if (preset === 'soft_male') {
      setCustomPitch(0.88);
      setCustomRate(0.85);
      findBestVoiceForKeywords(availableVoices, ['daniel', 'george', 'oliver', 'ryan', 'jonas', 'henrik', 'male', 'uk english', 'nb-no', 'no-no', 'en-gb']);
    } else if (preset === 'deep_male') {
      setCustomPitch(0.70);
      setCustomRate(0.88);
      findBestVoiceForKeywords(availableVoices, ['daniel', 'george', 'male', 'uk english', 'en-gb']);
    } else if (preset === 'warm_narrator') {
      setCustomPitch(0.95);
      setCustomRate(0.92);
      findBestVoiceForKeywords(availableVoices, ['oliver', 'serena', 'google', 'en-gb', 'en-us']);
    } else {
      setCustomPitch(profile.pitch);
      setCustomRate(profile.rate);
      findBestVoiceForActor(availableVoices, profile);
    }
  };

  const findBestVoiceForKeywords = (
    availableVoices: SpeechSynthesisVoice[],
    keywords: string[]
  ) => {
    if (!availableVoices || availableVoices.length === 0) return;
    for (const kw of keywords) {
      const match = availableVoices.find(
        v => v.name.toLowerCase().includes(kw) || v.lang.toLowerCase().includes(kw)
      );
      if (match) {
        setSelectedVoice(match);
        return;
      }
    }
    const maleFallback = availableVoices.find(v => v.name.toLowerCase().includes('male') || v.lang.startsWith('en'));
    if (maleFallback) setSelectedVoice(maleFallback);
  };

  // Synchronize pitch and rate whenever actor changes
  useEffect(() => {
    setCustomPitch(profile.pitch);
    setCustomRate(profile.rate);
  }, [actor.id]);

  // Load browser voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      findBestVoiceForActor(availableVoices, profile);
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [actor.id]);

  const findBestVoiceForActor = (
    availableVoices: SpeechSynthesisVoice[],
    voiceProfile: ActorVoiceProfile
  ) => {
    if (!availableVoices || availableVoices.length === 0) return;

    // Search for preferred keywords in order
    for (const keyword of voiceProfile.voiceKeywords) {
      const match = availableVoices.find(
        v => v.name.toLowerCase().includes(keyword) || v.lang.toLowerCase().includes(keyword)
      );
      if (match) {
        setSelectedVoice(match);
        return;
      }
    }

    // Fallback to English voice if available
    const enVoice = availableVoices.find(v => v.lang.startsWith('en'));
    if (enVoice) {
      setSelectedVoice(enVoice);
    } else {
      setSelectedVoice(availableVoices[0]);
    }
  };

  // Stop speaking on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-read whenever a new simulation frame arrives
  useEffect(() => {
    if (!isNarrationEnabled || !autoRead || !simulation) return;

    // Only speak if simulation scene changed or was updated
    if (
      simulation !== prevSimulationRef.current &&
      (simulation.narrative || simulation.actorReaction)
    ) {
      prevSimulationRef.current = simulation;
      speakFullScene();
    }
  }, [simulation, isNarrationEnabled, autoRead]);

  const stopNarration = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentlySpeakingSection(null);
  };

  const speakText = (text: string, sectionName: string, onComplete?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    if (!text || text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.pitch = customPitch;
    utterance.rate = customRate;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setCurrentlySpeakingSection(sectionName);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentlySpeakingSection(null);
      if (onComplete) onComplete();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentlySpeakingSection(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const speakFullScene = () => {
    if (!simulation) return;

    const narrativeText = simulation.narrative ? `Scene Narrative. ${simulation.narrative}` : '';
    const reactionText = simulation.actorReaction
      ? `${actor.name}'s Reaction. ${simulation.actorReaction}`
      : '';

    const fullText = `${narrativeText} ${reactionText}`.trim();

    if (fullText) {
      speakText(fullText, 'Full Scene Narration');
    }
  };

  const speakNarrativeOnly = () => {
    if (!simulation?.narrative) return;
    speakText(simulation.narrative, 'Scene Narrative');
  };

  const speakReactionOnly = () => {
    if (!simulation?.actorReaction) return;
    speakText(`${actor.name}'s Reaction. ${simulation.actorReaction}`, `${actor.name}'s Reaction`);
  };

  const togglePauseResume = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
    } else if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return (
      <div className="bond-panel p-3 text-xs text-[#817b71]">
        Browser Speech Synthesis API is not supported in this environment.
      </div>
    );
  }

  const presetButton = (active: boolean) =>
    `rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition ${
      active
        ? 'border-[#c8a96b]/35 bg-[#c8a96b]/12 text-[#e1c58e]'
        : 'border-white/7 bg-black/15 text-[#817b71] hover:border-[#c8a96b]/20 hover:text-white'
    }`;

  return (
    <section className="bond-panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => {
              const nextState = !isNarrationEnabled;
              if (!nextState) stopNarration();
              onToggleNarrationMode(nextState);
            }}
            className={`bond-icon-button ${isNarrationEnabled ? 'is-active' : ''}`}
          >
            {isNarrationEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span>{isNarrationEnabled ? 'Audio Recon Active' : 'Enable Audio Recon'}</span>
          </button>

          <div className="hidden min-w-0 sm:block">
            <div className="bond-kicker">VOICE PROFILE</div>
            <div className="truncate text-xs text-[#aaa69d]">
              {actor.name} · {profile.styleLabel}
            </div>
          </div>
        </div>

        {isNarrationEnabled && (
          <div className="flex items-center gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/7 bg-black/15 px-2.5 py-2 text-[10px] text-[#89837a] hover:text-white">
              <input type="checkbox" checked={autoRead} onChange={e => setAutoRead(e.target.checked)} className="accent-[#c8a96b]" />
              Auto-read
            </label>

            {isSpeaking ? (
              <button onClick={togglePauseResume} className="bond-icon-button is-active" title="Pause narration"><Pause className="h-4 w-4" /></button>
            ) : isPaused ? (
              <button onClick={togglePauseResume} className="bond-icon-button is-active" title="Resume narration"><Play className="h-4 w-4" /></button>
            ) : (
              <button onClick={speakFullScene} disabled={!simulation} className="bond-icon-button" title="Narrate current scene"><Play className="h-4 w-4" /><span className="hidden sm:inline">Play</span></button>
            )}

            {(isSpeaking || isPaused) && (
              <button onClick={stopNarration} className="bond-icon-button" title="Stop narration"><Square className="h-4 w-4" /></button>
            )}

            <button onClick={() => setShowSettings(!showSettings)} className={`bond-icon-button ${showSettings ? 'is-active' : ''}`} title="Voice settings">
              <Sliders className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {isNarrationEnabled && (
        <div className="border-t border-white/7 bg-black/10 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bond-kicker mr-1">VOICE PRESET</span>
            <button onClick={() => applyVoicePreset('soft_male')} className={presetButton(voicePreset === 'soft_male')}>Soft male</button>
            <button onClick={() => applyVoicePreset('deep_male')} className={presetButton(voicePreset === 'deep_male')}>Deep male</button>
            <button onClick={() => applyVoicePreset('actor')} className={presetButton(voicePreset === 'actor')}>{actor.name}</button>
            <button onClick={() => applyVoicePreset('warm_narrator')} className={presetButton(voicePreset === 'warm_narrator')}>Warm narrator</button>

            {simulation && (
              <div className="ml-auto flex items-center gap-2">
                <button onClick={speakNarrativeOnly} className="bond-icon-button"><RotateCcw className="h-3.5 w-3.5" /><span className="hidden lg:inline">Scene</span></button>
                <button onClick={speakReactionOnly} className="bond-icon-button"><RotateCcw className="h-3.5 w-3.5" /><span className="hidden lg:inline">Reaction</span></button>
              </div>
            )}
          </div>

          {(isSpeaking || isPaused) && (
            <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-400/10 bg-emerald-400/5 px-3 py-2.5">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">
                <Radio className={`h-3.5 w-3.5 ${isSpeaking ? 'animate-pulse' : ''}`} />
                {isPaused ? 'Narration paused' : `Reading · ${currentlySpeakingSection}`}
              </div>
              {isSpeaking && (
                <div className="flex items-end gap-1" aria-hidden="true">
                  {[8,14,10,18,7].map((height, idx) => (
                    <span key={idx} className="w-0.5 animate-pulse rounded-full bg-[#c8a96b]" style={{ height, animationDelay: `${idx * 100}ms` }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {showSettings && (
            <div className="mt-3 grid gap-4 rounded-xl border border-white/7 bg-[#0d0e0f] p-4 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <label className="bond-field-label">Synthesizer voice</label>
                  <button
                    onClick={() => { setCustomPitch(profile.pitch); setCustomRate(profile.rate); }}
                    className="text-[10px] font-semibold text-[#c8a96b] hover:text-[#e0c78f]"
                  >
                    Reset defaults
                  </button>
                </div>
                <select
                  value={selectedVoice?.name || ''}
                  onChange={(e) => {
                    const found = voices.find(v => v.name === e.target.value);
                    if (found) setSelectedVoice(found);
                  }}
                  className="bond-select mt-1.5"
                >
                  {voices.map((v, i) => <option key={i} value={v.name}>{v.name} ({v.lang})</option>)}
                </select>
                <p className="mt-2 text-[10px] italic text-[#706b63]">{profile.accentDescription}</p>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-[10px] text-[#8c867d]"><span>Pitch</span><b className="text-[#d9bd84]">{customPitch.toFixed(2)}</b></div>
                <input type="range" min="0.5" max="1.5" step="0.05" value={customPitch} onChange={e => setCustomPitch(parseFloat(e.target.value))} className="w-full accent-[#c8a96b]" />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-[10px] text-[#8c867d]"><span>Rate</span><b className="text-[#d9bd84]">{customRate.toFixed(2)}x</b></div>
                <input type="range" min="0.6" max="1.4" step="0.05" value={customRate} onChange={e => setCustomRate(parseFloat(e.target.value))} className="w-full accent-[#c8a96b]" />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
