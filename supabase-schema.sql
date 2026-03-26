-- Supabase Schema for Manitou LMS

-- 1. Create a profiles table that links to the built-in auth.users
CREATE TABLE public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  display_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own profile." 
  ON public.profiles FOR UPDATE USING ( auth.uid() = id );

CREATE POLICY "Users can view their own profile." 
  ON public.profiles FOR SELECT USING ( auth.uid() = id );

-- Optional: Create a trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, new.raw_user_meta_data->>'display_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Create the progress tracking table
CREATE TABLE public.progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  module_id text not null,
  status text not null check (status in ('started', 'completed')),
  score_percent integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, module_id)
);

-- Enable RLS on progress
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own progress" 
  ON public.progress FOR INSERT WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own progress" 
  ON public.progress FOR UPDATE USING ( auth.uid() = user_id );

CREATE POLICY "Users can view their own progress" 
  ON public.progress FOR SELECT USING ( auth.uid() = user_id );
