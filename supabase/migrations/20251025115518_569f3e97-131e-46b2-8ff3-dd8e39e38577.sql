-- Fix security warnings by setting search_path for functions

-- Update the update_updated_at_column function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Update the delete_expired_messages function with proper search_path
CREATE OR REPLACE FUNCTION public.delete_expired_messages()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.messages
    SET is_deleted = true
    WHERE self_destruct_at IS NOT NULL 
    AND self_destruct_at <= now()
    AND is_deleted = false;
END;
$$;