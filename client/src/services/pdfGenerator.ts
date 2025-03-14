import jsPDF from 'jspdf';
import { Runner } from './runner.service';
import { Category } from './category.service';

export interface DiplomaConfig {
  eventName: string;
  eventDate: string;
  eventLocation: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

// Default configuration for diploma generation
const defaultDiplomaConfig: DiplomaConfig = {
  eventName: 'Running Event',
  eventDate: new Date().toLocaleDateString(),
  eventLocation: 'Event Location',
  primaryColor: '#0066cc',
  secondaryColor: '#28a745'
};

export const DiplomaGenerator = {
  /**
   * Generate a PDF diploma for a runner
   * @param runner The runner to generate the diploma for
   * @param category The runner's category
   * @param position The runner's position in the results
   * @param config Optional configuration for the diploma
   * @returns The generated PDF as a Blob
   */
  generateDiploma: async (
    runner: Runner, 
    category: Category, 
    position: number,
    config: Partial<DiplomaConfig> = {}
  ): Promise<Blob> => {
    // Merge default config with provided config
    const diplomaConfig = { ...defaultDiplomaConfig, ...config };
    
    // Initialize PDF document (A4 size)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set background color
    pdf.setFillColor(250, 250, 250);
    pdf.rect(0, 0, 297, 210, 'F');
    
    // Add border
    pdf.setDrawColor(diplomaConfig.primaryColor || '#0066cc');
    pdf.setLineWidth(3);
    pdf.rect(10, 10, 277, 190);
    
    // Add header
    pdf.setFontSize(30);
    pdf.setTextColor(diplomaConfig.primaryColor || '#0066cc');
    pdf.setFont('helvetica', 'bold');
    pdf.text('DIPLOMA', 148.5, 40, { align: 'center' });
    
    // Add event details
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`This certifies that`, 148.5, 60, { align: 'center' });
    
    // Add runner name
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${runner.firstName} ${runner.lastName}`, 148.5, 75, { align: 'center' });
    if (runner.nickname) {
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`"${runner.nickname}"`, 148.5, 85, { align: 'center' });
    }
    
    // Add achievement
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `has successfully completed the ${diplomaConfig.eventName}`,
      148.5, 100, 
      { align: 'center' }
    );
    
    // Add category and position
    pdf.setFontSize(16);
    pdf.setTextColor(diplomaConfig.secondaryColor || '#28a745');
    pdf.text(
      `Category: ${category.name}`,
      148.5, 115, 
      { align: 'center' }
    );
    
    pdf.text(
      `Position: ${getPositionText(position)}`,
      148.5, 125, 
      { align: 'center' }
    );
    
    // Add stats
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    const totalTime = runner.totalRunningTime 
      ? formatTime(runner.totalRunningTime) 
      : 'N/A';
    
    pdf.text(
      `Total Time: ${totalTime}`,
      148.5, 140, 
      { align: 'center' }
    );
    
    pdf.text(
      `Total Distance: ${runner.totalDistance} km`,
      148.5, 150, 
      { align: 'center' }
    );
    
    pdf.text(
      `Total Laps: ${runner.totalLaps}`,
      148.5, 160, 
      { align: 'center' }
    );
    
    // Add event details and date
    pdf.setFontSize(12);
    pdf.text(
      `${diplomaConfig.eventLocation} - ${diplomaConfig.eventDate}`,
      148.5, 180, 
      { align: 'center' }
    );
    
    // Return the PDF as a blob
    return pdf.output('blob');
  }
};

// Helper function to format time (milliseconds to HH:MM:SS)
const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    remainingSeconds.toString().padStart(2, '0')
  ].join(':');
};

// Helper function to format position (1st, 2nd, 3rd, etc.)
const getPositionText = (position: number): string => {
  if (position === 1) return '1st Place';
  if (position === 2) return '2nd Place';
  if (position === 3) return '3rd Place';
  return `${position}th Place`;
};

export default DiplomaGenerator;
