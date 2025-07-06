
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Enhanced CORS headers for better compatibility
const enhancedCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  console.log('=== UPLOAD PLANT IMAGE FUNCTION START ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  console.log('User Agent:', req.headers.get('user-agent'));
  console.log('Origin:', req.headers.get('origin'));
  console.log('Referer:', req.headers.get('referer'));

  // Handle CORS preflight with enhanced headers
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      status: 200,
      headers: enhancedCorsHeaders 
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    console.log('Environment check:');
    console.log('- SUPABASE_URL exists:', !!supabaseUrl);
    console.log('- SERVICE_KEY exists:', !!supabaseServiceKey);
    
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
      const textBody = await req.text();
      console.log('Raw request body length:', textBody.length);
      body = JSON.parse(textBody);
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
      headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' }
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
      headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
