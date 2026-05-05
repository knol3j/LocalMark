import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';

export interface Campaign {
  id: string;
  activePrompt: string;
  activeTab: string;
  updatedAt: any;
  enabledModules?: string[];
}

export interface Variation {
  id: string;
  label: string;
  copy: string;
  ctr: number;
  conv: number;
  image?: string;
  status: 'winner' | 'contender';
  platform: string;
  audience: string;
  trend: 'up' | 'down' | 'stable';
}

export interface Persona {
  id: string;
  name: string;
  demographics: string;
  pains: string[];
  gains: string[];
  engagementScore: number;
}

export interface Metric {
  id: string;
  timestamp: any;
  ctr: number;
  conv: number;
  spend: number;
}

export interface Keyword {
  id: string;
  term: string;
  volume: string;
  difficulty: string;
  intent: string;
}

export const dataService = {
  // Campaign Root
  async getCampaign(campaignId: string) {
    const path = `campaigns/${campaignId}`;
    try {
      const docSnap = await getDoc(doc(db, path));
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Campaign : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async updateCampaign(campaignId: string, data: Partial<Campaign>) {
    const path = `campaigns/${campaignId}`;
    try {
      await setDoc(doc(db, path), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Variations
  subscribeToVariations(campaignId: string, callback: (variations: Variation[]) => void) {
    const path = `campaigns/${campaignId}/variations`;
    const q = query(collection(db, path), orderBy('ctr', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const variations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Variation));
      callback(variations);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  },

  async addVariation(campaignId: string, variation: Omit<Variation, 'id'>) {
    const path = `campaigns/${campaignId}/variations`;
    try {
      const newDoc = doc(collection(db, path));
      await setDoc(newDoc, variation);
      return newDoc.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Personas
  subscribeToPersonas(campaignId: string, callback: (personas: Persona[]) => void) {
    const path = `campaigns/${campaignId}/personas`;
    const q = query(collection(db, path));
    
    return onSnapshot(q, (snapshot) => {
      const personas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Persona));
      callback(personas);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  },

  async addPersona(campaignId: string, persona: Omit<Persona, 'id'>) {
    const path = `campaigns/${campaignId}/personas`;
    try {
      const newDoc = doc(collection(db, path));
      await setDoc(newDoc, persona);
      return newDoc.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async addMetric(campaignId: string, metric: Omit<Metric, 'id'>) {
    const path = `campaigns/${campaignId}/metrics`;
    try {
      const newDoc = doc(collection(db, path));
      await setDoc(newDoc, {
        ...metric,
        timestamp: metric.timestamp || serverTimestamp()
      });
      return newDoc.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Keywords
  subscribeToKeywords(campaignId: string, callback: (keywords: Keyword[]) => void) {
    const path = `campaigns/${campaignId}/keywords`;
    const q = query(collection(db, path));
    
    return onSnapshot(q, (snapshot) => {
      const keywords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Keyword));
      callback(keywords);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  },

  async addKeyword(campaignId: string, keyword: Omit<Keyword, 'id'>) {
    const path = `campaigns/${campaignId}/keywords`;
    try {
      const newDoc = doc(collection(db, path));
      await setDoc(newDoc, keyword);
      return newDoc.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Metrics
  subscribeToMetrics(campaignId: string, callback: (metrics: Metric[]) => void) {
    const path = `campaigns/${campaignId}/metrics`;
    const q = query(collection(db, path), orderBy('timestamp', 'asc'), limit(50));
    
    return onSnapshot(q, (snapshot) => {
      const metrics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Metric));
      callback(metrics);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  }
};
