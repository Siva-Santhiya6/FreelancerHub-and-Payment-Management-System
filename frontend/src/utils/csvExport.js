/**
 * Utility to download formatted CSV data in browser with Excel UTF-8 BOM support
 * @param {Object} options
 * @param {string} options.filename - File name to save
 * @param {Array<string>} options.headers - Column headers
 * @param {Array<Array<any>>} options.rows - Matrix of cell values
 * @param {Array<string>} [options.metadata] - Optional title / metadata lines at top
 */
export function exportToCSV({ filename = 'export.csv', headers = [], rows = [], metadata = [] }) {
  const escapeCell = (cell) => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const csvLines = [];

  // Preamble metadata
  if (metadata && metadata.length > 0) {
    metadata.forEach(line => csvLines.push(line));
    csvLines.push('');
  }

  // Header row
  if (headers && headers.length > 0) {
    csvLines.push(headers.map(escapeCell).join(','));
  }

  // Data rows
  if (rows && rows.length > 0) {
    rows.forEach(row => {
      csvLines.push(row.map(escapeCell).join(','));
    });
  }

  // UTF-8 BOM for Microsoft Excel compatibility
  const csvContent = '\uFEFF' + csvLines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
