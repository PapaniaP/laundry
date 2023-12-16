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
	let buttonFill: "solid" | "outline" | "clear" | "default";
	if (isSelected) {
		buttonFill = "solid"; // or any other color to indicate selection
	} else if (isAvailable) {
		buttonFill = "outline";
	} else {
		buttonFill = "outline";
	}

	let buttonColor;
	if (isSelected) {
		buttonColor = "primary"; // or any other color to indicate selection
	} else if (isAvailable) {
		buttonColor = "primary";
	} else {
		buttonColor = "danger";
	}

	const ariaLabel = `${isAvailable ? "Available" : "Unavailable"} time slot: ${text}`;

	return (
		<IonButton
			onClick={() => onButtonClick(value)}
			disabled={!isAvailable} // disable button if not available
			fill={buttonFill}
			color={buttonColor}
			aria-label={ariaLabel} // Descriptive label for screen readers
			aria-pressed={isSelected} // Indicates if the button is in a pressed state
		>
			{text}
		</IonButton>
	);
};

export default TimeButton;
