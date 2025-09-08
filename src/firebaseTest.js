import { auth, db } from './firebase';

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    console.log('Auth instance:', auth);
    console.log('Auth app:', auth.app);
    console.log('Firestore instance:', db);
    
    // Check if auth is properly initialized
    if (!auth.app) {
      throw new Error('Firebase app not initialized');
    }
    
    console.log('Firebase connection test passed!');
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};
