
import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AntennaParams, CalculationResults } from './types';
import { calculateAntennaArray } from './services/antennaService';
import ControlPanel from './components/ControlPanel';
import AntennaChart from './components/AntennaChart';
import MetricsSummary from './components/MetricsSummary';
import PhaseTable from './components/PhaseTable';

const App: React.FC = () => {
  const [params, setParams] = useState<AntennaParams>({
    frequencyGhz: 29.9,
    spacingMm: 4.9,
    scanAngleDeg: 55.5,
    numElements: 16,
    bits: 6
  });

  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const results: CalculationResults = useMemo(() => {
    return calculateAntennaArray(params);
  }, [params]);

  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Analyze this Phased Array Antenna configuration:
        - Frequency: ${params.frequencyGhz} GHz
        - Element Spacing: ${params.spacingMm} mm
        - Scan Angle: ${params.scanAngleDeg}°
        - Number of Elements: ${params.numElements}
        - Phase Bits: ${params.bits}

        Calculated Results:
        - d/λ: ${results.dOverLambda.toFixed(3)}
        - Sidelobe Level (Quantized): ${results.sllQuant.toFixed(1)} dB
        - Beam Offset: ${results.beamOffset.toFixed(2)}°

        Please provide a concise technical insight (2-3 sentences) about potential grating lobes, quantization effects, and scan performance.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiAnalysis(response.text || 'No analysis available.');
    } catch (error) {
      console.error("AI Analysis failed", error);
      setAiAnalysis("Could not generate AI insights at this time.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-slate-900 text-white py-6 px-8 mb-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <i className="fa-solid fa-tower-broadcast text-2xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Phased Array Beamforming Simulator</h1>
              <p className="text-slate-400 text-sm">Quantized Phase Shifter & Array Factor Analysis</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={runAiAnalysis}
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <i className="fa-solid fa-spinner animate-spin"></i>
              ) : (
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              )}
              AI Insights
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* AI Insight Box */}
        {aiAnalysis && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl shadow-sm animate-in fade-in duration-500">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-brain text-blue-600 mt-1"></i>
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Gemini AI Analysis</p>
                <p className="text-blue-800 text-sm italic">{aiAnalysis}</p>
              </div>
              <button onClick={() => setAiAnalysis('')} className="text-blue-400 hover:text-blue-600 ml-auto">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-3 space-y-6">
            <ControlPanel params={params} setParams={setParams} />
            
            <div className="bg-slate-900 text-slate-100 p-6 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold mb-3 border-b border-slate-700 pb-2">Physics Reference</h3>
              <div className="space-y-3 text-xs opacity-90">
                <div className="flex justify-between">
                  <span>Wavelength (λ)</span>
                  <span>{(results.lambda * 1000).toFixed(2)} mm</span>
                </div>
                <div className="flex justify-between">
                  <span>Wave Number (k)</span>
                  <span>{((2 * Math.PI) / results.lambda).toFixed(1)} rad/m</span>
                </div>
                <div className="flex justify-between">
                  <span>Phase Step</span>
                  <span>{(360 / Math.pow(2, params.bits)).toFixed(2)}°</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-9">
            <MetricsSummary results={results} />
            
            <div className="grid grid-cols-1 gap-8">
              <AntennaChart results={results} />
              
              <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
                 <PhaseTable phases={results.phases} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-slate-400 text-sm">
        <p>© 2024 Phased Array Design Lab. Powered by Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;
