import React from 'react';
import { useAudit } from './hooks/useAudit';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorAlert } from './components/ErrorAlert';
import { AuditDashboard } from './components/AuditDashboard';
import { Footer } from './components/Footer';
import { ProgressBar } from './components/ProgressBar';

export function App() {
  const {
    url,
    setUrl,
    loading,
    loadingStep,
    report,
    error,
    copied,
    recentSearches,
    analyze,
    handleCopyJson,
    handleDownloadPdf,
    handleDownloadJson,
    resetAudit,
    formatUrlInput
  } = useAudit();

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0A0A0A] text-slate-100 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Top Animated Progress Bar when analyzing */}
      <ProgressBar loading={loading} />

      {/* Radiant Background Glow Blobs */}
      <div className="glow-blob-purple" />
      <div className="glow-blob-blue" />
      <div className="glow-blob-pink" />

      {/* Top Glass Navbar */}
      <Navbar onReset={resetAudit} />

      {/* Main Content Container */}
      <main className="flex-1 z-10">
        <HeroSection
          url={url}
          setUrl={setUrl}
          onAnalyze={analyze}
          loading={loading}
          recentSearches={recentSearches}
          formatUrlInput={formatUrlInput}
          hasReport={Boolean(report)}
        />

        {/* Loading State with Skeleton Loaders */}
        {loading && <LoadingSkeleton step={loadingStep} />}

        {/* Categorized Error Diagnostic Alert */}
        {!loading && error && (
          <ErrorAlert error={error} onRetry={() => analyze(url)} />
        )}

        {/* Audit Results Dashboard */}
        {!loading && report && (
          <AuditDashboard
            report={report}
            targetUrl={formatUrlInput(url)}
            copied={copied}
            onCopyJson={handleCopyJson}
            onDownloadPdf={handleDownloadPdf}
            onDownloadJson={handleDownloadJson}
            onReset={resetAudit}
          />
        )}
      </main>

      {/* SaaS Footer */}
      <Footer />
    </div>
  );
}

export default App;
