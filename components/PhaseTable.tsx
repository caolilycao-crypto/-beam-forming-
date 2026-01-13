
import React from 'react';
import { PhaseData } from '../types';

interface PhaseTableProps {
  phases: PhaseData[];
}

const PhaseTable: React.FC<PhaseTableProps> = ({ phases }) => {
  const downloadCSV = () => {
    const headers = ['Element', 'Phase_Cont_rad', 'Phase_Quant_rad', 'Phase_Cont_deg', 'Phase_Quant_deg'];
    const rows = phases.map(p => [
      p.index,
      p.phaseContRad.toFixed(4),
      p.phaseQuantRad.toFixed(4),
      p.phaseContDeg.toFixed(2),
      p.phaseQuantDeg.toFixed(2)
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "antenna_phases.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Element Phase Distribution</h2>
        <button 
          onClick={downloadCSV}
          className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1"
        >
          <i className="fa-solid fa-download"></i> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="px-4 py-2">Element</th>
              <th className="px-4 py-2">Continuous (°)</th>
              <th className="px-4 py-2">Quantized (°)</th>
              <th className="px-4 py-2">Error (°)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {phases.map((p) => {
              const err = Math.abs(p.phaseContDeg - p.phaseQuantDeg) % 360;
              const displayErr = err > 180 ? 360 - err : err;
              return (
                <tr key={p.index} className="hover:bg-slate-50/50">
                  <td className="px-4 py-2 font-medium">{p.index}</td>
                  <td className="px-4 py-2 text-slate-600">{p.phaseContDeg.toFixed(1)}</td>
                  <td className="px-4 py-2 text-blue-600 font-semibold">{p.phaseQuantDeg.toFixed(1)}</td>
                  <td className={`px-4 py-2 ${displayErr > 5 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {displayErr.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PhaseTable;
