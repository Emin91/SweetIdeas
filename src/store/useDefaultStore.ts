import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "../services/MmkvAdapter";

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
};

export const useDefaultStore = create<TDefaultStoreState>()(
	persist(
		set => ({
			isNotificationEnabled: false,
			isSoundsEnabled: true,
			isMusicEnabled: true,
			savedIdeas: [],
			toggleIsNotificationEnabled: () => set(state => ({ isNotificationEnabled: !state.isNotificationEnabled })),
			toggleIsSoundsEnabled: () => set(state => ({ isSoundsEnabled: !state.isSoundsEnabled })),
			toggleIsMusicEnabled: () => set(state => ({ isMusicEnabled: !state.isMusicEnabled })),

			addSavedIdea: (idea: any) => set(state => ({ savedIdeas: [...state.savedIdeas, idea] })),
			removeSavedIdeaById: (id: number) => set(state => ({ savedIdeas: state.savedIdeas.filter(idea => idea.id !== id) })),
			clearSavedIdeas: () => set({ savedIdeas: [] })
		}),
		{
			name: "default-store",
			storage: createJSONStorage(() => mmkvStorage),
			partialize: state => ({
				isNotificationEnabled: state.isNotificationEnabled,
				isSoundsEnabled: state.isSoundsEnabled,
				isMusicEnabled: state.isMusicEnabled,
				savedIdeas: state.savedIdeas
			})
		}
	)
);
