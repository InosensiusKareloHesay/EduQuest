-- ====================================================================
-- EDUQUEST COMPREHENSIVE SUPABASE DATABASE MIGRATION & SEED
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE item_category AS ENUM ('hair', 'outfit', 'bottom', 'shoes', 'head_accessory', 'face_accessory', 'back_accessory');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE question_status AS ENUM ('draft', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE quiz_status AS ENUM ('in_progress', 'completed', 'abandoned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE coin_txn_type AS ENUM ('quiz_reward', 'shop_purchase', 'initial_bonus', 'admin_adjustment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    coins INTEGER NOT NULL DEFAULT 50 CHECK (coins >= 0),
    avatar_skin TEXT DEFAULT '#FFDFC4',
    avatar_expression TEXT DEFAULT 'happy',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. ITEMS CATALOG (Cosmetic Shop)
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category item_category NOT NULL,
    price INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0),
    asset_id TEXT NOT NULL,
    description TEXT,
    is_default BOOLEAN NOT NULL DEFAULT false,
    rarity TEXT DEFAULT 'common',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. PLAYER INVENTORY
CREATE TABLE IF NOT EXISTS public.player_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    acquired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, item_id)
);

-- 6. PLAYER EQUIPMENT
CREATE TABLE IF NOT EXISTS public.player_equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    hair_item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
    outfit_item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
    bottom_item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
    shoes_item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
    head_accessory_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
    face_accessory_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
    back_accessory_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. SUBJECTS
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL DEFAULT 'book-open',
    color TEXT NOT NULL DEFAULT '#3B82F6',
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. QUESTION CATEGORIES
CREATE TABLE IF NOT EXISTS public.question_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'sparkles',
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(subject_id, slug)
);

-- 9. QUIZ SETTINGS
CREATE TABLE IF NOT EXISTS public.quiz_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.question_categories(id) ON DELETE CASCADE UNIQUE,
    total_questions INTEGER NOT NULL DEFAULT 10,
    easy_count INTEGER NOT NULL DEFAULT 4,
    medium_count INTEGER NOT NULL DEFAULT 4,
    hard_count INTEGER NOT NULL DEFAULT 2,
    reward_per_correct INTEGER NOT NULL DEFAULT 10,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_counts CHECK (easy_count + medium_count + hard_count = total_questions)
);

-- 10. QUESTIONS
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.question_categories(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    difficulty difficulty_level NOT NULL DEFAULT 'easy',
    status question_status NOT NULL DEFAULT 'published',
    explanation TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. QUESTION OPTIONS
CREATE TABLE IF NOT EXISTS public.question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    option_label TEXT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 1
);

-- 12. QUIZ ATTEMPTS
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.question_categories(id) ON DELETE CASCADE,
    status quiz_status NOT NULL DEFAULT 'in_progress',
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    score_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    coins_earned INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- 13. QUIZ ATTEMPT QUESTIONS
CREATE TABLE IF NOT EXISTS public.quiz_attempt_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    order_num INTEGER NOT NULL,
    selected_option_id UUID REFERENCES public.question_options(id),
    is_correct BOOLEAN,
    UNIQUE(attempt_id, question_id)
);

-- 14. COIN TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.coin_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type coin_txn_type NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempt_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

-- Helper to check if user is admin/teacher
CREATE OR REPLACE FUNCTION public.is_admin_or_teacher()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('teacher', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Anyone authenticated can read their own, teachers/admins can read all
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin_or_teacher());

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Items: Anyone can read items catalog
CREATE POLICY "Anyone can view items" ON public.items
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage items" ON public.items
    FOR ALL USING (public.is_admin_or_teacher());

-- Player Inventory: View own inventory
CREATE POLICY "Users view own inventory" ON public.player_inventory
    FOR SELECT USING (auth.uid() = user_id);

-- Player Equipment: View and edit own equipment
CREATE POLICY "Users manage own equipment" ON public.player_equipment
    FOR ALL USING (auth.uid() = user_id);

-- Subjects & Categories: Public read for active, Admins manage all
CREATE POLICY "View active subjects" ON public.subjects
    FOR SELECT USING (is_active = true OR public.is_admin_or_teacher());

CREATE POLICY "Manage subjects" ON public.subjects
    FOR ALL USING (public.is_admin_or_teacher());

CREATE POLICY "View active categories" ON public.question_categories
    FOR SELECT USING (is_active = true OR public.is_admin_or_teacher());

CREATE POLICY "Manage categories" ON public.question_categories
    FOR ALL USING (public.is_admin_or_teacher());

