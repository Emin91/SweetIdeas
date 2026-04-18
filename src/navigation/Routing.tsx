import React from "react";
import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { ConfirmModalScreen } from "../screens/ConfirmModalScreen";

enableScreens(true);

export type RootStackParamList = {
	Welcome: undefined;
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
				<Stack.Group screenOptions={transparentModalOptions}>
					{/*<Stack.Screen name="ConfirmModal" component={ConfirmModalScreen} />*/}
				</Stack.Group>
			</Stack.Navigator>
		</NavigationContainer>
	);
};
