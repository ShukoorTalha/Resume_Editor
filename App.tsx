import React, { useState } from 'react';
import { ResumeEditor } from './components/ResumeEditor';
import { ResumePreview } from './components/ResumePreview';
import { initialResumeState, ResumeData } from './types';
import { FileDown, Layout, Printer, Loader2 } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ToastProvider, useToast } from './context/ToastContext';

const AppContent: React.FC = () => {
  const [resumeData, setResumeData] = useLocalStorage<ResumeData>('resume-data', initialResumeState);
  const [view, setView] = useState<'both' | 'edit' | 'preview'>('both');
  const [isDownloading, setIsDownloading] = useState(false);
  const { showToast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    setIsDownloading(true);
    // @ts-ignore
    if (!window.html2pdf) {
      showToast('PDF library not loaded', 'error');
      setIsDownloading(false);
      return;
    }

    const opt = {
      margin: 0,
      filename: `${resumeData.profile.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore
      await window.html2pdf().set(opt).from(element).save();
      showToast('Resume downloaded successfully!', 'success');
    } catch (error) {
      console.error('PDF generation failed:', error);
      showToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white p-2 rounded-lg">
            <Layout size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Resume Builder</h1>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setView('edit')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'edit' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Edit
          </button>
           <button 
            onClick={() => setView('both')}
            className={`hidden md:block px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'both' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Split View
          </button>
           <button 
            onClick={() => setView('preview')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'preview' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Preview
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
            <span className="hidden sm:inline">Download PDF</span>
          </button>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 flex">
          {/* Editor Panel */}
          <div 
            className={`
              flex-1 overflow-y-auto bg-slate-50 border-r border-slate-200 transition-all duration-300 print:hidden
              ${view === 'preview' ? 'hidden' : 'block'}
              ${view === 'both' ? 'w-1/2 max-w-xl' : 'w-full max-w-2xl mx-auto'}
            `}
          >
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Content Editor</h2>
                  <p className="text-sm text-slate-500">Update your resume information below.</p>
                </div>
              </div>
              <ResumeEditor data={resumeData} onChange={setResumeData} />
            </div>
          </div>

          {/* Preview Panel */}
          <div 
            className={`
              flex-1 bg-slate-200/50 overflow-y-auto transition-all duration-300 flex justify-center p-8 print:p-0 print:bg-white print:block
              ${view === 'edit' ? 'hidden' : 'block'}
              ${view === 'both' ? 'w-1/2' : 'w-full'}
            `}
          >
            <div className="print:w-full">
              <ResumePreview data={resumeData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}