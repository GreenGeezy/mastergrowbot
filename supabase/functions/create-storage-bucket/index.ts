
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if bucket exists
    const { data: existingBucket, error: checkError } = await supabase
      .storage
      .getBucket('plant-images');

    if (checkError && checkError.message.includes('not found')) {
      // Bucket doesn't exist, create it
      const { data, error } = await supabase
        .storage
        .createBucket('plant-images', {
          public: true,
          fileSizeLimit: 10485760, // 10MB in bytes
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
        });

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({ message: 'Storage bucket created successfully', data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (checkError) {
      throw checkError;
    }

    return new Response(
      JSON.stringify({ message: 'Storage bucket already exists', bucket: existingBucket }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
