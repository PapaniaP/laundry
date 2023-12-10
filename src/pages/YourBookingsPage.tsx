import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonMenuButton } from "@ionic/react";

const YourBookingsPage: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Your bookings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

            </IonContent>
        </IonPage >
    );
};

export default YourBookingsPage;