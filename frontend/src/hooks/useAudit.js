import { useState, useCallback, useEffect } from 'react';
import { auditWebsite } from '../services/api';
import { generatePdfReport } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';

const RECENT_SEARCHES_KEY = 'pagepulse_recent_audits';

export const useAudit = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent audit history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage read error
    }
  }, []);

  const saveToHistory = (scannedUrl, auditResult) => {
    try {
      const newEntry = {
        url: scannedUrl,
        title: auditResult.title || 'Untitled',
        status: auditResult.status,
        seoScore: auditResult.seo_score?.total || 0,
        timestamp: auditResult.timestamp || new Date().toISOString()
      };
      setRecentSearches(prev => {
        const filtered = prev.filter(item => item.url !== scannedUrl);
        const updated = [newEntry, ...filtered].slice(0, 5); // Keep top 5 recent
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch {
      // Ignore localStorage write error
    }
  };

  // URL normalization and validation helper
  const formatUrlInput = (inputUrl) => {
    let clean = inputUrl.trim();
    if (!clean) return '';
    if (!/^https?:\/\//i.test(clean)) {
      clean = 'https://' + clean;
    }
    return clean;
  };

  // Execute Audit request immediately without artificial delays
  const analyze = useCallback(async (targetUrlOverride) => {
    const targetUrl = targetUrlOverride || url;
    const cleanUrl = formatUrlInput(targetUrl);

    if (!cleanUrl) {
      setError({
        message: 'Empty URL',
        detail: 'Please enter a valid website URL (e.g. https://example.com) to perform an audit.'
      });
      return;
    }

    setLoading(true);
    setLoadingStep(1);
    setError(null);
    setReport(null);

    const stepTimer1 = setTimeout(() => setLoadingStep(2), 200);
    const stepTimer2 = setTimeout(() => setLoadingStep(3), 400);

    try {
      const data = await auditWebsite(cleanUrl);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      
      // Render IMMEDIATELY upon receiving response
      setReport(data);
      setLoading(false);
      setLoadingStep(0);
      saveToHistory(cleanUrl, data);

      // Fire celebration confetti if high SEO score
      if (data.seo_score?.total >= 85) {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
      setLoadingStep(0);
      setError({
        message: err.message || 'Audit Failed',
        detail: err.detail || err.message || 'Failed to complete website audit. Please verify the URL and try again.',
        statusCode: err.statusCode || 500
      });
    }
  }, [url]);

  const handleCopyJson = useCallback(() => {
    if (!report) return;
    navigator.clipboard.writeText(JSON.stringify(report, null, 2))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }, [report]);

  const handleDownloadPdf = useCallback(() => {
    if (!report) return;
    generatePdfReport(report, formatUrlInput(url));
  }, [report, url]);

  const handleDownloadJson = useCallback(() => {
    if (!report) return;
    const domain = report.title ? report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'pagepulse_audit';
    const filename = `${domain}_audit_report.json`;
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }, [report]);

  const resetAudit = useCallback(() => {
    setUrl('');
    setReport(null);
    setError(null);
    setLoading(false);
    setLoadingStep(0);
  }, []);

  return {
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
  };
};