-- Quiz Settings: View active settings, Admins manage
CREATE POLICY "View quiz settings" ON public.quiz_settings
    FOR SELECT USING (is_active = true OR public.is_admin_or_teacher());

CREATE POLICY "Manage quiz settings" ON public.quiz_settings
    FOR ALL USING (public.is_admin_or_teacher());

-- Questions: Admins can view/manage all; Students only query via secure functions
CREATE POLICY "Manage questions" ON public.questions
    FOR ALL USING (public.is_admin_or_teacher());

CREATE POLICY "Manage options" ON public.question_options
    FOR ALL USING (public.is_admin_or_teacher());

-- Quiz attempts: Users can see own attempts, Admins can view all
CREATE POLICY "View quiz attempts" ON public.quiz_attempts
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_teacher());

CREATE POLICY "View attempt questions" ON public.quiz_attempt_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quiz_attempts a
            WHERE a.id = attempt_id AND (a.user_id = auth.uid() OR public.is_admin_or_teacher())
        )
    );

-- Coin Transactions: Users view own transactions
CREATE POLICY "View own transactions" ON public.coin_transactions
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_teacher());

-- ====================================================================
-- SECURE RPC PROCEDURES (ANTI-CHEAT & CONSISTENCY)
-- ====================================================================

-- 1. Initialize User Profile and starter equipment on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_hair UUID;
    default_outfit UUID;
    default_bottom UUID;
    default_shoes UUID;
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, coins)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'student'),
        100 -- Starting bonus 100 coins
    );

    -- Grant starter items
    INSERT INTO public.player_inventory (user_id, item_id)
    SELECT new.id, id FROM public.items WHERE is_default = true;

    SELECT id INTO default_hair FROM public.items WHERE asset_id = 'hair-short-brown' LIMIT 1;
    SELECT id INTO default_outfit FROM public.items WHERE asset_id = 'outfit-blue-tee' LIMIT 1;
    SELECT id INTO default_bottom FROM public.items WHERE asset_id = 'bottom-denim-jeans' LIMIT 1;
    SELECT id INTO default_shoes FROM public.items WHERE asset_id = 'shoes-red-sneakers' LIMIT 1;

    INSERT INTO public.player_equipment (
        user_id, hair_item_id, outfit_item_id, bottom_item_id, shoes_item_id
    ) VALUES (
        new.id, default_hair, default_outfit, default_bottom, default_shoes
    );

    INSERT INTO public.coin_transactions (user_id, amount, type, description)
    VALUES (new.id, 100, 'initial_bonus', 'Bonus selamat datang EduQuest');

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. START QUIZ SESSION (Randomized & Secure questions without answers)
CREATE OR REPLACE FUNCTION public.start_quiz_session(p_category_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_settings public.quiz_settings%ROWTYPE;
    v_attempt_id UUID;
    v_easy_questions UUID[];
    v_med_questions UUID[];
    v_hard_questions UUID[];
    v_all_questions UUID[];
    v_q_id UUID;
    v_order INT := 1;
    v_result JSONB;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Fetch settings
    SELECT * INTO v_settings FROM public.quiz_settings
    WHERE category_id = p_category_id AND is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pengaturan kuis tidak ditemukan atau belum aktif';
    END IF;

    -- Pick randomized easy questions
    SELECT ARRAY(
        SELECT id FROM public.questions
        WHERE category_id = p_category_id AND difficulty = 'easy' AND status = 'published'
        ORDER BY RANDOM() LIMIT v_settings.easy_count
    ) INTO v_easy_questions;

    -- Pick randomized medium questions
    SELECT ARRAY(
        SELECT id FROM public.questions
        WHERE category_id = p_category_id AND difficulty = 'medium' AND status = 'published'
        ORDER BY RANDOM() LIMIT v_settings.medium_count
    ) INTO v_med_questions;

    -- Pick randomized hard questions
    SELECT ARRAY(
        SELECT id FROM public.questions
        WHERE category_id = p_category_id AND difficulty = 'hard' AND status = 'published'
        ORDER BY RANDOM() LIMIT v_settings.hard_count
    ) INTO v_hard_questions;

    IF array_length(v_easy_questions, 1) < v_settings.easy_count THEN
        RAISE EXCEPTION 'Bank soal mudah tidak mencukupi (tersedia %, dibutuhkan %)', COALESCE(array_length(v_easy_questions, 1), 0), v_settings.easy_count;
    END IF;

    IF array_length(v_med_questions, 1) < v_settings.medium_count THEN
        RAISE EXCEPTION 'Bank soal sedang tidak mencukupi (tersedia %, dibutuhkan %)', COALESCE(array_length(v_med_questions, 1), 0), v_settings.medium_count;
    END IF;

    IF array_length(v_hard_questions, 1) < v_settings.hard_count THEN
        RAISE EXCEPTION 'Bank soal sulit tidak mencukupi (tersedia %, dibutuhkan %)', COALESCE(array_length(v_hard_questions, 1), 0), v_settings.hard_count;
    END IF;

    -- Merge and shuffle
    SELECT ARRAY(
        SELECT unnest FROM unnest(v_easy_questions || v_med_questions || v_hard_questions)
        ORDER BY RANDOM()
    ) INTO v_all_questions;

    -- Create attempt
    INSERT INTO public.quiz_attempts (user_id, category_id, total_questions, status)
    VALUES (v_user_id, p_category_id, v_settings.total_questions, 'in_progress')
    RETURNING id INTO v_attempt_id;

    -- Insert attempt questions
    FOREACH v_q_id IN ARRAY v_all_questions LOOP
        INSERT INTO public.quiz_attempt_questions (attempt_id, question_id, order_num)
        VALUES (v_attempt_id, v_q_id, v_order);
        v_order := v_order + 1;
    END LOOP;

    -- Prepare sanitized output (WITHOUT is_correct to prevent inspect cheat)
    SELECT jsonb_build_object(
        'attempt_id', v_attempt_id,
        'category_id', p_category_id,
        'total_questions', v_settings.total_questions,
        'reward_per_correct', v_settings.reward_per_correct,
        'questions', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', q.id,
                    'order_num', aq.order_num,
                    'question_text', q.question_text,
                    'difficulty', q.difficulty,
                    'options', (
                        SELECT jsonb_agg(
                            jsonb_build_object(
                                'id', opt.id,
                                'option_label', opt.option_label,
                                'option_text', opt.option_text
                            ) ORDER BY opt.sort_order
                        )
                        FROM public.question_options opt
                        WHERE opt.question_id = q.id
                    )
                ) ORDER BY aq.order_num
            )
            FROM public.quiz_attempt_questions aq
            JOIN public.questions q ON q.id = aq.question_id
            WHERE aq.attempt_id = v_attempt_id
        )
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. SUBMIT QUIZ ATTEMPT (Verifies answers, computes score, awards coins safely)
CREATE OR REPLACE FUNCTION public.submit_quiz_attempt(
    p_attempt_id UUID,
    p_answers JSONB -- [{question_id: uuid, selected_option_id: uuid}]
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_attempt public.quiz_attempts%ROWTYPE;
    v_settings public.quiz_settings%ROWTYPE;
    v_correct_count INT := 0;
    v_total_questions INT;
    v_coins_earned INT := 0;
    v_score_pct NUMERIC(5,2);
    v_answer JSONB;
    v_q_id UUID;
    v_opt_id UUID;
    v_is_correct BOOLEAN;
    v_breakdown JSONB;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT * INTO v_attempt FROM public.quiz_attempts
    WHERE id = p_attempt_id AND user_id = v_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Sesi kuis tidak valid';
    END IF;

    IF v_attempt.status = 'completed' THEN
        RAISE EXCEPTION 'Kuis ini sudah diselesaikan sebelumnya';
    END IF;

    SELECT * INTO v_settings FROM public.quiz_settings
    WHERE category_id = v_attempt.category_id;

    v_total_questions := v_attempt.total_questions;

    -- Evaluate each answer
    FOR v_answer IN SELECT * FROM jsonb_array_elements(p_answers) LOOP
        v_q_id := (v_answer->>'question_id')::UUID;
        v_opt_id := (v_answer->>'selected_option_id')::UUID;

        -- Check correctness
        SELECT is_correct INTO v_is_correct
        FROM public.question_options
        WHERE id = v_opt_id AND question_id = v_q_id;

        IF v_is_correct IS TRUE THEN
            v_correct_count := v_correct_count + 1;
        END IF;

        -- Record response in attempt questions
        UPDATE public.quiz_attempt_questions
        SET selected_option_id = v_opt_id,
            is_correct = COALESCE(v_is_correct, false)
        WHERE attempt_id = p_attempt_id AND question_id = v_q_id;
    END LOOP;

    -- Calculate coins & percentage
    v_coins_earned := v_correct_count * v_settings.reward_per_correct;
    v_score_pct := ROUND((v_correct_count::numeric / v_total_questions::numeric) * 100, 2);

    -- Update attempt record
    UPDATE public.quiz_attempts
    SET status = 'completed',
        correct_answers = v_correct_count,
        score_percentage = v_score_pct,
        coins_earned = v_coins_earned,
        completed_at = now()
    WHERE id = p_attempt_id;

    -- Award coins to profile
    IF v_coins_earned > 0 THEN
        UPDATE public.profiles
        SET coins = coins + v_coins_earned,
            updated_at = now()
        WHERE id = v_user_id;

        INSERT INTO public.coin_transactions (user_id, amount, type, description)
        VALUES (
            v_user_id,
            v_coins_earned,
            'quiz_reward',
            'Reward ' || v_correct_count || ' jawaban benar kuis'
        );
    END IF;

    -- Build breakdown with correct answers and explanations for learning
    SELECT jsonb_agg(
        jsonb_build_object(
            'question_id', q.id,
            'question_text', q.question_text,
            'explanation', q.explanation,
            'selected_option_id', aq.selected_option_id,
            'is_correct', aq.is_correct,
            'correct_option', (
                SELECT jsonb_build_object(
                    'id', opt.id,
                    'label', opt.option_label,
                    'text', opt.option_text
                )
                FROM public.question_options opt
                WHERE opt.question_id = q.id AND opt.is_correct = true
                LIMIT 1
            )
        ) ORDER BY aq.order_num
    ) INTO v_breakdown
    FROM public.quiz_attempt_questions aq
    JOIN public.questions q ON q.id = aq.question_id
    WHERE aq.attempt_id = p_attempt_id;

    RETURN jsonb_build_object(
        'attempt_id', p_attempt_id,
        'total_questions', v_total_questions,
        'correct_answers', v_correct_count,
        'wrong_answers', v_total_questions - v_correct_count,
        'score_percentage', v_score_pct,
        'coins_earned', v_coins_earned,
        'breakdown', v_breakdown
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. PURCHASE SHOP ITEM
CREATE OR REPLACE FUNCTION public.purchase_item(p_item_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_item public.items%ROWTYPE;
    v_user_coins INT;
    v_already_owned BOOLEAN;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT * INTO v_item FROM public.items WHERE id = p_item_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Item tidak ditemukan';
    END IF;

    SELECT coins INTO v_user_coins FROM public.profiles WHERE id = v_user_id;

    SELECT EXISTS (
        SELECT 1 FROM public.player_inventory
        WHERE user_id = v_user_id AND item_id = p_item_id
    ) INTO v_already_owned;

    IF v_already_owned THEN
        RAISE EXCEPTION 'Item ini sudah kamu miliki!';
    END IF;

    IF v_user_coins < v_item.price THEN
        RAISE EXCEPTION 'Coins kamu tidak mencukupi (Butuh % Coins, kamu punya % Coins)', v_item.price, v_user_coins;
    END IF;

    -- Deduct coins
    UPDATE public.profiles
    SET coins = coins - v_item.price,
        updated_at = now()
    WHERE id = v_user_id;

    -- Add to inventory
    INSERT INTO public.player_inventory (user_id, item_id)
    VALUES (v_user_id, p_item_id);

    -- Log transaction
    INSERT INTO public.coin_transactions (user_id, amount, type, description)
    VALUES (v_user_id, -v_item.price, 'shop_purchase', 'Membeli item ' || v_item.name);

    RETURN jsonb_build_object(
        'success', true,
        'item_id', p_item_id,
        'item_name', v_item.name,
        'remaining_coins', v_user_coins - v_item.price
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. EQUIP ITEM
CREATE OR REPLACE FUNCTION public.equip_item(p_item_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_item public.items%ROWTYPE;
    v_owns BOOLEAN;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT * INTO v_item FROM public.items WHERE id = p_item_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Item tidak ditemukan';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.player_inventory
        WHERE user_id = v_user_id AND item_id = p_item_id
    ) INTO v_owns;

    IF NOT v_owns THEN
        RAISE EXCEPTION 'Kamu belum memiliki item ini';
    END IF;

    -- Equip according to category
    CASE v_item.category
        WHEN 'hair' THEN
            UPDATE public.player_equipment SET hair_item_id = p_item_id, updated_at = now() WHERE user_id = v_user_id;
        WHEN 'outfit' THEN
            UPDATE public.player_equipment SET outfit_item_id = p_item_id, updated_at = now() WHERE user_id = v_user_id;
        WHEN 'bottom' THEN
            UPDATE public.player_equipment SET bottom_item_id = p_item_id, updated_at = now() WHERE user_id = v_user_id;
        WHEN 'shoes' THEN
            UPDATE public.player_equipment SET shoes_item_id = p_item_id, updated_at = now() WHERE user_id = v_user_id;
        WHEN 'head_accessory' THEN
            UPDATE public.player_equipment SET head_accessory_id = p_item_id, updated_at = now() WHERE user_id = v_user_id;
        WHEN 'face_accessory' THEN
            UPDATE public.player_equipment SET face_accessory_id = p_item_id, updated_at = now() WHERE user_id = v_user_id;
        WHEN 'back_accessory' THEN
            UPDATE public.player_equipment SET back_accessory_id = p_item_id, updated_at = now() WHERE user_id = v_user_id;
    END CASE;

    RETURN jsonb_build_object('success', true, 'equipped_category', v_item.category, 'item_name', v_item.name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- SEED DATA (SUBJECTS, CATEGORIES, ITEMS, QUIZ SETTINGS, BANK SOAL)
-- ====================================================================

-- 1. SEED ITEMS
INSERT INTO public.items (name, category, price, asset_id, description, is_default, rarity) VALUES
-- Hair
('Rambut Pendek Cokelat', 'hair', 0, 'hair-short-brown', 'Gaya rambut rapi dan santai.', true, 'common'),
('Rambut Panjang Hitam', 'hair', 40, 'hair-long-black', 'Rambut panjang lurus berkilau.', false, 'common'),
('Rambut Kriting Pirang', 'hair', 75, 'hair-curly-blonde', 'Gaya rambut ikal ceria berenergi.', false, 'rare'),
('Rambut Spiky Biru', 'hair', 120, 'hair-spiky-blue', 'Rambut ala pahlawan anime keren!', false, 'epic'),

-- Outfit (Atasan)
('Kaos Biru EduQuest', 'outfit', 0, 'outfit-blue-tee', 'Kaos santai berlogo EduQuest.', true, 'common'),
('Kemeja Kotak Merah', 'outfit', 50, 'outfit-red-flannel', 'Kemeja flanel modis dan hangat.', false, 'common'),
('Hoodie Juara Ungu', 'outfit', 90, 'outfit-purple-hoodie', 'Hoodie favorit para pemenang kuis.', false, 'rare'),
('Jas Peneliti Pintar', 'outfit', 150, 'outfit-lab-coat', 'Jas laboratorium ilmuwan cilik!', false, 'epic'),

-- Bottom (Bawahan)
('Celana Denim Biru', 'bottom', 0, 'bottom-denim-jeans', 'Celana jeans klasik nyaman.', true, 'common'),
('Celana Cargo Khaki', 'bottom', 40, 'bottom-cargo-khaki', 'Banyak kantong untuk simpan catatan.', false, 'common'),
('Rok Lipit Kotak', 'bottom', 60, 'bottom-pleated-skirt', 'Rok sekolah modis dan anggun.', false, 'rare'),

-- Shoes
('Sneakers Merah', 'shoes', 0, 'shoes-red-sneakers', 'Sepatu kasual yang lincah.', true, 'common'),
('Sepatu Pantofel Cokelat', 'shoes', 45, 'shoes-brown-loafers', 'Sepatu formal murid berprestasi.', false, 'common'),
('Sepatu Bot Petualang', 'shoes', 80, 'shoes-boots-yellow', 'Siap melangkah ke segala tantangan.', false, 'rare'),

-- Accessories (Head, Face, Back)
('Topi Baseball Kuning', 'head_accessory', 50, 'acc-yellow-cap', 'Melindungi dari sinar matahari cerah.', false, 'common'),
('Mahkota Emas Juara', 'head_accessory', 200, 'acc-gold-crown', 'Hanya untuk sang master trivia sejati!', false, 'legendary'),
('Kacamata Cerdas Bulat', 'face_accessory', 60, 'acc-smart-glasses', 'Menambah aura kejeniusanmu +100.', false, 'rare'),
('Tas Ransel Penjelajah', 'back_accessory', 80, 'acc-explorer-bag', 'Muat banyak buku dan camilan!', false, 'rare'),
('Sayap Peri Berkilau', 'back_accessory', 250, 'acc-fairy-wings', 'Sayap ajaib pemancar cahaya bintang.', false, 'legendary')
ON CONFLICT DO NOTHING;

-- 2. SEED SUBJECTS
INSERT INTO public.subjects (name, slug, icon, color, description, is_active) VALUES
('Matematika', 'matematika', 'calculator', '#3B82F6', 'Asah logika berhitung, bangun ruang, dan pecahan.', true),
('IPA (Sains)', 'ipa', 'flask-conical', '#10B981', 'Jelajahi keajaiban alam, energi, dan tata surya.', true),
('Bahasa Indonesia', 'bahasa-indonesia', 'book-open', '#F59E0B', 'Kembangkan wawasan kosa kata, tata bahasa, dan membaca.', true)
ON CONFLICT (slug) DO NOTHING;

-- 3. SEED CATEGORIES FOR MATEMATIKA
DO $$
DECLARE
    v_math_id UUID;
    v_cat_pecahan_id UUID;
    v_cat_hitung_id UUID;
    v_cat_bangun_id UUID;
BEGIN
    SELECT id INTO v_math_id FROM public.subjects WHERE slug = 'matematika';

    -- Insert Kategori Pecahan
    INSERT INTO public.question_categories (subject_id, name, slug, icon, description, is_active)
    VALUES (v_math_id, 'Pecahan', 'pecahan', 'pie-chart', 'Belajar konsep setengah, seperempat, penjumlahan pecahan.', true)
    ON CONFLICT (subject_id, slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_cat_pecahan_id;

    -- Insert Kategori Operasi Hitung
    INSERT INTO public.question_categories (subject_id, name, slug, icon, description, is_active)
    VALUES (v_math_id, 'Operasi Hitung', 'operasi-hitung', 'plus-circle', 'Penjumlahan, pengurangan, perkalian, dan pembagian cepat.', true)
    ON CONFLICT (subject_id, slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_cat_hitung_id;

    -- Insert Kategori Bangun Datar
    INSERT INTO public.question_categories (subject_id, name, slug, icon, description, is_active)
    VALUES (v_math_id, 'Bangun Datar', 'bangun-datar', 'shapes', 'Mengenal persegi, segitiga, lingkaran, dan keliling.', true)
    ON CONFLICT (subject_id, slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_cat_bangun_id;

    -- Quiz settings for Pecahan (10 questions: 4 easy, 4 medium, 2 hard, 10 coins/answer)
    INSERT INTO public.quiz_settings (category_id, total_questions, easy_count, medium_count, hard_count, reward_per_correct, is_active)
    VALUES (v_cat_pecahan_id, 10, 4, 4, 2, 10, true)
    ON CONFLICT (category_id) DO UPDATE SET
        total_questions = EXCLUDED.total_questions,
        easy_count = EXCLUDED.easy_count,
        medium_count = EXCLUDED.medium_count,
        hard_count = EXCLUDED.hard_count,
        reward_per_correct = EXCLUDED.reward_per_correct;

    -- Quiz settings for Operasi Hitung
    INSERT INTO public.quiz_settings (category_id, total_questions, easy_count, medium_count, hard_count, reward_per_correct, is_active)
    VALUES (v_cat_hitung_id, 10, 4, 4, 2, 10, true)
    ON CONFLICT (category_id) DO NOTHING;

    -- Quiz settings for Bangun Datar
    INSERT INTO public.quiz_settings (category_id, total_questions, easy_count, medium_count, hard_count, reward_per_correct, is_active)
    VALUES (v_cat_bangun_id, 10, 4, 4, 2, 10, true)
    ON CONFLICT (category_id) DO NOTHING;

END $$;

-- 4. SEED BANK SOAL (PECAHAN)
DO $$
DECLARE
    v_cat_id UUID;
    v_q_id UUID;
BEGIN
    SELECT id INTO v_cat_id FROM public.question_categories WHERE slug = 'pecahan' LIMIT 1;
    IF v_cat_id IS NULL THEN RETURN; END IF;

    -- ================= EASY QUESTIONS (Min 5) =================
    -- Q1 Easy
    INSERT INTO public.questions (category_id, question_text, difficulty, status, explanation)
    VALUES (v_cat_id, 'Berapakah pecahan yang senilai dengan sebuah apel yang dibagi rata menjadi 2 bagian?', 'easy', 'published', 'Sebuah benda utuh dibagi menjadi 2 bagian yang sama besar bernilai 1/2.')
    RETURNING id INTO v_q_id;
    INSERT INTO public.question_options (question_id, option_label, option_text, is_correct, sort_order) VALUES
    (v_q_id, 'A', '1/4', false, 1),
    (v_q_id, 'B', '1/2', true, 2),
    (v_q_id, 'C', '2/1', false, 3),
    (v_q_id, 'D', '3/4', false, 4);

    -- Q2 Easy
    INSERT INTO public.questions (category_id, question_text, difficulty, status, explanation)
    VALUES (v_cat_id, 'Berapakah hasil dari 1/4 + 2/4 ?', 'easy', 'published', 'Karena penyebutnya sudah sama (4), kita cukup menjumlahkan pembilangnya: 1 + 2 = 3. Jadi hasilnya 3/4.')
    RETURNING id INTO v_q_id;
    INSERT INTO public.question_options (question_id, option_label, option_text, is_correct, sort_order) VALUES
    (v_q_id, 'A', '3/4', true, 1),
    (v_q_id, 'B', '2/4', false, 2),
    (v_q_id, 'C', '3/8', false, 3),
    (v_q_id, 'D', '1/2', false, 4);

    -- Q3 Easy
    INSERT INTO public.questions (category_id, question_text, difficulty, status, explanation)
    VALUES (v_cat_id, 'Manakah pecahan berikut yang bernilai paling kecil?', 'easy', 'published', 'Dengan pembilang yang sama (1), pecahan dengan penyebut terbesar bernilai paling kecil: 1/8 < 1/4 < 1/3 < 1/2.')
    RETURNING id INTO v_q_id;
    INSERT INTO public.question_options (question_id, option_label, option_text, is_correct, sort_order) VALUES
    (v_q_id, 'A', '1/2', false, 1),
    (v_q_id, 'B', '1/3', false, 2),
    (v_q_id, 'C', '1/4', false, 3),
    (v_q_id, 'D', '1/8', true, 4);

    -- Q4 Easy
    INSERT INTO public.questions (category_id, question_text, difficulty, status, explanation)
    VALUES (v_cat_id, 'Bentuk pecahan dari 0,5 adalah...', 'easy', 'published', '0,5 sama dengan 5/10. Jika disederhanakan dengan membagi 5, didapatkan 1/2.')
    RETURNING id INTO v_q_id;
    INSERT INTO public.question_options (question_id, option_label, option_text, is_correct, sort_order) VALUES
    (v_q_id, 'A', '1/5', false, 1),
    (v_q_id, 'B', '1/2', true, 2),
    (v_q_id, 'C', '5/2', false, 3),
    (v_q_id, 'D', '2/5', false, 4);

    -- Q5 Easy
    INSERT INTO public.questions (category_id, question_text, difficulty, status, explanation)
    VALUES (v_cat_id, 'Hasil dari 5/7 - 2/7 adalah...', 'easy', 'published', 'Penyebut sama yaitu 7, kurangkan pembilang: 5 - 2 = 3. Jadi hasilnya 3/7.')
    RETURNING id INTO v_q_id;
    INSERT INTO public.question_options (question_id, option_label, option_text, is_correct, sort_order) VALUES
    (v_q_id, 'A', '3/7', true, 1),
    (v_q_id, 'B', '2/7', false, 2),
    (v_q_id, 'C', '3/14', false, 3),
    (v_q_id, 'D', '7/7', false, 4);

    -- ================= MEDIUM QUESTIONS (Min 5) =================
    -- Q6 Medium
    INSERT INTO public.questions (category_id, question_text, difficulty, status, explanation)
    VALUES (v_cat_id, 'Berapakah hasil dari 1/2 + 1/4 ?', 'medium', 'published', 'Samakan penyebut menjadi 4: 1/2 = 2/4. Maka 2/4 + 1/4 = 3/4.')
    RETURNING id INTO v_q_id;
    INSERT INTO public.question_options (question_id, option_label, option_text, is_correct, sort_order) VALUES
    (v_q_id, 'A', '2/6', false, 1),
    (v_q_id, 'B', '3/4', true, 2),
    (v_q_id, 'C', '1/3', false, 3),
    (v_q_id, 'D', '1', false, 4);

    -- Q7 Medium
    INSERT INTO public.questions (category_id, question_text, difficulty, status, explanation)
    VALUES (v_cat_id, 'Bentuk sederhana dari pecahan 12/18 adalah...', 'medium', 'published', 'Bagi pembilang dan penyebut dengan FPB 6: 12:6 = 2, 18:6 = 3. Hasilnya 2/3.')
    RETURNING id INTO v_q_id;
    INSERT INTO public.question_options (question_id, option_label, option_text, is_correct, sort_order) VALUES
    (v_q_id, 'A', '3/4', false, 1),
    (v_q_id, 'B', '2/3', true, 2),
    (v_q_id, 'C', '6/9', false, 3),
    (v_q_id, 'D', '4/6', false, 4);

    -- Q8 Medium
    INSERT INTO public.questions (category_id, question_text, difficulty, status, explanation)
    VALUES (v_cat_id, 'Budi memiliki sebatang cokelat berukuran 8 potong. Budi memakan 3 potong. Berapa bagian cokelat yang tersisa?', 'medium', 'published', 'Sisa potong = 8 - 3 = 5 potong dari total 8, sehingga bagian yang tersisa adalah 5/8.')
    RETURNING id INTO v_q_id;
    INSERT INTO public.question_options (question_id, option_label, option_text, is_correct, sort_order) VALUES
    (v_q_id, 'A', '3/8', false, 1),
    (v_q_id, 'B', '5/8', true, 2),
    (v_q_id, 'C', '1/2', false, 3),
    (v_q_id, 'D', '8/3', false, 4);

    -- Q9 Medium
    INSERT INTO public.questions (category_id, question_text, difficulty, status, explanation)
    VALUES (v_cat_id, 'Berapakah hasil dari 2/3 x 3/5 ?', 'medium', 'published', 'Kalikan pembilang dengan pembilang (2x3=6) dan penyebut dengan penyebut (3x5=15). 6/15 disederhanakan menjadi 2/5.')
    RETURNING id INTO v_q_id;
    INSERT INTO public.question_options (question_id, option_label, option_text, is_correct, sort_order) VALUES
    (v_q_id, 'A', '2/5', true, 1),
    (v_q_id, 'B', '5/8', false, 2),
    (v_q_id, 'C', '6/8', false, 3),
    (v_q_id, 'D', '1/2', false, 4);

    -- Q10 Medium
    INSERT INTO public.questions (category_id, question_text, difficulty, status, explanation)
    VALUES (v_cat_id, 'Pecahan campuran 2 1/3 jika diubah ke pecahan biasa menjadi...', 'medium', 'published', '(2 x 3) + 1 = 7, penyebut tetap 3. Jadi 7/3.')
    RETURNING id INTO v_q_id;
    INSERT INTO public.question_options (question_id, option_label, option_text, is_correct, sort_order) VALUES
    (v_q_id, 'A', '6/3', false, 1),
    (v_q_id, 'B', '5/3', false, 2),
    (v_q_id, 'C', '7/3', true, 3),
    (v_q_id, 'D', '8/3', false, 4);

    -- ================= HARD QUESTIONS (Min 3) =================
    -- Q11 Hard
    INSERT INTO public.questions (category_id, question_text, difficulty, status, explanation)
    VALUES (v_cat_id, 'Ibu memiliki 3/4 liter minyak goreng. Digunakan memasak 1/3 liter, lalu Ibu membeli lagi 1/2 liter. Berapa liter minyak Ibu sekarang?', 'hard', 'published', '3/4 - 1/3 + 1/2. KPK penyebut 12: 9/12 - 4/12 + 6/12 = 11/12 liter.')
    RETURNING id INTO v_q_id;
    INSERT INTO public.question_options (question_id, option_label, option_text, is_correct, sort_order) VALUES
    (v_q_id, 'A', '11/12 liter', true, 1),
    (v_q_id, 'B', '7/12 liter', false, 2),
    (v_q_id, 'C', '1 liter', false, 3),
    (v_q_id, 'D', '5/6 liter', false, 4);

    -- Q12 Hard
    INSERT INTO public.questions (category_id, question_text, difficulty, status, explanation)
    VALUES (v_cat_id, 'Berapakah hasil pembagian pecahan 3/4 : 2/5 ?', 'hard', 'published', 'Membagi pecahan sama dengan mengalikan dengan kebalikannya: 3/4 x 5/2 = 15/8 = 1 7/8.')
    RETURNING id INTO v_q_id;
    INSERT INTO public.question_options (question_id, option_label, option_text, is_correct, sort_order) VALUES
    (v_q_id, 'A', '6/20', false, 1),
    (v_q_id, 'B', '15/8', true, 2),
    (v_q_id, 'C', '8/15', false, 3),
    (v_q_id, 'D', '5/8', false, 4);

    -- Q13 Hard
    INSERT INTO public.questions (category_id, question_text, difficulty, status, explanation)
    VALUES (v_cat_id, 'Dalam sebuah kelas, 2/5 siswa adalah laki-laki. Jika jumlah siswa laki-laki 16 orang, berapa jumlah total siswa di kelas?', 'hard', 'published', '2/5 x Total = 16. Maka Total = 16 x (5/2) = 40 siswa.')
    RETURNING id INTO v_q_id;
    INSERT INTO public.question_options (question_id, option_label, option_text, is_correct, sort_order) VALUES
    (v_q_id, 'A', '32 siswa', false, 1),
    (v_q_id, 'B', '36 siswa', false, 2),
    (v_q_id, 'C', '40 siswa', true, 3),
    (v_q_id, 'D', '48 siswa', false, 4);

END $$;

