-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_gender AS ENUM ('male', 'female', 'non_binary', 'prefer_not_to_say');
CREATE TYPE connection_mode AS ENUM ('random', 'interest_based', 'group_room');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');
CREATE TYPE moderation_action AS ENUM ('warning', 'temporary_ban', 'permanent_ban', 'cleared');
CREATE TYPE message_type AS ENUM ('text', 'emoji', 'gif', 'sticker', 'system');
CREATE TYPE room_type AS ENUM ('one_on_one', 'group');

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    age INTEGER CHECK (age >= 18 AND age <= 120),
    gender user_gender,
    province TEXT,
    city TEXT,
    bio TEXT,
    avatar_url TEXT,
    preferred_language TEXT DEFAULT 'en',
    is_anonymous BOOLEAN DEFAULT true,
    is_premium BOOLEAN DEFAULT false,
    is_banned BOOLEAN DEFAULT false,
    ban_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User preferences for matching
CREATE TABLE public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    age_min INTEGER DEFAULT 18,
    age_max INTEGER DEFAULT 100,
    preferred_gender user_gender,
    preferred_provinces TEXT[],
    interests TEXT[],
    enable_video_blur BOOLEAN DEFAULT false,
    voice_only_mode BOOLEAN DEFAULT false,
    self_destructing_messages BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- Chat rooms
CREATE TABLE public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_type room_type NOT NULL DEFAULT 'one_on_one',
    name TEXT,
    theme TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Room participants
CREATE TABLE public.room_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    left_at TIMESTAMP WITH TIME ZONE,
    is_currently_active BOOLEAN DEFAULT true,
    UNIQUE(room_id, user_id)
);

-- Messages
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message_type message_type DEFAULT 'text',
    content TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT false,
    self_destruct_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Matches history
CREATE TABLE public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    connection_mode connection_mode NOT NULL,
    duration_seconds INTEGER,
    user1_rating INTEGER CHECK (user1_rating >= 1 AND user1_rating <= 5),
    user2_rating INTEGER CHECK (user2_rating >= 1 AND user2_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CHECK (user1_id != user2_id)
);

-- Favorites
CREATE TABLE public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    favorited_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_mutual BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, favorited_user_id),
    CHECK (user_id != favorited_user_id)
);

-- Blocks
CREATE TABLE public.blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, blocked_user_id),
    CHECK (user_id != blocked_user_id)
);

-- Reports
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status report_status DEFAULT 'pending',
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Moderation logs
CREATE TABLE public.moderation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    moderator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action moderation_action NOT NULL,
    reason TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User stats
CREATE TABLE public.user_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_matches INTEGER DEFAULT 0,
    total_chat_time_seconds INTEGER DEFAULT 0,
    skips_used INTEGER DEFAULT 0,
    reports_received INTEGER DEFAULT 0,
    average_rating DECIMAL(2,1),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for chat_rooms
CREATE POLICY "Users can view rooms they participate in" ON public.chat_rooms FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.room_participants 
        WHERE room_participants.room_id = chat_rooms.id 
        AND room_participants.user_id = auth.uid()
    )
);

-- RLS Policies for room_participants
CREATE POLICY "Users can view participants in their rooms" ON public.room_participants FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.room_participants AS rp 
        WHERE rp.room_id = room_participants.room_id 
        AND rp.user_id = auth.uid()
    )
);
CREATE POLICY "Users can join rooms" ON public.room_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own participation" ON public.room_participants FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their rooms" ON public.messages FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.room_participants 
        WHERE room_participants.room_id = messages.room_id 
        AND room_participants.user_id = auth.uid()
    )
);
CREATE POLICY "Users can send messages in their rooms" ON public.messages FOR INSERT 
WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM public.room_participants 
        WHERE room_participants.room_id = messages.room_id 
        AND room_participants.user_id = auth.uid()
        AND room_participants.is_currently_active = true
    )
);

-- RLS Policies for matches
CREATE POLICY "Users can view their own matches" ON public.matches FOR SELECT 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "System can insert matches" ON public.matches FOR INSERT WITH CHECK (true);

-- RLS Policies for favorites
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for blocks
CREATE POLICY "Users can view own blocks" ON public.blocks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add blocks" ON public.blocks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own blocks" ON public.blocks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reports
CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- RLS Policies for moderation_logs
CREATE POLICY "Users can view own moderation logs" ON public.moderation_logs FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for user_stats
CREATE POLICY "Users can view all stats" ON public.user_stats FOR SELECT USING (true);
CREATE POLICY "Users can update own stats" ON public.user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, created_at, updated_at)
    VALUES (new.id, now(), now());
    
    INSERT INTO public.user_preferences (user_id, created_at, updated_at)
    VALUES (new.id, now(), now());
    
    INSERT INTO public.user_stats (user_id, created_at)
    VALUES (new.id, now());
    
    RETURN new;
END;
$$;

-- Trigger to create profile, preferences, and stats on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to delete self-destructing messages
CREATE OR REPLACE FUNCTION public.delete_expired_messages()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.messages
    SET is_deleted = true
    WHERE self_destruct_at IS NOT NULL 
    AND self_destruct_at <= now()
    AND is_deleted = false;
END;
$$;

-- Enable realtime for chat functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;