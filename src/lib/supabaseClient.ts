import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Robust client that works even if env injection fails in preview builds
const FALLBACK_PROJECT_ID = 'alxtxtvjibhhdeiygcof';
const FALLBACK_URL = `https://${FALLBACK_PROJECT_ID}.supabase.co`;
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFseHR4dHZqaWJoaGRlaXlnY29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODE4NDUsImV4cCI6MjA3Njk1Nzg0NX0.qrALwWKbKxG_kBqMdQB3dLpPMmeOfTSG4UzJztm7ygg';

const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID as string | undefined;
const envKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

const SUPABASE_URL = envUrl || (envProjectId ? `https://${envProjectId}.supabase.co` : undefined) || FALLBACK_URL;
const SUPABASE_PUBLISHABLE_KEY = envKey || FALLBACK_ANON_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
