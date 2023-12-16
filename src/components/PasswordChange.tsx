import React, { useState } from "react";
import {
	IonPage,
	IonContent,
	IonInput,
	IonButton,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonBackButton,
	IonButtons,
	IonItem,
	IonList,
} from "@ionic/react";
import { updatePassword } from "firebase/auth";
import { useAuth } from "../components/AuthContext"; // Adjust the path as necessary
import "./PasswordChange.css";

const PasswordChangePage: React.FC = () => {
	const { user } = useAuth();
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleChangePassword = async () => {
		if (newPassword !== confirmPassword) {
			alert("New passwords do not match.");
			return;
		}
		try {
			if (user) {
				await updatePassword(user, newPassword);
				alert("Password successfully updated.");
				// Redirect or handle post-update logic
			}
		} catch (error) {
			console.error("Error updating password: ", error);
		}
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton defaultHref="/profile"></IonBackButton>
					</IonButtons>
					<IonTitle>Change Password</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<div className="password-container">
					<div className="password-input">
						<IonList>
							<IonItem>
								<IonInput
									type="password"
									label="New Password"
									labelPlacement="floating"
									counter={true}
									maxlength={20}
									minlength={6}
									onIonChange={(e) => setNewPassword(e.detail.value!)}
								/>
							</IonItem>
						</IonList>
					</div>
					<div className="password-input">
						<IonList>
							<IonItem>
								<IonInput
									type="password"
									label="Confirm Password"
									labelPlacement="floating"
									counter={true}
									maxlength={20}
									minlength={6}
									onIonChange={(e) => setConfirmPassword(e.detail.value!)}
								/>
							</IonItem>
						</IonList>
					</div>
					<div className="password-input">
						<IonButton
							expand="block"
							onClick={handleChangePassword}
							color={"primary"}
							aria-label="Update Password" // Clear description for screen readers
						>
							Update Password
						</IonButton>
					</div>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default PasswordChangePage;
