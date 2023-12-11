import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonButton } from "@ionic/react";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "../firebase-config";
import { Booking } from "./HomePage";

interface BookingsByDate {
    [date: string]: Booking[];
}

const YourBookingsPage: React.FC = () => {
    const [bookingsByDate, setBookingsByDate] = useState<BookingsByDate>({});
    const [loading, setLoading] = useState(true); // Loading state
    const auth = getAuth();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoading(true); // Begin loading
                const buildingCollectionRef = collection(db, "building-1");

                const unsubscribe = onSnapshot(buildingCollectionRef, (snapshot) => {
                    const newBookingsByDate: BookingsByDate = {};

                    snapshot.docs.forEach((doc) => {
                        const date = doc.id;
                        const allBookings: Booking[] = doc.data().bookings || [];
                        // Filter user's bookings and sort the bookedTimes
                        const userBookings = allBookings
                            .filter(booking => booking.uid === user.uid)
                            .map(booking => ({
                                ...booking,
                                bookedTimes: booking.bookedTimes.slice().sort((a, b) => a - b)
                            }));

                        if (userBookings.length > 0) {
                            newBookingsByDate[date] = userBookings;
                        }
                    });

                    console.log("Sorted bookings by date:", newBookingsByDate); // Debug: Log sorted bookings
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
        });

        return () => unsubscribeAuth();
    }, [auth]);

    const deleteBooking = async (date: string, bookingTime: number) => {
        const bookingDocRef = doc(db, "building-1", date);
        const currentBooking = bookingsByDate[date].find(booking => booking.bookedTimes.includes(bookingTime));

        if (currentBooking) {
            // If it's the last number in the array or if the array only contains the number being deleted
            if (currentBooking.bookedTimes.length === 1 || (currentBooking.bookedTimes.length > 1 && currentBooking.bookedTimes.every(bt => bt === bookingTime))) {
                // Remove the whole booking object from the Firestore document
                await updateDoc(bookingDocRef, {
                    bookings: arrayRemove(currentBooking)
                });
            } else {
                // Create a copy of the booking without the deleted time
                const updatedBooking = {
                    ...currentBooking,
                    bookedTimes: currentBooking.bookedTimes.filter(time => time !== bookingTime)
                };
                // First remove the old booking object
                await updateDoc(bookingDocRef, {
                    bookings: arrayRemove(currentBooking)
                });
                // Then add the updated booking object
                await updateDoc(bookingDocRef, {
                    bookings: arrayUnion(updatedBooking)
                });
            }

            // Update the state to reflect the deletion
            setBookingsByDate(prevState => {
                const updatedBookings = { ...prevState };
                const currentBookings = updatedBookings[date];

                if (currentBookings) {
                    // Filter out the booking that contains the time to be deleted
                    const remainingBookings = currentBookings.filter(booking => !booking.bookedTimes.includes(bookingTime));

                    if (remainingBookings.length > 0) {
                        // If there are remaining bookings, update the date entry
                        updatedBookings[date] = remainingBookings;
                    } else {
                        // If all bookings for the date have been deleted, remove the date entry
                        delete updatedBookings[date];
                    }
                }

                return updatedBookings;
            });
        }
    };

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
                {Object.entries(bookingsByDate).length > 0 ? (
                    Object.entries(bookingsByDate).map(([date, bookings], index) => (
                        <IonCard key={index}>
                            <IonCardHeader>
                                <IonCardTitle>{date}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                {bookings.map((booking, bookingIndex) => (
                                    booking.bookedTimes.map((time, timeIndex) => (
                                        <IonItem key={`${bookingIndex}-${timeIndex}`}>
                                            <IonLabel>
                                                Booking Time: {time}
                                            </IonLabel>
                                            <IonButton
                                                onClick={() => deleteBooking(date, time)}
                                                color="danger"
                                            >
                                                Delete
                                            </IonButton>
                                        </IonItem>
                                    ))
                                ))}
                            </IonCardContent>
                        </IonCard>
                    ))
                ) : (
                    <IonItem>No bookings found.</IonItem>
                )}
            </IonContent>
        </IonPage>
    );
};

export default YourBookingsPage;