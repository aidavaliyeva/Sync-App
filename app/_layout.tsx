import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export default function RootLayout() {
  const { setSessionAndProfile, setLoading, isAuthenticated, isLoading, onboardingComplete } =
    useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  // True while we've called router.replace('/(auth)/new-password') but segments
  // haven't updated yet — blocks the routing guard from redirecting to home during
  // that render window.
  const handlingRecovery = useRef(false);

  // TEMP DEBUG — remove after deep link is confirmed working
  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      console.log('🚨🚨🚨 STARTUP URL:', url);
    });
    const sub = Linking.addEventListener('url', (event) => {
      console.log('🚨🚨🚨 URL EVENT:', event.url);
    });
    return () => sub.remove();
  }, []);

  // Load session on mount and subscribe to auth changes.
  // Use onAuthStateChange only — it fires INITIAL_SESSION immediately with the
  // stored session, avoiding a redundant getSession() call and the race condition
  // that causes double profile fetches.
  useEffect(() => {
    const resolveSession = async (session: any) => {
      try {
        if (session?.user?.id) {
          const { data } = await supabase
            .from('profiles')
            .select('onboarding_complete')
            .eq('id', session.user.id)
            .single();
          // data may be null if profile doesn't exist yet — default to false
          setSessionAndProfile(session, data?.onboarding_complete ?? false);
        } else {
          setSessionAndProfile(null, false);
        }
      } catch {
        // Profile fetch failed (network error, RLS, etc.) — unblock the app
        setSessionAndProfile(session ?? null, false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'PASSWORD_RECOVERY') {
        resolveSession(session);
        router.replace('/(auth)/new-password');
        return;
      }
      resolveSession(session);
    });

    // Hard safety net: unblock after 10 s no matter what (network hang, etc.)
    const timeout = setTimeout(() => {
      if (useAuthStore.getState().isLoading) {
        setLoading(false);
      }
    }, 10_000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // Process deep-link tokens directly — Expo Router can't mount auth-callback.tsx
  // before the routing guard fires (no persisted session → isLoading goes false → redirect to welcome).
  // By handling the URL here we can call setSession() and navigate to new-password
  // while the inNewPassword guard holds the routing guard back.
  useEffect(() => {
    async function handleDeepLink(url: string | null) {
      console.log('🔗 handleDeepLink called with:', url);
      console.log('🔗 includes auth-callback:', url?.includes('auth-callback'));
      console.log('🔗 includes #:', url?.includes('#'));

      if (!url || !url.includes('auth-callback')) {
        console.log('🔗 SKIPPING — no auth-callback in URL');
        return;
      }

      const hash = url.split('#')[1];
      console.log('🔗 hash fragment:', hash ?? '(none)');
      if (!hash) return;

      const params: Record<string, string> = {};
      hash.split('&').forEach((pair) => {
        const idx = pair.indexOf('=');
        if (idx > -1) {
          params[decodeURIComponent(pair.slice(0, idx))] = decodeURIComponent(pair.slice(idx + 1));
        }
      });

      console.log('🔗 params.type:', params.type);
      console.log('🔗 has access_token:', !!params.access_token);
      console.log('🔗 has refresh_token:', !!params.refresh_token);

      if (params.access_token && params.refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
        });
        console.log('🔗 setSession error:', error?.message ?? 'none');
        if (!error && params.type === 'recovery') {
          console.log('🔗 navigating to new-password');
          handlingRecovery.current = true;
          router.replace('/(auth)/new-password');
        }
      }
    }

    Linking.getInitialURL().then((url) => {
      console.log('🔗 INITIAL URL:', url);
      handleDeepLink(url);
    });

    const sub = Linking.addEventListener('url', (event) => {
      console.log('🔗 URL EVENT:', event.url);
      handleDeepLink(event.url);
    });

    return () => sub.remove();
  }, []);

  // Routing guard: redirect based on auth + onboarding state.
  // Fires whenever isLoading/isAuthenticated/onboardingComplete/segments change.
  useEffect(() => {
    if (isLoading) return;

    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';
    const onRootIndex = segments.length === 0;
    // auth-callback sets the session — don't redirect it before it finishes
    const inAuthCallback = segments[0] === 'auth-callback';
    // Don't evict the user from new-password after PASSWORD_RECOVERY sets their session
    const inNewPassword = segments.includes('new-password');

    console.log('LAYOUT: segments =', segments);
    console.log('LAYOUT: isAuthenticated =', isAuthenticated);
    console.log('LAYOUT: isOnAuthCallback =', inAuthCallback);

    if (inAuthCallback) return;
    if (inNewPassword) {
      handlingRecovery.current = false; // we've arrived — clear the race guard
      return;
    }
    if (handlingRecovery.current) return; // navigating to new-password, segments not updated yet

    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/welcome');
    } else if (isAuthenticated && !onboardingComplete && !inOnboarding) {
      router.replace('/(onboarding)/step-1');
    } else if (isAuthenticated && onboardingComplete && (inAuth || inOnboarding || onRootIndex)) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isLoading, onboardingComplete, segments]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth-callback" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="chat/[id]" />
        <Stack.Screen name="profile/[id]" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="edit-profile" />
      </Stack>
      {/* Overlay splash while session resolves — keeps the Stack mounted so
          Expo Router processes deep link URLs before the routing guard runs. */}
      {isLoading && (
        <View style={[StyleSheet.absoluteFill, styles.splash]}>
          <Text style={styles.splashText}>Sync</Text>
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#0A0A0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
