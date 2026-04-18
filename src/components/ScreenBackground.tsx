import { ImageBackground, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { FC, PropsWithChildren } from "react";
import { Edges, SafeAreaView } from "react-native-safe-area-context";
import { ImageKeys, IMAGES } from "../assets/images";

interface IProps extends PropsWithChildren {
	backgroundKey?: ImageKeys;
	style?: StyleProp<ViewStyle>;
	edges?: Edges;
	overlayKey?: ImageKeys;
}

export const ScreenBackground: FC<IProps> = ({ edges = ["top", "bottom"], backgroundKey, style, children }) => {
	return (
		<ImageBackground style={styles.container} source={backgroundKey ? IMAGES[backgroundKey] : IMAGES.bg2}>
			<SafeAreaView style={styles.container} edges={edges}>
				<View style={[styles.content, style]}>{children}</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	content: {
		flex: 1,
		zIndex: 2
	},
	overlay: {
		position: "absolute",
		bottom: 0,
		left: 0,
		width: "100%",
		height: "100%",
		zIndex: 1
	},
	image: {
		width: "100%",
		height: "100%"
	}
});
