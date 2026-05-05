import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp, collection, query, orderBy, limit, addDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

interface CollaborationContextType {
  user: User | null;
  loading: boolean;
  campaignState: {
    id?: string;
    activePrompt?: string;
    activeTab?: string;
    enabledModules?: string[];
  };
  messages: any[];
  updateCampaignState: (updates: { activePrompt?: string; activeTab?: string; enabledModules?: string[] }) => Promise<void>;
  sendMessage: (role: 'user' | 'assistant', content: string, image?: string) => Promise<void>;
  toggleModule: (moduleId: string) => Promise<void>;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) throw new Error('useCollaboration must be used within a CollaborationProvider');
  return context;
};

export function CollaborationProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [campaignState, setCampaignState] = useState<any>({});
  const [messages, setMessages] = useState<any[]>([]);

  const campaignId = 'main-campaign'; // Shared campaign for the demo

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      
      if (u) {
        // Sync user profile
        const userDoc = doc(db, 'users', u.uid);
        setDoc(userDoc, {
          displayName: u.displayName,
          photoURL: u.photoURL,
          lastSeen: serverTimestamp(),
        }, { merge: true }).catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${u.uid}`));
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const campaignDoc = doc(db, 'campaigns', campaignId);
    const unsubscribeCampaign = onSnapshot(campaignDoc, (snapshot) => {
      if (snapshot.exists()) {
        setCampaignState(snapshot.data());
      } else {
        // Initialize campaign if not exists
        setDoc(campaignDoc, {
          activePrompt: '',
          activeTab: 'engine',
          updatedAt: serverTimestamp(),
        }).catch(err => handleFirestoreError(err, OperationType.CREATE, `campaigns/${campaignId}`));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, `campaigns/${campaignId}`));

    const messagesQuery = query(
      collection(db, 'campaigns', campaignId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
    }, (err) => handleFirestoreError(err, OperationType.LIST, `campaigns/${campaignId}/messages`));

    return () => {
      unsubscribeCampaign();
      unsubscribeMessages();
    };
  }, [user]);

  const updateCampaignState = async (updates: any) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'campaigns', campaignId), {
        ...updates,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `campaigns/${campaignId}`);
    }
  };

  const sendMessage = async (role: 'user' | 'assistant', content: string, image?: string) => {
    if (!user) return;
    const path = `campaigns/${campaignId}/messages`;
    try {
      await addDoc(collection(db, 'campaigns', campaignId, 'messages'), {
        role,
        content,
        image: image || null,
        createdAt: serverTimestamp(),
        authorId: user.uid,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const toggleModule = async (moduleId: string) => {
    if (!user) return;
    const currentModules = campaignState.enabledModules || [];
    const newModules = currentModules.includes(moduleId)
      ? currentModules.filter(id => id !== moduleId)
      : [...currentModules, moduleId];
    
    await updateCampaignState({ enabledModules: newModules });
  };

  return (
    <CollaborationContext.Provider value={{
      user,
      loading,
      campaignState: { ...campaignState, id: campaignId },
      messages,
      updateCampaignState,
      sendMessage,
      toggleModule
    }}>
      {children}
    </CollaborationContext.Provider>
  );
}
