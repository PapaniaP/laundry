import React, { useState, useEffect } from "react";
import {
	IonPage,
	IonContent,
	IonLabel,
	IonButton,
	IonInput,
	IonSelect,
	IonSelectOption,
	IonAlert,
	IonItem,
	IonToggle,
	IonButtons,
	IonHeader,
	IonMenuButton,
	IonTitle,
	IonToolbar,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonList,
	IonGrid,
	IonRow,
} from "@ionic/react";
import { getAuth, updatePassword, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useAuth } from "../components/AuthContext";
import "../theme/variables.css";
import "./ProfilePage.css";

const ProfilePage: React.FC = () => {
	const { user } = useAuth();
	const auth = getAuth();

	// State for user data, new password, and theme
	const [userData, setUserData] = useState<any>({});
	const [newPassword, setNewPassword] = useState("");
	const [themeToggle, setThemeToggle] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");

	useEffect(() => {
		if (user) {
			const userDocRef = doc(db, "users", user.uid);
			getDoc(userDocRef).then((docSnap) => {
				if (docSnap.exists()) {
					setUserData(docSnap.data());

					// Extracting first name for Menu.tsx
					const firstName = userData.name ? userData.name.split(" ")[0] : "";

				}
			});
		}
	}, [user]);

	// const handlePasswordChange = async () => {
	// 	if (!user) {
	// 		setAlertMessage("No user logged in.");
	// 		setShowAlert(true);
	// 		return;
	// 	}
	// 	if (newPassword.length < 6) {
	// 		setAlertMessage("Password must be at least 6 characters long.");
	// 		setShowAlert(true);
	// 		return;
	// 	}
	// 	try {
	// 		await updatePassword(user, newPassword);
	// 		setAlertMessage("Password updated successfully.");
	// 	} catch (error) {
	// 		setAlertMessage("Failed to update password.");
	// 	}
	// 	setShowAlert(true);
	// };

	const handleBuildingChange = async (newBuilding: string) => {
		if (!user) {
			setAlertMessage("No user logged in.");
			setShowAlert(true);
			return;
		}
		const userDocRef = doc(db, "users", user.uid);
		await updateDoc(userDocRef, {
			building: newBuilding,
		});
		setAlertMessage("Building updated successfully.");
		setShowAlert(true);
	};

	const toggleChange = (ev: CustomEvent) => {
		toggleDarkTheme(ev.detail.checked);
	};

	const toggleDarkTheme = (shouldAdd: boolean) => {
		document.body.classList.toggle("dark", shouldAdd);
		localStorage.setItem("theme", shouldAdd ? "dark" : "light");
	};

	const initializeDarkTheme = () => {
		const storedTheme = localStorage.getItem("theme");
		const isDark = storedTheme
			? storedTheme === "dark"
			: window.matchMedia("(prefers-color-scheme: dark)").matches;
		setThemeToggle(isDark);
		toggleDarkTheme(isDark);
	};

	useEffect(() => {
		initializeDarkTheme;
	}, []);

	const handleLogout = async () => {
		await signOut(auth);
		// Redirect to sign-in page or handle the logout view update
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Your Profile</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<div className="profile-container">
					<div className="profile-section">
						<IonList>
							<IonItem>
								<IonLabel
									position="stacked"
									color={"primary"}
								>
									Name
								</IonLabel>
								{userData.name}
							</IonItem>

							<IonItem>
								<IonLabel
									position="stacked"
									color={"primary"}
								>
									Email
								</IonLabel>
								{userData.email}
							</IonItem>
							<IonItem>
								<IonLabel
									position="stacked"
									color={"primary"}
								>
									Building
								</IonLabel>
								{userData.building}
							</IonItem>
						</IonList>
					</div>

					<div className="profile-section">
						<IonList>
							<IonItem>
								<IonSelect
									label="Select your Building"
									value={userData.building}
									placeholder=""
									onIonChange={(e) => handleBuildingChange(e.detail.value)}
								>
									<IonSelectOption value="building-1">1</IonSelectOption>
									<IonSelectOption value="building-2">2</IonSelectOption>
									<IonSelectOption value="building-3">3</IonSelectOption>
									<IonSelectOption value="building-4">4</IonSelectOption>
									<IonSelectOption value="building-5">5</IonSelectOption>
									<IonSelectOption value="building-6">6</IonSelectOption>
									<IonSelectOption value="building-7">7</IonSelectOption>
									<IonSelectOption value="building-8">8</IonSelectOption>
								</IonSelect>
							</IonItem>
						</IonList>
					</div>

					<div className="profile-section">
						<IonList>
							<IonItem>
								<IonLabel>Dark Mode</IonLabel>
								<IonToggle
									checked={themeToggle}
									onIonChange={toggleChange}
									slot="end"
								/>
							</IonItem>
						</IonList>
					</div>

					<div className="profile-section">
						<IonButton
							size="default"
							expand="block"
							fill="outline"
							color={"danger"}
							routerLink="/change-password"
						>
							Change Password
						</IonButton>
						<IonButton
							size="default"
							expand="block"
							onClick={handleLogout}
							color={"danger"}
						>
							Logout
						</IonButton>
					</div>
				</div>

				<IonAlert
					isOpen={showAlert}
					onDidDismiss={() => setShowAlert(false)}
					header={"Alert"}
					message={alertMessage}
					buttons={["OK"]}
				/>
			</IonContent>
		</IonPage>
	);
};

export default ProfilePage;
