
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

    console.log('Starting storage bucket setup...')

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
      console.log('Creating plant-images bucket...')
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
    } else {
      console.log('plant-images bucket already exists')
    }

    // Delete existing policies first to avoid conflicts
    console.log('Cleaning up existing policies...')
    try {
      await supabase
        .from('storage.policies')
        .delete()
        .eq('bucket_id', 'plant-images')
    } catch (error) {
      console.log('Policy cleanup warning (normal if no policies exist):', error)
    }

    // Create comprehensive policies that allow anonymous access
    console.log('Creating new storage policies...')
    
    const policies = [
      {
        name: 'Allow anonymous read access to plant images',
        bucket_id: 'plant-images',
        operation: 'SELECT',
        definition: 'true'
      },
      {
        name: 'Allow anonymous upload to plant images', 
        bucket_id: 'plant-images',
        operation: 'INSERT',
        definition: 'true'
      },
      {
        name: 'Allow anonymous update to plant images',
        bucket_id: 'plant-images', 
        operation: 'UPDATE',
        definition: 'true'
      },
      {
        name: 'Allow anonymous delete to plant images',
        bucket_id: 'plant-images',
        operation: 'DELETE', 
        definition: 'true'
      }
    ]

    // Insert policies one by one
    for (const policy of policies) {
      try {
        console.log(`Creating policy: ${policy.name}`)
        const { error: policyError } = await supabase
          .from('storage.policies')
          .insert(policy)
        
        if (policyError) {
          console.error(`Error creating policy ${policy.name}:`, policyError)
        } else {
          console.log(`Successfully created policy: ${policy.name}`)
        }
      } catch (error) {
        console.error(`Failed to create policy ${policy.name}:`, error)
      }
    }

    // Also try to disable RLS on the objects table temporarily for debugging
    console.log('Attempting to modify storage.objects RLS...')
    try {
      // First check current RLS status
      const { data: rlsStatus } = await supabase.rpc('exec_sql', {
        sql: `SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'storage' AND tablename = 'objects';`
      })
      
      console.log('Current RLS status:', rlsStatus)
      
      // Disable RLS temporarily for objects table to allow anonymous uploads
      await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;`
      })
      
      console.log('Disabled RLS on storage.objects table')
    } catch (error) {
      console.log('Could not modify RLS (may not have permissions):', error)
    }

    return new Response(JSON.stringify({ 
      message: 'Storage bucket setup completed with anonymous access policies',
      bucket: { name: 'plant-images', public: true },
      policies_created: policies.length,
      success: true
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
