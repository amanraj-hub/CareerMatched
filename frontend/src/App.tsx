import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AuthModal } from './pages/AuthModal';
import { LandingPage } from './pages/LandingPage';

// Individual Portal Pages
import { IndividualDashboard } from './pages/individual/IndividualDashboard';
import { ResumeManager } from './pages/individual/ResumeManager';
import { MatchAnalyzer } from './pages/individual/MatchAnalyzer';
import { LearningPath } from './pages/individual/LearningPath';
import { AnalysisHistory } from './pages/individual/AnalysisHistory';

// Company Portal Pages
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { JobManager } from './pages/company/JobManager';
import { BulkScreening } from './pages/company/BulkScreening';
import { CandidateLeaderboard } from './pages/company/CandidateLeaderboard';
import { CandidateComparison } from './pages/company/CandidateComparison';
import { CandidateDetailModal } from './pages/company/CandidateDetailModal';

import { ResumeAnalysis } from './types';

export const App: React.FC = () => {
  const { user, loading } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Navigation payload states
  const [matchResumeId, setMatchResumeId] = useState<number | undefined>();
  const [learningAnalysis, setLearningAnalysis] = useState<ResumeAnalysis | null>(null);
  const [historySelectedId, setHistorySelectedId] = useState<number | null>(null);

  const [targetJobId, setTargetJobId] = useState<number | null>(null);
  const [compareCandidateIds, setCompareCandidateIds] = useState<number[]>([]);
  const [detailCandidateId, setDetailCandidateId] = useState<number | null>(null);

  // Automatically direct user to their respective dashboard when logged in
  useEffect(() => {
    if (user && currentTab === 'landing') {
      setCurrentTab(user.role === 'company' ? 'comp-dashboard' : 'ind-dashboard');
    }
  }, [user]);

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSelectTab = (tab: string) => {
    if (!user && tab !== 'landing') {
      setAuthModalOpen(true);
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreRole = (role: 'individual' | 'company') => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      setCurrentTab(role === 'company' ? 'comp-dashboard' : 'ind-dashboard');
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-100">
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Landing Page */}
        {currentTab === 'landing' && (
          <LandingPage
            onGetStarted={() => setAuthModalOpen(true)}
            onExploreRole={handleExploreRole}
          />
        )}

        {/* ----------------- INDIVIDUAL PORTAL ----------------- */}
        {currentTab === 'ind-dashboard' && (
          <IndividualDashboard
            onNavigate={(tab, analysisId) => {
              if (analysisId) setHistorySelectedId(analysisId);
              handleSelectTab(tab);
            }}
          />
        )}

        {currentTab === 'ind-resumes' && (
          <ResumeManager
            onSelectForMatch={(resumeId) => {
              setMatchResumeId(resumeId);
              setCurrentTab('ind-match');
            }}
            showToast={showToast}
          />
        )}

        {currentTab === 'ind-match' && (
          <MatchAnalyzer
            initialResumeId={matchResumeId}
            onNavigateToLearning={(analysis) => {
              setLearningAnalysis(analysis);
              setCurrentTab('ind-learning');
            }}
            showToast={showToast}
          />
        )}

        {currentTab === 'ind-learning' && (
          <LearningPath
            currentAnalysis={learningAnalysis}
            onNavigateToMatch={() => setCurrentTab('ind-match')}
          />
        )}

        {currentTab === 'ind-history' && (
          <AnalysisHistory
            selectedAnalysisId={historySelectedId}
            onOpenLearning={(analysis) => {
              setLearningAnalysis(analysis);
              setCurrentTab('ind-learning');
            }}
            showToast={showToast}
          />
        )}

        {/* ----------------- COMPANY PORTAL ----------------- */}
        {currentTab === 'comp-dashboard' && (
          <CompanyDashboard
            onNavigate={(tab, jobId) => {
              if (jobId) setTargetJobId(jobId);
              handleSelectTab(tab);
            }}
          />
        )}

        {currentTab === 'comp-jobs' && (
          <JobManager
            onNavigateToScreening={(jobId) => {
              setTargetJobId(jobId);
              setCurrentTab('comp-screening');
            }}
            onNavigateToLeaderboard={(jobId) => {
              setTargetJobId(jobId);
              setCurrentTab('comp-leaderboard');
            }}
            showToast={showToast}
          />
        )}

        {currentTab === 'comp-screening' && (
          <BulkScreening
            initialJobId={targetJobId}
            onNavigateToLeaderboard={(jobId) => {
              setTargetJobId(jobId);
              setCurrentTab('comp-leaderboard');
            }}
            showToast={showToast}
          />
        )}

        {currentTab === 'comp-leaderboard' && (
          <CandidateLeaderboard
            initialJobId={targetJobId}
            onCompareCandidates={(ids) => {
              setCompareCandidateIds(ids);
              setCurrentTab('comp-compare');
            }}
            onOpenCandidateDetail={(candidateId) => setDetailCandidateId(candidateId)}
            showToast={showToast}
          />
        )}

        {currentTab === 'comp-compare' && (
          <CandidateComparison
            candidateIds={compareCandidateIds}
            onBack={() => setCurrentTab('comp-leaderboard')}
            showToast={showToast}
          />
        )}
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          showToast('success', 'Logged in successfully!');
        }}
      />

      {/* Candidate Deep-Dive Dossier Modal */}
      {detailCandidateId && (
        <CandidateDetailModal
          candidateId={detailCandidateId}
          onClose={() => setDetailCandidateId(null)}
          onStatusUpdated={() => {}}
          showToast={showToast}
        />
      )}

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
};
