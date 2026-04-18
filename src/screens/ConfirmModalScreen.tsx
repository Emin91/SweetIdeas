import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

export const ConfirmModalScreen = memo(() => {
	return (
		<View style={styles.container}>
			<Text>Confirm</Text>
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	}
});
