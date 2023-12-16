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
	let buttonColor;

	if (isSelected) {
		buttonFill = "solid";
		buttonColor = "secondary"; // Adjust as necessary
	} else if (isAvailable) {
		buttonFill = "outline";
		buttonColor = "secondary";
	} else {
		buttonFill = "solid";
		buttonColor = "medium";
	}

	// Compute the CSS class for the button
	const buttonClasses = [
		isSelected ? 'time-button-selected' : '',
		!isAvailable ? 'time-button-disabled' : '',
	].join(' ');

	const ariaLabel = `${isAvailable ? "Available" : "Unavailable"} time slot: ${text}`;

	return (
		<IonButton
			className={buttonClasses} // Apply the class here
			onClick={() => onButtonClick(value)}
			disabled={!isAvailable}
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
