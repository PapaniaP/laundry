import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonButton, IonDatetime, IonItem, IonLabel, IonModal, IonGrid, IonRow, IonCol
} from "@ionic/react";
import { useParams } from "react-router";
import "./HomePage.css";

import TimeButton from "../components/TimeButton";
import { useState, useEffect } from "react";
import { updateDoc, arrayUnion, doc } from "firebase/firestore";
import { db, user } from "../firebase-config";
import { formatISO, startOfToday, addDays } from 'date-fns';
import { getAuth } from "firebase/auth";

interface Booking {
  uid: string;
  bookedTimes: number[];
}

function HomePage() {
  const [selectedValues, setSelectedValues] = useState<number[]>([]);
  const [Booking, setBooking] = useState<Booking>({
    uid: "",
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

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        // Prepare the booking data with the actual user's UID
        const newBooking = {
          uid: currentUser.uid, // Use the UID from the authenticated user
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
        alert("Booking successful");
        // Possibly redirect or show a success message
      } catch (error) {
        console.error("Failed to create booking:", error);
      }
    } else {
      console.error("No user is currently logged in.");
      // Handle the case where there is no authenticated user
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
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonRow> Washer 1</IonRow>
                <IonRow>
                  <TimeButton
                    id={1}
                    text="07:00 - 09:00"
                    value={1}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(1)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={2}
                    text="09:00 - 11:00"
                    value={2}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(2)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={3}
                    text="11:00 - 13:00"
                    value={3}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(3)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={4}
                    text="13:00 - 15:00" // Updated text for id 4
                    value={4}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(4)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={5}
                    text="15:00 - 17:00"
                    value={5}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(5)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={6}
                    text="17:00 - 19:00"
                    value={6}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(6)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={7}
                    text="19:00 - 21:00"
                    value={7}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(7)}
                  />
                </IonRow>
              </IonCol>

              <IonCol>
                <IonRow> Washer 2</IonRow>
                <IonRow>
                  <TimeButton
                    id={8}
                    text="07:00 - 09:00"
                    value={8}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(8)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={9}
                    text="09:00 - 11:00"
                    value={9}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(9)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={10}
                    text="11:00 - 13:00"
                    value={10}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(10)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={11}
                    text="13:00 - 15:00"
                    value={11}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(11)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={12}
                    text="15:00 - 17:00"
                    value={12}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(12)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={13}
                    text="17:00 - 19:00"
                    value={13}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(13)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={14}
                    text="19:00 - 21:00"
                    value={14}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(14)}
                  />
                </IonRow>
              </IonCol>

              <IonCol>
                <IonRow> Dryer</IonRow>
                <IonRow>
                  <TimeButton
                    id={15}
                    text="07:00 - 09:00"
                    value={15}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(15)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={16}
                    text="09:00 - 11:00"
                    value={16}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(16)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={17}
                    text="11:00 - 13:00"
                    value={17}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(17)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={18}
                    text="13:00 - 15:00"
                    value={18}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(18)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={19}
                    text="15:00 - 17:00"
                    value={19}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(19)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={20}
                    text="17:00 - 19:00"
                    value={20}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(20)}
                  />
                </IonRow>
                <IonRow>
                  <TimeButton
                    id={21}
                    text="19:00 - 21:00"
                    value={21}
                    onButtonClick={handleButtonClick}
                    isSelected={selectedValues.includes(21)}
                  />
                </IonRow>
              </IonCol>

            </IonRow>
          </IonGrid>
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
