import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { BOND_ACTORS } from '../data/bondPersonalities';
import { BondActor } from '../types';
import { ScanSearch } from 'lucide-react';

export default function ActorComparator() {
  const [actor1, setActor1] = useState<BondActor>(BOND_ACTORS[0]);
  const [actor2, setActor2] = useState<BondActor>(BOND_ACTORS[5]);

  const attributes = ['coldness', 'ruthlessness', 'compassion', 'charm', 'confidence', 'violenceThreshold', 'moralValue', 'carelessness'];
  const data = attributes.map(attr => ({
    subject: attr === 'violenceThreshold' ? 'Violence' : attr === 'moralValue' ? 'Moral' : attr.charAt(0).toUpperCase() + attr.slice(1),
    A: actor1.attributes[attr as keyof typeof actor1.attributes],
    B: actor2.attributes[attr as keyof typeof actor2.attributes],
  }));

  return (
    <section className="bond-panel overflow-hidden">
      <div className="bond-panel-heading">
        <div>
          <span className="bond-kicker">COMPARATIVE ANALYSIS</span>
          <h2 className="text-base font-semibold text-white">Bond profile radar</h2>
        </div>
        <ScanSearch className="h-5 w-5 text-[#c8a96b]" />
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="bond-field-label">Profile A</label>
            <select className="bond-select mt-1.5" value={actor1.id} onChange={(e) => setActor1(BOND_ACTORS.find(a => a.id === e.target.value) || BOND_ACTORS[0])}>
              {BOND_ACTORS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="bond-field-label">Profile B</label>
            <select className="bond-select mt-1.5" value={actor2.id} onChange={(e) => setActor2(BOND_ACTORS.find(a => a.id === e.target.value) || BOND_ACTORS[0])}>
              {BOND_ACTORS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4 h-60 rounded-xl border border-white/6 bg-black/15 p-1">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="69%" data={data}>
              <PolarGrid stroke="rgba(255,255,255,.10)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#7f796f', fontSize: 9 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name={actor1.name} dataKey="A" stroke="#8faec4" fill="#6d95b1" fillOpacity={0.18} strokeWidth={2} />
              <Radar name={actor2.name} dataKey="B" stroke="#c8a96b" fill="#c8a96b" fillOpacity={0.16} strokeWidth={2} />
              <Tooltip
                contentStyle={{ background: '#0d0e0f', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, fontSize: 11, color: '#eee' }}
                labelStyle={{ color: '#c8a96b' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.11em]">
          <span className="flex items-center gap-1.5 text-[#94b1c6]"><i className="h-2 w-2 rounded-full bg-[#7f9fb7]" />{actor1.name}</span>
          <span className="flex items-center gap-1.5 text-[#ceb276]"><i className="h-2 w-2 rounded-full bg-[#c8a96b]" />{actor2.name}</span>
        </div>
      </div>
    </section>
  );
}
