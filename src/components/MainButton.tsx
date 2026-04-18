import { FC } from "react";
import { Image, StyleSheet, Text, TextProps, TextStyle, TouchableOpacity, TouchableOpacityProps, ViewStyle } from "react-native";
import { StyleProp } from "react-native";
import { FONTS } from "../assets/fonts";

interface IProps extends Omit<TouchableOpacityProps, "style"> {
	title: string;
	buttonStyle?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
	textProps?: TextProps;
	icon?: any;
}

export const MainButton: FC<IProps> = ({ title, buttonStyle, textStyle, textProps, icon, ...buttonProps }) => {
	return (
		<TouchableOpacity activeOpacity={0.8} style={[styles.container, buttonStyle]} {...buttonProps}>
			{icon && <Image source={icon} style={styles.icon} />}
			<Text numberOfLines={1} style={[styles.text, textStyle]} {...textProps}>
				{title}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: 70,
		borderRadius: 40,
		paddingHorizontal: 40,
		gap: 12,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#FFC62B"
	},
	icon: {
		width: 32,
		height: 32
	},
	text: {
		fontSize: 34,
		color: "#FFF",
		fontFamily: FONTS.JostBlack
	}
});
