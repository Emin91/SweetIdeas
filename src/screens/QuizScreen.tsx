import { memo, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenBackground } from "../components/ScreenBackground";
import { MainHeader } from "../components/MainHeader";
import { FONTS } from "../assets/fonts";
import { MainButton } from "../components/MainButton";
import { RootNavigation } from "../navigation/Routing";
import { QUIZ_LIST } from "../data/quizList";
import { ACTIVITIES_DATA } from "../data/activitiesData";
import { hexToRgba } from "../utils/hexToRgba";
import { useDefaultStore } from "../store/useDefaultStore";

export const QuizScreen = memo(() => {
	const navigation = useNavigation<RootNavigation>();
	const registerQuizCompleted = useDefaultStore(state => state.registerQuizCompleted);
	const [quizListIndex] = useState(0);
	const quizListKey = `list_${quizListIndex + 1}` as keyof typeof QUIZ_LIST;
	const questions = QUIZ_LIST[quizListKey] ?? QUIZ_LIST.list_1;
	const [shuffledQuestions, setShuffledQuestions] = useState(questions);
	const [questionIndex, setQuestionIndex] = useState(0);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const [answersByQuestionId, setAnswersByQuestionId] = useState<Record<number, number | null>>({});

	const activeQuestion = shuffledQuestions[questionIndex];
	const isLastQuestion = questionIndex === shuffledQuestions.length - 1;
	const isAnswerSelected = selectedIndex === null;

	const shuffleArray = <T,>(items: T[]): T[] => {
		const array = [...items];
		for (let i = array.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	};

	const onSelectAnswer = (index: number) => {
		if (selectedIndex !== null) return;
		setSelectedIndex(index);
		setAnswersByQuestionId(prev => ({ ...prev, [activeQuestion.id]: index }));
	};

	const onFinish = () => {
		registerQuizCompleted();
		const companyIndex = answersByQuestionId[2] ?? null;
		const selectedType = companyIndex === 1 ? "friends" : companyIndex === 2 ? "partner" : "solo";

		const interestIndex = answersByQuestionId[4] ?? null;
		const moodIndex = answersByQuestionId[1] ?? null;

		const categoryFromInterest =
			interestIndex === 0
				? "activity"
				: interestIndex === 1
					? "entertainment"
					: interestIndex === 2
						? "creativity"
						: interestIndex === 3
							? "social"
							: interestIndex === 4
								? "random"
								: interestIndex === 5
									? "food"
									: null;

		const categoryFromMood =
			moodIndex === 0
				? "selfTime"
				: moodIndex === 1
					? "activity"
					: moodIndex === 2
						? "creativity"
						: moodIndex === 3
							? "random"
							: moodIndex === 4
								? "learning"
								: moodIndex === 5
									? "entertainment"
									: null;

		const preferredCategory = categoryFromInterest ?? categoryFromMood;

		const pickRandom = <T,>(items: T[]): T | null => {
			if (items.length === 0) return null;
			return items[Math.floor(Math.random() * items.length)] ?? null;
		};

		const pickFromCategory = () => {
			if (!preferredCategory) return null;
			const category = ACTIVITIES_DATA.find(item => item.category === preferredCategory);
			if (!category) return null;
			const activities = category.items.filter(item => item.type.includes(selectedType));
			const activity = pickRandom(activities);
			if (!activity) return null;
			return { category, activity };
		};

		const pickFromAnyCategoryByType = () => {
			const categories = [...ACTIVITIES_DATA].sort(() => Math.random() - 0.5);
			for (const category of categories) {
				const activities = category.items.filter(item => item.type.includes(selectedType));
				const activity = pickRandom(activities);
				if (!activity) continue;
				return { category, activity };
			}
			return null;
		};

		const pickAny = () => {
			const category = pickRandom(ACTIVITIES_DATA);
			if (!category) return null;
			const activity = pickRandom(category.items);
			if (!activity) return null;
			return { category, activity };
		};

		const pick = pickFromCategory() ?? pickFromAnyCategoryByType() ?? pickAny();
		if (!pick) return;

		navigation.navigate("QuizResult", {
			activity: {
				id: pick.activity.id,
				title: pick.activity.title,
				description: pick.activity.description,
				type: pick.activity.type
			},
			category: {
				id: pick.category.id,
				category: pick.category.category
			}
		});
	}

	const onContinue = () => {
		if (isAnswerSelected) return;

		if (isLastQuestion) {
			onFinish()
			return;
		}

		setQuestionIndex(questionIndex + 1);
		setSelectedIndex(null);
	};

	useEffect(() => {
		setShuffledQuestions(
			questions.map(question => ({
				...question,
				options: shuffleArray(question.options)
			}))
		);
		setQuestionIndex(0);
		setSelectedIndex(null);
		setAnswersByQuestionId({});
	}, [questions, quizListIndex]);

	if (!activeQuestion) return null;

	return (
		<ScreenBackground>
			<View style={styles.container}>
				<MainHeader title={`Question ${questionIndex + 1}/${shuffledQuestions.length}`} />

				<ScrollView
					showsVerticalScrollIndicator={false}
					style={styles.list}
					contentContainerStyle={styles.scrollContent}
				>
					<View style={styles.questionCard}>
						<Text style={styles.questionText}>{activeQuestion.question}</Text>
					</View>

					<View style={styles.options}>
						{activeQuestion.options.map((option, index) => {
							const isSelected = selectedIndex === index;

							return (
								<TouchableOpacity
									key={index}
									activeOpacity={0.8}
									disabled={selectedIndex !== null}
									onPress={() => onSelectAnswer(index)}
									style={[
										styles.optionItem,
										isAnswerSelected
											? styles.optionItemDefault
											: isSelected
												? styles.optionItemSelected
												: styles.optionItemDimmed
									]}
								>
									<View
										style={[
											styles.optionDot,
											isSelected ? styles.optionDotSelected : styles.optionDotDefault
										]}
									/>
									<Text style={styles.optionText}>{option.title}</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				</ScrollView>

				<MainButton
					title={isLastQuestion ? "Finish" : "Continue"}
					buttonStyle={isAnswerSelected ? styles.buttonDisabled : styles.buttonEnabled}
					disabled={isAnswerSelected}
					onPress={onContinue}
				/>
			</View>
		</ScreenBackground>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20
	},
	list: {
		marginTop: 18
	},
	scrollContent: {
		gap: 20
	},
	questionCard: {
		minHeight: 144,
		padding: 20,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: hexToRgba("#FFFFFF")
	},
	questionText: {
		fontSize: 28,
		color: "#FFFFFF",
		textAlign: "center",
		fontFamily: FONTS.JostBlack
	},
	options: {
		gap: 10
	},
	optionItem: {
		flexDirection: "row",
		gap: 10,
		minHeight: 50,
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 16,
		alignItems: "center",
		backgroundColor: hexToRgba("#FFFFFF")
	},
	optionItemDefault: {
		opacity: 1
	},
	optionItemSelected: {
		opacity: 1
	},
	optionItemDimmed: {
		opacity: 0.5
	},
	optionDot: {
		width: 16,
		height: 16,
		borderRadius: 16
	},
	optionDotSelected: {
		backgroundColor: "#ED6EFF"
	},
	optionDotDefault: {
		backgroundColor: "#FCE5FF"
	},
	optionText: {
		flexShrink: 1,
		fontSize: 22,
		fontFamily: FONTS.JostSemiBold,
		color: "#FFFFFF"
	},
	buttonEnabled: {
		opacity: 1
	},
	buttonDisabled: {
		opacity: 0.5
	}
});