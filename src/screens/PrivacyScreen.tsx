import { memo, } from "react";
import { StyleSheet } from "react-native";
import { ScreenBackground } from "../components/ScreenBackground";
import { MainHeader } from "../components/MainHeader";
import WebView from "react-native-webview";

export const PrivacyScreen = memo(() => {

	return (
		<ScreenBackground style={styles.container}>
			<MainHeader title="Privacy" />
			<WebView style={styles.webview} source={{ uri: 'https://sweetideas.app/privacy-policy' }} />
		</ScreenBackground>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 20,
		padding: 20
	},
	webview: {
		flex: 1,
	}
});
