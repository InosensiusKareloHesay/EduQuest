export type UserRole = 'student' | 'teacher' | 'admin';

export type ItemCategory = 
  | 'hair' 
  | 'outfit' 
  | 'bottom' 
  | 'shoes' 
  | 'head_accessory' 
  | 'face_accessory' 
  | 'back_accessory';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type QuestionStatus = 'draft' | 'published';
export type QuizStatus = 'in_progress' | 'completed' | 'abandoned';
export type CoinTxnType = 'quiz_reward' | 'shop_purchase' | 'initial_bonus' | 'admin_adjustment';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  coins: number;
  avatar_skin: string;
  avatar_expression: string;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  asset_id: string;
  description: string;
  is_default: boolean;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface PlayerEquipment {
  hair_item_id: string | null;
  outfit_item_id: string | null;
  bottom_item_id: string | null;
  shoes_item_id: string | null;
  head_accessory_id: string | null;
  face_accessory_id: string | null;
  back_accessory_id: string | null;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  is_active: boolean;
  created_at?: string;
}

export interface QuestionCategory {
  id: string;
  subject_id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  is_active: boolean;
  created_at?: string;
}

export interface QuizSettings {
  id: string;
  category_id: string;
  total_questions: number;
  easy_count: number;
  medium_count: number;
  hard_count: number;
  reward_per_correct: number;
  is_active: boolean;
}

export interface QuestionOption {
  id: string;
  question_id?: string;
  option_label: 'A' | 'B' | 'C' | 'D';
  option_text: string;
  is_correct?: boolean; // Hidden from student during quiz!
  sort_order: number;
}

export interface Question {
  id: string;
  category_id: string;
  question_text: string;
  difficulty: DifficultyLevel;
  status: QuestionStatus;
  explanation?: string;
  options: QuestionOption[];
  created_at?: string;
}

export interface QuizSessionQuestion {
  id: string;
  order_num: number;
  question_text: string;
  difficulty: DifficultyLevel;
  options: {
    id: string;
    option_label: string;
    option_text: string;
  }[];
}

export interface QuizSessionData {
  attempt_id: string;
  category_id: string;
  category_name: string;
  subject_name: string;
  total_questions: number;
  reward_per_correct: number;
  questions: QuizSessionQuestion[];
}

export interface QuizResultBreakdown {
  question_id: string;
  question_text: string;
  explanation: string;
  selected_option_id: string | null;
  is_correct: boolean;
  correct_option: {
    id: string;
    label: string;
    text: string;
  };
}

export interface QuizResult {
  attempt_id: string;
  category_id: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  score_percentage: number;
  coins_earned: number;
  breakdown: QuizResultBreakdown[];
  completed_at: string;
}

export interface CoinTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: CoinTxnType;
  description: string;
  created_at: string;
}

