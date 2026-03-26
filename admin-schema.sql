-- Add is_admin column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Update the handle_new_user trigger to make the FIRST user an admin automatically!
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
DECLARE
  is_first_user boolean;
BEGIN
  SELECT count(*) = 0 INTO is_first_user FROM public.profiles;
  
  INSERT INTO public.profiles (id, display_name, is_admin)
  VALUES (new.id, new.raw_user_meta_data->>'display_name', is_first_user);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policy for Admins to access all profiles
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING ( (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true );

-- Add RLS policy for Admins to access all progress records
CREATE POLICY "Admins can view all progress" 
  ON public.progress FOR SELECT 
  USING ( (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true );
