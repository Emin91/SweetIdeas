import { SafeAreaProvider } from "react-native-safe-area-context";
import { Routing } from "./src/navigation/Routing";
import { enableScreens } from "react-native-screens";

enableScreens();

export const App = () => {

	return (
		<SafeAreaProvider>
			<Routing />
		</SafeAreaProvider>
	);
};
