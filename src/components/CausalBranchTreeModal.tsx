import { useState } from 'react';
import { CausalNode } from '../types';
import { GitBranch, MapPin, ShieldAlert, Sparkles, ArrowRight, CornerDownRight, RotateCcw, Clock } from 'lucide-react';

interface CausalBranchTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  treeNodes: Record<string, CausalNode>;
  activeNodeId: string | null;
  onJumpToNode: (nodeId: string) => void;
}

export default function CausalBranchTreeModal({
  isOpen,
  onClose,
  treeNodes,
  activeNodeId,
  onJumpToNode
}: CausalBranchTreeModalProps) {
  const [selectedPreviewId, setSelectedPreviewId] = useState<string | null>(activeNodeId);

  if (!isOpen) return null;

  // Find root nodes (nodes with parentId === null)
  const nodesList = Object.values(treeNodes);
  const rootNodes = nodesList.filter(n => n.parentId === null);

  // Get active path IDs to highlight active timeline
  const activePathSet = new Set<string>();
  let currId = activeNodeId;
  while (currId && treeNodes[currId]) {
    activePathSet.add(currId);
    currId = treeNodes[currId].parentId;
  }

  const previewNode = selectedPreviewId ? treeNodes[selectedPreviewId] : (activeNodeId ? treeNodes[activeNodeId] : null);

  // Helper to render tree recursively
  const renderTreeNode = (node: CausalNode, isLastChild: boolean = true) => {
    const isActive = node.id === activeNodeId;
    const isSelected = node.id === selectedPreviewId;
    const isInActivePath = activePathSet.has(node.id);
    const uniqueChildIds = Array.from(new Set(node.childrenIds || []));
    const children = uniqueChildIds
      .map(cid => treeNodes[cid])
      .filter(Boolean);

    return (
      <div key={node.id} className="flex flex-col items-start relative">
        {/* Node card */}
        <div className="flex items-center gap-2 group">
          <div
            onClick={() => setSelectedPreviewId(node.id)}
            className={`cursor-pointer p-3 rounded-lg border text-xs font-mono transition-all duration-200 min-w-[220px] max-w-[280px] shadow-lg relative ${
              isActive
                ? 'bg-sky-950/90 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)] ring-2 ring-sky-500/50'
                : isSelected
                ? 'bg-[#1e222b] border-amber-500/80 text-white shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : isInActivePath
                ? 'bg-[#14161c] border-sky-700/60 text-sky-200 hover:border-sky-500'
                : 'bg-[#0d0e0f] border-[#2d3139] text-[#a0a5b0] hover:border-[#424754] hover:text-white'
            }`}
          >
            {/* Header / Badges */}
            <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-[#2d3139]/80">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-sky-300' : 'text-[#8e9299]'}`}>
                Depth {node.depth} {node.depth === 0 ? '• Initial' : ''}
              </span>
              {isActive && (
                <span className="bg-sky-500/20 text-sky-300 text-[9px] px-1.5 py-0.5 rounded font-bold border border-sky-400/40 uppercase animate-pulse">
                  ACTIVE TIMELINE
                </span>
              )}
            </div>

            {/* Action title */}
            <div className="font-bold text-xs truncate text-white mb-1" title={node.actionTaken}>
              {node.depth === 0 ? '🎬 ' + node.actionTaken : '⚡ ' + node.actionTaken}
            </div>

            {/* Scene title */}
            <div className="text-[11px] text-[#8e9299] truncate font-sans">
              {node.simulation?.sceneTitle || node.title}
            </div>

            {/* Children count indicator if branching */}
            {children.length > 1 && (
              <div className="mt-2 flex items-center gap-1 text-[9px] text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/30">
                <GitBranch className="w-3 h-3" />
                <span>{children.length} Causal Branches Diverge Here</span>
              </div>
            )}
          </div>

          {/* Quick Jump Action Button on Node */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onJumpToNode(node.id);
              setSelectedPreviewId(node.id);
            }}
            title="Jump to this decision point"
            className={`p-2 rounded border text-xs font-bold transition flex items-center gap-1 ${
              isActive
                ? 'bg-sky-600 text-white border-sky-400 opacity-80 cursor-default'
                : 'bg-[#1a1c23] hover:bg-sky-600 border-[#2d3139] hover:border-sky-400 text-sky-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden group-hover:inline uppercase">Jump</span>
          </button>
        </div>

        {/* Children Render */}
        {children.length > 0 && (
          <div className="pl-6 pt-3 space-y-3 relative border-l-2 border-[#2d3139] ml-4 mt-1">
            {children.map((child, idx) => (
              <div key={`branch-${child.id}`} className="relative">
                {/* Horizontal branch line connector */}
                <div className="absolute -left-[24px] top-4 w-5 h-0.5 bg-[#2d3139]" />
                {renderTreeNode(child, idx === children.length - 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-[#111213] border border-[#c8a96b]/15 rounded-2xl w-full max-w-6xl h-[88vh] font-mono text-xs flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Top Navigation */}
        <div className="p-4 border-b border-[#2d3139] bg-[#0d0e0f] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-950 border border-sky-500/40 text-sky-400 rounded-lg">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Causal Branch Map & Temporal Decision Tree
              </h2>
              <p className="text-[10px] text-[#8e9299]">
                Visualizing divergence points in current timeline • Select any scene node to rewind and try alternate choices.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8e9299] hover:text-white font-bold px-3 py-1.5 bg-[#1a1c23] hover:bg-[#252832] border border-[#2d3139] rounded transition"
          >
            ✕ Close Tree View
          </button>
        </div>

        {/* Main Body Grid: Left = Visual Tree, Right = Selected Node Preview */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left Canvas: Interactive Node Tree */}
          <div className="md:col-span-7 lg:col-span-8 p-6 overflow-auto bg-[#0a0b0d] custom-scrollbar border-r border-[#2d3139]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] text-[#8e9299] uppercase font-bold tracking-widest flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Timeline Hierarchy ({nodesList.length} Total Nodes)</span>
              </span>
              <div className="flex gap-4 text-[10px]">
                <span className="flex items-center gap-1 text-sky-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span> Active Node
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Selected Preview
                </span>
              </div>
            </div>

            {rootNodes.length === 0 ? (
              <div className="text-center py-16 text-[#8e9299]">
                No causal nodes generated yet. Start a simulation to construct timeline branches.
              </div>
            ) : (
              <div className="space-y-6 pb-12">
                {rootNodes.map(root => renderTreeNode(root))}
              </div>
            )}
          </div>

          {/* Right Panel: Selected Node Inspector & Quantum Rewind */}
          <div className="md:col-span-5 lg:col-span-4 p-5 bg-[#14161c] overflow-y-auto flex flex-col justify-between">
            {previewNode ? (
              <div className="space-y-4">
                <div className="border-b border-[#2d3139] pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                      Scene Inspection (Depth {previewNode.depth})
                    </span>
                    {previewNode.id === activeNodeId && (
                      <span className="bg-sky-500 text-black text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                        Current Active
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {previewNode.simulation?.sceneTitle || previewNode.title}
                  </h3>
                  <p className="text-[10px] text-sky-400 mt-1 font-semibold flex items-center gap-1">
                    <CornerDownRight className="w-3 h-3 text-sky-400" />
                    <span>Action Taken: {previewNode.actionTaken}</span>
                  </p>
                </div>

                {/* Narrative Excerpt */}
                <div className="bg-[#0a0b0d] p-3 rounded border border-[#2d3139] space-y-2">
                  <span className="text-[10px] text-[#8e9299] font-bold uppercase block border-b border-[#2d3139] pb-1">
                    [SCENE RECAP]
                  </span>
                  <p className="text-white text-[11px] leading-relaxed max-h-40 overflow-y-auto font-sans">
                    {previewNode.simulation?.narrative || 'Opening scene deployment context.'}
                  </p>
                </div>

                {/* Causal Impact & Deviation */}
                {previewNode.simulation?.causalImpact && (
                  <div className="bg-red-950/20 border border-red-500/30 p-3 rounded space-y-1">
                    <span className="text-[10px] text-red-400 font-bold uppercase block">
                      [CAUSAL IMPACT]
                    </span>
                    <p className="text-red-200/90 text-[11px] leading-relaxed font-sans">
                      {previewNode.simulation.causalImpact}
                    </p>
                  </div>
                )}

                {/* Tactical Status at Node */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-[#0a0b0d] p-2 rounded border border-[#2d3139]">
                    <span className="text-[#8e9299] font-bold block mb-0.5">Location</span>
                    <span className="text-amber-400 font-bold">{previewNode.simulation?.currentLocation || 'Unknown'}</span>
                  </div>
                  <div className="bg-[#0a0b0d] p-2 rounded border border-[#2d3139]">
                    <span className="text-[#8e9299] font-bold block mb-0.5">Plot Deviation</span>
                    <span className="text-sky-400 font-bold">{previewNode.simulation?.plotDeviationScore || '0.0%'}</span>
                  </div>
                </div>

                {/* Available choices divergence */}
                {previewNode.simulation?.choices && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[#8e9299] font-bold uppercase block">
                      Action Options Diverging From Here:
                    </span>
                    <ul className="space-y-1">
                      {previewNode.simulation.choices.map((c: string, idx: number) => (
                        <li key={idx} className="bg-[#0a0b0d] p-2 rounded border border-[#2d3139] text-[10px] text-white">
                          <span className="text-sky-400 font-bold">Option {idx + 1}:</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-[#8e9299]">
                Select any node on the tree to inspect its causal consequences.
              </div>
            )}

            {/* Jump Button */}
            {previewNode && (
              <div className="pt-4 border-t border-[#2d3139]">
                <button
                  onClick={() => {
                    onJumpToNode(previewNode.id);
                    onClose();
                  }}
                  disabled={previewNode.id === activeNodeId}
                  className={`w-full py-3 px-4 rounded font-bold text-xs uppercase flex items-center justify-center gap-2 transition ${
                    previewNode.id === activeNodeId
                      ? 'bg-[#1a1c23] text-[#8e9299] cursor-not-allowed border border-[#2d3139]'
                      : 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>
                    {previewNode.id === activeNodeId
                      ? 'Currently Active Timeline'
                      : 'Jump to this Decision Point'}
                  </span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
