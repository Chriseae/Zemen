import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Message, LibraryItem, Project, Transaction, Referral } from '../types';

// ==================== USER DATA ====================

export const saveUserProfile = async (userId: string, data: any) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: Timestamp.now()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error saving user profile:', error);
    return { success: false, error };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error };
  }
};

// ==================== CHAT SESSIONS ====================

export const saveChatSession = async (userId: string, sessionId: string, messages: Message[], title: string) => {
  try {
    await setDoc(doc(db, 'users', userId, 'chatSessions', sessionId), {
      sessionId,
      title,
      messages: messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp || new Date().toISOString()
      })),
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving chat session:', error);
    return { success: false, error };
  }
};

export const getChatSessions = async (userId: string) => {
  try {
    const sessionsRef = collection(db, 'users', userId, 'chatSessions');
    const q = query(sessionsRef, orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const sessions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, data: sessions };
  } catch (error) {
    console.error('Error getting chat sessions:', error);
    return { success: false, error };
  }
};

export const deleteChatSession = async (userId: string, sessionId: string) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'chatSessions', sessionId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting chat session:', error);
    return { success: false, error };
  }
};

// ==================== LIBRARY ITEMS ====================

export const saveLibraryItem = async (userId: string, item: LibraryItem) => {
  try {
    const itemRef = doc(db, 'users', userId, 'libraryItems', item.id);
    await setDoc(itemRef, {
      ...item,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving library item:', error);
    return { success: false, error };
  }
};

export const getLibraryItems = async (userId: string) => {
  try {
    const itemsRef = collection(db, 'users', userId, 'libraryItems');
    const q = query(itemsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LibraryItem[];

    return { success: true, data: items };
  } catch (error) {
    console.error('Error getting library items:', error);
    return { success: false, error };
  }
};

export const deleteLibraryItem = async (userId: string, itemId: string) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'libraryItems', itemId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting library item:', error);
    return { success: false, error };
  }
};

export const updateLibraryItem = async (userId: string, itemId: string, updates: Partial<LibraryItem>) => {
  try {
    const itemRef = doc(db, 'users', userId, 'libraryItems', itemId);
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating library item:', error);
    return { success: false, error };
  }
};

// ==================== PROJECTS ====================

export const saveProject = async (userId: string, project: Project) => {
  try {
    const projectRef = doc(db, 'users', userId, 'projects', project.id);
    await setDoc(projectRef, {
      ...project,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving project:', error);
    return { success: false, error };
  }
};

export const getProjects = async (userId: string) => {
  try {
    const projectsRef = collection(db, 'users', userId, 'projects');
    const querySnapshot = await getDocs(projectsRef);

    const projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];

    return { success: true, data: projects };
  } catch (error) {
    console.error('Error getting projects:', error);
    return { success: false, error };
  }
};

export const deleteProject = async (userId: string, projectId: string) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'projects', projectId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error };
  }
};

export const updateProject = async (userId: string, projectId: string, updates: Partial<Project>) => {
  try {
    const projectRef = doc(db, 'users', userId, 'projects', projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error };
  }
};

// ==================== LOCALSTORAGE HELPERS ====================

export const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(`zemenai-${key}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('LocalStorage save error:', error);
    return false;
  }
};

export const getFromLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(`zemenai-${key}`);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('LocalStorage get error:', error);
    return null;
  }
};

export const removeFromLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(`zemenai-${key}`);
    return true;
  } catch (error) {
    console.error('LocalStorage remove error:', error);
    return false;
  }
};