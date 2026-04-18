import { memo, } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { ScreenBackground } from "../components/ScreenBackground";
import { MainHeader } from "../components/MainHeader";
import { hexToRgba } from "../utils/hexToRgba";
import { useDefaultStore } from "../store/useDefaultStore";
import { MainButton } from "../components/MainButton";
import { FONTS } from "../assets/fonts";

export const SettingsScreen = memo(() => {
	const isNotificationEnabled = useDefaultStore(state => state.isNotificationEnabled);
	const isSoundsEnabled = useDefaultStore(state => state.isSoundsEnabled);
	const isMusicEnabled = useDefaultStore(state => state.isMusicEnabled);
	const toggleNotification = useDefaultStore(state => state.toggleIsNotificationEnabled);
	const toggleSounds = useDefaultStore(state => state.toggleIsSoundsEnabled);
	const toggleMusic = useDefaultStore(state => state.toggleIsMusicEnabled);

	const menuItems = [
		{
			id: 1,
			title: 'Notifications',
			value: isNotificationEnabled,
			onPress: toggleNotification,
		},
		{
			id: 2,
			title: 'Sounds',
			value: isSoundsEnabled,
			onPress: toggleSounds,
		},
		{
			id: 3,
			title: 'Music',
			value: isMusicEnabled,
			onPress: toggleMusic,
		},
	];

	return (
		<ScreenBackground style={styles.container}>
			<MainHeader title="Settings" />
			<View style={styles.menuContainer}>
				{menuItems.map((item, index) => (
					<TouchableOpacity onPress={item.onPress} activeOpacity={1} key={index} style={styles.menuItem}>
						<Text style={styles.menuItemText}>{item.title}</Text>
						<View style={styles.switchContainer}>
							<Switch onValueChange={item.onPress} value={item.value} thumbColor={'#FFF'} trackColor={{ false: '#ccc', true: '#A893FD' }} />
						</View>
					</TouchableOpacity>
				))}
			</View>
			<View style={styles.buttonContainer}>
				<MainButton title="Clear Cache" buttonStyle={styles.clearCacheButton} />
				<MainButton title="Privacy Policy" />
			</View>
		</ScreenBackground>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20,
		paddingHorizontal: 20
	},
	menuContainer: {
		gap: 10,
		marginTop: 24,
		flex: 1
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		height: 60,
		borderRadius: 18,
		backgroundColor: hexToRgba('#F7E9FF')
	},
	menuItemText: {
		color: "#FFFFFF",
		fontSize: 26,
		fontFamily: FONTS.JostBlack
	},
	switchContainer: {
		height: "100%",
		justifyContent: "center"
	},
	buttonContainer: {
		gap: 12
	},
	clearCacheButton: {
		backgroundColor: '#FF752B'
	}
});
