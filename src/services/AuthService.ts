import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

class AuthService {
    constructor() {
        // Don't configure here to avoid crash if native module is missing during bundle load
    }

    initialize() {
        try {
            GoogleSignin.configure({
                offlineAccess: true,
            });
        } catch (error) {
            console.error('GoogleSignin configure error:', error);
        }
    }

    // Auth state listener
    onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void) {
        return auth().onAuthStateChanged(callback);
    }

    // Get current user
    getCurrentUser() {
        return auth().currentUser;
    }

    // Email/Password Sign Up
    async signUpWithEmail(email: string, password: string, name: string) {
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            if (userCredential.user) {
                await userCredential.user.updateProfile({ displayName: name });
            }
            return userCredential.user;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Email/Password Sign In
    async signInWithEmail(email: string, password: string) {
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            return userCredential.user;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Google Sign In
    async signInWithGoogle() {
        try {
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            // Get the users ID token
            const response = await GoogleSignin.signIn();
            const idToken = response.data?.idToken;

            if (!idToken) {
                throw new Error('Google Sign-In failed: No ID token received');
            }

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            const userCredential = await auth().signInWithCredential(googleCredential);
            return userCredential.user;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Sign Out
    async signOut() {
        try {
            await GoogleSignin.signOut();
            await auth().signOut();
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Password Reset
    async sendPasswordResetEmail(email: string) {
        try {
            await auth().sendPasswordResetEmail(email);
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    private handleError(error: any) {
        console.error('Auth Error:', error);
        let message = 'An error occurred during authentication.';

        if (error.code === 'auth/email-already-in-use') {
            message = 'That email address is already in use!';
        } else if (error.code === 'auth/invalid-email') {
            message = 'That email address is invalid!';
        } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            message = 'Invalid email or password.';
        } else if (error.code === 'auth/weak-password') {
            message = 'The password is too weak.';
        }

        return new Error(message);
    }
}

export default new AuthService();
