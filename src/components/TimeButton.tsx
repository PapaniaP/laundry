import { IonButton } from "@ionic/react";
import "./TimeButton.css";

interface TimeButtonProps {
	id: number;
	text: string;
	value: number;
	onButtonClick: (value: number) => void;
	isSelected: boolean;
	isAvailable: boolean; // new prop to indicate if the time slot is available
}

const TimeButton: React.FC<TimeButtonProps> = ({
	text,
	value,
	onButtonClick,
	isSelected,
	isAvailable,
	id,
}) => {
	let buttonColor;
	if (isSelected) {
		buttonColor = "tertiary"; // or any other color to indicate selection
	} else if (isAvailable) {
		buttonColor = "success";
	} else {
		buttonColor = "danger";
	}

	return (
		<IonButton
			color={buttonColor}
			onClick={() => onButtonClick(value)}
			disabled={!isAvailable} // disable button if not available
		>
			{text}
		</IonButton>
	);
};

export default TimeButton;
