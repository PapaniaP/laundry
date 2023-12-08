import React, { useState, useEffect } from 'react';
import { IonDatetime, IonItem, IonLabel, IonButton, IonContent, IonModal, IonCol, IonGrid, IonRow } from '@ionic/react';
import { formatISO, startOfToday, addDays } from 'date-fns';

const DatePicker: React.FC = () => {
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

  console.log(dateToBeFetched);

  return (
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
  );
};

export default DatePicker;





