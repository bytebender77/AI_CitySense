
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardList, HardHat, Info, Activity, BrainCircuit, ChevronDown, ChevronUp, User, Users, Wrench, FileText, Copy, Check, BarChart3, TrendingUp } from 'lucide-react';
import { CivicIssueAnalysis } from '../types';

interface AnalysisDisplayProps {
  analysis: CivicIssueAnalysis | null;
  history?: CivicIssueAnalysis[];
  loading: boolean;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, history = [], loading }) => {
  const [isDeepAnalysisOpen, setIsDeepAnalysisOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (analysis?.complaintLetter) {
      navigator.clipboard.writeText(analysis.complaintLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper to calculate statistics
  const getSessionStats = () => {
    // Combine history with current analysis if history update hasn't propagated yet or for robustness
    // App.tsx updates history, so validHistory should be history.
    const validHistory = history.length > 0 ? history : (analysis ? [analysis] : []);
    
    if (validHistory.length === 0) return null;

    const count = validHistory.length;
    
    // Get unique issue types detected in this session
    const uniqueIssues = Array.from(new Set(validHistory.map(h => h.issueType)));
    
    // Find highest severity score seen
    const maxSeverity = validHistory.reduce((max, curr) => Math.max(max, curr.severityScore), 0);

    return { count, issues: uniqueIssues, maxSeverity };
  };

  const stats = getSessionStats();

  const getCategoryConfig = (category: string) => {
    const cat = category.toLowerCase();
    
    if (cat.includes('pothole')) {
        return { style: 'bg-orange-100 text-orange-800 border-orange-200', icon: null };
    }
    if (cat.includes('garbage') || cat.includes('waste') || cat.includes('trash')) {
        return { style: 'bg-stone-100 text-stone-800 border-stone-200', icon: null }; // Stone for brown/earthy
    }
    if (cat.includes('water') || cat.includes('drain') || cat.includes('flood') || cat.includes('leak')) {
        return { style: 'bg-blue-100 text-blue-800 border-blue-200', icon: null };
    }
    if (cat.includes('signal') || cat.includes('light')) {
        return { style: 'bg-red-100 text-red-800 border-red-200', icon: null };
    }
    if (cat.includes('infrastructure') || cat.includes('building') || cat.includes('road') || cat.includes('bridge') || cat.includes('damaged')) {
        return { style: 'bg-slate-100 text-slate-700 border-slate-200', icon: null };
    }
    if (cat.includes('safe') || cat.includes('hazard') || cat.includes('danger') || cat.includes('accident') || cat.includes('security')) {
        return { style: 'bg-red-50 text-red-700 border-red-200', icon: <AlertTriangle className="w-3 h-3 mr-1" /> };
    }
    
    return { style: 'bg-purple-100 text-purple-800 border-purple-200', icon: null };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-8 h-full min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <h3 className="mt-6 text-lg font-medium text-slate-900">AI Analysis in Progress</h3>
        <p className="mt-2 text-slate-500 max-w-xs">
          Identifying infrastructure issues, assessing severity score, and generating evidence summary...
        </p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-8 h-full min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
          <ClipboardList className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Waiting for Data</h3>
        <p className="mt-2 text-slate-500 max-w-sm">
          Upload media and click Analyze to see results
        </p>
      </div>
    );
  }

  // Variables mapping
  const detected_issue = analysis.issueType;
  const severity_score = analysis.severityScore;
  const evidence_summary = analysis.evidenceSummary;
  const citizen_actions = analysis.citizenActions;
  const authority_actions = analysis.authorityActions;
  const complaint_letter = analysis.complaintLetter;
  const session_insights = analysis.sessionInsights;
  const categoryConfig = getCategoryConfig(detected_issue);

  // Visual helper for score color and label based on specific requirements
  const getSeverityConfig = (score: number) => {
    if (score >= 9) return { 
      barColor: 'bg-red-600', 
      textColor: 'text-red-600', 
      badgeBg: 'bg-red-50',
      label: 'Critical' 
    };
    if (score >= 7) return { 
      barColor: 'bg-orange-500', 
      textColor: 'text-orange-600', 
      badgeBg: 'bg-orange-50',
      label: 'High' 
    };
    if (score >= 4) return { 
      barColor: 'bg-yellow-500', 
      textColor: 'text-yellow-600', 
      badgeBg: 'bg-yellow-50',
      label: 'Moderate' 
    };
    return { 
      barColor: 'bg-green-500', 
      textColor: 'text-green-600', 
      badgeBg: 'bg-green-50',
      label: 'Low' 
    };
  };
  
  const config = getSeverityConfig(severity_score);
  // Ensure width is at least visible (10%)
  const scoreWidth = `${Math.max(severity_score * 10, 5)}%`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full">
      <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          🛠️ Detection Results
        </h2>
        {/* Issue Category Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border flex items-center ${categoryConfig.style}`}>
          {categoryConfig.icon}
          {detected_issue}
        </span>
      </div>

      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        
        {/* Severity Score Section */}
        <div>
          <div className="flex items-end justify-between mb-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Severity Score</label>
            <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${config.badgeBg} ${config.textColor}`}>
                    {config.label}
                </span>
                <span className={`text-2xl font-bold ${config.textColor}`}>
                  {severity_score}<span className="text-sm text-slate-400 font-normal">/10</span>
                </span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${config.barColor}`}
              style={{ width: scoreWidth }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
             <span>Low (1-3)</span>
             <span>Moderate (4-6)</span>
             <span>High (7-8)</span>
             <span>Critical (9-10)</span>
          </div>
        </div>

        {/* Evidence Summary Section */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
            <Info className="w-3 h-3" /> Evidence Summary
          </label>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 text-sm leading-relaxed">
            {evidence_summary}
          </div>
        </div>

        {/* Recommended Actions Cards */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-3">
            <CheckCircle2 className="w-3 h-3" /> ✅ Recommended Actions
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* For Citizens */}
            <div className="bg-blue-50/50 rounded-lg border border-blue-100 p-4">
              <div className="flex items-center gap-2 mb-2 text-blue-800">
                <Users className="w-4 h-4" />
                <h4 className="text-sm font-semibold">For Citizens</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {citizen_actions}
              </p>
            </div>
            
            {/* For Authorities */}
            <div className="bg-slate-100/50 rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2 text-slate-800">
                <Wrench className="w-4 h-4" />
                <h4 className="text-sm font-semibold">For Authorities</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {authority_actions}
              </p>
            </div>
          </div>
        </div>

        {/* Generated Complaint Report */}
        <div>
           <div className="flex items-center justify-between mb-3">
             <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
               <FileText className="w-3 h-3" /> 📝 Generated Complaint Report
             </label>
             <button
               onClick={handleCopy}
               className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
             >
               {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
               {copied ? 'Copied!' : 'Copy to Clipboard'}
             </button>
           </div>
           <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 rounded-l-lg"></div>
              {complaint_letter}
           </div>
        </div>

        {/* Deep Analysis Collapsible Section */}
        <div className="border-t border-slate-100 pt-4">
          <button
            onClick={() => setIsDeepAnalysisOpen(!isDeepAnalysisOpen)}
            className="flex items-center justify-between w-full text-left group focus:outline-none"
          >
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 cursor-pointer group-hover:text-blue-600 transition-colors">
              <BrainCircuit className="w-3 h-3" /> 🧠 Deep Analysis
            </label>
            {isDeepAnalysisOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            )}
          </button>

          {isDeepAnalysisOpen && (
            <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {analysis.deepAnalysis}
            </div>
          )}
        </div>

        {/* Session Insights Section */}
        {stats && (
            <div className="border-t border-slate-100 pt-6">
                 <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-4">
                    <BarChart3 className="w-3 h-3" /> 📊 Session Tracking
                 </label>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                     {/* Total Analyses */}
                     <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-100 flex flex-col justify-center">
                         <div className="text-2xl font-bold text-slate-800">{stats.count}</div>
                         <div className="text-xs text-slate-500 uppercase tracking-wide">Total Analyses</div>
                     </div>
                     
                     {/* Issues Detected */}
                     <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-100 flex flex-col justify-center">
                         <div className="text-sm font-semibold text-slate-800 line-clamp-2 px-1" title={stats.issues.join(", ")}>
                             {stats.issues.length > 0 ? stats.issues.join(", ") : "None"}
                         </div>
                         <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">Issues Detected</div>
                     </div>
                     
                     {/* Highest Severity */}
                     <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-100 flex flex-col justify-center">
                         <div className="text-2xl font-bold text-slate-800">
                             {stats.maxSeverity}<span className="text-sm font-normal text-slate-400">/10</span>
                         </div>
                         <div className="text-xs text-slate-500 uppercase tracking-wide">Highest Severity</div>
                     </div>
                 </div>
                 
                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 flex gap-3">
                     <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                     <p className="text-sm text-blue-900 leading-relaxed italic">
                         "{session_insights}"
                     </p>
                 </div>
            </div>
        )}

        {/* Additional Details (Department) */}
        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-100">
            <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</label>
                <div className="flex items-center gap-2 mt-1">
                    <HardHat className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-800">{analysis.department}</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisDisplay;
