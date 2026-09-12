/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BOND_ACTORS } from './data/bondPersonalities';
import { BOND_FILMS } from './data/bondFilms';
import { BondActor, SaveSlot, CausalNode } from './types';
import { FilmContext } from './data/bondFilms';
import ActorComparator from './components/ActorComparator';
import ActiveStatusWidget from './components/ActiveStatusWidget';
import SaveManagerModal from './components/SaveManagerModal';
import CausalBranchTreeModal from './components/CausalBranchTreeModal';
import AudioNarrationControl from './components/AudioNarrationControl';
import { Save, RefreshCw, Check, GitBranch, Volume2, UserRound, Film, Target, ChevronRight } from 'lucide-react';

const AUTOSAVE_KEY = 'bond_simulator_autosave_v1';

export default function App() {
  const [selectedActor, setSelectedActor] = useState<BondActor>(BOND_ACTORS[5]); // Default Craig
  const [selectedFilm, setSelectedFilm] = useState<FilmContext>(BOND_FILMS[2]); // Default GoldenEye
  const [loading, setLoading] = useState(false);
  const [simulation, setSimulation] = useState<any>(null);
  const [sessionLog, setSessionLog] = useState<any[]>([]);
  const [sessionSummary, setSessionSummary] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [customAction, setCustomAction] = useState('');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);
  const [autosaveNotice, setAutosaveNotice] = useState(false);
  const [treeNodes, setTreeNodes] = useState<Record<string, CausalNode>>({});
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isNarrationEnabled, setIsNarrationEnabled] = useState<boolean>(false);

  // Restore autosave on initial boot if available
  useEffect(() => {
    try {
      const rawAutosave = localStorage.getItem(AUTOSAVE_KEY);
      if (rawAutosave) {
        const savedData: SaveSlot = JSON.parse(rawAutosave);
        if (savedData && savedData.actorId && savedData.filmId) {
          const foundActor = BOND_ACTORS.find(a => a.id === savedData.actorId);
          const foundFilm = BOND_FILMS.find(f => f.id === savedData.filmId);
          if (foundActor) setSelectedActor(foundActor);
          if (foundFilm) setSelectedFilm(foundFilm);
          if (savedData.simulation) setSimulation(savedData.simulation);
          if (savedData.sessionLog) setSessionLog(savedData.sessionLog);
          if (savedData.sessionSummary) setSessionSummary(savedData.sessionSummary);
          if (savedData.history) setHistory(savedData.history);
          if (savedData.treeNodes && Object.keys(savedData.treeNodes).length > 0) {
            setTreeNodes(savedData.treeNodes);
            setActiveNodeId(savedData.activeNodeId || Object.keys(savedData.treeNodes)[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load initial autosave:', err);
    }
  }, []);

  // Trigger automatic background save whenever state changes
  useEffect(() => {
    if (simulation || sessionLog.length > 0 || history.length > 0) {
      const autosaveData: SaveSlot = {
        id: 'autosave',
        name: `Autosave (${selectedActor.name} in ${selectedFilm.title})`,
        timestamp: Date.now(),
        actorId: selectedActor.id,
        filmId: selectedFilm.id,
        simulation,
        sessionLog,
        sessionSummary,
        history,
        treeNodes,
        activeNodeId
      };
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(autosaveData));
      setAutosaveNotice(true);
      const timer = setTimeout(() => setAutosaveNotice(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedActor, selectedFilm, simulation, sessionLog, sessionSummary, history, treeNodes, activeNodeId]);

  const loadSaveSlot = (save: SaveSlot) => {
    const foundActor = BOND_ACTORS.find(a => a.id === save.actorId);
    const foundFilm = BOND_FILMS.find(f => f.id === save.filmId);
    if (foundActor) setSelectedActor(foundActor);
    if (foundFilm) setSelectedFilm(foundFilm);
    setSimulation(save.simulation || null);
    setSessionLog(save.sessionLog || []);
    setSessionSummary(save.sessionSummary || null);
    setHistory(save.history || []);

    if (save.treeNodes && Object.keys(save.treeNodes).length > 0) {
      setTreeNodes(save.treeNodes);
      setActiveNodeId(save.activeNodeId || Object.keys(save.treeNodes)[0]);
    } else if (save.sessionLog && save.sessionLog.length > 0) {
      // Reconstruct tree nodes for legacy save files
      const reconstructed: Record<string, CausalNode> = {};
      let prevId: string | null = null;
      save.sessionLog.forEach((logItem, index) => {
        const nodeId = `node-legacy-${index}`;
        reconstructed[nodeId] = {
          id: nodeId,
          parentId: prevId,
          childrenIds: [],
          title: logItem.sceneTitle || `Scene ${index + 1}`,
          actionTaken: logItem.action || (index === 0 ? "Initial Deployment" : `Choice ${index}`),
          simulation: logItem,
          sessionLog: save.sessionLog.slice(0, index + 1),
          history: save.history ? save.history.slice(0, index + 1) : [],
          timestamp: Date.now() + index,
          depth: index,
        };
        if (prevId && reconstructed[prevId] && !reconstructed[prevId].childrenIds.includes(nodeId)) {
          reconstructed[prevId].childrenIds.push(nodeId);
        }
        prevId = nodeId;
      });
      setTreeNodes(reconstructed);
      setActiveNodeId(prevId);
    } else {
      setTreeNodes({});
      setActiveNodeId(null);
    }
  };

  const jumpToNode = (nodeId: string) => {
    const target = treeNodes[nodeId];
    if (!target) return;
    setActiveNodeId(nodeId);
    setSimulation(target.simulation);
    setSessionLog(target.sessionLog || []);
    setHistory(target.history || []);
    setSessionSummary(null);
    setErrorMsg(null);
  };

  const runSimulation = async (actionText?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filmId: selectedFilm.id,
          actorId: selectedActor.id,
          sceneState: simulation?.nextSceneState || { currentScene: selectedFilm.openingScene.title, description: selectedFilm.openingScene.description },
          lastAction: actionText || "Initial Simulation Run",
          history
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Simulation failed");
      }
      setSimulation(data);
      const updatedLog = [...sessionLog, { action: actionText, ...data }];
      setSessionLog(updatedLog);
      const updatedHistory = actionText ? [...history, actionText] : history;
      if (actionText) {
        setHistory(updatedHistory);
      }

      // Append to Causal Branch Tree
      const newNodeId = `node-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setTreeNodes(prev => {
        const updated = { ...prev };
        let parentId = activeNodeId;

        // If tree is empty, initialize root deployment node
        if (!parentId && Object.keys(updated).length === 0) {
          const rootId = `node-root-${Date.now()}`;
          updated[rootId] = {
            id: rootId,
            parentId: null,
            childrenIds: [],
            title: selectedFilm.openingScene.title,
            actionTaken: "Initial Deployment",
            simulation: null,
            sessionLog: [],
            history: [],
            timestamp: Date.now() - 100,
            depth: 0,
          };
          parentId = rootId;
        }

        const parentNode = parentId ? updated[parentId] : null;
        const parentDepth = parentNode ? parentNode.depth : 0;

        const newNode: CausalNode = {
          id: newNodeId,
          parentId: parentId,
          childrenIds: [],
          title: data.sceneTitle || "Scene",
          actionTaken: actionText || "Initial Deployment",
          simulation: data,
          sessionLog: updatedLog,
          history: updatedHistory,
          timestamp: Date.now(),
          depth: parentDepth + 1,
        };

        if (parentId && updated[parentId]) {
          const currentChildren = updated[parentId].childrenIds || [];
          if (!currentChildren.includes(newNodeId)) {
            updated[parentId] = {
              ...updated[parentId],
              childrenIds: [...currentChildren, newNodeId]
            };
          }
        }

        updated[newNodeId] = newNode;
        return updated;
      });

      setActiveNodeId(newNodeId);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to communicate with simulation engine.");
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/end-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: sessionLog }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Summary generation failed");
      }
      // Ensure the keys match what the server returns (Summary, ScoreRating, FinalAnalysis)
      setSessionSummary({
        Summary: data.Summary || data.summary,
        ScoreRating: data.ScoreRating || data.scoreRating,
        FinalAnalysis: data.FinalAnalysis || data.finalAnalysis,
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to generate the session summary.");
    } finally {
      setLoading(false);
    }
  };

  const resetSimulation = () => {
    setSimulation(null);
    setSessionLog([]);
    setSessionSummary(null);
    setErrorMsg(null);
    setHistory([]);
    setTreeNodes({});
    setActiveNodeId(null);
    localStorage.removeItem(AUTOSAVE_KEY);
  };

  return (
    <div className="bond-shell min-h-screen text-[#f1eee6]">
      <div className="bond-noise" aria-hidden="true" />

      <header className="bond-topbar sticky top-0 z-40">
        <div className="flex min-w-0 items-center gap-4">
          <div className="bond-mark" aria-hidden="true">
            <span>007</span>
          </div>
          <div className="min-w-0">
            <div className="bond-kicker">MI6 // Q BRANCH SIMULATION LAB</div>
            <h1 className="truncate text-lg font-semibold tracking-[0.02em] text-white sm:text-xl">
              Actor Swap Simulator
            </h1>
          </div>
          <span className="hidden rounded-full border border-[#c8a96b]/25 bg-[#c8a96b]/8 px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-[#d8bd86] lg:inline-flex">
            LAYERS 1 · 2 · 3 ONLINE
          </span>
        </div>

        <div className="flex items-center gap-2">
          {autosaveNotice && (
            <div className="hidden items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 sm:flex">
              <Check className="h-3.5 w-3.5" />
              Autosaved
            </div>
          )}
          <button
            onClick={() => setIsNarrationEnabled(!isNarrationEnabled)}
            className={`bond-icon-button ${isNarrationEnabled ? 'is-active' : ''}`}
            title="Toggle audio recon"
          >
            <Volume2 className="h-4 w-4" />
            <span className="hidden xl:inline">Audio</span>
          </button>
          <button onClick={() => setIsTreeModalOpen(true)} className="bond-icon-button" title="Open causal tree">
            <GitBranch className="h-4 w-4" />
            <span className="hidden xl:inline">Tree</span>
            <span className="bond-count">{Object.keys(treeNodes).length}</span>
          </button>
          <button onClick={() => setIsSaveModalOpen(true)} className="bond-icon-button" title="Save or load operation">
            <Save className="h-4 w-4" />
            <span className="hidden xl:inline">Save</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-[1920px] grid-cols-1 gap-4 p-3 sm:p-4 lg:grid-cols-[310px_minmax(0,1fr)] lg:gap-5 lg:p-5 2xl:grid-cols-[330px_minmax(0,1fr)]">
        <aside className="space-y-4 lg:sticky lg:top-[88px] lg:h-[calc(100vh-108px)] lg:overflow-y-auto lg:pr-1 bond-scroll">
          <section className="bond-panel overflow-hidden">
            <div className="bond-panel-heading">
              <div>
                <span className="bond-kicker">CASTING MATRIX</span>
                <h2 className="text-base font-semibold text-white">Choose your 007</h2>
              </div>
              <UserRound className="h-5 w-5 text-[#c8a96b]" />
            </div>

            <div className="space-y-3 p-4">
              <label className="bond-field-label" htmlFor="bond-actor">Bond actor</label>
              <div className="bond-select-wrap">
                <select
                  id="bond-actor"
                  className="bond-select"
                  value={selectedActor.id}
                  onChange={(e) => {
                    const found = BOND_ACTORS.find(a => a.id === e.target.value);
                    if (found) setSelectedActor(found);
                    resetSimulation();
                  }}
                >
                  {BOND_ACTORS.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.era})</option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl border border-white/7 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xl font-semibold text-white">{selectedActor.name}</div>
                    <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#c8a96b]">Agent personality profile</div>
                  </div>
                  <div className="bond-agent-chip">007</div>
                </div>
                <p className="mt-3 text-[13px] leading-5 text-[#aaa69d]">{selectedActor.description}</p>
              </div>

              <div className="space-y-3 pt-1">
                {[
                  ['Ruthlessness', selectedActor.attributes.ruthlessness, 'danger'],
                  ['Risk tolerance', selectedActor.attributes.riskTolerance, 'gold'],
                  ['Professionalism', selectedActor.attributes.professionalism, 'blue'],
                ].map(([label, value, tone]) => (
                  <div key={String(label)}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-[#b8b4aa]">{label}</span>
                      <span className="font-semibold text-white">{value}%</span>
                    </div>
                    <div className="bond-meter">
                      <div className={`bond-meter-fill ${tone}`} style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bond-panel overflow-hidden">
            <div className="bond-panel-heading">
              <div>
                <span className="bond-kicker">TARGET UNIVERSE</span>
                <h2 className="text-base font-semibold text-white">Select mission file</h2>
              </div>
              <Film className="h-5 w-5 text-[#c8a96b]" />
            </div>
            <div className="space-y-3 p-4">
              <label className="bond-field-label" htmlFor="bond-film">Film universe</label>
              <div className="bond-select-wrap">
                <select
                  id="bond-film"
                  className="bond-select"
                  value={selectedFilm.id}
                  onChange={(e) => {
                    const found = BOND_FILMS.find(f => f.id === e.target.value);
                    if (found) setSelectedFilm(found);
                    resetSimulation();
                  }}
                >
                  {BOND_FILMS.map(f => (
                    <option key={f.id} value={f.id}>{f.title} ({f.year})</option>
                  ))}
                </select>
              </div>

              <div className="bond-film-card">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-semibold leading-tight text-white">{selectedFilm.title}</h3>
                  <span className="text-sm font-semibold text-[#c8a96b]">{selectedFilm.year}</span>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-[#aaa69d]">
                  <div><span className="bond-meta-key">TECH</span>{selectedFilm.technology}</div>
                  <div><span className="bond-meta-key">HOSTILES</span>{selectedFilm.villains.join(', ')}</div>
                  <div><span className="bond-meta-key">Q BRANCH</span>{selectedFilm.gadgets.join(', ')}</div>
                </div>
              </div>
            </div>
          </section>

          <ActorComparator />
        </aside>

        <section className="min-w-0 space-y-4">
          <div className="bond-hero bond-cut relative overflow-hidden">
            <div className="bond-gunbarrel" aria-hidden="true" />
            <div className="relative z-10 grid min-h-[210px] items-end gap-6 p-5 sm:p-7 xl:grid-cols-[minmax(0,1fr)_auto]">
              <div className="max-w-4xl">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="bond-live-dot"><i /> LIVE TIMELINE</span>
                  <span className="bond-hero-tag">{selectedActor.name}</span>
                  <span className="bond-hero-tag">{selectedFilm.title} · {selectedFilm.year}</span>
                </div>
                <div className="bond-kicker mb-2">CURRENT SIMULATION FRAME</div>
                <h2 className="bond-scene-title">
                  {simulation?.sceneTitle || selectedFilm.openingScene.title}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[#bcb7ad]">
                  {simulation
                    ? `Timeline depth ${activeNodeId && treeNodes[activeNodeId] ? treeNodes[activeNodeId].depth : 0}. Every decision is now mutating the original ${selectedFilm.year} continuity.`
                    : selectedFilm.initialObjective}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 xl:w-[430px]">
                <div className="bond-stat-card">
                  <span>Plot deviation</span>
                  <strong className="text-[#e8766f]">{simulation?.plotDeviationScore || '0.0%'}</strong>
                </div>
                <div className="bond-stat-card">
                  <span>Timeline depth</span>
                  <strong>{activeNodeId && treeNodes[activeNodeId] ? treeNodes[activeNodeId].depth : 0}</strong>
                </div>
                <button onClick={() => setIsTreeModalOpen(true)} className="bond-stat-card bond-stat-action text-left">
                  <span>Causal nodes</span>
                  <strong className="flex items-center gap-2">{Object.keys(treeNodes).length}<GitBranch className="h-4 w-4" /></strong>
                </button>
              </div>
            </div>
          </div>

          <ActiveStatusWidget
            currentLocation={simulation?.currentLocation}
            knownThreats={simulation?.knownThreats}
            intelGathered={simulation?.intelGathered}
            initialLocation={selectedFilm.openingScene.title}
          />

          {errorMsg && (
            <div className="bond-alert">
              <div>
                <div className="font-semibold text-white">Simulation link interrupted</div>
                <div className="mt-1 text-sm text-red-200/75">{errorMsg}</div>
              </div>
              <button onClick={() => runSimulation('Retry Simulation')} className="bond-button danger">Retry</button>
            </div>
          )}

          {sessionSummary ? (
            <section className="bond-panel p-5 sm:p-7">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/8 pb-5">
                <div>
                  <div className="bond-kicker">MISSION DEBRIEF</div>
                  <h2 className="mt-1 text-3xl font-semibold text-white">Simulation Summary</h2>
                </div>
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/8 px-4 py-3 text-right">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300/70">Score rating</div>
                  <div className="mt-1 text-xl font-semibold text-emerald-300">{sessionSummary.ScoreRating}</div>
                </div>
              </div>
              <div className="grid gap-5 xl:grid-cols-2">
                <article className="bond-document">
                  <div className="bond-document-label">Final analysis</div>
                  <p>{sessionSummary.FinalAnalysis}</p>
                </article>
                <article className="bond-document">
                  <div className="bond-document-label">Operation summary</div>
                  <p>{sessionSummary.Summary}</p>
                </article>
              </div>
              <div className="mt-6">
                <div className="bond-kicker mb-3">SIMULATION CHRONICLE</div>
                <div className="grid gap-2">
                  {sessionLog.map((log, i) => (
                    <div key={i} className="bond-history-row">
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      <p>{log.action || 'Initial deployment'}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={resetSimulation} className="bond-button primary mt-6">Start New Simulation</button>
            </section>
          ) : simulation ? (
            <>
              <AudioNarrationControl
                actor={selectedActor}
                simulation={simulation}
                isNarrationEnabled={isNarrationEnabled}
                onToggleNarrationMode={setIsNarrationEnabled}
              />

              <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-4">
                  <article className="bond-narrative-card scene">
                    <div className="bond-document-label">01 // Scene narrative</div>
                    <p>{simulation.narrative}</p>
                  </article>
                  <article className="bond-narrative-card actor">
                    <div className="bond-document-label">02 // Actor personality reaction</div>
                    <p>{simulation.actorReaction}</p>
                  </article>
                  <article className="bond-narrative-card causal">
                    <div className="bond-document-label">03 // Causal impact & plot deviation</div>
                    <p>{simulation.causalImpact}</p>
                  </article>
                </div>

                <aside className="space-y-4 xl:sticky xl:top-[88px] xl:self-start">
                  <div className="grid grid-cols-3 gap-2 xl:grid-cols-1">
                    <div className="bond-side-metric">
                      <span>Enemy readiness</span>
                      <strong className="text-[#e7a56e]">{simulation.enemyReadiness}</strong>
                    </div>
                    <div className="bond-side-metric">
                      <span>Physical integrity</span>
                      <strong className="text-emerald-300">{simulation.physicalIntegrity}</strong>
                    </div>
                    <div className="bond-side-metric">
                      <span>Branch history</span>
                      <strong className="text-[#9ab9d5]">{history.length} actions</strong>
                    </div>
                  </div>

                  <div className="bond-panel p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <div className="bond-kicker">DECISION CONSOLE</div>
                        <h3 className="mt-1 text-base font-semibold text-white">Bond's next move</h3>
                      </div>
                      <Target className="h-5 w-5 text-[#c8a96b]" />
                    </div>
                    <div className="space-y-2">
                      {simulation.choices?.map((choice: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => runSimulation(choice)}
                          disabled={loading}
                          className="bond-choice group"
                        >
                          <span className="bond-choice-number">0{idx + 1}</span>
                          <span className="min-w-0 flex-1 text-left">{choice}</span>
                          <ChevronRight className="h-4 w-4 shrink-0 text-[#c8a96b] transition-transform group-hover:translate-x-1" />
                        </button>
                      ))}
                    </div>

                    <div className="my-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6f6b64]">
                      <span className="h-px flex-1 bg-white/8" />
                      Custom directive
                      <span className="h-px flex-1 bg-white/8" />
                    </div>

                    <textarea
                      className="bond-textarea"
                      rows={4}
                      placeholder="Write Bond's custom action..."
                      value={customAction}
                      onChange={(e) => setCustomAction(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        if (customAction.trim()) {
                          runSimulation(customAction);
                          setCustomAction('');
                        }
                      }}
                      disabled={loading || !customAction.trim()}
                      className="bond-button primary mt-3 w-full"
                    >
                      {loading ? 'Simulating…' : 'Execute Custom Action'}
                    </button>
                  </div>

                  <button onClick={endSession} disabled={loading} className="bond-button danger w-full">
                    End Session & Get Summary
                  </button>
                </aside>
              </section>
            </>
          ) : (
            <section className="bond-panel bond-launch relative min-h-[440px] overflow-hidden p-6 sm:p-10">
              <div className="bond-launch-rings" aria-hidden="true" />
              <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center py-12 text-center">
                <div className="bond-agent-seal">007</div>
                <div className="bond-kicker mt-6">SIMULATION READY</div>
                <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
                  Deploy {selectedActor.name} into {selectedFilm.title}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[#aaa69d]">{selectedFilm.initialObjective}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-[#aaa69d]">
                  <span className="bond-hero-tag">Personality locked</span>
                  <span className="bond-hero-tag">Universe loaded</span>
                  <span className="bond-hero-tag">Causal engine armed</span>
                </div>
                <button onClick={() => runSimulation('Initialize Scene 1')} disabled={loading} className="bond-launch-button mt-8">
                  <span>{loading ? 'Initializing…' : 'Start Simulation'}</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </section>
          )}

          <footer className="flex flex-col gap-3 rounded-2xl border border-white/6 bg-black/15 px-4 py-3 text-xs text-[#77736c] sm:flex-row sm:items-center">
            <button onClick={resetSimulation} className="inline-flex items-center gap-2 font-semibold text-[#aaa69d] transition hover:text-white">
              <RefreshCw className="h-3.5 w-3.5" /> Reset simulation
            </button>
            <span className="hidden h-4 w-px bg-white/8 sm:block" />
            <span>Engine Core <b className="font-semibold text-[#d7d2c8]">Active</b> · Layers 1, 2 & 3 fully operational</span>
            <span className="sm:ml-auto">{selectedActor.name} // {selectedFilm.title} // {history.length + 1} active branch</span>
          </footer>
        </section>
      </main>

      <SaveManagerModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        currentSaveData={{
          actorId: selectedActor.id,
          filmId: selectedFilm.id,
          simulation,
          sessionLog,
          sessionSummary,
          history,
          treeNodes,
          activeNodeId,
        }}
        onLoadSave={loadSaveSlot}
      />

      <CausalBranchTreeModal
        isOpen={isTreeModalOpen}
        onClose={() => setIsTreeModalOpen(false)}
        treeNodes={treeNodes}
        activeNodeId={activeNodeId}
        onJumpToNode={jumpToNode}
      />
    </div>
  );
}
