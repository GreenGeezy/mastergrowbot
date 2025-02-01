import { useShareAnalysis } from './share/useShareAnalysis';
import ShareButton from './share/ShareButton';
import ShareDialog from './share/ShareDialog';

interface ShareResultsProps {
  analysisId: string;
  imageUrls: string[];
}

const ShareResults = ({ analysisId, imageUrls }: ShareResultsProps) => {
  const { isOpen, setIsOpen, isLoading, shareOptions, handleMobileShare } = useShareAnalysis(analysisId, imageUrls);

  return (
    <>
      <ShareDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        shareOptions={shareOptions}
        isLoading={isLoading}
      />
      <ShareButton 
        onClick={() => setIsOpen(true)} 
        onMobileShare={handleMobileShare}
      />
    </>
  );
};

export default ShareResults;