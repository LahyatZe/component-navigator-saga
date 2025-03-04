
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import { UserProgress } from '@/types/course';

interface UseCvDownloadProps {
  saveProgress: (updates: Partial<UserProgress>) => void;
}

export const useCvDownload = ({ saveProgress }: UseCvDownloadProps) => {
  const handleCvDownload = useCallback(() => {
    try {
      // Make sure to handle the case when usedHints is undefined
      saveProgress({ 
        cvDownloaded: true 
      } as Partial<UserProgress>);
      
      // Create a link element to download the CV
      const link = document.createElement('a');
      link.href = '/CV_Sohaib_ZEGHOUANI.pdf';
      link.download = 'CV_Sohaib_ZEGHOUANI.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Merci d'avoir téléchargé mon CV !", {
        duration: 3000,
        icon: <Download className="w-5 h-5 text-blue-500" />
      });
    } catch (error) {
      console.error("Error downloading CV:", error);
      toast.error("Erreur lors du téléchargement du CV. Veuillez réessayer.", {
        duration: 3000
      });
    }
  }, [saveProgress]);

  return { handleCvDownload };
};
