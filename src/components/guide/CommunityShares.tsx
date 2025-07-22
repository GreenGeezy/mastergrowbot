import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface SuccessStory {
  id: string;
  title: string;
  description: string;
  before_image_url: string | null;
  after_image_url: string | null;
  created_at: string;
}

const CommunityShares = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setStories(data);
      }
    };

    fetchStories();
  }, []);

  if (stories.length === 0) return null;

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-700">
        Recent Community Successes
      </h2>
      
      <div className="grid gap-6">
        {stories.map((story) => (
          <div
            key={story.id}
            className="p-4 border border-gray-300 rounded-lg bg-gray-50 backdrop-blur-sm"
          >
            <h3 className="font-medium mb-2 text-gray-900">{story.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{story.description}</p>
            
            {(story.before_image_url || story.after_image_url) && (
              <div className="grid grid-cols-2 gap-4">
                {story.before_image_url && (
                  <div>
                    <span className="text-xs text-red-500 block mb-1">Before</span>
                    <img
                      src={story.before_image_url}
                      alt="Before"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
                {story.after_image_url && (
                  <div>
                    <span className="text-xs text-green-600 block mb-1">After</span>
                    <img
                      src={story.after_image_url}
                      alt="After"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-2 text-xs text-gray-600">
              {format(new Date(story.created_at), "MMM d, yyyy")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityShares;