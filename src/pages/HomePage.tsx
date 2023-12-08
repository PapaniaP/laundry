import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonMenuButton,
	IonTitle,
	IonContent,
	IonButton,
} from "@ionic/react";
import { useParams } from "react-router";
import "./HomePage.css";

import DatePicker from "../components/DatePicker";
import TimeButton from "../components/TimeButton";
import { useState, useEffect } from "react";

function HomePage() {
  const [selectedValues, setSelectedValues] = useState<number[]>([]);

  const handleButtonClick = (value: number) => {
    setSelectedValues(prev => {
      // Toggle selection
      if (prev.includes(value)) {
        return prev.filter(val => val !== value); // Deselect if already selected
      } else {
        return [...prev, value]; // Add to selected values
      }
    });
  };

  // Since setSelectedValues is asynchronous, to see the current state after a click,
  // you can use the useEffect hook with selectedValues as a dependency.
  useEffect(() => {
    console.log(selectedValues);
  }, [selectedValues]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Hello</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <DatePicker />

        <TimeButton
		id={1}
          text="7:00 - 9:00"
          value={1}
          onButtonClick={handleButtonClick}
          isSelected={selectedValues.includes(1)} // Check for value 1
        />
        <TimeButton
		id={2}
          text="9:00 - 11:00"
          value={2}
          onButtonClick={handleButtonClick}
          isSelected={selectedValues.includes(2)} // Check for value 2, not 1
        />
      </IonContent>
    </IonPage>
  );
}

export default HomePage;
