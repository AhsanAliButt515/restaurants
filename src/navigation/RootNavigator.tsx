import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useVerifyQuery } from '../api/auth';
import api from '../api/client';
import SplashScreen from '../screens/SplashScreen';
import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';

interface AuthContextType {
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return {
      checkAuth: async () => { console.warn('[AuthContext] checkAuth called outside provider'); },
      logout: async () => { console.warn('[AuthContext] logout called outside provider'); }
    };
  }
  return context;
};

export const RootNavigator = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load token from storage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@auth_token');
        setToken(storedToken);
      } catch (e) {
        console.error('[RootNavigator] Failed to load token:', e);
      } finally {
        setIsInitializing(false);
      }
    };
    initAuth();
  }, []);

  // Use the verify query hook
  const { data: userData, isLoading: isVerifying, isError, error } = useVerifyQuery(token);
  // Sync authentication state based on query results
  useEffect(() => {
    if (!isInitializing && !isVerifying) {
      if (userData) {
        console.log('[RootNavigator] Session verified:', userData);
        setIsAuthenticated(true);
      } else if (isError || (token && !userData)) {
        console.log('[RootNavigator] Session invalid or error:', error);
        handleAuthFailure();
      } else if (!token) {
        setIsAuthenticated(false);
      }
    }
  }, [userData, isError, isInitializing, isVerifying, token, error]);

  const handleAuthFailure = async () => {
    await AsyncStorage.removeItem('@auth_token');
    await AsyncStorage.removeItem('@access_granted');
    setToken(null);
    setIsAuthenticated(false);
  };

  const checkAuth = useCallback(async () => {
    const storedToken = await AsyncStorage.getItem('@auth_token');
    setToken(storedToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('[RootNavigator] Logout API call failed:', error);
    } finally {
      await AsyncStorage.removeItem('@auth_token');
      await AsyncStorage.removeItem('@access_granted');
      await AsyncStorage.removeItem('@auth_user');
      setToken(null);
      setIsAuthenticated(false);
    }
  }, [token]);

  const contextValue = useMemo(() => ({
    checkAuth,
    logout,
  }), [checkAuth, logout]);

  const loading = isInitializing || (!!token && isVerifying);

  console.log('[RootNavigator] State:', { loading, isInitializing, isVerifying, isAuthenticated, hasToken: !!token });

  if (loading) {
    return <SplashScreen standalone />;
  }

  return (
    <AuthContext.Provider value={contextValue}>

      {isAuthenticated ? <AppStack /> : <AuthStack />}

    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
