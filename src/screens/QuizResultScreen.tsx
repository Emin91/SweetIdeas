import { memo, useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ScreenBackground } from "../components/ScreenBackground";
import { FONTS } from "../assets/fonts";
import { hexToRgba } from "../utils/hexToRgba";
import { MainButton } from "../components/MainButton";
import { HeartIcon } from "../assets/svg";
import { RootNavigation, RootStackParamList } from "../navigation/Routing";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { useDefaultStore } from "../store/useDefaultStore";

export const QuizResultScreen = memo(() => {
	const navigation = useNavigation<RootNavigation>();
	const route = useRoute<RouteProp<RootStackParamList, "QuizResult">>();
	const { activity, category } = route.params;
	const { toggleIdeas, isIdeaSaved, registerIdeaGenerated } = useDefaultStore();
	const isActiveIdeaSaved = isIdeaSaved(activity.id, category.id);
	const hasRegisteredGeneratedRef = useRef(false);

	useEffect(() => {
		if (hasRegisteredGeneratedRef.current) return;
		hasRegisteredGeneratedRef.current = true;
		registerIdeaGenerated(category.id);
	}, [category.id, registerIdeaGenerated]);

	const handleToggleIdeas = () => {
		toggleIdeas({
			...activity,
			categoryId: category.id,
			category: category.category
		});
	};

	return (
		<ScreenBackground style={styles.container}>
			<ScrollView>
				<Text style={styles.title}>Your Pick Is Ready!</Text>
				<Text style={styles.subtitle}>Based on your answers, here’s something you can try right now.</Text>
				<View style={styles.card}>
					<TouchableOpacity style={styles.heartButton} onPress={handleToggleIdeas}>
						<HeartIcon color={isActiveIdeaSaved ? "#FF6DC5" : "#C8B0F1"} />
					</TouchableOpacity>
					<View style={styles.cardContent}>
						<Text style={styles.cardTitle}>{activity.title}</Text>
						<View style={styles.cardDivider} />
						<Text style={styles.cardSubtitle}>{activity.description}</Text>
					</View>
				</View>
			</ScrollView>
			<MainButton title="Restart Test!" onPress={() => navigation.reset({ index: 0, routes: [{ name: "Home" }, { name: "Quiz" }] })} buttonStyle={styles.resetButton} />
			<MainButton title="Quit" onPress={() => navigation.reset({ index: 0, routes: [{ name: "Home" }] })} />
		</ScreenBackground>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 20,
		paddingHorizontal: 20
	},
	title: {
		fontSize: 30,
		fontFamily: FONTS.JostBlack,
		color: "#FFFFFF",
		textAlign: "center"
	},
	subtitle: {
		fontSize: 22,
		fontFamily: FONTS.JostSemiBold,
		color: "#FFFFFF",
		textAlign: "center",
		marginTop: 10,
		marginBottom: 20
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
	resetButton: {
		backgroundColor: "#FF752B",
		marginVertical: 12
	}
});