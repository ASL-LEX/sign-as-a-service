import { createContext } from 'react';
import { User } from 'firebase/auth';

export const AuthContext = createContext<{
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}>({ token: null, user: null, login: () => {}, logout: () => {} });
