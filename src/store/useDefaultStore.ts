import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "../services/MmkvAdapter";
import { ACHIEVEMENTS_DATA } from "../data/achievements";

type TDefaultStoreState = {
	isNotificationEnabled: boolean;
	isSoundsEnabled: boolean;
	isMusicEnabled: boolean;
	toggleIsNotificationEnabled: () => void;
	toggleIsSoundsEnabled: () => void;
	toggleIsMusicEnabled: () => void;

	savedIdeas: any[];
	addSavedIdea: (idea: any) => void;
	removeSavedIdeaById: (id: number) => void;
	clearSavedIdeas: () => void;

	achievements: any[];
	unlockAchievementById: (id: number) => void;
	isAchievementUnlocked: (id: number) => boolean;
};

export const useDefaultStore = create<TDefaultStoreState>()(
	persist(
		set => ({
			isNotificationEnabled: false,
			isSoundsEnabled: true,
			isMusicEnabled: true,
			toggleIsNotificationEnabled: () => set(state => ({ isNotificationEnabled: !state.isNotificationEnabled })),
			toggleIsSoundsEnabled: () => set(state => ({ isSoundsEnabled: !state.isSoundsEnabled })),
			toggleIsMusicEnabled: () => set(state => ({ isMusicEnabled: !state.isMusicEnabled })),

			savedIdeas: [],
			addSavedIdea: (idea: any) => set(state => ({ savedIdeas: [...state.savedIdeas, idea] })),
			removeSavedIdeaById: (id: number) => set(state => ({ savedIdeas: state.savedIdeas.filter(idea => idea.id !== id) })),
			clearSavedIdeas: () => set({ savedIdeas: [] }),

			achievements: ACHIEVEMENTS_DATA,
			isAchievementUnlocked: (id: number) => {
				const achievement = useDefaultStore.getState().achievements.find(achievement => achievement.id === id);
				return achievement?.isUnlocked || false;
			},
			unlockAchievementById: (id: number) =>
				set(state => ({
					achievements: state.achievements.map(achievement => (achievement.id === id ? { ...achievement, isUnlocked: true } : achievement))
				}))
		}),
		{
			name: "default-store",
			storage: createJSONStorage(() => mmkvStorage),
			partialize: state => ({
				isNotificationEnabled: state.isNotificationEnabled,
				isSoundsEnabled: state.isSoundsEnabled,
				isMusicEnabled: state.isMusicEnabled,
				savedIdeas: state.savedIdeas,
				achievements: state.achievements
			})
		}
	)
);
