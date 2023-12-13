import React, { useState } from "react";
import "./SignInPage.css";
import {
	IonInput,
	IonText,
	IonButton,
	IonCard,
	IonContent,
	IonPage,
	IonCardHeader,
	IonCardTitle,
	IonCardSubtitle,
	IonAlert,
	IonList,
	IonItem,
} from "@ionic/react";
import { alertController } from "@ionic/core";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase-config";
import { useHistory } from "react-router";

const SignInPage: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [showResetPasswordAlert, setShowResetPasswordAlert] = useState(false);

	const history = useHistory();

	const handleSignIn = async () => {
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			console.log(userCredential.user); // this means the user is signed in
			setError(""); // clears any previous errors
			history.push("/home");
		} catch (error) {
			setError("Email or Password incorrect"); // error message
		}
	};

	const handleForgotPasswordPrompt = async () => {
		const alert = await alertController.create({
			header: "Reset Password",
			inputs: [
				{
					name: "email",
					type: "email",
					placeholder: "Your email address",
				},
			],
			buttons: [
				{
					text: "Cancel",
					role: "cancel",
					cssClass: "secondary",
					handler: () => {
						console.log("Confirm Cancel");
					},
				},
				{
					text: "Send",
					handler: async (data) => {
						if (data.email) {
							try {
								await sendPasswordResetEmail(auth, data.email);
								// Show confirmation message
								console.log("Password reset email sent");
							} catch (error) {
								// Handle error (e.g., user not found)
								console.error("Error sending password reset email:", error);
							}
						}
					},
				},
			],
		});

		await alert.present();
	};

	return (
		<IonPage>
			<IonContent slot="middle">
				<div className="app-header">
					<h1>Ravnsbjerg</h1>
					<h1>Laundry</h1>
				</div>
				<div className="centered-container">
					<IonCard className="ion-padding">
						<IonCardHeader className="ion-no-padding">
							<IonCardTitle className="ion-margin-bottom">Sign In</IonCardTitle>
						</IonCardHeader>
						<IonList>
							<IonInput
								className="ion-margin-bottom"
								value={email}
								label="Email Address"
								labelPlacement="stacked"
								onIonChange={(e) => setEmail(e.detail.value!)}
								placeholder="Email"
								errorText="Invalid Email"
								fill="outline"
							/>

							<IonInput
								className="ion-margin-bottom"
								label="Password"
								labelPlacement="stacked"
								value={password}
								onIonChange={(e) => setPassword(e.detail.value!)}
								type="password"
								placeholder="Password"
								fill="outline"
							/>
						</IonList>{" "}
						{error && (
							<IonCardSubtitle
								className="ion-padding-bottom"
								color="danger"
							>
								{error}
							</IonCardSubtitle>
						)}
						<div
							className="forgot-password-container"
							style={{ textAlign: "left", marginTop: "0", marginBottom: "24px" }}
						>
							<IonButton
								className="ion-no-padding"
								fill="clear"
								size="small"
								onClick={handleForgotPasswordPrompt}
								style={{ fontSize: "12px", fontWeight: "400", minHeight: "1em" }}
							>
								Forgot your password?
							</IonButton>
						</div>
						<IonButton
							onClick={handleSignIn}
							expand="block"
						>
							Sign In
						</IonButton>
					</IonCard>
				</div>
				<IonAlert
					isOpen={showResetPasswordAlert}
					onDidDismiss={() => setShowResetPasswordAlert(false)}
					header="Password Reset"
					message="A password reset link has been sent to your email address."
					buttons={["OK"]}
				/>
			</IonContent>
		</IonPage>
	);
};

export default SignInPage;
