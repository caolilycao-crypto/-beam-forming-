
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { CalculationResults } from '../types';

interface AntennaChartProps {
  results: CalculationResults;
}

const AntennaChart: React.FC<AntennaChartProps> = ({ results }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[500px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Array Factor Pattern (dB)</h2>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-600 rounded-full"></span> Ideal</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Quantized</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={results.pattern} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="theta" 
            label={{ value: 'Angle (deg)', position: 'insideBottom', offset: -5 }} 
            domain={[-90, 90]}
            type="number"
          />
          <YAxis 
            label={{ value: 'Normalized Gain (dB)', angle: -90, position: 'insideLeft' }} 
            domain={[-40, 0]} 
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(2)} dB`]}
            labelFormatter={(label: number) => `Angle: ${label.toFixed(2)}°`}
          />
          <Line 
            type="monotone" 
            dataKey="idealGainDb" 
            stroke="#2563eb" 
            strokeWidth={2} 
            dot={false} 
            name="Ideal Phase"
          />
          <Line 
            type="monotone" 
            dataKey="quantizedGainDb" 
            stroke="#ef4444" 
            strokeDasharray="5 5" 
            strokeWidth={2} 
            dot={false} 
            name={`${results.phases.length > 0 ? 'Quantized' : ''}`}
          />
          <ReferenceLine y={results.sllIdeal} stroke="#2563eb" strokeDasharray="3 3" label={{ position: 'right', value: `SLL ${results.sllIdeal.toFixed(1)}dB`, fill: '#2563eb', fontSize: 10 }} />
          <ReferenceLine y={results.sllQuant} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: `SLL ${results.sllQuant.toFixed(1)}dB`, fill: '#ef4444', fontSize: 10 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AntennaChart;
