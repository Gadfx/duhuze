-- Create a live matching queue so users are paired only when both are online
CREATE TABLE IF NOT EXISTS public.waiting_users (
  user_id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.waiting_users ENABLE ROW LEVEL SECURITY;

-- RLS: users can manage their own waiting row
DROP POLICY IF EXISTS "Users can insert themselves in waiting" ON public.waiting_users;
CREATE POLICY "Users can insert themselves in waiting"
ON public.waiting_users
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their waiting row" ON public.waiting_users;
CREATE POLICY "Users can delete their waiting row"
ON public.waiting_users
FOR DELETE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their waiting row" ON public.waiting_users;
CREATE POLICY "Users can view their waiting row"
ON public.waiting_users
FOR SELECT
USING (auth.uid() = user_id);
