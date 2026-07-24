import { jsPDF } from 'jspdf';

/**
 * Generates an executive, SaaS-quality PDF audit report for Page Pulse
 * @param {Object} report Audit result payload
 * @param {string} targetUrl The target website URL
 */
export const generatePdfReport = (report, targetUrl) => {
  if (!report) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = 15;

  // Primary Palette
  const darkBg = [10, 10, 10];
  const primaryIndigo = [99, 102, 241];
  const textWhite = [255, 255, 255];
  const textDark = [30, 41, 59];
  const textMuted = [100, 116, 139];
  const borderGray = [226, 232, 240];

  // 1. Header Banner
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Brand Logo Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('PAGE PULSE', margin, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(165, 180, 252);
  doc.text('ENTERPRISE WEBSITE PERFORMANCE & SEO AUDIT REPORT', margin, 26);

  // Scan Timestamp & Domain Link
  const scanDate = report.timestamp ? new Date(report.timestamp).toLocaleString() : new Date().toLocaleString();
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`Target URL: ${targetUrl}`, margin, 34);
  doc.text(`Scanned: ${scanDate}`, pageWidth - margin - 50, 34);

  y = 52;

  // 2. Executive SEO Score Card Banner
  const totalScore = report.seo_score?.total ?? 85;
  const grade = report.seo_score?.grade || 'Audit Rating';

  // Box Background
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...borderGray);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 26, 3, 3, 'FD');

  // Score Number Circle/Box
  let scoreBg = [16, 185, 129]; // Emerald
  if (totalScore < 65) scoreBg = [244, 63, 94]; // Rose
  else if (totalScore < 85) scoreBg = [245, 158, 11]; // Amber

  doc.setFillColor(...scoreBg);
  doc.roundedRect(margin + 6, y + 4, 18, 18, 2, 2, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(String(totalScore), margin + 10, y + 16);

  // Title & Rating Text
  doc.setTextColor(...textDark);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  const siteTitle = report.title || targetUrl;
  const truncatedTitle = siteTitle.length > 55 ? siteTitle.substring(0, 52) + '...' : siteTitle;
  doc.text(truncatedTitle, margin + 30, y + 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textMuted);
  doc.text(`SEO Rating: ${grade} • Protocol: ${report.https_status ? 'HTTPS Secure' : 'HTTP Only'}`, margin + 30, y + 19);

  y += 34;

  // 3. Section Title: Key Performance & Structural Metrics
  doc.setTextColor(...textDark);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Core Performance & Structural Metrics', margin, y);
  y += 6;

  // Metric Table Setup
  const tableX = margin;
  const colWidths = [50, 45, 85];
  const rowHeight = 9;

  const metrics = [
    ['HTTP Status Code', String(report.status || 200), report.status >= 200 && report.status < 300 ? '200 OK (Standard Success)' : `HTTP Status ${report.status}`],
    ['Response Time', report.response_time || '0 ms', 'Network latency to receive target HTML payload'],
    ['H1 Tag Count', `${report.h1_count ?? 0} Tag(s)`, report.h1_count === 1 ? 'Optimal (Exactly 1 primary H1)' : `${report.h1_count} H1 tags detected`],
    ['Missing Image Alt', `${report.missing_alt_images ?? 0} Image(s)`, report.missing_alt_images === 0 ? '100% Alt Tag Coverage' : `${report.missing_alt_images} images missing alt text`],
    ['Word Count', String(report.word_count?.toLocaleString() || 0), report.word_count > 300 ? 'Substantial body content' : 'Thin text content volume']
  ];

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(tableX, y, colWidths[0] + colWidths[1] + colWidths[2], rowHeight, 'F');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text('METRIC', tableX + 3, y + 6);
  doc.text('VALUE', tableX + colWidths[0] + 3, y + 6);
  doc.text('AUDIT ASSESSMENT', tableX + colWidths[0] + colWidths[1] + 3, y + 6);
  y += rowHeight;

  // Table Rows
  metrics.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(tableX, y, colWidths[0] + colWidths[1] + colWidths[2], rowHeight, 'F');
    }
    doc.setDrawColor(...borderGray);
    doc.line(tableX, y + rowHeight, tableX + colWidths[0] + colWidths[1] + colWidths[2], y + rowHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...textDark);
    doc.text(row[0], tableX + 3, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryIndigo);
    doc.text(row[1], tableX + colWidths[0] + 3, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textMuted);
    doc.text(row[2], tableX + colWidths[0] + colWidths[1] + 3, y + 6);

    y += rowHeight;
  });

  y += 10;

  // 4. Section Title: Meta & Page Headings Breakdown
  doc.setTextColor(...textDark);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Page Metadata Summary', margin, y);
  y += 6;

  // Page Title Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...borderGray);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 16, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text('PAGE TITLE:', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textDark);
  const pTitle = report.title || 'Missing title tag';
  doc.text(pTitle.length > 75 ? pTitle.substring(0, 72) + '...' : pTitle, margin + 28, y + 6);

  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  doc.text(`Length: ${pTitle.length} characters (Recommended: 30-60 characters)`, margin + 4, y + 12);

  y += 20;

  // Meta Description Box
  const metaDesc = report.meta_description || 'Meta description tag is missing.';
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...borderGray);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 24, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text('META DESCRIPTION:', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textDark);
  const splitDesc = doc.splitTextToSize(metaDesc, pageWidth - margin * 2 - 8);
  doc.text(splitDesc.slice(0, 2), margin + 4, y + 12);

  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  doc.text(`Length: ${metaDesc.length} characters`, margin + 4, y + 20);

  y += 30;

  // 5. Section Title: Target Response Headers
  if (report.response_headers && Object.keys(report.response_headers).length > 0) {
    doc.setTextColor(...textDark);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Captured HTTP Response Headers', margin, y);
    y += 6;

    const headersList = Object.entries(report.response_headers).slice(0, 6);
    headersList.forEach(([key, val]) => {
      if (y > pageHeight - 25) return; // Stay on single page

      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
      doc.setDrawColor(...borderGray);
      doc.line(margin, y + 7, pageWidth - margin, y + 7);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryIndigo);
      doc.text(String(key).toUpperCase(), margin + 3, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textDark);
      const valStr = String(val);
      doc.text(valStr.length > 60 ? valStr.substring(0, 57) + '...' : valStr, margin + 55, y + 5);

      y += 7;
    });
  }

  // 6. Footer
  const footerY = pageHeight - 12;
  doc.setDrawColor(...borderGray);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textMuted);
  doc.text('Page Pulse © ' + new Date().getFullYear() + ' • Built for Digital Heroes Training Task', margin, footerY);

  doc.text('https://digitalheroesco.com', pageWidth - margin - 40, footerY);

  // Save File
  const filenameDomain = (report.title || 'website').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`${filenameDomain}_pagepulse_audit_report.pdf`);
};
