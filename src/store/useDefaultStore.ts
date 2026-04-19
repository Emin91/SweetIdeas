import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "../services/MmkvAdapter";
import { ACHIEVEMENTS_DATA } from "../data/achievements";

type TAchievement = (typeof ACHIEVEMENTS_DATA)[number];

type TSavedIdea = {
	id: number;
	title: string;
	info: string;
};

type TDefaultStoreState = {
	isNotificationEnabled: boolean;
	isSoundsEnabled: boolean;
	isMusicEnabled: boolean;
	toggleIsNotificationEnabled: () => void;
	toggleIsSoundsEnabled: () => void;
	toggleIsMusicEnabled: () => void;

	savedIdeas: TSavedIdea[];
	addSavedIdea: (idea: TSavedIdea) => void;
	removeSavedIdeaById: (id: number) => void;
	clearSavedIdeas: () => void;

	achievements: TAchievement[];
	unlockAchievementById: (id: number) => void;
	isAchievementUnlocked: (id: number) => boolean;
};

export const useDefaultStore = create<TDefaultStoreState>()(
	persist<TDefaultStoreState, [], [], Partial<TDefaultStoreState>>(
		(set, get) => ({
			isNotificationEnabled: false,
			isSoundsEnabled: true,
			isMusicEnabled: true,
			toggleIsNotificationEnabled: () => set(state => ({ isNotificationEnabled: !state.isNotificationEnabled })),
			toggleIsSoundsEnabled: () => set(state => ({ isSoundsEnabled: !state.isSoundsEnabled })),
			toggleIsMusicEnabled: () => set(state => ({ isMusicEnabled: !state.isMusicEnabled })),

			savedIdeas: [],
			addSavedIdea: (idea: TSavedIdea) => set(state => ({ savedIdeas: [...state.savedIdeas, idea] })),
			removeSavedIdeaById: (id: number) => set(state => ({ savedIdeas: state.savedIdeas.filter(idea => idea.id !== id) })),
			clearSavedIdeas: () => set({ savedIdeas: [] }),

			achievements: ACHIEVEMENTS_DATA,
			unlockAchievementById: (id: number) =>
				set(state => ({
					achievements: state.achievements.map(item => (item.id === id ? { ...item, isUnlocked: true } : item))
				})),
			isAchievementUnlocked: (id: number) => {
				const achievement = get().achievements.find(item => item.id === id);
				return achievement?.isUnlocked || false;
			}
		}),
		{
			name: "default-store",
			storage: createJSONStorage(() => mmkvStorage),
			partialize: (state): Partial<TDefaultStoreState> => ({
				isNotificationEnabled: state.isNotificationEnabled,
				isSoundsEnabled: state.isSoundsEnabled,
				isMusicEnabled: state.isMusicEnabled,
				savedIdeas: state.savedIdeas,
				achievements: state.achievements
			})
		}
	)
);
