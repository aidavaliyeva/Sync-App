import { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '../lib/supabase';

export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    console.log('AUTH-CALLBACK: screen mounted');
    let handled = false;

    async function processUrl(url: string) {
      if (handled) return;
      handled = true;

      try {
        console.log('Auth callback URL:', url);

        const hashPart = url.split('#')[1];
        if (!hashPart) {
          router.replace('/(auth)/login');
          return;
        }

        const params: Record<string, string> = {};
        hashPart.split('&').forEach((pair) => {
          const eqIndex = pair.indexOf('=');
          if (eqIndex > -1) {
            params[decodeURIComponent(pair.substring(0, eqIndex))] =
              decodeURIComponent(pair.substring(eqIndex + 1));
          }
        });

        console.log('Parsed params type:', params.type);

        if (!params.access_token || !params.refresh_token) {
          router.replace('/(auth)/login');
          return;
        }

        const { error } = await supabase.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
        });

        if (error) {
          console.error('Set session error:', error);
          router.replace('/(auth)/login');
          return;
        }

        if (params.type === 'recovery') {
          router.replace('/(auth)/new-password');
        } else {
          router.replace('/(tabs)/home');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        router.replace('/(auth)/login');
      }
    }

    // Cold start: app launched via the deep link
    Linking.getInitialURL().then((url) => {
      if (url) processUrl(url);
    });

    // Warm start: app was already running (e.g. backgrounded while in email app)
    const sub = Linking.addEventListener('url', ({ url }) => {
      processUrl(url);
    });

    // Safety fallback: if no URL arrives after 5 s, go to login
    const timeout = setTimeout(() => {
      if (!handled) {
        handled = true;
        router.replace('/(auth)/login');
      }
    }, 5000);

    return () => {
      sub.remove();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1B8A8F" />
      <Text style={styles.text}>Verifying...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' },
  text: { color: 'rgba(255,255,255,0.7)', marginTop: 16, fontSize: 14 },
});
