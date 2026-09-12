import { MapPin, ShieldAlert, FileText, Activity } from 'lucide-react';

interface ActiveStatusWidgetProps {
  currentLocation?: string;
  knownThreats?: string[];
  intelGathered?: string[];
  initialLocation?: string;
}

export default function ActiveStatusWidget({
  currentLocation,
  knownThreats = [],
  intelGathered = [],
  initialLocation
}: ActiveStatusWidgetProps) {
  const displayLocation = currentLocation || initialLocation || 'Classification Pending (Deployment Area)';

  return (
    <section id="bond-active-status-widget" className="bond-panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/7 px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-emerald-400/15 bg-emerald-400/7 text-emerald-300">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <div className="bond-kicker">TACTICAL RECON</div>
            <h3 className="mt-0.5 text-sm font-semibold text-white">007 Active Status</h3>
          </div>
        </div>
        <span className="bond-live-dot"><i /> live feed</span>
      </div>

      <div className="grid gap-px bg-white/6 md:grid-cols-3">
        <div className="bg-[#111214]/95 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#c8a96b]">
            <MapPin className="h-4 w-4" /> Current location
          </div>
          <div className="text-[15px] font-semibold leading-5 text-white">{displayLocation}</div>
        </div>

        <div className="bg-[#111214]/95 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#d4776f]">
            <ShieldAlert className="h-4 w-4" /> Known threats
          </div>
          {knownThreats.length > 0 ? (
            <ul className="space-y-2">
              {knownThreats.slice(0, 4).map((threat, idx) => (
                <li key={idx} className="flex gap-2 text-[12px] leading-4 text-[#c8b8b4]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b95750]" />
                  <span>{threat}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-[12px] italic text-[#777168]">No immediate hostiles acquired.</div>
          )}
        </div>

        <div className="bg-[#111214]/95 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#82b79a]">
            <FileText className="h-4 w-4" /> Intel gathered
          </div>
          {intelGathered.length > 0 ? (
            <ul className="space-y-2">
              {intelGathered.slice(0, 4).map((intel, idx) => (
                <li key={idx} className="flex gap-2 text-[12px] leading-4 text-[#b9c9bf]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5b9d76]" />
                  <span>{intel}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-[12px] italic text-[#777168]">Reconnaissance in progress…</div>
          )}
        </div>
      </div>
    </section>
  );
}
