import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Download, FileText, Database, Calendar, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { analyticsApi } from '@/lib/analytics-api';

export default function ExportData() {
  const [exportType, setExportType] = useState('orders');
  const [format, setFormat] = useState('json');
  const [timeRange, setTimeRange] = useState('30d');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const exportTypes = [
    { value: 'orders', label: 'Orders Data', description: 'Export all order information and analytics' },
    { value: 'messages', label: 'Messages Data', description: 'Export customer messages and chat analytics' }
  ];

  const formats = [
    { value: 'json', label: 'JSON', description: 'JavaScript Object Notation' },
    { value: 'csv', label: 'CSV', description: 'Comma Separated Values' },
    { value: 'xlsx', label: 'Excel', description: 'Microsoft Excel format (JSON for now)' }
  ];

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus(null);
    
    try {
      // Get business ID and auth token
      const businessId = localStorage.getItem('business_id') || 
                        localStorage.getItem('businessId') || 
                        localStorage.getItem('current_business_id');
      
      const token = localStorage.getItem('accessToken');
      
      if (!businessId) {
        throw new Error('Business ID not found. Please log in again.');
      }
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Call the appropriate export API
      const endpoint = `/api/analytics/${exportType}/${businessId}/export?period=${timeRange}&format=${format}`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Export failed with status ${response.status}`);
      }
      
      // Get the filename from Content-Disposition header or create one
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `analytics-${exportType}-${timeRange}.${format}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setExportStatus({
        type: 'success',
        message: `Successfully exported ${exportType} data as ${format.toUpperCase()}`
      });
      
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Export failed with unknown error'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Export Configuration</h3>
        
        {/* Export Status */}
        {exportStatus && (
          <div className={`mb-6 p-4 rounded-lg border ${
            exportStatus.type === 'success' 
              ? 'border-green-500/30 bg-green-500/10' 
              : 'border-red-500/30 bg-red-500/10'
          }`}>
            <div className="flex items-center gap-3">
              {exportStatus.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
              <p className={`text-sm ${
                exportStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {exportStatus.message}
              </p>
            </div>
          </div>
        )}
        
        {/* Data Type Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-300 mb-3 block">Data Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exportTypes.map((type) => (
              <div
                key={type.value}
                onClick={() => setExportType(type.value)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  exportType === type.value
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Database className="h-5 w-5 text-purple-400" />
                  <span className="font-medium text-white">{type.label}</span>
                </div>
                <p className="text-sm text-gray-400">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-300 mb-3 block">Export Format</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formats.map((fmt) => (
              <div
                key={fmt.value}
                onClick={() => setFormat(fmt.value)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  format === fmt.value
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <span className="font-medium text-white">{fmt.label}</span>
                </div>
                <p className="text-sm text-gray-400">{fmt.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Time Range Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-300 mb-3 block">Time Range</label>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Export Data
            </>
          )}
        </button>
      </Card>

      {/* Export Guidelines */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Export Guidelines</h3>
        <div className="space-y-3 text-gray-300">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
            <p className="text-sm">Exported data includes all relevant analytics within the selected time range</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
            <p className="text-sm">CSV format is recommended for spreadsheet analysis</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
            <p className="text-sm">JSON format preserves complete data structure for programmatic use</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
            <p className="text-sm">Large datasets may take several minutes to generate</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
            <p className="text-sm">Excel format downloads as JSON for now (proper Excel support coming soon)</p>
          </div>
        </div>
      </Card>

      {/* Export Preview */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Export Preview</h3>
        <div className="bg-gray-700/30 p-4 rounded-lg">
          <div className="text-sm text-gray-300 space-y-2">
            <p><span className="text-white font-medium">Data Type:</span> {exportTypes.find(t => t.value === exportType)?.label}</p>
            <p><span className="text-white font-medium">Format:</span> {formats.find(f => f.value === format)?.label}</p>
            <p><span className="text-white font-medium">Time Range:</span> {timeRanges.find(r => r.value === timeRange)?.label}</p>
            <p><span className="text-white font-medium">Filename:</span> analytics-{exportType}-{timeRange}.{format}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}