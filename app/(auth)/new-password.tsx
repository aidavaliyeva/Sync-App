import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { ScreenBackground } from '../../components/ScreenBackground';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export default function NewPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const canSubmit = password.length >= 8 && password === confirm;

  const handleSubmit = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    await supabase.auth.signOut();
    setLoading(false);
    setDone(true);
  };

  return (
    <ScreenBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View
          style={[
            styles.container,
            { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 32 },
          ]}
        >
          <Text style={styles.title}>Set new password</Text>

          {!done ? (
            <>
              <Text style={styles.body}>Choose a new password for your account.</Text>

              <View style={{ marginTop: 24, gap: 12 }}>
                <View>
                  <TextInput
                    style={[styles.input, { paddingRight: 46 }]}
                    placeholder="New password"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={password}
                    onChangeText={(t) => { setPassword(t); setError(''); }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoFocus
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword((v) => !v)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name={showPassword ? 'eye-off' : 'eye'} size={16} color={Colors.text.label} />
                  </TouchableOpacity>
                </View>

                <View>
                  <TextInput
                    style={[styles.input, { paddingRight: 46 }]}
                    placeholder="Confirm password"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={confirm}
                    onChangeText={(t) => { setConfirm(t); setError(''); }}
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowConfirm((v) => !v)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name={showConfirm ? 'eye-off' : 'eye'} size={16} color={Colors.text.label} />
                  </TouchableOpacity>
                </View>

                {error ? (
                  <View style={styles.errorRow}>
                    <Feather name="alert-circle" size={12} color={Colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}
              </View>

              <Button
                label="Save new password"
                onPress={handleSubmit}
                variant="primary"
                fullWidth
                loading={loading}
                disabled={!canSubmit}
                style={[styles.tallBtn, { marginTop: 20 }]}
              />
            </>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.iconCircle}>
                <Feather name="check" size={28} color={Colors.teal.bright} />
              </View>
              <Text style={styles.successTitle}>Password updated!</Text>
              <Text style={styles.body}>
                Your password has been changed. Please log in with your new password.
              </Text>
              <TouchableOpacity
                style={{ marginTop: 32 }}
                onPress={() => router.replace('/(auth)/login')}
              >
                <Text style={styles.continueLink}>Back to log in</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20 },
  title: {
    fontSize: Typography.size.screenTitle,
    fontWeight: Typography.weight.screenTitle,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  body: {
    fontSize: 14,
    color: Colors.text.body,
    lineHeight: 20,
  },
  input: {
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#FFFFFF',
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  errorText: { fontSize: 12, color: Colors.error, flex: 1 },
  tallBtn: { height: 48 },
  successContainer: { flex: 1, alignItems: 'center', paddingTop: 40 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.teal.verifiedBg,
    borderWidth: 0.5,
    borderColor: Colors.teal.tagBorderAlpha,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: Typography.size.screenTitle,
    fontWeight: Typography.weight.screenTitle,
    color: Colors.text.primary,
    marginBottom: 10,
  },
  continueLink: { fontSize: 14, color: Colors.teal.bright, fontWeight: '500' },
});
