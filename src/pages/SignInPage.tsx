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
} from "@ionic/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { useHistory } from "react-router";

const SignInPage: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

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

	return (
		<IonPage>
			<IonContent slot="middle">
				<div className="centered-container">
					<IonCard className="ion-padding">
						<IonCardHeader>
							<IonCardTitle className="ion-margin-bottom">Sign In</IonCardTitle>
						</IonCardHeader>
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
						{error && (
							<IonCardSubtitle
								className="ion-padding-bottom"
								color="danger"
							>
								{error}
							</IonCardSubtitle>
						)}
						<IonButton onClick={handleSignIn}>Sign In</IonButton>
					</IonCard>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default SignInPage;
