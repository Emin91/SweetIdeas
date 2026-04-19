import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenBackground } from "../components/ScreenBackground";
import { ArrowIcon, GameIcon, HeartIcon, IdeasIcon, PlayIcon, SettingsIcon } from "../assets/svg";
import { hexToRgba } from "../utils/hexToRgba";
import { FONTS } from "../assets/fonts";
import { MainButton } from "../components/MainButton";
import { ImageKeys, IMAGES } from "../assets/images";
import { RootNavigation } from "../navigation/Routing";
import { ACTIVITIES_DATA } from "../data/activitiesData";
import { useDefaultStore } from "../store/useDefaultStore";

type GameType = {
	id: number;
	title: "Friends" | "Solo" | "Partners";
};

const TYPE_MAP: Record<GameType["title"], "friends" | "solo" | "partner"> = {
	Friends: "friends",
	Solo: "solo",
	Partners: "partner"
};

export const HomeScreen = memo(() => {
	const navigation = useNavigation<RootNavigation>();
	const { toggleIdeas, isIdeaSaved, registerRandomUsed, registerIdeaGenerated } = useDefaultStore();

	const topActions = [
		{ icon: <IdeasIcon />, onPress: () => navigation.navigate("SavedIdeas") },
		{ icon: <GameIcon />, onPress: () => navigation.navigate("Achievements") },
		{ icon: <SettingsIcon />, onPress: () => navigation.navigate("Settings") }
	];

	const gameTypes: GameType[] = [
		{ id: 1, title: "Friends" },
		{ id: 2, title: "Solo" },
		{ id: 3, title: "Partners" }
	];

	const categoriesWithAll = useMemo(() => {
		return [
			{ id: "all", category: "all", items: ACTIVITIES_DATA.flatMap(category => category.items) },
			...ACTIVITIES_DATA
		];
	}, []);

	const [selectedOption, setSelectedOption] = useState<GameType>(gameTypes[0]);
	const [categoryIndex, setCategoryIndex] = useState(0);
	const [activityIndex, setActivityIndex] = useState(0);
	const skipNextActivityResetRef = useRef(false);

	const activeCategory = categoriesWithAll[categoryIndex];
	const selectedType = TYPE_MAP[selectedOption.title];

	const filteredActivities = useMemo(() => {
		return activeCategory.items.filter(item => item.type.includes(selectedType));
	}, [activeCategory, selectedType]);

	useEffect(() => {
		if (skipNextActivityResetRef.current) {
			skipNextActivityResetRef.current = false;
			return;
		}
		setActivityIndex(0);
	}, [categoryIndex, selectedOption]);

	const activeActivity = filteredActivities[activityIndex] ?? null;

	const isActiveIdeaSaved =
		activeActivity != null
			? isIdeaSaved(activeActivity.id, activeCategory.id)
			: false;

	const previousCategory = () => {
		setCategoryIndex(prev => (prev - 1 + categoriesWithAll.length) % categoriesWithAll.length);
	};

	const nextCategory = () => {
		setCategoryIndex(prev => (prev + 1) % categoriesWithAll.length);
	};

	const shuffleActivity = () => {
		type TPick = {
			categoryId: number;
			activityIndex: number;
			gameType: GameType;
		};

		const buildPick = (gameType: GameType): Omit<TPick, "gameType"> | null => {
			const nextType = TYPE_MAP[gameType.title];
			const shuffledCategories = [...ACTIVITIES_DATA].sort(() => Math.random() - 0.5);

			for (const category of shuffledCategories) {
				const activitiesForType = category.items.filter(item => item.type.includes(nextType));
				if (activitiesForType.length === 0) continue;

				return {
					categoryId: category.id,
					activityIndex: Math.floor(Math.random() * activitiesForType.length)
				};
			}

			return null;
		};

		const shuffledGameTypes = [...gameTypes].sort(() => Math.random() - 0.5);
		let nextPick: TPick | null = null;

		for (const gameType of shuffledGameTypes) {
			const pickForType = buildPick(gameType);
			if (!pickForType) continue;

			nextPick = { ...pickForType, gameType };
			break;
		}

		if (!nextPick) return;

		const nextCategoryIndex = categoriesWithAll.findIndex(category => category.id === nextPick.categoryId);
		if (nextCategoryIndex === -1) return;

		skipNextActivityResetRef.current = true;
		registerRandomUsed();
		registerIdeaGenerated(nextPick.categoryId);
		setSelectedOption(nextPick.gameType);
		setCategoryIndex(nextCategoryIndex);
		setActivityIndex(nextPick.activityIndex);
	};

	const handleToggleIdeas = () => {
		if (!activeActivity) return;

		toggleIdeas({
			...activeActivity,
			categoryId: activeCategory.id,
			category: activeCategory.category
		});
	};

	return (
		<ScreenBackground style={styles.container} edges={["top"]}>
			<View style={styles.topActions}>
				{topActions.map((action, index) => (
					<TouchableOpacity key={index} onPress={action.onPress}>
						<Text>{action.icon}</Text>
					</TouchableOpacity>
				))}
			</View>

			<View style={styles.carousel}>
				<TouchableOpacity style={styles.leftArrow} onPress={previousCategory}>
					<ArrowIcon />
				</TouchableOpacity>

				<View style={styles.carouselContent}>
					<Image
						source={activeCategory.category === "all" ? IMAGES.dice : IMAGES[`c${activeCategory.id}` as ImageKeys]}
						style={styles.carouselImage}
					/>
					<Text numberOfLines={2} style={styles.carouselText}>
						{activeCategory.category === "all" ? "All Categories" : activeCategory.category}
					</Text>
				</View>

				<TouchableOpacity style={styles.rightArrow} onPress={nextCategory}>
					<ArrowIcon />
				</TouchableOpacity>
			</View>
			<View style={styles.gameTypes}>
				{gameTypes.map(gameType => (
					<TouchableOpacity
						key={gameType.id}
						onPress={() => setSelectedOption(gameType)}
						style={[
							styles.gameTypeButton,
							selectedOption.id === gameType.id
								? styles.gameTypeButtonActive
								: styles.gameTypeButtonInactive
						]}
					>
						<Text
							style={[
								styles.gameTypeText,
								selectedOption.id === gameType.id
									? styles.gameTypeTextActive
									: styles.gameTypeTextInactive
							]}
						>
							{gameType.title}
						</Text>
					</TouchableOpacity>
				))}
			</View>
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
			>
				<View style={styles.card}>
					<TouchableOpacity disabled={!activeActivity?.title} style={[styles.heartButton, { opacity: activeActivity?.title ? 1 : 0 }]} onPress={handleToggleIdeas}>
						<HeartIcon color={isActiveIdeaSaved ? "#FF6DC5" : "#C8B0F1"} />
					</TouchableOpacity>
					<View style={styles.cardContent}>
						<Text style={styles.cardTitle}>
							{activeActivity?.title ?? "No ideas found"}
						</Text>
						<View style={styles.cardDivider} />
						<Text style={styles.cardSubtitle}>
							{activeActivity?.description ??
								`There are no activities in "${activeCategory.category}" for ${selectedOption.title.toLowerCase()} right now.`}
						</Text>
					</View>
				</View>
				<MainButton
					title="Shuffle!"
					icon={IMAGES.dice}
					onPress={shuffleActivity}
					disabled={!activeActivity}
				/>
				<View style={styles.quizCard}>
					<Text style={styles.quizTitle}>Find Your Perfect Pick</Text>
					<View style={styles.quizContent}>
						<Text style={styles.quizText}>
							Answer a few simple questions and we’ll match you with the right idea.
						</Text>
						<TouchableOpacity onPress={() => navigation.navigate("Quiz")}>
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
	carousel: {
		height: 80,
		marginTop: 22,
		borderRadius: 16,
		paddingHorizontal: 6,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: hexToRgba("#EDFAFF")
	},
	carouselImage: {
		width: 40,
		height: 40
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
	carouselContent: {
		flex: 1,
		gap: 10,
		paddingHorizontal: 6,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row"
	},
	carouselText: {
		textAlign: "center",
		fontSize: 26,
		fontFamily: FONTS.JostBlack,
		color: "#FFFFFF",
		flexShrink: 1,
		textTransform: "capitalize"
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
		fontFamily: FONTS.JostBlack
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