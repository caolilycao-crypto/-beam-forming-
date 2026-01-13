
import React from 'react';
import { CalculationResults } from '../types';

interface MetricsSummaryProps {
  results: CalculationResults;
}

const MetricsSummary: React.FC<MetricsSummaryProps> = ({ results }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Beam Offset</p>
        <p className={`text-2xl font-mono ${Math.abs(results.beamOffset) > 1 ? 'text-amber-600' : 'text-emerald-600'}`}>
          {results.beamOffset.toFixed(2)}°
        </p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Sidelobe Level (Q)</p>
        <p className="text-2xl font-mono text-slate-800">
          {results.sllQuant.toFixed(1)} dB
        </p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Main Beam (Q)</p>
        <p className="text-2xl font-mono text-slate-800">
          {results.mainQuant.toFixed(2)}°
        </p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">d / λ</p>
        <p className={`text-2xl font-mono ${results.dOverLambda > 0.5 ? 'text-red-500' : 'text-slate-800'}`}>
          {results.dOverLambda.toFixed(3)}
        </p>
      </div>
    </div>
  );
};

export default MetricsSummary;
