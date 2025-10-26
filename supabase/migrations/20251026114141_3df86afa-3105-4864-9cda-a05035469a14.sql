-- Create deliverables storage bucket for submissions and policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('deliverables', 'deliverables', true)
ON CONFLICT (id) DO NOTHING;

-- Clean up any existing conflicting policies
DROP POLICY IF EXISTS "Public can read deliverables" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own deliverables" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own deliverables" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own deliverables" ON storage.objects;

-- Allow public read access to deliverables files (since we share links in app)
CREATE POLICY "Public can read deliverables"
ON storage.objects
FOR SELECT
USING (bucket_id = 'deliverables');

-- Allow users to upload into their own folder: {user_id}/...
CREATE POLICY "Users can upload their own deliverables"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'deliverables'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update files in their own folder
CREATE POLICY "Users can update their own deliverables"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'deliverables'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete files in their own folder
CREATE POLICY "Users can delete their own deliverables"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'deliverables'
  AND auth.uid()::text = (storage.foldername(name))[1]
);