import { memo, } from "react";
import { StyleSheet } from "react-native";
import { ScreenBackground } from "../components/ScreenBackground";
import { MainHeader } from "../components/MainHeader";
import WebView from "react-native-webview";

export const PrivacyScreen = memo(() => {

	return (
		<ScreenBackground style={styles.container}>
			<MainHeader title="Privacy" containerStyle={styles.header} />
			<WebView style={styles.webview} source={{ uri: 'https://www.freeprivacypolicy.com/live/a2d35136-9885-4df5-bc5f-3a75b4946885' }} />
		</ScreenBackground>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 20,
	},
	header: {
		paddingHorizontal: 20,
	},
	webview: {
		flex: 1,
	}
});
