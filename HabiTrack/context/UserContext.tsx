import { DatabaseService } from '@/services';
import { createContext, useContext, useState } from 'react';

const UserContext = createContext<{
  currentUserId: string | null;
  setCurrentUser: (user: string | null) => void;
}>({ currentUserId: null, setCurrentUser: (user: string | null) => {} });
export function UserProvider({ children }: { children: React.ReactNode }) {
  const databaseService = DatabaseService.instance;
  const [currentUserId, setCurrentUserId] = useState<string | null>(
    databaseService?.userId || null,
  );
  return (
    <UserContext.Provider
      value={{ currentUserId: currentUserId, setCurrentUser: setCurrentUserId }}>
      {children}
    </UserContext.Provider>
  );
}
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
