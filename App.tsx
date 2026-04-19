import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Routing } from "./src/navigation/Routing";
import { enableScreens } from "react-native-screens";
import { useDefaultStore } from "./src/store/useDefaultStore";

enableScreens();

export const App = () => {
	const registerAppOpen = useDefaultStore(state => state.registerAppOpen);

	useEffect(() => {
		registerAppOpen();
	}, [registerAppOpen]);

	return (
		<SafeAreaProvider>
			<Routing />
		</SafeAreaProvider>
	);
};
