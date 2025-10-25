-- Ajouter le rôle admin à boulkassoum2002@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM public.profiles
WHERE email = 'boulkassoum2002@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Mettre à jour la fonction handle_new_user pour reconnaître ce nouvel email admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
  IF NEW.email IN ('travail.apprentissage.2025@gmail.com', 'boulkassoum2002@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;