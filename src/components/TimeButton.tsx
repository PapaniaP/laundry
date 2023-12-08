
import { IonButton } from '@ionic/react';

interface TimeButtonProps {
    id: number;
  text: string;
  value: number;
  onButtonClick: (value: number) => void;
  isSelected: boolean;
}

const TimeButton: React.FC<TimeButtonProps> = ({ text, value, onButtonClick, isSelected, id }) => {
  return (
    <IonButton 
      fill = {isSelected ? "solid" : "outline"}
      color={isSelected ? "light" : "dark"} 
      onClick={() => onButtonClick(value)}
    >
      {text}
    </IonButton>
  );
};

export default TimeButton;
