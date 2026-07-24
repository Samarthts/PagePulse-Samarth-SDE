import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MetricCard } from './MetricCard';
import { StatusCard } from './StatusCard';
import { MetaDescriptionCard } from './MetaDescriptionCard';
import { ResponseHeadersModal } from './ResponseHeadersModal';
import { 
  Clock, Heading, ImageOff, FileText, Globe, 
  ShieldCheck, ShieldAlert, Copy, Download, RotateCcw, 
  Check, Server, ExternalLink, FileDown
} from 'lucide-react';

export const AuditDashboard = React.memo(({
  report,
  targetUrl,
  copied,
  onCopyJson,
  onDownloadPdf,
  onDownloadJson,
  onReset
}) => {
  const [showHeadersModal, setShowHeadersModal] = useState(false);

  if (!report) return null;

  // Extract variables with default fallback safe bounds
  const {
    status = 200,
    response_time = '0 ms',
    title,
    meta_description,
    h1_count = 0,
    missing_alt_images = 0,
    word_count = 0,
    favicon,
    https_status = true,
    response_headers = {},
    seo_score = {},
    timestamp
  } = report;

  const totalScore = seo_score.total ?? 85;

  // Response Time Badge
  const getLatencyBadge = (timeStr) => {
    const ms = parseInt(timeStr) || 0;
    if (ms < 400) return { text: 'Fast Latency', type: 'success' };
    if (ms < 1200) return { text: 'Moderate Latency', type: 'warning' };
    return { text: 'Slow Latency', type: 'danger' };
  };
  const latencyBadge = getLatencyBadge(response_time);

  // H1 Tag Badge
  const getH1Badge = (count) => {
    if (count === 1) return { text: 'Optimal (1 H1)', type: 'success' };
    if (count === 0) return { text: 'Missing H1', type: 'danger' };
    return { text: `Multiple (${count} H1s)`, type: 'warning' };
  };
  const h1Badge = getH1Badge(h1_count);

  // Alt Images Badge
  const getAltBadge = (count) => {
    if (count === 0) return { text: '100% Alt Coverage', type: 'success' };
    if (count <= 3) return { text: `${count} missing`, type: 'warning' };
    return { text: `${count} missing`, type: 'danger' };
  };
  const altBadge = getAltBadge(missing_alt_images);

  // SEO Score Gauge Color
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
    if (score >= 65) return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
    return 'text-rose-400 border-rose-500/40 bg-rose-950/20';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.02
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-[1340px] mx-auto my-4 sm:my-6 px-4 sm:px-6 lg:px-8"
    >
      
      {/* Overview Header Banner Panel */}
      <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 shadow-2xl mb-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          
          {/* Target Domain, Favicon & Metadata */}
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center shrink-0 shadow-lg p-2">
              {favicon ? (
                <img
                  src={favicon}
                  alt="Favicon"
                  className="w-7 h-7 object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <Globe className="w-6 h-6 text-indigo-400" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate max-w-xl">
                  {title || targetUrl}
                </h2>
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-indigo-300 transition-colors p-1 rounded-lg hover:bg-white/5"
                  title="Visit Target Website"
                  aria-label="Visit Target Website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="mt-1 flex items-center gap-2.5 flex-wrap text-xs text-slate-300 font-mono">
                <span className="truncate max-w-md text-slate-300">{targetUrl}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold">
                  {https_status ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  {https_status ? 'HTTPS Secure' : 'HTTP Only'}
                </span>
                {timestamp && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Overall SEO Health Score Badge */}
          <div className={`px-5 py-3.5 rounded-xl border flex items-center gap-3.5 ${getScoreColor(totalScore)} shadow-xl shrink-0`}>
            <div className="flex flex-col text-right">
              <span className="text-[11px] uppercase font-bold tracking-wider opacity-90">SEO Health Score</span>
              <span className="text-xs font-semibold text-slate-200">{seo_score.grade || 'Audit Rating'}</span>
            </div>
            <div className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-black/60 border border-white/10 font-extrabold text-xl text-white font-mono">
              {totalScore}
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHeadersModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
            >
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              <span>Response Headers</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Download PDF Report Action Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onDownloadPdf}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-white" />
              <span>Download PDF Report</span>
            </motion.button>

            <button
              onClick={onCopyJson}
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={onDownloadJson}
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-300" />
              <span>Download JSON</span>
            </button>

            <button
              onClick={onReset}
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
              title="Reset Audit"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Audit</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grid Row 1: Status Code, Response Latency, H1 Hierarchy, Alt Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: HTTP Status Code (Color-Coded StatusCard) */}
        <motion.div variants={itemVariants}>
          <StatusCard status={status} />
        </motion.div>

        {/* Metric 2: Response Time */}
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Response Time"
            value={response_time}
            subtitle="Network fetch latency"
            icon={Clock}
            badge={latencyBadge.text}
            badgeType={latencyBadge.type}
            tooltip="Elapsed time in milliseconds to receive target HTML payload."
          />
        </motion.div>

        {/* Metric 3: H1 Heading Tags */}
        <motion.div variants={itemVariants}>
          <MetricCard
            title="H1 Heading Tags"
            value={`${h1_count} Tag${h1_count === 1 ? '' : 's'}`}
            subtitle="Page structural hierarchy"
            icon={Heading}
            badge={h1Badge.text}
            badgeType={h1Badge.type}
            tooltip="SEO standard recommendation is exactly 1 H1 tag per page."
          />
        </motion.div>

        {/* Metric 4: Missing Alt Images */}
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Missing Image Alt"
            value={`${missing_alt_images} Image${missing_alt_images === 1 ? '' : 's'}`}
            subtitle="Accessibility & image SEO"
            icon={ImageOff}
            badge={altBadge.text}
            badgeType={altBadge.type}
            tooltip="Number of image <img> tags missing descriptive alt text."
          />
        </motion.div>

      </div>

      {/* Grid Row 2: Page Title, Expandable Meta Description, Word Count */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        
        {/* Page Title Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <MetricCard
            title="Page Title"
            value={title}
            subtitle={title ? `${title.length} characters` : 'Title tag missing'}
            icon={Globe}
            badge={title ? (title.length >= 30 && title.length <= 60 ? 'Optimal Length' : 'Title Present') : 'Missing'}
            badgeType={title ? 'success' : 'danger'}
            tooltip="HTML <title> tag text displayed in browser tabs and Google search snippet headings."
            highlight
          />
        </motion.div>

        {/* Expandable Meta Description Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <MetaDescriptionCard description={meta_description} />
        </motion.div>

        {/* Word Count Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <MetricCard
            title="Approx Word Count"
            value={word_count ? word_count.toLocaleString() : '0'}
            subtitle="Extracted body text volume"
            icon={FileText}
            badge={word_count > 300 ? 'Substantial Content' : 'Thin Content'}
            badgeType={word_count > 300 ? 'success' : 'warning'}
            tooltip="Estimated total word count extracted from body HTML text content."
          />
        </motion.div>

      </div>

      {/* Response Headers Modal Drawer */}
      <ResponseHeadersModal
        isOpen={showHeadersModal}
        onClose={() => setShowHeadersModal(false)}
        headers={response_headers}
        targetUrl={targetUrl}
      />
    </motion.div>
  );
});

AuditDashboard.displayName = 'AuditDashboard';
