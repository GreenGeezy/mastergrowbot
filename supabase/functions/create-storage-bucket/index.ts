
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if bucket exists
    const { data: bucket, error: checkError } = await supabase
      .storage
      .getBucket('plant-images');

    if (checkError) {
      if (checkError.message.includes('not found')) {
        // Create the bucket
        const { data, error: createError } = await supabase
          .storage
          .createBucket('plant-images', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
          });

        if (createError) throw createError;

        return new Response(
          JSON.stringify({ message: 'Storage bucket created successfully', bucket: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw checkError;
    }

    return new Response(
      JSON.stringify({ message: 'Storage bucket already exists', bucket }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 200, // Use 200 to prevent client from treating it as a network error
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
