import React, { useState } from 'react';
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

  return (
    <IonContent className="ion-padding">
      <IonGrid>
         <IonRow><p>PLease pick a date:</p></IonRow>
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
 {/* <IonRow>
  <IonCol>
     <IonRow><p>Washing machine 1</p></IonRow>
     <IonRow></IonRow>
  </IonCol>
 </IonRow> */}
      </IonGrid>      
    </IonContent>
  );
};

export default DatePicker;





