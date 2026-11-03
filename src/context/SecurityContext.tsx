import React, { createContext, useContext, useState, useEffect } from 'react';
import { SecurityEvent, AttackChain, AnalysisResult, PrivacySettings, AuditLogEntry } from '../../server/types.js';
import { api } from '../services/api.js';

export type NavTab = 'landing' | 'dashboard' | 'analyze' | 'graph' | 'timeline' | 'privacy' | 'demo' | 'analytics' | 'settings';

interface User {
  id: string;
  email: string;
  name: string;
}

interface SecurityContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  dashboardData: any;
  events: SecurityEvent[];
  chains: AttackChain[];
  privacySettings: PrivacySettings;
  auditLogs: AuditLogEntry[];
  activeAnalysis: AnalysisResult | null;
  setActiveAnalysis: (res: AnalysisResult | null) => void;
  isAnalyzing: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  refreshData: () => Promise<void>;
  analyzeInput: (payload: any) => Promise<AnalysisResult | any>;
  loadScenario: (scenarioId: string) => Promise<any>;
  purgeData: () => Promise<void>;
  updatePrivacy: (settings: Partial<PrivacySettings>) => Promise<void>;
  loginDemoUser: () => void;
  logout: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('landing');
  const [user, setUser] = useState<User | null>({ id: 'usr-1', email: 'secops@shieldx-agent.org', name: 'Security Analyst' });
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [chains, setChains] = useState<AttackChain[]>([]);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataMinimization: true,
    anonymizeEvents: true,
    noRawMessageStorage: true,
    localPreprocessing: true,
    retentionDays: 30,
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const refreshData = async () => {
    const dash = await api.getDashboard();
    if (dash) setDashboardData(dash);

    const evRes = await api.getEvents();
    if (evRes?.events) setEvents(evRes.events);

    const chRes = await api.getChains();
    if (chRes?.chains) setChains(chRes.chains);

    const priv = await api.getPrivacy();
    if (priv) {
      if (priv.settings) setPrivacySettings(priv.settings);
      if (priv.auditLogs) setAuditLogs(priv.auditLogs);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const analyzeInput = async (payload: any) => {
    setIsAnalyzing(true);
    try {
      const result = await api.analyzeEvent(payload);
      if (result) {
        if (result.isMultiEvent) {
          setActiveAnalysis(result.latestResult);
        } else {
          setActiveAnalysis(result);
        }
        await refreshData();
        showNotification('success', 'AI & Feature Correlation analysis complete.');
        return result;
      }
    } catch (err) {
      showNotification('error', 'Failed to complete analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadScenario = async (scenarioId: string) => {
    setIsAnalyzing(true);
    try {
      const result = await api.loadDemoScenario(scenarioId);
      if (result) {
        setActiveAnalysis(result.analysis);
        await refreshData();
        setActiveTab('analyze');
        showNotification('success', `Scenario loaded: ${result.title}`);
        return result;
      }
    } catch (err) {
      showNotification('error', 'Scenario load error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const purgeData = async () => {
    const res = await api.purgeUserData();
    if (res?.success) {
      await refreshData();
      setActiveAnalysis(null);
      showNotification('info', 'All security events & privacy logs purged.');
    }
  };

  const updatePrivacy = async (settings: Partial<PrivacySettings>) => {
    const res = await api.updatePrivacySettings(settings);
    if (res?.settings) {
      setPrivacySettings(res.settings);
      showNotification('success', 'Privacy preferences updated.');
    }
  };

  const loginDemoUser = () => {
    setUser({ id: 'usr-demo', email: 'reviewer@shieldx.ai', name: 'Demo Evaluator' });
    setIsAuthModalOpen(false);
    setActiveTab('dashboard');
    showNotification('success', 'Logged in as Demo Evaluator');
  };

  const logout = () => {
    setUser(null);
    setActiveTab('landing');
    showNotification('info', 'Logged out');
  };

  return (
    <SecurityContext.Provider value={{
      activeTab,
      setActiveTab,
      user,
      setUser,
      dashboardData,
      events,
      chains,
      privacySettings,
      auditLogs,
      activeAnalysis,
      setActiveAnalysis,
      isAnalyzing,
      isAuthModalOpen,
      setIsAuthModalOpen,
      notification,
      showNotification,
      refreshData,
      analyzeInput,
      loadScenario,
      purgeData,
      updatePrivacy,
      loginDemoUser,
      logout
    }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const ctx = useContext(SecurityContext);
  if (!ctx) throw new Error('useSecurity must be used within SecurityProvider');
  return ctx;
};
