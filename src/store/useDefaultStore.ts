import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "../services/MmkvAdapter";
import { ACHIEVEMENTS_DATA } from "../data/achievements";
import { ACTIVITIES_DATA } from "../data/activitiesData";

type TAchievement = (typeof ACHIEVEMENTS_DATA)[number];
type TActivityItem = (typeof ACTIVITIES_DATA)[number]["items"][number];

type TSavedIdea = TActivityItem & {
	categoryId: number | string;
	category: string;
};

type TDefaultStoreState = {
	isNotificationEnabled: boolean;
	isSoundsEnabled: boolean;
	isMusicEnabled: boolean;
	toggleIsNotificationEnabled: () => void;
	toggleIsSoundsEnabled: () => void;
	toggleIsMusicEnabled: () => void;

	achievements: TAchievement[];
	unlockAchievementById: (id: number) => void;
	isAchievementUnlocked: (id: number) => boolean;

	savedIdeas: TSavedIdea[];
	toggleIdeas: (idea: TSavedIdea) => void;
	isIdeaSaved: (ideaId: number, categoryId: number | string) => boolean;
};

export const useDefaultStore = create<TDefaultStoreState>()(
	persist<TDefaultStoreState, [], [], Partial<TDefaultStoreState>>(
		(set, get) => ({
			isNotificationEnabled: false,
			isSoundsEnabled: true,
			isMusicEnabled: true,

			toggleIsNotificationEnabled: () =>
				set(state => ({
					isNotificationEnabled: !state.isNotificationEnabled
				})),

			toggleIsSoundsEnabled: () =>
				set(state => ({
					isSoundsEnabled: !state.isSoundsEnabled
				})),

			toggleIsMusicEnabled: () =>
				set(state => ({
					isMusicEnabled: !state.isMusicEnabled
				})),

			achievements: ACHIEVEMENTS_DATA,

			unlockAchievementById: (id: number) =>
				set(state => ({
					achievements: state.achievements.map(item => (item.id === id ? { ...item, isUnlocked: true } : item))
				})),

			isAchievementUnlocked: (id: number) => {
				const achievement = get().achievements.find(item => item.id === id);
				return achievement?.isUnlocked || false;
			},

			savedIdeas: [],

			toggleIdeas: (idea: TSavedIdea) =>
				set(state => {
					const exists = state.savedIdeas.some(item => item.id === idea.id && item.categoryId === idea.categoryId);

					if (exists) {
						return {
							savedIdeas: state.savedIdeas.filter(item => !(item.id === idea.id && item.categoryId === idea.categoryId))
						};
					}

					return {
						savedIdeas: [idea, ...state.savedIdeas]
					};
				}),

			isIdeaSaved: (ideaId: number, categoryId: number | string) => {
				return get().savedIdeas.some(item => item.id === ideaId && item.categoryId === categoryId);
			}
		}),
		{
			name: "defaultV3-store",
			storage: createJSONStorage(() => mmkvStorage),
			partialize: (state): Partial<TDefaultStoreState> => ({
				isNotificationEnabled: state.isNotificationEnabled,
				isSoundsEnabled: state.isSoundsEnabled,
				isMusicEnabled: state.isMusicEnabled,
				achievements: state.achievements,
				savedIdeas: state.savedIdeas
			})
		}
	)
);
