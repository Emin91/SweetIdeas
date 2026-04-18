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
};

export const useDefaultStore = create<TDefaultStoreState>()(
	persist(
		set => ({
			isNotificationEnabled: false,
			isSoundsEnabled: true,
			isMusicEnabled: true,
			toggleIsNotificationEnabled: () => set(state => ({ isNotificationEnabled: !state.isNotificationEnabled })),
			toggleIsSoundsEnabled: () => set(state => ({ isSoundsEnabled: !state.isSoundsEnabled })),
			toggleIsMusicEnabled: () => set(state => ({ isMusicEnabled: !state.isMusicEnabled }))
		}),
		{
			name: "default-store",
			storage: createJSONStorage(() => mmkvStorage),
			partialize: state => ({
				isNotificationEnabled: state.isNotificationEnabled,
				isSoundsEnabled: state.isSoundsEnabled,
				isMusicEnabled: state.isMusicEnabled
			})
		}
	)
);
