import { memo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScreenBackground } from "../components/ScreenBackground";
import { ArrowIcon, GameIcon, HeartIcon, IdeasIcon, PlayIcon, SettingsIcon } from "../assets/svg";
import { hexToRgba } from "../utils/hexToRgba";
import { FONTS } from "../assets/fonts";
import { MainButton } from "../components/MainButton";
import { IMAGES } from "../assets/images";
import { RootNavigation } from "../navigation/Routing";
import { useNavigation } from "@react-navigation/native";

export const HomeScreen = memo(() => {
	const navigation = useNavigation<RootNavigation>();

	const topActions = [
		{ icon: <IdeasIcon />, onPress: () => navigation.navigate("SavedIdeas") },
		{ icon: <GameIcon />, onPress: () => navigation.navigate("Achievements") },
		{ icon: <SettingsIcon />, onPress: () => navigation.navigate("Settings") }];

	const gameTypes = [{ id: 1, title: "Friends" }, { id: 2, title: "Solo" }, { id: 3, title: "Partners" }];

	const [selectedOption, setSelectedOption] = useState(gameTypes[0]);

	return (
		<ScreenBackground style={styles.container} edges={["top"]}>
			<View style={styles.topActions}>
				{topActions.map((action, index) => (
					<TouchableOpacity key={index} style={styles.topActionItem} onPress={action.onPress}>
						<Text>{action.icon}</Text>
					</TouchableOpacity>
				))}
			</View>
			<View style={styles.carousel}>
				<TouchableOpacity style={styles.leftArrow}>
					<ArrowIcon />
				</TouchableOpacity>
				<Text numberOfLines={2} style={styles.carouselText}>All categories</Text>
				<TouchableOpacity style={styles.rightArrow}>
					<ArrowIcon />
				</TouchableOpacity>
			</View>
			<View style={styles.gameTypes}>
				{gameTypes.map((gameType, index) => (
					<TouchableOpacity key={index} onPress={() => setSelectedOption(gameType)} style={[styles.gameTypeButton, selectedOption.id === gameType.id ? styles.gameTypeButtonActive : styles.gameTypeButtonInactive]}>
						<Text style={[styles.gameTypeText, selectedOption.id === gameType.id ? styles.gameTypeTextActive : styles.gameTypeTextInactive]}>{gameType.title}</Text>
					</TouchableOpacity>
				))}
			</View>
			<ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
				<View style={styles.card}>
					<TouchableOpacity style={styles.heartButton}>
						<HeartIcon color="#C8B0F1" />
					</TouchableOpacity>
					<View style={styles.cardContent}>
						<Text style={styles.cardTitle}>Cook Without Recipe</Text>
						<View style={styles.cardDivider} />
						<Text style={styles.cardSubtitle}>Make a dish using only what you have.</Text>
					</View>
				</View>
				<MainButton title="Shuffle!" icon={IMAGES.dice} />
				<View style={styles.quizCard}>
					<Text style={styles.quizTitle}>Find Your Perfect Pick</Text>
					<View style={styles.quizContent}>
						<Text style={styles.quizText}>Answer a few simple questions and we’ll match you with the right idea.</Text>
						<TouchableOpacity>
							<PlayIcon />
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</ScreenBackground>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20
	},
	topActions: {
		marginTop: 20,
		gap: 10,
		flexDirection: "row",
		justifyContent: "flex-end"
	},
	topActionItem: {},
	carousel: {
		height: 80,
		marginTop: 22,
		borderRadius: 16,
		paddingHorizontal: 6,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: hexToRgba("#EDFAFF")
	},
	leftArrow: {
		width: 30,
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		transform: [{ rotate: "180deg" }]
	},
	rightArrow: {
		width: 30,
		height: "100%",
		justifyContent: "center",
		alignItems: "center"
	},
	carouselText: {
		flex: 1,
		flexShrink: 1,
		textAlign: "center",
		fontSize: 26,
		fontFamily: FONTS.JostBlack,
		color: "#FFFFFF"
	},
	gameTypes: {
		gap: 6,
		flexDirection: "row",
		marginTop: 14
	},
	gameTypeButton: {
		flex: 1,
		height: 36,
		borderRadius: 10,
		paddingHorizontal: 12,
		justifyContent: "center",
		alignItems: "center"
	},
	gameTypeButtonActive: {
		backgroundColor: "#B092FF"
	},
	gameTypeButtonInactive: {
		backgroundColor: "#E3CDFF"
	},
	gameTypeText: {
		fontFamily: FONTS.JostBlack,
		fontSize: 18
	},
	gameTypeTextActive: {
		color: "#FFFFFF"
	},
	gameTypeTextInactive: {
		color: "#beb0dd"
	},
	scrollView: {
		marginTop: 14
	},
	scrollContent: {
		gap: 14,
		paddingBottom: 30
	},
	card: {
		width: "100%",
		borderRadius: 16,
		padding: 14,
		backgroundColor: hexToRgba("#FFFFFF"),
		height: 276
	},
	heartButton: {
		alignSelf: "flex-end"
	},
	cardContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 6
	},
	cardTitle: {
		color: "#FFFFFF",
		fontSize: 30,
		fontFamily: FONTS.JostBlack,
		textAlign: "center"
	},
	cardDivider: {
		height: 3,
		borderRadius: 3,
		width: "100%",
		backgroundColor: "#FF9DD8"
	},
	cardSubtitle: {
		color: "#FFFFFF",
		fontSize: 22,
		fontFamily: FONTS.JostSemiBold,
		textAlign: "center"
	},
	quizCard: {
		backgroundColor: "#E68772",
		borderRadius: 16,
		paddingVertical: 10,
		paddingHorizontal: 22,
		gap: 4
	},
	quizTitle: {
		color: "#FFFFFF",
		fontSize: 28,
		fontFamily: FONTS.JostBlack,
	},
	quizContent: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10
	},
	quizText: {
		color: "#FFFFFF",
		fontSize: 20,
		fontFamily: FONTS.JostSemiBold,
		flexShrink: 1
	}
});