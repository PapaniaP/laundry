import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel } from "@ionic/react";
import { useState, useEffect } from "react";
import { Booking } from "./HomePage";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import { getAuth } from "firebase/auth";

interface BookingsByDate {
    [date: string]: Booking[];
}

const YourBookingsPage: React.FC = () => {
    const [bookingsByDate, setBookingsByDate] = useState<BookingsByDate>({});
    const [loading, setLoading] = useState(true); // Loading state
    const auth = getAuth();
    const currentUser = auth.currentUser?.uid;

    useEffect(() => {
        if (currentUser) {
            setLoading(true); // Begin loading
            const buildingCollectionRef = collection(db, "building-1");

            const unsubscribe = onSnapshot(buildingCollectionRef, (snapshot) => {
                const newBookingsByDate: BookingsByDate = {};

                snapshot.docs.forEach((doc) => {
                    const date = doc.id;
                    const allBookings: Booking[] = doc.data().bookings || [];
                    const userBookings = allBookings.filter(booking => booking.uid === currentUser);

                    if (userBookings.length > 0) {
                        newBookingsByDate[date] = userBookings;
                    }
                });

                setBookingsByDate(newBookingsByDate);
                setLoading(false); // End loading
            }, (error) => {
                console.error("Error listening to the collection:", error);
                setLoading(false); // End loading even if there's an error
            });

            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    if (loading) {
        return <IonPage><IonContent>Loading your bookings...</IonContent></IonPage>;
    }

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
            <IonContent fullscreen>
                {Object.entries(bookingsByDate).map(([date, bookings], index) => (
                    <IonCard key={index}>
                        <IonCardHeader>
                            <IonCardTitle>{date}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            {bookings.map((booking, bookingIndex) => (
                                <IonItem key={bookingIndex}>
                                    <IonLabel>
                                        Booking Times: {booking.bookedTimes.join(', ')}
                                    </IonLabel>
                                </IonItem>
                            ))}
                        </IonCardContent>
                    </IonCard>
                ))}
            </IonContent>
        </IonPage>
    );
};

export default YourBookingsPage;
``
