
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Enhanced CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with, accept',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false',
}

serve(async (req) => {
  console.log('=== UPLOAD PLANT IMAGE FUNCTION START ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Origin:', req.headers.get('origin'));

  // Handle CORS preflight with immediate response - CRITICAL FIX
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    // Environment validation
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('Environment check:');
    console.log('- SUPABASE_URL exists:', !!supabaseUrl);
    console.log('- SERVICE_KEY exists:', !!supabaseServiceKey);
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error',
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Initialize Supabase client
    let supabase;
    try {
      supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      console.log('Supabase client initialized');
    } catch (supabaseError) {
      console.error('Failed to initialize Supabase client:', supabaseError);
      return new Response(JSON.stringify({ 
        error: 'Database connection error',
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    let body;
    try {
      const textBody = await req.text();
      console.log('Raw request body length:', textBody.length);
      
      if (!textBody || textBody.length === 0) {
        throw new Error('Empty request body');
      }
      
      body = JSON.parse(textBody);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid request format',
        success: false 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { fileName, fileData, contentType } = body;
    
    console.log('Upload request:', {
      fileName,
      contentType,
      fileDataLength: fileData?.length || 0
    });
    
    if (!fileName || !fileData) {
      console.error('Missing fileName or fileData');
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: fileName or fileData',
        success: false 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Convert base64 to blob
    let bytes;
    try {
      console.log('Converting base64 to bytes...');
      const binaryString = atob(fileData);
      bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      console.log('File converted to bytes, size:', bytes.length);
    } catch (conversionError) {
      console.error('Failed to convert base64 to bytes:', conversionError);
      return new Response(JSON.stringify({ 
        error: 'Invalid file data format',
        success: false 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Upload to storage
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
      return new Response(JSON.stringify({ 
        error: `Upload failed: ${uploadError.message}`,
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
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
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('=== UPLOAD PLANT IMAGE FUNCTION ERROR ===');
    console.error('Unexpected error:', error);
    console.error('Error stack:', error.stack);
    
    // CRITICAL: Always return CORS headers even on error
    return new Response(JSON.stringify({ 
      error: 'Internal server error occurred',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
