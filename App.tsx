
import React, { useState } from 'react';
import Header from './components/Header';
import IssueForm from './components/IssueForm';
import AnalysisDisplay from './components/AnalysisDisplay';
import { analyzeIssue } from './services/geminiService';
import { CivicIssueAnalysis, GeoLocation } from './types';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<CivicIssueAnalysis | null>(null);
  const [history, setHistory] = useState<CivicIssueAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (image: string | null, video: string | null, audio: string | null, text: string, location?: GeoLocation) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null); // Clear previous results

    try {
      // Pass the current history for context
      const result = await analyzeIssue(
        image, 
        video, 
        audio, 
        text, 
        history, 
        location ? { lat: location.latitude, lng: location.longitude } : undefined
      );
      
      setAnalysis(result);
      setHistory(prev => [...prev, result]);
    } catch (err) {
      console.error(err);
      setError("Analysis unavailable. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* App Subtitle */}
        <div className="text-center mb-8 sm:mb-10 max-w-3xl mx-auto">
          <p className="text-slate-500 text-base sm:text-lg">
            Upload a photo, video, audio, or text to detect and analyze civic infrastructure issues
          </p>
        </div>

        {/* Intro / Context */}
        <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">New Issue Report</h2>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
                Use AI to automatically categorize and assess infrastructure problems in your city.
            </p>
        </div>

        {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <IssueForm onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">How it works</h4>
                <ul className="text-xs text-blue-700 space-y-2 list-disc list-inside">
                    <li>Upload a clear photo of the issue.</li>
                    <li>Add a brief text description if needed.</li>
                    <li>The Gemini AI engine analyzes severity and type.</li>
                    <li>Results are formatted for city works dispatch.</li>
                </ul>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7 xl:col-span-8 h-full">
            <AnalysisDisplay analysis={analysis} history={history} loading={isAnalyzing} />
          </div>
          
        </div>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-xs text-slate-400">
                Powered by Google Gemini API • © {new Date().getFullYear()} AI CitySense
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
