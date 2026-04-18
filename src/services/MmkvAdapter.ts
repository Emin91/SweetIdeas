import { MMKVLoader } from "react-native-mmkv-storage";

const mmkv = new MMKVLoader().initialize();

export const mmkvStorage = {
	getItem: (name: string): string | null => {
		const value = mmkv.getString(name);
		return typeof value === "string" ? value : null;
	},
	setItem: (name: string, value: string): void => {
		mmkv.setString(name, value);
	},
	removeItem: (name: string): void => {
		mmkv.removeItem(name);
	}
};
