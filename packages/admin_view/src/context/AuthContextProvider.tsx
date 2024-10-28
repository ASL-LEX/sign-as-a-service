import { ReactNode, useCallback, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { AuthContext } from './auth-context';

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const app = initializeApp({ apiKey: import.meta.env.VITE_GCP_API_KEY });
  const auth = getAuth(app);

  // Firebase stores the auth state in localstorage by default
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const jwt = user ? await user.getIdToken() : null;
      setToken(jwt);
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const jwt = await user.getIdToken();
      setUser(user);
      setToken(jwt);
    },
    [auth]
  );

  const logout = useCallback(async () => {
    await signOut(auth);
  }, [auth]);

  return !loading && <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
