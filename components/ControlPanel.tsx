
import React from 'react';
import { AntennaParams } from '../types';

interface ControlPanelProps {
  params: AntennaParams;
  setParams: React.Dispatch<React.SetStateAction<AntennaParams>>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ params, setParams }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
        <i className="fa-solid fa-sliders text-blue-600"></i>
        Array Configuration
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Frequency (GHz)
          </label>
          <input
            type="number"
            name="frequencyGhz"
            value={params.frequencyGhz}
            onChange={handleChange}
            step="0.1"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Element Spacing (mm)
          </label>
          <input
            type="number"
            name="spacingMm"
            value={params.spacingMm}
            onChange={handleChange}
            step="0.1"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Scan Angle (deg)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              name="scanAngleDeg"
              min="-90"
              max="90"
              value={params.scanAngleDeg}
              onChange={handleChange}
              className="flex-grow accent-blue-600"
            />
            <input
              type="number"
              name="scanAngleDeg"
              value={params.scanAngleDeg}
              onChange={handleChange}
              className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-center"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Number of Elements (N)
          </label>
          <input
            type="number"
            name="numElements"
            value={params.numElements}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Phase Quantization Bits
          </label>
          <select
            name="bits"
            value={params.bits}
            onChange={(e) => setParams(p => ({ ...p, bits: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(b => (
              <option key={b} value={b}>{b}-bit ({Math.pow(2, b)} levels)</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
