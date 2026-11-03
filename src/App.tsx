import React from 'react';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzeEventPage } from './pages/AnalyzeEventPage';
import { AttackGraphPage } from './pages/AttackGraphPage';
import { TimelinePage } from './pages/TimelinePage';
import { PrivacyCenterPage } from './pages/PrivacyCenterPage';
import { DemoModePage } from './pages/DemoModePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, notification } = useSecurity();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing': return <LandingPage />;
      case 'dashboard': return <DashboardPage />;
      case 'analyze': return <AnalyzeEventPage />;
      case 'graph': return <AttackGraphPage />;
      case 'timeline': return <TimelinePage />;
      case 'privacy': return <PrivacyCenterPage />;
      case 'demo': return <DemoModePage />;
      case 'analytics': return <AnalyticsPage />;
      case 'settings': return <SettingsPage />;
      default: return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-grid bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto items-start">
        
        {/* Sidebar (Visible on non-landing pages or as main nav) */}
        {activeTab !== 'landing' && <Sidebar />}

        {/* Page Main Content Area */}
        <main className="flex-1 min-w-0 p-4 lg:p-8">
          {renderActivePage()}
        </main>

      </div>

      {/* Auth Modal */}
      <AuthModal />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
          <div className={`glass-panel px-4 py-3 rounded-xl border flex items-center gap-3 shadow-2xl ${
            notification.type === 'success' ? 'border-emerald-500/50 bg-slate-900/95 text-emerald-300' :
            notification.type === 'error' ? 'border-rose-500/50 bg-slate-900/95 text-rose-300' :
            'border-cyan-500/50 bg-slate-900/95 text-cyan-300'
          }`}>
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {notification.type === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
            <span className="text-xs font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <SecurityProvider>
      <AppContent />
    </SecurityProvider>
  );
}
