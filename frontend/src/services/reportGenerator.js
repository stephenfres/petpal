import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export const generatePDFReport = (report, pet, t) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text(`PetPal - Weekly Report`, 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Pet: ${pet.name}`, 14, 30);
  doc.text(`Week: ${format(new Date(report.weekStart), 'MMM dd')} - ${format(new Date(report.weekEnd), 'MMM dd, yyyy')}`, 14, 38);
  
  // Summary Table
  const summaryData = [
    ['Feeding Consistency', `${report.summary.feedingConsistency}%`],
    ['Health Incidents', report.summary.healthIncidents.toString()],
    ['Vaccinations Due', report.summary.vaccinationsDue.toString()],
    ['Medications Given', report.summary.medicationsGiven.toString()],
  ];
  
  doc.autoTable({
    startY: 45,
    head: [['Metric', 'Value']],
    body: summaryData,
  });
  
  // AI Insights
  const finalY = doc.lastAutoTable.finalY || 45;
  doc.text('AI Insights:', 14, finalY + 15);
  doc.setFontSize(10);
  
  const splitInsights = doc.splitTextToSize(report.aiInsights, 180);
  doc.text(splitInsights, 14, finalY + 25);
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(10);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
  }
  
  doc.save(`petpal-report-${pet.name}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};