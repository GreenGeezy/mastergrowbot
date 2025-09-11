-- Master Growbot Schema Export for iOS Branch Project
-- Run this SQL in your new Supabase project's SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create app_config table
CREATE TABLE public.app_config (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    key text NOT NULL,
    value text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT app_config_pkey PRIMARY KEY (id)
);

-- Create assistant_settings table
CREATE TABLE public.assistant_settings (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    assistant_id text NOT NULL,
    user_id uuid,
    system_instructions text,
    temperature double precision DEFAULT 0.7,
    max_tokens integer DEFAULT 1000,
    voice_settings jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT assistant_settings_pkey PRIMARY KEY (id)
);

-- Create avatar_customizations_catalog table
CREATE TABLE public.avatar_customizations_catalog (
    id text NOT NULL,
    name text NOT NULL,
    image_url text,
    description text NOT NULL,
    unlock_requirement integer NOT NULL,
    customization_type text DEFAULT 'background'::text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT avatar_customizations_catalog_pkey PRIMARY KEY (id)
);

-- Create badges_catalog table
CREATE TABLE public.badges_catalog (
    id text NOT NULL,
    name text NOT NULL,
    icon_url text,
    description text NOT NULL,
    unlock_requirement integer NOT NULL,
    badge_type text DEFAULT 'streak'::text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT badges_catalog_pkey PRIMARY KEY (id)
);

-- Create chat_history table
CREATE TABLE public.chat_history (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid,
    message text NOT NULL,
    is_ai boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    conversation_id uuid,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT chat_history_pkey PRIMARY KEY (id)
);

-- Create leaderboard_profiles table
CREATE TABLE public.leaderboard_profiles (
    user_id uuid NOT NULL,
    leaderboard_name text NOT NULL DEFAULT ''::text,
    is_opt_in boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT leaderboard_profiles_pkey PRIMARY KEY (user_id)
);

-- Create milestones_catalog table
CREATE TABLE public.milestones_catalog (
    id text NOT NULL,
    title text NOT NULL,
    fun_fact text NOT NULL,
    streak_requirement integer NOT NULL,
    milestone_type text NOT NULL DEFAULT 'streak'::text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT milestones_catalog_pkey PRIMARY KEY (id)
);

-- Create pending_subscriptions table
CREATE TABLE public.pending_subscriptions (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    email text NOT NULL,
    subscription_type text NOT NULL,
    square_order_id text NOT NULL,
    consumed boolean DEFAULT false,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT pending_subscriptions_pkey PRIMARY KEY (id)
);

-- Create plant_analyses table
CREATE TABLE public.plant_analyses (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    image_url text NOT NULL,
    diagnosis text,
    confidence_level double precision,
    recommended_actions jsonb DEFAULT '{}'::jsonb,
    detailed_analysis jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    primary_issue text,
    growth_stage text,
    strain_name text,
    growing_method text,
    issue_resolved boolean DEFAULT false,
    follow_up_date timestamp with time zone,
    resolution_notes text,
    image_taken_at timestamp with time zone DEFAULT now(),
    image_urls jsonb DEFAULT '[]'::jsonb,
    CONSTRAINT plant_analyses_pkey PRIMARY KEY (id)
);

-- Create quiz_responses table
CREATE TABLE public.quiz_responses (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    experience_level text NOT NULL,
    growing_method text NOT NULL,
    monitoring_method text NOT NULL,
    nutrient_type text NOT NULL,
    plant_quantity text,
    challenges text[] NOT NULL,
    goals text[] NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT quiz_responses_pkey PRIMARY KEY (id)
);

-- Create share_metrics table
CREATE TABLE public.share_metrics (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid,
    analysis_id uuid,
    share_type text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT share_metrics_pkey PRIMARY KEY (id)
);

-- Create shared_analyses table
CREATE TABLE public.shared_analyses (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    analysis_id uuid NOT NULL,
    share_token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT shared_analyses_pkey PRIMARY KEY (id)
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    subscription_type text NOT NULL,
    status text NOT NULL,
    starts_at timestamp with time zone NOT NULL DEFAULT now(),
    expires_at timestamp with time zone NOT NULL,
    square_order_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT subscriptions_pkey PRIMARY KEY (id)
);

-- Create support_messages table
CREATE TABLE public.support_messages (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    email text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'new'::text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT support_messages_pkey PRIMARY KEY (id)
);

-- Create user_access_view (view)
CREATE VIEW public.user_access_view AS
SELECT 
    up.id,
    up.has_completed_quiz,
    s.subscription_type,
    s.status as subscription_status,
    s.expires_at,
    CASE 
        WHEN s.status = 'active' AND s.expires_at > now() THEN true
        ELSE false
    END as has_active_subscription
FROM public.user_profiles up
LEFT JOIN public.subscriptions s ON up.id = s.user_id;

-- Create user_avatars table
CREATE TABLE public.user_avatars (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    avatar_customization_id text NOT NULL,
    is_active boolean DEFAULT false,
    applied_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_avatars_pkey PRIMARY KEY (id)
);

-- Create user_badges table
CREATE TABLE public.user_badges (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    badge_id text NOT NULL,
    is_active boolean DEFAULT true,
    unlocked_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_badges_pkey PRIMARY KEY (id)
);

-- Create user_feedback table
CREATE TABLE public.user_feedback (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid,
    growing_effectiveness_rating integer NOT NULL,
    recommendation_rating integer NOT NULL,
    main_improvement_area text NOT NULL,
    other_improvement_details text,
    whats_working text,
    biggest_challenge text,
    beta_testing_email text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT user_feedback_pkey PRIMARY KEY (id)
);

-- Create user_milestones table
CREATE TABLE public.user_milestones (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    milestone_id text NOT NULL,
    celebrated_at timestamp with time zone DEFAULT now(),
    is_shared boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_milestones_pkey PRIMARY KEY (id)
);

-- Create user_profiles table
CREATE TABLE public.user_profiles (
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    grow_experience_level text DEFAULT 'beginner'::text,
    subscription_status text DEFAULT 'inactive'::text,
    avatar_url text,
    has_completed_quiz boolean DEFAULT false,
    growing_method text,
    monitoring_method text,
    nutrient_type text,
    challenges text[],
    goals text[],
    username text,
    CONSTRAINT user_profiles_pkey PRIMARY KEY (id)
);

-- Create user_streaks table
CREATE TABLE public.user_streaks (
    user_id uuid NOT NULL,
    current_streak integer NOT NULL DEFAULT 0,
    last_action date NOT NULL DEFAULT CURRENT_DATE,
    grace_days integer NOT NULL DEFAULT 0,
    CONSTRAINT user_streaks_pkey PRIMARY KEY (user_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatar_customizations_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('plant-images', 'plant-images', true),
('success-stories', 'success-stories', true),
('avatars', 'avatars', true),
('badge-icons', 'badge-icons', true),
('avatar-backgrounds', 'avatar-backgrounds', true);

-- Storage policies will be added automatically by Supabase for standard access patterns