import { createContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (userEmail: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});