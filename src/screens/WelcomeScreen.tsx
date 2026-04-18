import { memo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenBackground } from "../components/ScreenBackground";
import { RootNavigation } from "../navigation/Routing";
import { useNavigation } from "@react-navigation/native";
import { MainButton } from "../components/MainButton";
import { ImageKeys } from "../assets/images";
import { FONTS } from "../assets/fonts";

export const WelcomeScreen = memo(() => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const navigation = useNavigation<RootNavigation>();

	const data = [
		{
			id: 1,
			title: "Pick Something to Do Instantly!",
			description: `No more overthinking or endless scrolling.\n\nGet simple, ready-to-go ideas for your time in just a few taps.\n\nOpen the app, pick a mode, and start right away.`
		},
		{
			id: 2,
			title: "Set Your Preferences",
			description: "Choose who you’re with — solo, with friends, or with a partner. \n\nSelect categories you’re in the mood for, or leave everything open.\n\nThe app will use these settings to give you more relevant ideas."
		},
		{
			id: 3,
			title: "Get a Random Idea",
			description: "Tap “Shuffle!” to instantly receive a suggestion.\n\nEach card gives you a quick, clear idea you can act on right away.\n\nNot feeling it? Skip and try another — no limits."
		},
		{
			id: 4,
			title: "Take a Quick Test",
			description: "Answer a few short questions about your mood, energy, and situation.\n\nBased on your answers, the app will match you with a fitting idea.\n\nIt’s the fastest way to get something that actually feels right."
		},
		{
			id: 5,
			title: "Save What You Like",
			description: "Found something you want to try later?\n\nSave ideas to your favorites and keep them in one place.\n\nCome back anytime and pick from your personal list."
		},
		{
			id: 6,
			title: "Track Your Activity",
			description: "Unlock achievements as you explore ideas and use different features.\n\nTry new categories, use both modes, and build your collection.\n\nA simple way to track how much you’ve explored."
		},
		{
			id: 7,
			title: "Disclaimer",
			description: "This app provides general suggestions for entertainment purposes only.\n\nAll ideas are optional and should be considered based on your personal preferences, environment, and safety.\n\nThe app does not guarantee specific results or outcomes from any activity.\n\nUsers are responsible for their own decisions and actions.\n\nAlways use common sense and consider any limitations, risks, or local restrictions before trying an idea."
		}
	]

	const currentItem = data[selectedIndex];
	const isLastSlide = selectedIndex === data.length - 1;
	const isFirstSlide = selectedIndex === 0;

	const onNext = () => {
		if (isLastSlide) {
			navigation.navigate("Home")
			return;
		}
		setSelectedIndex(selectedIndex + 1);
	};

	return (
		<ScreenBackground backgroundKey={isLastSlide ? 'bg' : `w${currentItem.id}` as ImageKeys} style={styles.container}>
			<ScrollView
				bounces={false}
				showsVerticalScrollIndicator={false}
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}>
				<View style={styles.content}>
					<Text style={styles.title}>{currentItem.title}</Text>
					<View style={styles.divider} />
					<Text style={styles.description}>{currentItem.description}</Text>
				</View>
			</ScrollView>
			<MainButton title={isLastSlide ? "I Agree" : isFirstSlide ? "Start" : "Continue"} onPress={onNext} />
		</ScreenBackground>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		marginBottom: 10
	},
	content: {
		gap: 8,
	},
	scrollView: {
		marginBottom: 30
	},
	scrollViewContent: {
		flexGrow: 1,
		justifyContent: 'flex-end',
	},
	divider: {
		width: '100%',
		height: 3,
		borderRadius: 3,
		backgroundColor: '#FF9DD8',
	},
	title: {
		fontSize: 30,
		color: '#FFFFFF',
		fontFamily: FONTS.JostBlack,
		textAlign: 'center'
	},
	description: {
		fontSize: 22,
		color: '#FFFFFF',
		fontFamily: FONTS.JostSemiBold,
		textAlign: 'center'
	}
});
