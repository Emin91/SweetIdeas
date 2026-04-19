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

type TStats = {
	hasUsedRandom: boolean;
	hasCompletedQuiz: boolean;
	openedIdeasCount: number;
	generatedInSessionCount: number;
	triedCategoryIds: Array<number | string>;
	lastSessionAt: number | null;
	appOpenStreakDays: number;
	lastAppOpenDayKey: string | null;
};

type TDefaultStoreState = {
	isNotificationEnabled: boolean;
	isSoundsEnabled: boolean;
	isMusicEnabled: boolean;
	toggleIsNotificationEnabled: () => void;
	toggleIsSoundsEnabled: () => void;
	toggleIsMusicEnabled: () => void;

	isDisclaimerShowed: boolean;
	setIsDisclaimerShowed: (value: boolean) => void;

	achievements: TAchievement[];
	unlockAchievementById: (id: number) => void;
	isAchievementUnlocked: (id: number) => boolean;

	stats: TStats;
	registerAppOpen: () => void;
	registerRandomUsed: () => void;
	registerQuizCompleted: () => void;
	registerIdeaGenerated: (categoryId: number | string) => void;

	savedIdeas: TSavedIdea[];
	toggleIdeas: (idea: TSavedIdea) => void;
	isIdeaSaved: (ideaId: number, categoryId: number | string) => boolean;
};

