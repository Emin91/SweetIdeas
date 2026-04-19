import { memo, } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScreenBackground } from "../components/ScreenBackground";
import { MainHeader } from "../components/MainHeader";
import { hexToRgba } from "../utils/hexToRgba";
import { useDefaultStore } from "../store/useDefaultStore";
import { FONTS } from "../assets/fonts";
import { HeartIcon } from "../assets/svg";

export const SavedIdeasScreen = memo(() => {
	const savedIdeas = useDefaultStore(state => state.savedIdeas)

	return (
		<ScreenBackground style={styles.container}>
			<MainHeader title="Saved Ideas" />
			<FlatList
				data={savedIdeas}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.list}
				ListEmptyComponent={() => <Text style={styles.emptyState}>No saved ideas yet</Text>}
				renderItem={({ item }) => (
					<View style={styles.item}>
						<View style={styles.content}>
							<Text style={styles.title}>{item.title}</Text>
							<View style={styles.divider} />
							<Text style={styles.info}>{item.info}</Text>
						</View>
						<TouchableOpacity>
							<HeartIcon color={"#FF6DC5"} />
						</TouchableOpacity>
					</View>
				)} />
		</ScreenBackground>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 20,
		paddingHorizontal: 20
	},
	list: {
		marginTop: 24,
		paddingBottom: 60,
		gap: 10,
	},
	emptyState: {
		fontSize: 30,
		fontFamily: FONTS.JostSemiBold,
		color: '#FFFFFF',
		textAlign: 'center',
		marginTop: 20,
	},
	item: {
		backgroundColor: hexToRgba("#FFFFFF"),
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 10,
		gap: 10,
		flexDirection: 'row',
	},
	divider: {
		width: '100%',
		height: 3,
		borderRadius: 3,
		backgroundColor: '#FF9DD8',
	},
	content: {
		flex: 1,
		gap: 4,
	},
	title: {
		flexShrink: 1,
		fontSize: 20,
		fontFamily: FONTS.JostBlack,
		color: "#FFFFFF",
	},
	info: {
		flexShrink: 1,
		fontSize: 16,
		fontFamily: FONTS.JostSemiBold,
		color: "#FFFFFF",
	},
});
