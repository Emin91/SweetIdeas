import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScreenBackground } from "../components/ScreenBackground";

export const WelcomeScreen = memo(() => {
	return (
		<ScreenBackground>
			<View style={styles.container}>
				<Text>Welcome</Text>
			</View>
		</ScreenBackground>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
