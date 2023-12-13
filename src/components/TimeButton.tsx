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
	const buttonColour = isAvailable ? "danger" : "danger";
	return (
		<IonButton
			fill={"solid"}
			color={buttonColour}
			onClick={() => onButtonClick(value)}
			disabled={!isAvailable} // disable button if not available
		>
			{text}
		</IonButton>
	);
};

export default TimeButton;
