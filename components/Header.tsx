import React from 'react';
import { Building2, Activity } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              AI CitySense
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                Beta
              </span>
            </h1>
            <p className="text-xs text-slate-400">Civic Issue Detector</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-slate-300">
                <Activity className="h-4 w-4 mr-1 text-green-400" />
                <span>System Operational</span>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;