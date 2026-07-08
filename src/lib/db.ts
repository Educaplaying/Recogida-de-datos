import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { PartnerData, SupportTicket } from '../types';

// Initialize Firebase App gracefully
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);

const PARTNERS_COLLECTION = 'partners';
const TICKETS_COLLECTION = 'tickets';

// Helper to save a Partner Submission
export async function savePartnerSubmission(partner: PartnerData): Promise<void> {
  // 1. Always save to LocalStorage as an instant, fail-safe local cache
  try {
    const localData = localStorage.getItem('partners_cache');
    const existing: PartnerData[] = localData ? JSON.parse(localData) : [];
    // Avoid duplicates
    if (!existing.some(p => p.id === partner.id)) {
      localStorage.setItem('partners_cache', JSON.stringify([partner, ...existing]));
    }
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }

  // 2. Save to Firebase Firestore for real-time, multi-device cloud persistence
  try {
    const colRef = collection(firestore, PARTNERS_COLLECTION);
    await addDoc(colRef, {
      ...partner,
      timestamp: new Date()
    });
    console.log('Successfully saved submission to Firestore Cloud!');
  } catch (err) {
    console.error('Firestore save failed, using LocalStorage cache only:', err);
  }
}

// Helper to load all Partner Submissions (combining Cloud + Local Cache)
export async function loadPartnerSubmissions(): Promise<PartnerData[]> {
  const mergedMap = new Map<string, PartnerData>();

  // 1. First populate from Local Cache (so it loads instantly)
  try {
    const localData = localStorage.getItem('partners_cache');
    if (localData) {
      const parsed: PartnerData[] = JSON.parse(localData);
      parsed.forEach(item => mergedMap.set(item.id, item));
    }
  } catch (err) {
    console.warn('LocalStorage read failed:', err);
  }

  // 2. Fetch from Firebase Firestore to sync and get newest entries from other devices
  try {
    const colRef = collection(firestore, PARTNERS_COLLECTION);
    const q = query(colRef, orderBy('submissionDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const cloudItems: PartnerData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const item: PartnerData = {
        id: data.id,
        companyName: data.companyName,
        location: data.location,
        capacity: data.capacity,
        profile: data.profile,
        otherProfileText: data.otherProfileText,
        functions: data.functions,
        competencies: data.competencies,
        submissionDate: data.submissionDate
      };
      cloudItems.push(item);
      mergedMap.set(item.id, item); // Overwrite with cloud version if present
    });

    // Update LocalStorage cache with the fresh merged set
    const mergedList = Array.from(mergedMap.values()).sort((a, b) => 
      new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    );
    localStorage.setItem('partners_cache', JSON.stringify(mergedList));
    return mergedList;
  } catch (err) {
    console.warn('Firestore fetch failed, returning local cache only:', err);
    return Array.from(mergedMap.values()).sort((a, b) => 
      new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    );
  }
}

// Helper to save a Support Ticket
export async function saveSupportTicket(ticket: SupportTicket): Promise<void> {
  try {
    const localData = localStorage.getItem('tickets_cache');
    const existing: SupportTicket[] = localData ? JSON.parse(localData) : [];
    localStorage.setItem('tickets_cache', JSON.stringify([ticket, ...existing]));
  } catch (err) {
    console.warn('LocalStorage ticket save failed:', err);
  }

  try {
    const colRef = collection(firestore, TICKETS_COLLECTION);
    await addDoc(colRef, {
      ...ticket,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Firestore ticket save failed:', err);
  }
}
