import { useState } from "react";
import { Share2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SuccessShareProps {
  guideId: string;
  title: string;
}

const SuccessShare = ({ guideId, title }: SuccessShareProps) => {
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File, type: "before" | "after") => {
    const fileExt = file.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from("success-stories")
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("success-stories")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleShare = async () => {
    setIsSubmitting(true);
    try {
      let beforeImageUrl = null;
      let afterImageUrl = null;

      if (beforeImage) {
        beforeImageUrl = await handleImageUpload(beforeImage, "before");
      }
      if (afterImage) {
        afterImageUrl = await handleImageUpload(afterImage, "after");
      }

      const { error } = await supabase.from("success_stories").insert({
        guide_id: guideId,
        title: title,
        description,
        before_image_url: beforeImageUrl,
        after_image_url: afterImageUrl,
      });

      if (error) throw error;

      // Share to Twitter
      const tweetText = encodeURIComponent(
        `🌱 Just achieved growing success with Master Growbot!\n\n${title}\n\n#GrowingSuccess #MasterGrowbot`
      );
      window.open(
        `https://twitter.com/intent/tweet?text=${tweetText}`,
        "_blank"
      );

      toast({
        title: "Success shared!",
        description: "Your growing success has been shared with the community.",
      });

      // Reset form
      setBeforeImage(null);
      setAfterImage(null);
      setDescription("");
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Failed to share your success. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50 backdrop-blur-sm">
      <h3 className="text-lg font-medium mb-4 text-gray-900">Share Your Success</h3>
      
      <div className="space-y-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Share your growing success story..."
          className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-600 focus:ring-green-500 focus:border-green-500"
          rows={3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">Before Photo</label>
            <div className="relative">
              {beforeImage ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(beforeImage)}
                    alt="Before"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setBeforeImage(null)}
                    className="absolute top-2 right-2 p-1 bg-black/70 rounded-full hover:bg-black/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-400">
                  <Upload className="w-6 h-6 mb-2 text-gray-600" />
                  <span className="text-sm text-gray-600">Upload before photo</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && setBeforeImage(e.target.files[0])}
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">After Photo</label>
            <div className="relative">
              {afterImage ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(afterImage)}
                    alt="After"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setAfterImage(null)}
                    className="absolute top-2 right-2 p-1 bg-black/70 rounded-full hover:bg-black/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-400">
                  <Upload className="w-6 h-6 mb-2 text-gray-600" />
                  <span className="text-sm text-gray-600">Upload after photo</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && setAfterImage(e.target.files[0])}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={handleShare}
          disabled={isSubmitting || !description}
          className="w-full bg-gradient-to-r from-green-600 to-green-700"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Success
        </Button>
      </div>
    </div>
  );
};

export default SuccessShare;