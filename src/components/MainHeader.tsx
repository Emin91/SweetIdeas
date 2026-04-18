import { FC } from "react";
import { StyleSheet, Text, TextProps, TextStyle, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from "react-native";
import { StyleProp } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowIcon } from "../assets/svg";
import { FONTS } from "../assets/fonts";

interface IProps extends TouchableOpacityProps {
	title?: string;
	containerStyle?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
	textProps?: TextProps;
	isBackShown?: boolean;
	rightIcon?: React.ReactNode;
	rightAction?: () => void;
	onBack?: () => void;
}

export const MainHeader: FC<IProps> = ({
	title,
	containerStyle,
	textStyle,
	textProps,
	isBackShown = true,
	rightIcon,
	rightAction,
	onBack,
	...buttonProps
}) => {
	const navigation = useNavigation();

	return (
		<View style={[styles.wrapper, containerStyle]}>
			<TouchableOpacity
				activeOpacity={0.8}
				disabled={!isBackShown}
				style={styles.button}
				onPress={onBack || (() => navigation.goBack())}
				{...buttonProps}
			>
				{isBackShown && <ArrowIcon />}
			</TouchableOpacity>
			{title ? (
				<View style={styles.titleContainer}>
					<Text numberOfLines={1} style={[styles.title, textStyle]} {...textProps}>
						{title}
					</Text>
				</View>
			) : null}
			<TouchableOpacity style={styles.button} disabled={!rightIcon} activeOpacity={0.8} onPress={rightAction}>
				{rightIcon ?? null}
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: "row",
		alignItems: "center"
	},
	button: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center"
	},
	titleContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	title: {
		marginTop: 4,
		fontSize: 28,
		color: "#1F43D4",
		textTransform: "uppercase",
		fontFamily: FONTS.caesarDressing
	}
});
