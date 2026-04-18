import { ImageBackground, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { FC, PropsWithChildren } from "react";
import { Edges, SafeAreaView } from "react-native-safe-area-context";
import { ImageKeys, IMAGES } from "../assets/images";

interface IProps extends PropsWithChildren {
	backgroundKey?: ImageKeys;
	style?: StyleProp<ViewStyle>;
	edges?: Edges;
}

export const ScreenBackground: FC<IProps> = ({ edges = ["top", "bottom"], backgroundKey, style, children }) => {
	return (
		<ImageBackground style={styles.container} source={backgroundKey ? IMAGES[backgroundKey] : IMAGES.bg}>
			<SafeAreaView style={styles.container} edges={edges}>
				<View style={[styles.container, style]}>{children}</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
});
