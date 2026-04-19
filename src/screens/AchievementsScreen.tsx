import { memo } from "react";
import { Image, ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import { ScreenBackground } from "../components/ScreenBackground";
import { MainHeader } from "../components/MainHeader";
import { useDefaultStore } from "../store/useDefaultStore";
import { FONTS } from "../assets/fonts";
import { hexToRgba } from "../utils/hexToRgba";
import { ImageKeys, IMAGES } from "../assets/images";

const { width } = Dimensions.get("window");
const H_PADDING = 40;
const GAP = 10;
const ITEM_WIDTH = (width - H_PADDING - GAP * 2) / 3;

export const AchievementsScreen = memo(() => {
	const achievements = useDefaultStore(state => state.achievements);

	return (
		<ScreenBackground style={styles.container}>
			<MainHeader title="Achievements" />
			<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
				<View style={styles.imageRow}>
					{achievements.map(item => (
						<View key={item.id} style={styles.imageContainer}>
							<Image resizeMode="contain" source={item.isUnlocked ? IMAGES[`a${item.id}` as ImageKeys] : IMAGES.lock} style={styles.image} />
						</View>
					))}
				</View>
				<View style={styles.achievementsList}>
					{achievements.map(item => (
						<View key={item.id} style={styles.item}>
							<View style={styles.content}>
								<Text style={styles.title}>{item.title}</Text>
								<View style={styles.divider} />
								<Text style={styles.info}>{item.info}</Text>
							</View>
						</View>
					))}
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
	scrollContent: {
		marginTop: 24,
		paddingBottom: 60
	},
	achievementsList: {
		gap: 10
	},
	imageRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between"
	},
	imageContainer: {
		width: ITEM_WIDTH,
		aspectRatio: 1,
		marginBottom: 10,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
		backgroundColor: hexToRgba("#FFFFFF")
	},
	image: {
		width: "80%",
		height: "80%"
	},
	item: {
		backgroundColor: hexToRgba("#FFFFFF"),
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 10,
		gap: 10,
		flexDirection: "row"
	},
	divider: {
		width: "100%",
		height: 3,
		borderRadius: 3,
		backgroundColor: "#FF9DD8"
	},
	content: {
		flex: 1,
		gap: 4
	},
	title: {
		flexShrink: 1,
		fontSize: 20,
		fontFamily: FONTS.JostBlack,
		color: "#FFFFFF"
	},
	info: {
		flexShrink: 1,
		fontSize: 16,
		fontFamily: FONTS.JostSemiBold,
		color: "#FFFFFF"
	}
});