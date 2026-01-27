// showPdf.tsx
"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PDFPreview } from './PDFPreview';
import { DownloadIcon, PrinterIcon } from 'lucide-react';
import type { Budget } from '@/types/BudgetTypes';
import { DialogTitle } from '@radix-ui/react-dialog';
import { PDFViewer, pdf } from '@react-pdf/renderer';

interface PDFExportButtonProps {
  budgetData: Budget;
  title?: string;
}

export function PDFExportButton({ budgetData, title }: PDFExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Génération et téléchargement du PDF côté client
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // Génère le document PDF à partir du composant PDFPreview
      const blob = await pdf(
        <PDFPreview budget={budgetData} title={title} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `budget-${new Date().toISOString().slice(0,10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération du PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTitle className="m-0"></DialogTitle>
        <DialogTrigger asChild>
          <Button 
              variant="ghost" 
              className="w-10 m-1 hover:bg-gray-200"
          >
              <PrinterIcon className="text-gray-700"/>
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <PDFViewer width="100%" height="500px" className="flex-1 overflow-auto">
            <PDFPreview 
              budget={budgetData}
              title={title} 
            />
          </PDFViewer>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isGenerating}
            >
              Fermer
            </Button>
            
            <Button
              onClick={handleDownload}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <DownloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Télécharger
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}