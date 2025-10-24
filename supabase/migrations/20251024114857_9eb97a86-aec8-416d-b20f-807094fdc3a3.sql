-- Create admin user
-- Note: This inserts directly into auth.users with encrypted password
-- The password 'aghenterprise@2025' is hashed using Supabase's auth system

-- First, we'll insert the admin user profile and role
-- The actual user will be created through the auth system

-- Check if the user exists and insert role
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- We need to manually create the auth user first via the Supabase dashboard
  -- or use the signUp function in the application
  -- This migration will prepare the role for the admin user
  
  -- For now, we'll create a function that can be called after user signup
  -- to automatically assign admin role to this specific email
  
  CREATE OR REPLACE FUNCTION public.assign_admin_role_on_signup()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $func$
  BEGIN
    -- Check if the new user is the admin email
    IF NEW.email = 'travail.apprentissage.2025@gmail.com' THEN
      -- Insert admin role
      INSERT INTO public.user_roles (user_id, role)
      VALUES (NEW.id, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
    
    RETURN NEW;
  END;
  $func$;
  
  -- Drop trigger if exists
  DROP TRIGGER IF EXISTS on_admin_user_created ON auth.users;
  
  -- Create trigger to assign admin role on signup for the specific email
  CREATE TRIGGER on_admin_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    WHEN (NEW.email = 'travail.apprentissage.2025@gmail.com')
    EXECUTE FUNCTION public.assign_admin_role_on_signup();
END $$;