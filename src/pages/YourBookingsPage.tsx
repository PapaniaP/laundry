import {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonMenuButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonButton,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "../firebase-config";

interface Booking {
    uid: string;
    bookedTimes: number[];
}

interface BookingsByDate {
    [date: string]: Booking[];
}

interface GroupedBookings {
    [date: string]: {
        date: string;
        time: number;
        booking: Booking;
    }[];
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
                        const userBookings = allBookings
                            .filter(booking => booking.uid === user.uid)
                            .map(booking => ({
                                ...booking,
                                bookedTimes: booking.bookedTimes.slice().sort((a, b) => a - b),
                            }));

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
        });

        return () => unsubscribeAuth();
    }, [auth]);

    // Flatten bookings into an array of { date, time, booking } objects
    // and sort them by time across all dates
    const sortedBookings = Object.entries(bookingsByDate).flatMap(([date, bookings]) => {
        return bookings.flatMap(booking => {
            return booking.bookedTimes.map(time => ({
                date,
                time,
                booking
            }));
        });
    }).sort((a, b) => a.time - b.time);

    // Group the sorted bookings by date
    const bookingsGroupedByDate = sortedBookings.reduce<GroupedBookings>((groupedBookings, item) => {
        if (!groupedBookings[item.date]) {
            groupedBookings[item.date] = [];
        }
        groupedBookings[item.date].push(item);
        return groupedBookings;
    }, {});

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
                {Object.keys(bookingsGroupedByDate).length > 0 ? (
                    Object.entries(bookingsGroupedByDate).map(([date, bookings]) => (
                        <IonCard key={date}>
                            <IonCardHeader>
                                <IonCardTitle>{date}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                {bookings.map((booking, index) => (
                                    <IonItem key={index}>
                                        <IonLabel>
                                            Booking Time: {booking.time}
                                        </IonLabel>
                                        <IonButton
                                            onClick={() => deleteBooking(date, booking.time)}
                                            color="danger"
                                        >
                                            Delete
                                        </IonButton>
                                    </IonItem>
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
