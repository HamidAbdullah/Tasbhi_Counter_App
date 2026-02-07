import { Platform } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

class AuthService {
    constructor() {
        // Don't configure here to avoid crash if native module is missing during bundle load
    }

    initialize() {
        try {
            if (Platform.OS === 'android') {
                // Required for Firebase Auth: use the Web OAuth client ID (from Firebase Console →
                // Project settings → Your apps → Web client ID), NOT the Android client ID.
                // Without this, sign-in throws DEVELOPER_ERROR in debug/release.
                const webClientId = '390113223871-i16ujhliik66kfg39s1st3ao25lh8k29.apps.googleusercontent.com';
                GoogleSignin.configure({
                    webClientId,
                });
            }
        } catch (error) {
            console.error('GoogleSignin configure error:', error);
        }
    }

    /** Guest: continue without signing in. No Firebase user. */
    async signInAsGuest(): Promise<null> {
        return Promise.resolve(null);
    }

    /** Apple Sign-In (iOS only). Requires @invertase/react-native-apple-authentication + Sign in with Apple capability. */
    async signInWithApple(): Promise<FirebaseAuthTypes.User> {
        if (Platform.OS !== 'ios') {
            throw new Error('Apple Sign-In is only available on iOS.');
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const appleAuth = require('@invertase/react-native-apple-authentication').default;
            const rawNonce = Math.random().toString(36).slice(2);
            const request = {
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.AppleAuthRequestScope.EMAIL, appleAuth.AppleAuthRequestScope.FULL_NAME],
                nonce: rawNonce,
            };
            const { identityToken } = await appleAuth.performRequest(request);

            if (!identityToken) {
                throw new Error('Apple Sign-In failed: No identity token.');
            }

            const credential = auth.AppleAuthProvider.credential(identityToken, rawNonce);
            const userCredential = await auth().signInWithCredential(credential);
            return userCredential.user;
        } catch (e: any) {
            if (e?.code === 'ERR_REQUEST_CANCELED') {
                throw new Error('Sign-in was cancelled.');
            }
            if (e?.code === 'E_APPLE_AUTH_NOT_SUPPORTED' || (e?.message && (e.message.includes('require') || e.message.includes('Unable to resolve')))) {
                throw new Error('Apple Sign-In is not configured. Add @invertase/react-native-apple-authentication and enable Sign in with Apple in Xcode.');
            }
            throw this.handleError(e);
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

    // Google Sign In (Android; on iOS we use Apple)
    async signInWithGoogle() {
        if (Platform.OS !== 'android') {
            throw new Error('Use Apple Sign-In on this device.');
        }
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const response = await GoogleSignin.signIn();
            const idToken = response.data?.idToken;

            if (!idToken) {
                throw new Error('Google Sign-In failed: No ID token received');
            }

            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
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
