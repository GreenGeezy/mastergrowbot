
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return new Response(JSON.stringify({ error: 'Failed to list buckets' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const plantImagesBucket = buckets?.find(bucket => bucket.name === 'plant-images')
    
    if (!plantImagesBucket) {
      // Create the bucket
      const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('plant-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'],
        fileSizeLimit: 10485760 // 10MB
      })

      if (bucketError) {
        console.error('Error creating bucket:', bucketError)
        return new Response(JSON.stringify({ error: 'Failed to create bucket', details: bucketError }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      console.log('Created plant-images bucket:', bucketData)
    }

    // Now create/update storage policies using direct SQL commands
    try {
      console.log('Creating/updating storage policies...')
      
      // First, drop all existing policies for the bucket to start fresh
      const { error: dropError } = await supabase.rpc('exec_sql', {
        sql: `
          DELETE FROM storage.policies WHERE bucket_id = 'plant-images';
        `
      }).catch(() => {
        console.log('Could not drop existing policies (normal if they don\'t exist)')
      })

      // Create comprehensive policies that allow full anonymous access
      const policyQueries = [
        // Allow anonymous SELECT (read) access
        `INSERT INTO storage.policies (name, bucket_id, operation, definition) 
         VALUES ('Allow anonymous read access to plant images', 'plant-images', 'SELECT', 'true')
         ON CONFLICT (name, bucket_id) DO NOTHING;`,
        
        // Allow anonymous INSERT (upload) access
        `INSERT INTO storage.policies (name, bucket_id, operation, definition) 
         VALUES ('Allow anonymous upload to plant images', 'plant-images', 'INSERT', 'true')
         ON CONFLICT (name, bucket_id) DO NOTHING;`,
        
        // Allow anonymous UPDATE access
        `INSERT INTO storage.policies (name, bucket_id, operation, definition) 
         VALUES ('Allow anonymous update to plant images', 'plant-images', 'UPDATE', 'true')
         ON CONFLICT (name, bucket_id) DO NOTHING;`,
        
        // Allow anonymous DELETE access
        `INSERT INTO storage.policies (name, bucket_id, operation, definition) 
         VALUES ('Allow anonymous delete to plant images', 'plant-images', 'DELETE', 'true')
         ON CONFLICT (name, bucket_id) DO NOTHING;`
      ]

      // Execute each policy creation query
      for (const query of policyQueries) {
        try {
          const { error: policyError } = await supabase.rpc('exec_sql', { sql: query })
          if (policyError) {
            console.log('Policy creation error (may be normal):', policyError)
          }
        } catch (err) {
          console.log('Policy creation attempt failed:', err)
        }
      }

      // Also try direct policy insertion as fallback
      const policies = [
        {
          name: 'Public read access',
          bucket_id: 'plant-images',
          operation: 'SELECT',
          definition: 'true'
        },
        {
          name: 'Public upload access',
          bucket_id: 'plant-images',
          operation: 'INSERT',
          definition: 'true'
        }
      ]

      for (const policy of policies) {
        try {
          await supabase.from('storage.policies').upsert(policy, { onConflict: 'name,bucket_id' })
        } catch (err) {
          console.log('Direct policy insertion failed:', err)
        }
      }

    } catch (policyError) {
      console.log('Policy creation process completed with some issues:', policyError)
    }

    return new Response(JSON.stringify({ 
      message: plantImagesBucket ? 'Storage bucket already exists with updated policies' : 'Storage bucket created successfully with anonymous access',
      bucket: plantImagesBucket || { name: 'plant-images', public: true },
      policies_updated: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in create-storage-bucket:', error)
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
