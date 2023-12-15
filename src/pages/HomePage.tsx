import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonMenuButton,
	IonTitle,
	IonContent,
	IonButton,
	IonDatetime,
	IonItem,
	IonLabel,
	IonModal,
	IonGrid,
	IonRow,
	IonCol,
	IonChip,
} from "@ionic/react";
import { toastController } from "@ionic/core";

import { useHistory } from "react-router";
import "./HomePage.css";

import TimeButton from "../components/TimeButton";
import { useState, useEffect } from "react";
import {
	updateDoc,
	arrayUnion,
	doc,
	onSnapshot,
	collection,
	getDoc,
} from "firebase/firestore";
import { db, user } from "../firebase-config";
import { formatISO, startOfToday, addDays, format, parseISO } from "date-fns";
import { getAuth } from "firebase/auth";
import { push } from "ionicons/icons";

export interface Booking {
	uid: string;
	bookedTimes: number[];
}

function HomePage() {
	const [userBuilding, setUserBuilding] = useState(""); // State to hold user's building number
	const history = useHistory();
	const auth = getAuth();

	const [selectedValues, setSelectedValues] = useState<number[]>([]); // this is for updating array
	const [bookings, setBookings] = useState<Booking[]>([]); // this is for fetching
	const [Booking, setBooking] = useState<Booking>({
		uid: "",
		bookedTimes: [],
	});

	useEffect(() => {
		if (auth.currentUser) {
			// Fetch user's building number
			const userRef = doc(db, "users", auth.currentUser.uid);
			getDoc(userRef)
				.then((docSnap) => {
					if (docSnap.exists()) {
						const userData = docSnap.data();
						setUserBuilding(userData.building); // Set the user's building number
					} else {
						console.error("User data not found");
					}
				})
				.catch((error) => {
					console.error("Error fetching user data:", error);
				});
		}
	}, [auth.currentUser]);

	// date picker

	const [selectedDate, setSelectedDate] = useState<string>(formatISO(startOfToday()));
	const [showPicker, setShowPicker] = useState<boolean>(false);

	const minDate = formatISO(startOfToday());
	const maxDate = formatISO(addDays(startOfToday(), 7));

	const handleDateChange = (e: CustomEvent) => {
		setSelectedDate(e.detail.value as string);
		setShowPicker(false); // Automatically close the picker when a date is selected
	};

	const formatDateForDisplay = (dateIsoString: string): string => {
		const date = parseISO(dateIsoString);
		return format(date, "dd.MM.yyyy");
	};

	const dateToBeFetched = selectedDate.split("T")[0];

	const handleButtonClick = (value: number) => {
		setSelectedValues((prev) => {
			// Check if the value is already selected
			const isAlreadySelected = prev.includes(value);
			if (isAlreadySelected) {
				// If already selected, deselect it by filtering it out
				return prev.filter((val) => val !== value);
			} else {
				if (prev.length < 5) {
					// If less than 5 are selected, add the new value
					return [...prev, value];
				} else {
					// If 5 are already selected, do not add a new value
					// Optionally, show an alert or some other form of user feedback
					alert("You can select up to 5 time slots only.");
					return prev; // Return the previous state
				}
			}
		});
	};
	// Since setSelectedValues is asynchronous, to see the current state after a click,
	// you can use the useEffect hook with selectedValues as a dependency.
	useEffect(() => {
		console.log(selectedValues);
	}, [selectedValues]);

	//  sending data to firebase

	const handleBooking = async (event: React.FormEvent) => {
		event.preventDefault(); // Prevent default form submission behavior

		if (selectedValues.length === 0) {
			const toast = await toastController.create({
				message: "Please select at least one time slot before saving.",
				duration: 2000,
				position: "middle",
			});
			await toast.present();
			return; // Exit the function early
		}
		const auth = getAuth();
		const currentUser = auth.currentUser;

		if (currentUser && userBuilding) {
			try {
				const newBooking = {
					uid: currentUser.uid,
					bookedTimes: selectedValues,
				};

				const dateDocRef = doc(db, userBuilding, dateToBeFetched); // Use user's building number

				await updateDoc(dateDocRef, {
					bookings: arrayUnion(newBooking),
				});

				// Reset the booking state and selected values
				setBooking({
					uid: "",
					bookedTimes: [],
				});
				setSelectedValues([]); // Reset selected values
				setSelectedDate(formatISO(startOfToday())); // Reset the date

				// Show a success message or redirect
				history.push("/booked"); // Redirect to a success page if needed
			} catch (error) {
				history.push("/error");
				console.error("Failed to create booking:", error);
				// Handle error state here
			}
		} else {
			console.error("No user is currently logged in.");
			// Handle the case where there is no authenticated user
		}
	};

	// fetching data from database

	useEffect(() => {
		// Only set up the listener if userBuilding has been set
		if (userBuilding) {
			// Construct the path to the document for the selected date
			const dateDocRef = doc(db, userBuilding, dateToBeFetched);

			// Start listening to the document
			const unsubscribe = onSnapshot(
				dateDocRef,
				(documentSnapshot) => {
					if (documentSnapshot.exists()) {
						const data = documentSnapshot.data();
						// Assuming 'bookings' is the array within your document
						const fetchedBookings: Booking[] = data.bookings || [];
						setBookings(fetchedBookings);
					} else {
						// Handle the case where the document does not exist
						setBookings([]);
					}
				},
				(error) => {
					// Handle errors, such as lack of permissions to read the data
					console.error("Error listening to the document:", error);
				}
			);

			// Clean up the listener when the component unmounts
			return () => unsubscribe();
		}
	}, [dateToBeFetched, userBuilding]); // Add userBuilding as a dependency

	useEffect(() => {
		console.log(bookings);
	}),
		[bookings];

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Laundry booking</IonTitle>
					<IonChip
						className="ion-margin-end"
						slot="end"
					>
						{userBuilding.split("-")[1]}
					</IonChip>
				</IonToolbar>
			</IonHeader>
			<IonContent
				fullscreen
				className="ion-padding"
			>
				<form
					className="scroll-padding" // to avoid overlapping button
					onSubmit={handleBooking}
				>
					<IonGrid>
						<IonRow>
							<p>Please pick a date:</p>
						</IonRow>
						<IonRow>
							<IonButton
								className="bottom-button"
								onClick={() => setShowPicker(true)}
							>
								{selectedDate ? formatDateForDisplay(selectedDate) : "Select Date"}
							</IonButton>
							<IonModal
								isOpen={showPicker}
								onDidDismiss={() => setShowPicker(false)}
							>
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
							{/* Washer 1 Column */}
							<IonCol>
								<IonRow>
									{" "}
									<p>Washer 1</p>
								</IonRow>
								<IonRow>
									<TimeButton
										id={1}
										text="07:00 - 09:00"
										value={1}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(1)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(1))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={2}
										text="09:00 - 11:00"
										value={2}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(2)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(2))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={3}
										text="11:00 - 13:00"
										value={3}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(3)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(3))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={4}
										text="13:00 - 15:00"
										value={4}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(4)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(4))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={5}
										text="15:00 - 17:00"
										value={5}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(5)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(5))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={6}
										text="17:00 - 19:00"
										value={6}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(6)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(6))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={7}
										text="19:00 - 21:00"
										value={7}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(7)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(7))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={8}
										text="21:00 - 23:00"
										value={8}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(8)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(8))
										}
									/>
								</IonRow>
							</IonCol>

							<IonCol>
								<IonRow>
									{" "}
									<p>Washer 2</p>
								</IonRow>
								<IonRow>
									<TimeButton
										id={9}
										text="07:00 - 09:00"
										value={9}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(9)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(9))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={10}
										text="09:00 - 11:00"
										value={10}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(10)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(10))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={11}
										text="11:00 - 13:00"
										value={11}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(11)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(11))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={12}
										text="13:00 - 15:00"
										value={12}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(12)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(12))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={13}
										text="15:00 - 17:00"
										value={13}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(13)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(13))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={14}
										text="17:00 - 19:00"
										value={14}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(14)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(14))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={15}
										text="19:00 - 21:00"
										value={15}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(15)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(15))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={16}
										text="21:00 - 23:00"
										value={16}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(16)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(16))
										}
									/>
								</IonRow>
							</IonCol>

							<IonCol>
								<IonRow>
									{" "}
									<p>Dryer</p>{" "}
								</IonRow>
								<IonRow>
									<TimeButton
										id={17}
										text="07:00 - 09:00"
										value={17}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(17)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(17))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={18}
										text="09:00 - 11:00"
										value={18}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(18)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(18))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={19}
										text="11:00 - 13:00"
										value={19}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(19)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(19))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={20}
										text="13:00 - 15:00"
										value={20}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(20)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(20))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={21}
										text="15:00 - 17:00"
										value={21}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(21)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(21))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={22}
										text="17:00 - 19:00"
										value={22}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(22)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(22))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={23}
										text="19:00 - 21:00"
										value={23}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(23)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(23))
										}
									/>
								</IonRow>
								<IonRow>
									<TimeButton
										id={24}
										text="21:00 - 23:00"
										value={24}
										onButtonClick={handleButtonClick}
										isSelected={selectedValues.includes(24)}
										isAvailable={
											!bookings.some((booking) => booking.bookedTimes.includes(24))
										}
									/>
								</IonRow>
							</IonCol>
						</IonRow>
					</IonGrid>
					<div className="button-container">
						{/* div to fix button to bottom and create bg */}
						<IonButton
							className="bottom-button"
							expand="block"
							slot="fixed"
							type="submit"
						>
							Save and Create
						</IonButton>
					</div>
				</form>
			</IonContent>
		</IonPage>
	);
}

export default HomePage;
