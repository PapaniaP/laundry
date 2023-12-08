import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonMenuButton,
	IonTitle,
	IonContent,
	IonButton, IonDatetime, IonItem, IonLabel, IonModal, IonGrid, IonRow
} from "@ionic/react";
import { useParams } from "react-router";
import "./HomePage.css";

import TimeButton from "../components/TimeButton";
import { useState, useEffect } from "react";
import { updateDoc, arrayUnion, doc } from "firebase/firestore";
import { db } from "../firebase-config";
import { formatISO, startOfToday, addDays } from 'date-fns';

interface Booking {
	uid: string;
bookedTimes: number[];
}

function HomePage() {
  const [selectedValues, setSelectedValues] = useState<number[]>([]);
  const [Booking, setBooking] = useState<Booking>({
	uid:"",
	bookedTimes: []
  });

  const [selectedDate, setSelectedDate] = useState<string>(formatISO(startOfToday()));
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const minDate = formatISO(startOfToday());
  const maxDate = formatISO(addDays(startOfToday(), 7));

  const handleDateChange = (e: CustomEvent) => {
    setSelectedDate(e.detail.value as string);
    setShowPicker(false);  // Automatically close the picker when a date is selected
  };

  const dateToBeFetched = selectedDate.split("T")[0];

    useEffect(() => {
    localStorage.setItem('selectedDate', dateToBeFetched);
  }, [dateToBeFetched]);

//   const datesCollectionRef = collection(db, "building-1" , dateToBeFetched)
const dateDocRef = doc(db, "building-1", dateToBeFetched);

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
  
const handleBooking = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        // Prepare the booking data
        const newBooking = {
            uid: "some-uid", // Replace with actual UID
            bookedTimes: selectedValues
        };

        // Update the document with the new booking
        await updateDoc(dateDocRef, {
            bookings: arrayUnion(newBooking)
        });

        // Reset the booking state if needed
        setBooking({
            uid: "",
            bookedTimes: []
        });

        // Possibly redirect or show a success message
    } catch (error) {
        console.error("Failed to create booking:", error);
    }
};

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
      <IonContent fullscreen className="ion-padding">
        <form onSubmit={handleBooking}>
		<IonGrid>
         <IonRow><p>Please pick a date:</p></IonRow>
          <IonRow>      
            <IonButton onClick={() => setShowPicker(true)}>{selectedDate}</IonButton>
            <IonModal isOpen={showPicker} onDidDismiss={() => setShowPicker(false)}>
        <IonItem>
          <IonLabel>Pick a Day</IonLabel>
          <IonDatetime
            presentation="date"
            min={minDate}
            max={maxDate}
            value={selectedDate}
            onIonChange={handleDateChange}
          />
        </IonItem>
        {/* <IonButton onClick={() => setShowPicker(false)}>Done</IonButton> */}
      </IonModal>
</IonRow>

      </IonGrid>      

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

		<IonButton
			expand="block"
			// slot="end"
			type="submit"
		>
			Save and Create
		</IonButton>
		</form>
      </IonContent>
    </IonPage>
  );
}

export default HomePage;
