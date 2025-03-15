import React, { useEffect, useState } from 'react';
import DiplomaGenerator, { DiplomaConfig } from '../services/pdfGenerator';
import { Runner } from '../services/runner.service';
import { Category } from '../services/category.service';
import './RunnerDiploma.css';

interface RunnerDiplomaProps {
  runner: Runner;
  category: Category;
  position: number;
  onClose: () => void;
  config?: Partial<DiplomaConfig>;
}

const RunnerDiploma: React.FC<RunnerDiplomaProps> = ({ 
  runner, 
  category, 
  position, 
  onClose,
  config = {}
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const generateDiploma = async () => {
      try {
        setLoading(true);
        
        const pdfBlob = await DiplomaGenerator.generateDiploma(
          runner, 
          category, 
          position,
          config
        );
        
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
        setError(null);
      } catch (err) {
        console.error('Error generating diploma:', err);
        setError('Failed to generate diploma. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    generateDiploma();
    
    // Cleanup function to revoke object URL when component unmounts
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [runner, category, position, config]);
  
  return (
    <div className="diploma-modal-overlay" onClick={onClose}>
      <div className="diploma-modal" onClick={(e) => e.stopPropagation()}>
        <div className="diploma-header">
          <h2>Runner Diploma</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="diploma-content">
          {loading ? (
            <div className="diploma-loading">Generating diploma...</div>
          ) : error ? (
            <div className="diploma-error">{error}</div>
          ) : (
            <>
              <div className="diploma-preview">
                <iframe 
                  src={pdfUrl || ''} 
                  title="Diploma Preview" 
                  width="100%" 
                  height="500px" 
                />
              </div>
              
              <div className="diploma-actions">
                <a 
                  href={pdfUrl || ''} 
                  download={`diploma_${runner.firstName}_${runner.lastName}.pdf`}
                  className="btn btn-primary"
                >
                  Download PDF
                </a>
                
                <button 
                  onClick={() => window.open(pdfUrl || '', '_blank')}
                  className="btn btn-outline"
                >
                  Open in New Tab
                </button>
                
                <button 
                  onClick={() => {
                    if (pdfUrl) {
                      const printWindow = window.open(pdfUrl, '_blank');
                      if (printWindow) {
                        printWindow.addEventListener('load', () => {
                          printWindow.print();
                        });
                      }
                    }
                  }}
                  className="btn btn-success"
                >
                  Print
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RunnerDiploma;

