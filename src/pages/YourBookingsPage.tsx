import React from "react";
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
	IonList,
	IonIcon,
	IonChip,
} from "@ionic/react";
import { alertController } from "@ionic/core";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import "./YourBookingsPage.css";
import { trashBin } from "ionicons/icons";

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
		if (!userBuilding) {
			console.error("Building information is not available.");
			// Provide appropriate user feedback here
			return;
		}

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
					handler: () => {
						performDeletion(date, bookingTime);
					},
				},
			],
		});

		await alert.present();
	};

	const performDeletion = async (date: string, bookingTime: number) => {
		if (!userBuilding) {
			console.error("Building information is not available.");
			// Provide appropriate user feedback here
			return;
		}

		const bookingDocRef = doc(db, userBuilding, date);
		const auth = getAuth();
		const currentUser = auth.currentUser;

		if (!currentUser) {
			console.error("No user is currently logged in.");
			// Handle the case where there is no authenticated user
			return;
		}

		// Find the specific booking for the current user and the specific time.
		const currentBookingIndex = bookingsByDate[date]?.findIndex(
			(booking) =>
				booking.uid === currentUser.uid && booking.bookedTimes.includes(bookingTime)
		);

		// If the booking exists
		if (currentBookingIndex > -1) {
			try {
				// Create a new array of bookings without the deleted time.
				const newBookedTimes = bookingsByDate[date][
					currentBookingIndex
				].bookedTimes.filter((time) => time !== bookingTime);

				let updatedBookings: Booking[];
				if (newBookedTimes.length > 0) {
					// Update the booking with the new array of times.
					updatedBookings = bookingsByDate[date].map((booking, index) =>
						index === currentBookingIndex
							? { ...booking, bookedTimes: newBookedTimes }
							: booking
					);
				} else {
					// Remove the booking entirely if no times are left.
					updatedBookings = bookingsByDate[date].filter(
						(_, index) => index !== currentBookingIndex
					);
				}

				// Update Firestore with the new array of bookings.
				await setDoc(bookingDocRef, { bookings: updatedBookings }, { merge: true });

				// Update the local state to reflect the changes.
				setBookingsByDate((prevBookings) => ({
					...prevBookings,
					[date]: updatedBookings,
				}));

				// Reload the page if there are no more bookings for that date.
				if (updatedBookings.length === 0) {
					window.location.reload();
				}
			} catch (error) {
				console.error("Error deleting booking:", error);
				// Handle error (show error message to user)
			}
		} else {
			console.error("Booking not found or already deleted.");
			// Handle the case where the booking was not found or already deleted
		}
	};

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
					<IonChip
						className="ion-margin-end"
						slot="end"
					>
						{userBuilding.split("-")[1]}
					</IonChip>
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
						.map(([date, dailyBookings]) => (
							<IonCard key={date}>
								<IonCardHeader>
									<IonCardTitle>{formatDate(date)}</IonCardTitle>
								</IonCardHeader>
								<IonCardContent>
									{["Washer 1", "Washer 2", "Dryer"].map((washerGroup) => {
										console.log(`IonList key: ${washerGroup}`);

										// Filter and sort bookings for each washer group
										const washerBookings = dailyBookings
											.filter((booking) => getWasherGroup(booking.time) === washerGroup)
											.sort((a, b) => a.time - b.time);

										return (
											washerBookings.length > 0 && (
												<IonList key={washerGroup}>
													<div>
														<h2>{washerGroup}</h2>
														{washerBookings.map((booking, index) => (
															<IonItem key={`${date}-${booking.time}-${index}`}>
																<IonLabel>{timeIntervals[booking.time - 1]}</IonLabel>
																<IonButton
																	onClick={() => deleteBooking(date, booking.time)}
																	color="danger"
																>
																	Delete
																	<IonIcon
																		slot="end"
																		icon={trashBin}
																	></IonIcon>
																</IonButton>
															</IonItem>

															//slide to delete
															/*	<IonItemSliding>
																<IonItem key={`${date}-${booking.time}-${index}`}>
																	<IonLabel>{timeIntervals[booking.time - 1]}</IonLabel>
																</IonItem>

																<IonItemOptions>
																	<IonItemOption
																		color={"danger"}
																		onClick={() => deleteBooking(date, booking.time)}
																	>
																		Delete
																	</IonItemOption>
																</IonItemOptions>
															</IonItemSliding> */
														))}
													</div>
												</IonList>
											)
										);
									})}
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
