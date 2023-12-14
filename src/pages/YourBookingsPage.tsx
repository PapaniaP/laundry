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
	IonSpinner,
	IonCardSubtitle,
} from "@ionic/react";
import { alertController } from "@ionic/core";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
	collection,
	onSnapshot,
	doc,
	updateDoc,
	arrayRemove,
	arrayUnion,
	getDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import "./YourBookingsPage.css";

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
	const [userBuilding, setUserBuilding] = useState("");
	const auth = getAuth();

	const timeIntervals = [
		"07:00 - 09:00",
		"09:00 - 11:00",
		"11:00 - 13:00",
		"13:00 - 15:00",
		"15:00 - 17:00",
		"17:00 - 19:00",
		"19:00 - 21:00",
		"21:00 - 23:00",
		"07:00 - 09:00",
		"09:00 - 11:00",
		"11:00 - 13:00",
		"13:00 - 15:00",
		"15:00 - 17:00",
		"17:00 - 19:00",
		"19:00 - 21:00",
		"21:00 - 23:00",
		"07:00 - 09:00",
		"09:00 - 11:00",
		"11:00 - 13:00",
		"13:00 - 15:00",
		"15:00 - 17:00",
		"17:00 - 19:00",
		"19:00 - 21:00",
		"21:00 - 23:00",
	];

	const formatDate = (dateStr: string) => {
		const [year, month, day] = dateStr.split("-");
		return `${day}.${month}.${year}`;
	};

	const getWasherGroup = (time: number) => {
		if (time >= 1 && time <= 8) return "Washer 1";
		if (time >= 9 && time <= 16) return "Washer 2";
		if (time >= 17 && time <= 24) return "Dryer";
		return "Other";
	};

	const convertDateToComparableFormat = (dateStr: string) => {
		const parts = dateStr.split(".");
		return `${parts[2]}-${parts[1]}-${parts[0]}`; // Converts DD.MM.YYYY to YYYY-MM-DD
	};

	useEffect(() => {
		const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
			if (user) {
				setLoading(true); // Begin loading

				// Fetch user's building number
				const userRef = doc(db, "users", user.uid);
				getDoc(userRef)
					.then((docSnap) => {
						if (docSnap.exists()) {
							const userData = docSnap.data();
							setUserBuilding(userData.building); // Save the user's building number in state

							// Fetch bookings for the user in the specific building
							const buildingCollectionRef = collection(db, userData.building);

							const unsubscribe = onSnapshot(
								buildingCollectionRef,
								(snapshot) => {
									const newBookingsByDate: BookingsByDate = {};

									snapshot.docs.forEach((doc) => {
										const date = doc.id;
										const allBookings: Booking[] = doc.data().bookings || [];
										const userBookings = allBookings
											.filter((booking) => booking.uid === user.uid)
											.map((booking) => ({
												...booking,
												bookedTimes: booking.bookedTimes.slice().sort((a, b) => a - b),
											}));

										if (userBookings.length > 0) {
											newBookingsByDate[date] = userBookings;
										}
									});

									setBookingsByDate(newBookingsByDate);
									setLoading(false); // End loading
								},
								(error) => {
									console.error("Error listening to the collection:", error);
									setLoading(false); // End loading even if there's an error
								}
							);

							return () => unsubscribe();
						} else {
							// Handle case where user data does not exist
							console.error("User data not found");
							setLoading(false);
						}
					})
					.catch((error) => {
						console.error("Error fetching user data:", error);
						setLoading(false);
					});
				console.log("Bookings by Date:", bookingsByDate);
			} else {
				setLoading(false);
			}
		});

		return () => unsubscribeAuth();
	}, [auth]);

	// Flatten bookings into an array of { date, time, booking } objects
	// and sort them by time across all dates
	const sortedBookings = Object.entries(bookingsByDate)
		.flatMap(([date, bookings]) => {
			return bookings.flatMap((booking) => {
				return booking.bookedTimes.map((time) => ({
					date,
					time,
					booking,
				}));
			});
		})
		.sort((a, b) => a.time - b.time);

	// Group the sorted bookings by date
	const bookingsGroupedByDate = sortedBookings.reduce<GroupedBookings>(
		(groupedBookings, item) => {
			if (!groupedBookings[item.date]) {
				groupedBookings[item.date] = [];
			}
			groupedBookings[item.date].push(item);
			return groupedBookings;
		},
		{}
	);

	const deleteBooking = async (date: string, bookingTime: number) => {
		// Show confirmation dialog
		const alert = await alertController.create({
			header: "Confirm Deletion",
			message: "Do you really want to delete this booking?",
			buttons: [
				{
					text: "Cancel",
					role: "cancel",
					handler: () => {
						console.log("Deletion cancelled");
					},
				},
				{
					text: "Delete",
					handler: async () => {
						// Proceed with the deletion logic
						await performDeletion(date, bookingTime);

						// Refresh the page after deletion
						window.location.reload();
					},
				},
			],
		});

		await alert.present();
	};

	const performDeletion = async (date: string, bookingTime: number) => {
		const bookingDocRef = doc(db, "building-1", date);
		const currentBooking = bookingsByDate[date].find((booking) =>
			booking.bookedTimes.includes(bookingTime)
		);

		if (currentBooking) {
			// If it's the last number in the array or if the array only contains the number being deleted
			if (
				currentBooking.bookedTimes.length === 1 ||
				(currentBooking.bookedTimes.length > 1 &&
					currentBooking.bookedTimes.every((bt) => bt === bookingTime))
			) {
				// Remove the whole booking object from the Firestore document
				await updateDoc(bookingDocRef, {
					bookings: arrayRemove(currentBooking),
				});
			} else {
				// Create a copy of the booking without the deleted time
				const updatedBooking = {
					...currentBooking,
					bookedTimes: currentBooking.bookedTimes.filter((time) => time !== bookingTime),
				};
				// First remove the old booking object
				await updateDoc(bookingDocRef, {
					bookings: arrayRemove(currentBooking),
				});
				// Then add the updated booking object
				await updateDoc(bookingDocRef, {
					bookings: arrayUnion(updatedBooking),
				});
			}

			// Update the state to reflect the deletion
			setBookingsByDate((prevState) => {
				const updatedBookings = { ...prevState };
				const currentBookings = updatedBookings[date];

				if (currentBookings) {
					// Filter out the booking that contains the time to be deleted
					const remainingBookings = currentBookings.filter(
						(booking) => !booking.bookedTimes.includes(bookingTime)
					);

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
	console.log("Grouped Bookings:", bookingsGroupedByDate);

	if (loading) {
		return (
			<IonPage>
				<IonContent className="ion-padding ion-text-center">
					<div className="wrapper">
						<div className="container">
							<IonSpinner />
							<IonTitle className="ion-text-center titleheight">
								Your Bookings Are Loading
							</IonTitle>
						</div>
					</div>
				</IonContent>
			</IonPage>
		);
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
				{Object.entries(bookingsGroupedByDate).length > 0 ? (
					Object.entries(bookingsGroupedByDate)
						.sort((a, b) => {
							const dateA = convertDateToComparableFormat(a[0]);
							const dateB = convertDateToComparableFormat(b[0]);
							return new Date(dateA).getTime() - new Date(dateB).getTime();
						})
						.map(([date, bookings]) => (
							<IonCard key={date}>
								<IonCardHeader>
									<IonCardTitle>{formatDate(date)}</IonCardTitle>
									<IonCardSubtitle>{userBuilding} </IonCardSubtitle>
								</IonCardHeader>
								<IonCardContent>
									{bookings.map((booking) => (
										<div key={booking.time}>
											<IonItem>
												<IonLabel>{timeIntervals[booking.time - 1]}</IonLabel>
												<IonLabel>{getWasherGroup(booking.time)}</IonLabel>
												<IonButton
													onClick={() => deleteBooking(date, booking.time)}
													color="danger"
												>
													Delete
												</IonButton>
											</IonItem>
										</div>
									))}
								</IonCardContent>
							</IonCard>
						))
				) : (
					<div className="wrapper">
						<div className="container">
							<IonTitle className="ion-text-center titleheight">
								You don't have any bookings yet.
							</IonTitle>
						</div>
					</div>
				)}
			</IonContent>
		</IonPage>
	);
};

export default YourBookingsPage;
