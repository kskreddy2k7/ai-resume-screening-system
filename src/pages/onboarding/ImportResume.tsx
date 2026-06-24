import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { extractTextFromFile } from '../../lib/extractor';
import { parseResumeText } from '../../lib/ai';

export default function ImportResume() {
  const navigate = useNavigate();
  const loadResume = useResumeStore(state => state.loadResume);
  const setRawText = useResumeStore(state => state.setRawText);
  const setViewMode = useResumeStore(state => state.setViewMode);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length === 0) {
        throw new Error("No text could be extracted from the file. Please ensure it's not an image-based PDF.");
      }
      
      // Save raw text and switch view mode to raw for manual verification later
      setRawText(text);
      setViewMode('raw');
      
      // Auto-extract and populate store
      const extractedData = await parseResumeText(text);
      loadResume(extractedData);
      
      // Navigate straight to workspace
      navigate('/app');
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to extract resume.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="min-h-screen bg-background p-8 flex flex-col">
      <button 
        onClick={() => navigate('/start')}
        className="flex items-center text-muted-foreground hover:text-foreground mb-8 self-start transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Upload your Resume</h1>
          <p className="text-muted-foreground">
            We will automatically extract your contact info, experience, education, and skills.
          </p>
        </div>

        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragging ? 'border-primary bg-primary/5 scale-105' : 'border-border hover:border-primary hover:bg-secondary/50'
          } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.docx,.txt"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          
          {isLoading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-lg font-semibold">Extracting data...</p>
              <p className="text-sm text-muted-foreground mt-2">This usually takes a few seconds.</p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <UploadCloud className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Drag and drop your file here</h3>
              <p className="text-muted-foreground mb-6">or click to browse from your computer</p>
              
              <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1"><File className="w-4 h-4" /> PDF</span>
                <span className="flex items-center gap-1"><File className="w-4 h-4" /> DOCX</span>
                <span className="flex items-center gap-1"><File className="w-4 h-4" /> TXT</span>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-start gap-3 w-full max-w-2xl">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Privacy Notice: Your resume is processed completely locally in your browser. No data is sent to external servers or stored permanently without your permission.
          </p>
        </div>
      </div>
    </div>
  );
}
