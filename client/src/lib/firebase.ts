import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  EmailAuthProvider
} from "firebase/auth";
import { getFirestore, collection, doc, getDoc, setDoc, addDoc, deleteDoc, updateDoc, query, where, getDocs, Timestamp, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration - using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyA9hpzrKQ93TeOCy95-r_tr5Do-ejWKJkk",
  authDomain: "dona-4a86e.firebaseapp.com",
  projectId: "dona-4a86e",
  storageBucket: "dona-4a86e.firebasestorage.app",
  messagingSenderId: "121254084642",
  appId: "1:121254084642:web:a607076fba04963fb90a7b",
  measurementId: "G-1QNKJE6HFM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Authentication functions - Google Sign-in
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Email/Password Authentication

// Register a new user with email and password
export const registerWithEmail = async (email: string, password: string, displayName: string): Promise<User> => {
  try {
    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's profile with display name
    await updateProfile(userCredential.user, {
      displayName: displayName
    });
    
    // Create a user profile document in Firestore
    const userRef = doc(firestore, "users", userCredential.user.uid);
    await setDoc(userRef, {
      email: email,
      displayName: displayName,
      createdAt: serverTimestamp(),
    });
    
    return userCredential.user;
  } catch (error) {
    console.error("Error registering with email and password", error);
    throw error;
  }
};

// Sign in with email and password
export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in with email and password", error);
    throw error;
  }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw error;
  }
};

// Sign out user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

// Check if user is admin
export const checkAdminStatus = async (uid: string): Promise<boolean> => {
  try {
    // First check the admins collection (document per admin)
    const adminRef = doc(firestore, "admins", uid);
    const adminDoc = await getDoc(adminRef);
    
    if (adminDoc.exists()) {
      return true;
    }
    
    // If not found in admins collection, check the users collection for isAdmin field
    const userRef = doc(firestore, "users", uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists() && userDoc.data().isAdmin === true) {
      return true;
    }
    
    // Special case: if this is the first user ever created in the system, make them admin
    const usersRef = collection(firestore, "users");
    const usersQuery = query(usersRef);
    const usersSnapshot = await getDocs(usersQuery);
    
    if (usersSnapshot.size === 1 && usersSnapshot.docs[0].id === uid) {
      // This is the first and only user, let's make them admin
      await setDoc(adminRef, { 
        uid, 
        createdAt: serverTimestamp(),
        email: userDoc.exists() ? userDoc.data().email : null
      });
      
      // Also update the user document if it exists
      if (userDoc.exists()) {
        await updateDoc(userRef, { isAdmin: true });
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking admin status", error);
    return false;
  }
};

// Set admin status for a user (use this function to grant admin access)
export const setAdminStatus = async (uid: string, isAdmin: boolean): Promise<void> => {
  try {
    const adminRef = doc(firestore, "admins", uid);
    
    if (isAdmin) {
      // Get user information to store in admin document
      const userRef = doc(firestore, "users", uid);
      const userDoc = await getDoc(userRef);
      
      // Create admin document
      await setDoc(adminRef, {
        uid,
        createdAt: serverTimestamp(),
        email: userDoc.exists() ? userDoc.data().email : null
      });
      
      // Update user document if it exists
      if (userDoc.exists()) {
        await updateDoc(userRef, { isAdmin: true });
      }
    } else {
      // Remove admin document
      await deleteDoc(adminRef);
      
      // Update user document if it exists
      const userRef = doc(firestore, "users", uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        await updateDoc(userRef, { isAdmin: false });
      }
    }
  } catch (error) {
    console.error("Error setting admin status", error);
    throw error;
  }
};

// Firestore CRUD operations for events
export const getEvents = async () => {
  try {
    const eventsRef = collection(firestore, "events");
    const querySnapshot = await getDocs(eventsRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting events", error);
    throw error;
  }
};

export const addEvent = async (eventData: any) => {
  try {
    const eventsRef = collection(firestore, "events");
    const docRef = await addDoc(eventsRef, {
      ...eventData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding event", error);
    throw error;
  }
};

export const updateEvent = async (id: string, eventData: any) => {
  try {
    const eventRef = doc(firestore, "events", id);
    await updateDoc(eventRef, eventData);
  } catch (error) {
    console.error("Error updating event", error);
    throw error;
  }
};

export const deleteEvent = async (id: string) => {
  try {
    const eventRef = doc(firestore, "events", id);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error("Error deleting event", error);
    throw error;
  }
};

// Firestore CRUD operations for news posts
export const getNewsPosts = async () => {
  try {
    const newsRef = collection(firestore, "news");
    const querySnapshot = await getDocs(newsRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting news posts", error);
    throw error;
  }
};

export const addNewsPost = async (postData: any) => {
  try {
    const newsRef = collection(firestore, "news");
    const docRef = await addDoc(newsRef, {
      ...postData,
      publishedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding news post", error);
    throw error;
  }
};

export const updateNewsPost = async (id: string, postData: any) => {
  try {
    const postRef = doc(firestore, "news", id);
    await updateDoc(postRef, postData);
  } catch (error) {
    console.error("Error updating news post", error);
    throw error;
  }
};

export const deleteNewsPost = async (id: string) => {
  try {
    const postRef = doc(firestore, "news", id);
    await deleteDoc(postRef);
  } catch (error) {
    console.error("Error deleting news post", error);
    throw error;
  }
};

// Storage operations for images
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, `${path}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading image", error);
    throw error;
  }
};

// Menu items operations
export const getMenuItems = async () => {
  try {
    const menuRef = collection(firestore, "menuItems");
    const querySnapshot = await getDocs(menuRef);
    
    // Ensure all returned items have the correct structure
    interface MenuItem {
      id: string;
      title: string;
      path: string;
      order: number;
      isActive: boolean;
    }
    
    const items = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure the document has all required fields
      return {
        id: doc.id,
        title: data.title || "",
        path: data.path || "/",
        order: typeof data.order === 'number' ? data.order : 999,
        isActive: typeof data.isActive === 'boolean' ? data.isActive : true
      } as MenuItem;
    }).sort((a, b) => a.order - b.order);
    
    return items;
  } catch (error) {
    console.error("Error getting menu items", error);
    // Return default items on error
    return [
      { id: "default-1", title: "Home", path: "/", order: 1, isActive: true },
      { id: "default-2", title: "About", path: "/about", order: 2, isActive: true },
      { id: "default-3", title: "Events", path: "/events", order: 3, isActive: true },
      { id: "default-4", title: "News", path: "/news", order: 4, isActive: true },
      { id: "default-5", title: "Contact", path: "/contact", order: 5, isActive: true },
    ];
  }
};

export const updateMenuItem = async (id: string, itemData: any) => {
  try {
    const itemRef = doc(firestore, "menuItems", id);
    await updateDoc(itemRef, itemData);
  } catch (error) {
    console.error("Error updating menu item", error);
    throw error;
  }
};

export const addMenuItem = async (itemData: any) => {
  try {
    const menuRef = collection(firestore, "menuItems");
    const docRef = await addDoc(menuRef, itemData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding menu item", error);
    throw error;
  }
};

export const deleteMenuItem = async (id: string) => {
  try {
    const itemRef = doc(firestore, "menuItems", id);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error("Error deleting menu item", error);
    throw error;
  }
};

// Newsletter subscribers
export const addSubscriber = async (email: string) => {
  try {
    const subscribersRef = collection(firestore, "subscribers");
    const docRef = await addDoc(subscribersRef, {
      email,
      subscribedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding subscriber", error);
    throw error;
  }
};

export { auth, firestore, storage };
