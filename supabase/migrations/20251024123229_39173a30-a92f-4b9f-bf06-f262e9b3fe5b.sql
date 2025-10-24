-- 1) Remove any existing triggers that might conflict
DROP TRIGGER IF EXISTS on_admin_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2) Update the function to create profile first, then roles (intern + admin when email matches)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ensure profile exists/updated
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;

  -- Assign default intern role, idempotent
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'intern')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- If admin email, also assign admin role, idempotent
  IF NEW.email = 'travail.apprentissage.2025@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- 3) Recreate a single trigger on auth.users to call the function after user creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();