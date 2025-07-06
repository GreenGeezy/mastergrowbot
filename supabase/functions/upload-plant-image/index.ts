
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  console.log('=== UPLOAD PLANT IMAGE FUNCTION START ===');
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      throw new Error('Missing Supabase configuration');
    }
    
    // Use service role client to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      throw new Error('Invalid JSON in request body');
    }

    const { fileName, fileData, contentType } = body;
    
    console.log('Upload request:', {
      fileName,
      contentType,
      fileDataLength: fileData?.length || 0
    });
    
    if (!fileName || !fileData) {
      console.error('Missing fileName or fileData');
      throw new Error('Missing fileName or fileData');
    }

    // Convert base64 to blob
    let bytes;
    try {
      const binaryString = atob(fileData);
      bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      console.log('File converted to bytes, size:', bytes.length);
    } catch (conversionError) {
      console.error('Failed to convert base64 to bytes:', conversionError);
      throw new Error('Failed to convert file data');
    }

    // Upload using service role (bypasses RLS)
    console.log('Uploading to storage...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('plant-images')
      .upload(`public/${fileName}`, bytes, {
        contentType: contentType || 'image/jpeg',
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log('Upload successful:', uploadData);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('plant-images')
      .getPublicUrl(`public/${fileName}`);

    console.log('Public URL generated:', publicUrl);
    console.log('=== UPLOAD PLANT IMAGE FUNCTION SUCCESS ===');

    return new Response(JSON.stringify({ 
      publicUrl,
      path: uploadData.path,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('=== UPLOAD PLANT IMAGE FUNCTION ERROR ===');
    console.error('Error in upload-plant-image:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error occurred',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
