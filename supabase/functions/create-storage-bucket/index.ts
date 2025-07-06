
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

    // Create storage policies with direct SQL execution
    try {
      console.log('Creating storage policies...')
      
      // Delete existing policies first to avoid conflicts
      await supabase.rpc('exec_sql', { 
        sql: `
          DELETE FROM storage.policies WHERE bucket_id = 'plant-images';
        `
      }).catch(() => {
        // Ignore errors if policies don't exist
        console.log('No existing policies to delete or exec_sql not available')
      })

      // Create new policies that allow anonymous access
      const policies = [
        {
          name: 'Allow anonymous uploads to plant images',
          bucket_id: 'plant-images',
          operation: 'INSERT',
          definition: 'true'
        },
        {
          name: 'Allow public read access to plant images',
          bucket_id: 'plant-images', 
          operation: 'SELECT',
          definition: 'true'
        },
        {
          name: 'Allow users to update plant images',
          bucket_id: 'plant-images',
          operation: 'UPDATE', 
          definition: 'true'
        },
        {
          name: 'Allow users to delete plant images',
          bucket_id: 'plant-images',
          operation: 'DELETE',
          definition: 'true'
        }
      ]

      for (const policy of policies) {
        const { error: policyError } = await supabase
          .from('storage.policies')
          .insert(policy)
          .onConflict('name,bucket_id')
        
        if (policyError) {
          console.log(`Policy ${policy.name} might already exist:`, policyError)
        } else {
          console.log(`Created policy: ${policy.name}`)
        }
      }

    } catch (policyError) {
      console.log('Policy creation failed, but bucket exists:', policyError)
    }

    return new Response(JSON.stringify({ 
      message: plantImagesBucket ? 'Storage bucket already exists' : 'Storage bucket created successfully',
      bucket: plantImagesBucket || { name: 'plant-images', public: true }
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
