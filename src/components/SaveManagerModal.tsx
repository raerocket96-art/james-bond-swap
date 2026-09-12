import { useState, useEffect, type ChangeEvent } from 'react';
import { SaveSlot } from '../types';
import { Save, Download, Upload, Trash2, CheckCircle2, Clock } from 'lucide-react';

interface SaveManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSaveData: Omit<SaveSlot, 'id' | 'name' | 'timestamp'>;
  onLoadSave: (save: SaveSlot) => void;
}

const LOCAL_STORAGE_KEY = 'bond_simulator_saves_v1';
const AUTOSAVE_KEY = 'bond_simulator_autosave_v1';

export default function SaveManagerModal({
  isOpen,
  onClose,
  currentSaveData,
  onLoadSave
}: SaveManagerModalProps) {
  const [saves, setSaves] = useState<SaveSlot[]>([]);
  const [autosave, setAutosave] = useState<SaveSlot | null>(null);
  const [slotName, setSlotName] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadSavesFromStorage();
  }, [isOpen]);

  const loadSavesFromStorage = () => {
    try {
      const rawSaves = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (rawSaves) {
        setSaves(JSON.parse(rawSaves));
      }
      const rawAutosave = localStorage.getItem(AUTOSAVE_KEY);
      if (rawAutosave) {
        setAutosave(JSON.parse(rawAutosave));
      }
    } catch (err) {
      console.error('Failed to load saves from storage:', err);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const saveToSlot = (customName?: string) => {
    const nameToUse = customName || slotName.trim() || `Operation Save #${saves.length + 1}`;
    const newSave: SaveSlot = {
      id: `save-${Date.now()}`,
      name: nameToUse,
      timestamp: Date.now(),
      ...currentSaveData
    };

    const updated = [newSave, ...saves];
    setSaves(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setSlotName('');
    showNotification(`Saved "${nameToUse}" successfully!`);
  };

  const deleteSave = (id: string) => {
    const updated = saves.filter(s => s.id !== id);
    setSaves(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    showNotification('Save deleted');
  };

  const exportSaveToFile = (save: SaveSlot) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(save, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `007_Sim_${save.name.replace(/\s+/g, '_')}_${new Date(save.timestamp).toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Save exported to file');
  };

  const importSaveFromFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.actorId && parsed.filmId) {
            const importedSave: SaveSlot = {
              ...parsed,
              id: `imported-${Date.now()}`,
              name: parsed.name ? `[Imported] ${parsed.name}` : `Imported Save ${new Date().toLocaleTimeString()}`,
              timestamp: Date.now()
            };
            const updated = [importedSave, ...saves];
            setSaves(updated);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            showNotification('File imported successfully!');
          } else {
            alert('Invalid save file format');
          }
        } catch (err) {
          alert('Error parsing JSON save file');
        }
      };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#14161c] border border-[#2d3139] rounded-lg w-full max-w-2xl text-mono text-xs flex flex-col max-h-[85vh] shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-[#2d3139] flex justify-between items-center bg-[#0d0e0f]">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm uppercase">
            <Save className="w-4 h-4" />
            <span>007 MI6 Save File Manager & Archive</span>
          </div>
          <button onClick={onClose} className="text-[#8e9299] hover:text-white font-bold px-2 py-1">✕</button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {notification && (
            <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 p-2 rounded flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>{notification}</span>
            </div>
          )}

          {/* Quick Manual Save */}
          <div className="bg-[#0a0b0d] p-3 rounded border border-[#2d3139] space-y-2">
            <span className="text-[#8e9299] font-bold uppercase text-[10px] block">Create New Save Slot</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Operation / Save Name..."
                value={slotName}
                onChange={(e) => setSlotName(e.target.value)}
                className="bg-[#1a1c23] border border-[#2d3139] text-white p-2 rounded flex-1 text-xs outline-none focus:border-sky-500"
              />
              <button
                onClick={() => saveToSlot()}
                disabled={!currentSaveData.simulation && currentSaveData.history.length === 0}
                className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold px-4 rounded flex items-center gap-1 text-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Game</span>
              </button>
            </div>
          </div>

          {/* Import / Export Controls */}
          <div className="flex justify-between items-center bg-[#0a0b0d] p-3 rounded border border-[#2d3139]">
            <span className="text-[#8e9299] font-bold uppercase text-[10px]">Import External Save File</span>
            <label className="cursor-pointer bg-[#1a1c23] hover:bg-[#252832] border border-[#2d3139] text-sky-400 px-3 py-1.5 rounded flex items-center gap-1 text-xs font-bold">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload JSON</span>
              <input type="file" accept=".json" onChange={importSaveFromFile} className="hidden" />
            </label>
          </div>

          {/* Autosave Slot */}
          {autosave && (
            <div className="space-y-1">
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Automatic Background Autosave</span>
              <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                    <span>Autosave (Active Session)</span>
                  </div>
                  <div className="text-[10px] text-[#8e9299] mt-0.5">
                    {new Date(autosave.timestamp).toLocaleString()} • {autosave.history.length} turns
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { onLoadSave(autosave); onClose(); }}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1.5 rounded text-xs"
                  >
                    Load Autosave
                  </button>
                  <button
                    onClick={() => exportSaveToFile(autosave)}
                    className="bg-[#1a1c23] hover:bg-[#252832] border border-[#2d3139] text-white p-1.5 rounded"
                    title="Export Autosave"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Saved Games List */}
          <div className="space-y-2">
            <span className="text-[10px] text-[#8e9299] font-bold uppercase tracking-wider block">Saved Operational Archives ({saves.length})</span>
            {saves.length === 0 ? (
              <div className="text-center py-6 text-[#8e9299] bg-[#0a0b0d] rounded border border-[#2d3139]">
                No manual save files created yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {saves.map((save) => (
                  <div key={save.id} className="bg-[#0a0b0d] border border-[#2d3139] p-3 rounded flex items-center justify-between hover:border-sky-500/50 transition">
                    <div>
                      <div className="text-white font-bold text-xs">{save.name}</div>
                      <div className="text-[10px] text-[#8e9299] mt-0.5 flex gap-3">
                        <span>{new Date(save.timestamp).toLocaleString()}</span>
                        <span>• {save.history?.length || 0} Causal Branches</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { onLoadSave(save); onClose(); }}
                        className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-3 py-1.5 rounded text-xs"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => exportSaveToFile(save)}
                        className="bg-[#1a1c23] hover:bg-[#252832] border border-[#2d3139] text-sky-400 p-1.5 rounded"
                        title="Download JSON File"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSave(save.id)}
                        className="bg-[#1a1c23] hover:bg-red-900/50 border border-[#2d3139] text-red-400 p-1.5 rounded"
                        title="Delete Save"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#2d3139] bg-[#0d0e0f] flex justify-end">
          <button onClick={onClose} className="px-4 py-1.5 bg-[#1a1c23] hover:bg-[#252832] border border-[#2d3139] text-white font-bold rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