const buildDayKey = (date: Date) => {
	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const isYesterday = (todayKey: string, previousKey: string) => {
	const [ty, tm, td] = todayKey.split("-").map(Number);
	const [py, pm, pd] = previousKey.split("-").map(Number);
	if (!ty || !tm || !td || !py || !pm || !pd) return false;

	const today = new Date(ty, tm - 1, td);
	const previous = new Date(py, pm - 1, pd);
	const diffDays = Math.round((today.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
	return diffDays === 1;
};

export const useDefaultStore = create<TDefaultStoreState>()(
	persist<TDefaultStoreState, [], [], Partial<TDefaultStoreState>>(
		(set, get) => ({
			isNotificationEnabled: false,
			isSoundsEnabled: true,
			isMusicEnabled: true,
			isDisclaimerShowed: false,

			toggleIsNotificationEnabled: () =>
				set(state => ({
					isNotificationEnabled: !state.isNotificationEnabled
				})),

			setIsDisclaimerShowed: (value: boolean) =>
				set(() => ({
					isDisclaimerShowed: value
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

			stats: {
				hasUsedRandom: false,
				hasCompletedQuiz: false,
				openedIdeasCount: 0,
				generatedInSessionCount: 0,
				triedCategoryIds: [],
				lastSessionAt: null,
				appOpenStreakDays: 0,
				lastAppOpenDayKey: null
			},

			registerAppOpen: () =>
				set(state => {
					const todayKey = buildDayKey(new Date());
					const lastKey = state.stats.lastAppOpenDayKey;
					let nextStreak = state.stats.appOpenStreakDays;

					if (lastKey === todayKey) {
						return state;
					}

					if (!lastKey) {
						nextStreak = 1;
					} else if (isYesterday(todayKey, lastKey)) {
						nextStreak = nextStreak + 1;
					} else {
						nextStreak = 1;
					}

					const nextAchievements =
						nextStreak >= 3 ? state.achievements.map(item => (item.id === 8 ? { ...item, isUnlocked: true } : item)) : state.achievements;

					return {
						stats: {
							...state.stats,
							appOpenStreakDays: nextStreak,
							lastAppOpenDayKey: todayKey
						},
						achievements: nextAchievements
					};
				}),

			registerRandomUsed: () =>
				set(state => {
					if (state.stats.hasUsedRandom) return state;

					const nextStats = { ...state.stats, hasUsedRandom: true };
					const nextAchievements = state.achievements.map(item => {
						if (item.id === 2) return { ...item, isUnlocked: true };
						if (item.id === 7 && nextStats.hasCompletedQuiz) return { ...item, isUnlocked: true };
						return item;
					});

					return {
						stats: nextStats,
						achievements: nextAchievements
					};
				}),

			registerQuizCompleted: () =>
				set(state => {
					if (state.stats.hasCompletedQuiz) return state;

					const nextStats = { ...state.stats, hasCompletedQuiz: true };
					const nextAchievements = state.achievements.map(item => {
						if (item.id === 3) return { ...item, isUnlocked: true };
						if (item.id === 7 && nextStats.hasUsedRandom) return { ...item, isUnlocked: true };
						return item;
					});

					return {
						stats: nextStats,
						achievements: nextAchievements
					};
				}),

			registerIdeaGenerated: (categoryId: number | string) =>
				set(state => {
					const now = Date.now();
					const isNewSession = state.stats.lastSessionAt == null || now - state.stats.lastSessionAt > 1000 * 60 * 30;
					const nextGeneratedInSession = isNewSession ? 1 : state.stats.generatedInSessionCount + 1;
					const nextOpened = state.stats.openedIdeasCount + 1;

					const nextTriedCategoryIds = state.stats.triedCategoryIds.includes(categoryId)
						? state.stats.triedCategoryIds
						: [categoryId, ...state.stats.triedCategoryIds];

					const shouldUnlockFirstPick = nextOpened >= 1;
					const shouldUnlockTenIdeas = nextOpened >= 10;
					const shouldUnlockThreeCategories = nextTriedCategoryIds.length >= 3;
					const shouldUnlockLuckyStreak = nextGeneratedInSession >= 5;

					const nextAchievements = state.achievements.map(item => {
						if (item.id === 1 && shouldUnlockFirstPick) return { ...item, isUnlocked: true };
						if (item.id === 5 && shouldUnlockTenIdeas) return { ...item, isUnlocked: true };
						if (item.id === 6 && shouldUnlockThreeCategories) return { ...item, isUnlocked: true };
						if (item.id === 9 && shouldUnlockLuckyStreak) return { ...item, isUnlocked: true };
						return item;
					});

					return {
						stats: {
							...state.stats,
							openedIdeasCount: nextOpened,
							generatedInSessionCount: nextGeneratedInSession,
							triedCategoryIds: nextTriedCategoryIds,
							lastSessionAt: now
						},
						achievements: nextAchievements
					};
				}),

			savedIdeas: [],

			toggleIdeas: (idea: TSavedIdea) =>
				set(state => {
					const exists = state.savedIdeas.some(item => item.id === idea.id && item.categoryId === idea.categoryId);
					const nextSavedIdeas = exists
						? state.savedIdeas.filter(item => !(item.id === idea.id && item.categoryId === idea.categoryId))
						: [idea, ...state.savedIdeas];

					const shouldUnlockCollector = nextSavedIdeas.length >= 5;
					const nextAchievements = shouldUnlockCollector
						? state.achievements.map(item => (item.id === 4 ? { ...item, isUnlocked: true } : item))
						: state.achievements;

					return {
						savedIdeas: nextSavedIdeas,
						achievements: nextAchievements
					};
				}),

			isIdeaSaved: (ideaId: number, categoryId: number | string) => {
				return get().savedIdeas.some(item => item.id === ideaId && item.categoryId === categoryId);
			}
		}),
		{
			name: "default-store",
			storage: createJSONStorage(() => mmkvStorage),
			partialize: (state): Partial<TDefaultStoreState> => ({
				isNotificationEnabled: state.isNotificationEnabled,
				isSoundsEnabled: state.isSoundsEnabled,
				isMusicEnabled: state.isMusicEnabled,
				achievements: state.achievements,
				savedIdeas: state.savedIdeas,
				stats: state.stats,
				isDisclaimerShowed: state.isDisclaimerShowed
			})
		}
	)
);
