import React from "react";
import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { SavedIdeasScreen } from "../screens/SavedIdeasScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { AchievementsScreen } from "../screens/AchievementsScreen";
import { QuizScreen } from "../screens/QuizScreen";
import { QuizResultScreen } from "../screens/QuizResultScreen";
import { PrivacyScreen } from "../screens/PrivacyScreen";
import { useDefaultStore } from "../store/useDefaultStore";

enableScreens(true);

export type RootStackParamList = {
	Welcome: undefined;
	Home: undefined;
	Settings: undefined;
	SavedIdeas: undefined;
	Achievements: undefined;
	Quiz: undefined;
	QuizResult: {
		activity: {
			id: number;
			title: string;
			description: string;
			type: string[];
		};
		category: {
			id: number;
			category: string;
		};
	};
	Privacy: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const Routing = () => {
	const isDisclaimerShowed = useDefaultStore(state => state.isDisclaimerShowed)

	return (
		<NavigationContainer ref={navigationRef}>
			<Stack.Navigator initialRouteName={isDisclaimerShowed ? "Home" : "Welcome"} screenOptions={{ headerShown: false }}>
				<Stack.Screen name="Welcome" component={WelcomeScreen} />
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Settings" component={SettingsScreen} />
				<Stack.Screen name="SavedIdeas" component={SavedIdeasScreen} />
				<Stack.Screen name="Achievements" component={AchievementsScreen} />
				<Stack.Screen name="Quiz" component={QuizScreen} />
				<Stack.Screen name="QuizResult" component={QuizResultScreen} />
				<Stack.Screen name="Privacy" component={PrivacyScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};
