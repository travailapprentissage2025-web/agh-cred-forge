-- Add foreign key constraint between submissions and profiles
ALTER TABLE public.submissions
ADD CONSTRAINT submissions_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key constraint between progress and profiles
ALTER TABLE public.progress
ADD CONSTRAINT progress_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;