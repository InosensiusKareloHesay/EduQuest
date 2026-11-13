import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, Item, PlayerEquipment, QuizResult, UserRole, QuizSessionData } from '@/types';
import { INITIAL_ITEMS, DEFAULT_STUDENT_PROFILE, DEFAULT_EQUIPMENT } from '@/lib/mockData';

interface GameState {
  profile: Profile;
  userRole: UserRole;
  inventory: string[]; // item ids owned
  equipment: PlayerEquipment;
  coins: number;
  soundEnabled: boolean;
  activeQuizSession: QuizSessionData | null;
  quizAnswers: Record<string, string>; // questionId -> selectedOptionId
  quizHistory: QuizResult[];
  
  // Actions
  setProfile: (profile: Profile) => void;
  setUserRole: (role: UserRole) => void;
  setCoins: (coins: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  buyItem: (item: Item) => { success: boolean; message: string };
  equipItem: (item: Item) => void;
  unequipCategory: (category: keyof PlayerEquipment) => void;
  toggleSound: () => void;
  
  // Quiz Actions
  startQuizSession: (session: QuizSessionData) => void;
  selectQuizAnswer: (questionId: string, optionId: string) => void;
  clearQuizSession: () => void;
  recordQuizResult: (result: QuizResult) => void;
  resetDemoData: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_STUDENT_PROFILE,
      userRole: 'student',
      // Default unlocked items: all items with is_default=true
      inventory: INITIAL_ITEMS.filter((i) => i.is_default).map((i) => i.id),
      equipment: DEFAULT_EQUIPMENT,
      coins: 100,
      soundEnabled: true,
      activeQuizSession: null,
      quizAnswers: {},
      quizHistory: [],

      setProfile: (profile) => set({ profile, coins: profile.coins, userRole: profile.role }),

      setUserRole: (role) => set({ userRole: role }),

      setCoins: (coins) =>
        set((state) => ({
          coins,
          profile: { ...state.profile, coins },
        })),

      addCoins: (amount) =>
        set((state) => {
          const nextCoins = state.coins + amount;
          return {
            coins: nextCoins,
            profile: { ...state.profile, coins: nextCoins },
          };
        }),

      spendCoins: (amount) => {
        const current = get().coins;
        if (current < amount) return false;
        const nextCoins = current - amount;
        set((state) => ({
          coins: nextCoins,
          profile: { ...state.profile, coins: nextCoins },
        }));
        return true;
      },

      buyItem: (item) => {
        const state = get();
        if (state.inventory.includes(item.id)) {
          return { success: false, message: 'Item ini sudah kamu miliki!' };
        }
        if (state.coins < item.price) {
          return {
            success: false,
            message: `Koin tidak cukup! Butuh ${item.price} koin, kamu punya ${state.coins} koin.`,
          };
        }

        const success = state.spendCoins(item.price);
        if (success) {
          set((s) => ({
            inventory: [...s.inventory, item.id],
          }));
          // Auto equip item if purchased
          get().equipItem(item);
          return { success: true, message: `Berhasil membeli ${item.name}!` };
        }
        return { success: false, message: 'Gagal melakukan transaksi.' };
      },

      equipItem: (item) => {
        const state = get();
        if (!state.inventory.includes(item.id)) return;

        const nextEquipment = { ...state.equipment };
        switch (item.category) {
          case 'hair':
            nextEquipment.hair_item_id = item.id;
            break;
          case 'outfit':
            nextEquipment.outfit_item_id = item.id;
            break;
          case 'bottom':
            nextEquipment.bottom_item_id = item.id;
            break;
          case 'shoes':
            nextEquipment.shoes_item_id = item.id;
            break;
          case 'head_accessory':
            nextEquipment.head_accessory_id = item.id;
            break;
          case 'face_accessory':
            nextEquipment.face_accessory_id = item.id;
            break;
          case 'back_accessory':
            nextEquipment.back_accessory_id = item.id;
            break;
        }
        set({ equipment: nextEquipment });
      },

      unequipCategory: (categoryKey) => {
        set((state) => ({
          equipment: {
            ...state.equipment,
            [categoryKey]: null,
          },
        }));
      },

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      startQuizSession: (session) => {
        set({
          activeQuizSession: session,
          quizAnswers: {},
        });
      },

      selectQuizAnswer: (questionId, optionId) => {
        set((state) => ({
          quizAnswers: {
            ...state.quizAnswers,
            [questionId]: optionId,
          },
        }));
      },

      clearQuizSession: () => {
        set({
          activeQuizSession: null,
          quizAnswers: {},
        });
      },

      recordQuizResult: (result) => {
        set((state) => ({
          quizHistory: [result, ...state.quizHistory],
        }));
        get().addCoins(result.coins_earned);
      },

      resetDemoData: () => {
        set({
          profile: DEFAULT_STUDENT_PROFILE,
          coins: 100,
          inventory: INITIAL_ITEMS.filter((i) => i.is_default).map((i) => i.id),
          equipment: DEFAULT_EQUIPMENT,
          activeQuizSession: null,
          quizAnswers: {},
          quizHistory: [],
        });
      },
    }),
    {
      name: 'eduquest-game-storage',
    }
  )
);

