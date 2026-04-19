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

enableScreens(true);

export type RootStackParamList = {
	Welcome: undefined;
	Home: undefined;
	Settings: undefined;
	SavedIdeas: undefined;
	Achievements: undefined;
	Quiz: undefined;
	QuizResult: undefined;
	Privacy: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const transparentModalOptions = {
	presentation: "transparentModal" as const,
	animation: "fade" as const,
	contentStyle: { backgroundColor: "transparent" }
};

export const Routing = () => {
	return (
		<NavigationContainer ref={navigationRef}>
			<Stack.Navigator initialRouteName={"Welcome"} screenOptions={{ headerShown: false }}>
				<Stack.Screen name="Welcome" component={WelcomeScreen} />
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Settings" component={SettingsScreen} />
				<Stack.Screen name="SavedIdeas" component={SavedIdeasScreen} />
				<Stack.Screen name="Achievements" component={AchievementsScreen} />
				<Stack.Screen name="Quiz" component={QuizScreen} />
				<Stack.Screen name="QuizResult" component={QuizResultScreen} />
				<Stack.Screen name="Privacy" component={PrivacyScreen} />
				<Stack.Group screenOptions={transparentModalOptions}>
					{/*<Stack.Screen name="ConfirmModal" component={ConfirmModalScreen} />*/}
				</Stack.Group>
			</Stack.Navigator>
		</NavigationContainer>
	);
};
