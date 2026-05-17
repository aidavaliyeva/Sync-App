import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ScreenBackground } from '../components/ScreenBackground';
import { GlassCard } from '../components/ui/GlassCard';
import { Colors } from '../constants/colors';

export default function PrivacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScreenBackground>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 16, paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Feather name="chevron-left" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Privacy Policy</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content Card */}
        <GlassCard style={styles.contentCard}>

          {/* §1 — Data Controller */}
          <Text style={[styles.sectionTitle, styles.sectionTitleFirst]} accessibilityRole="header">
            1. Data Controller
          </Text>
          <Text style={styles.sectionBody}>
            {'[Company Name] ("we," "us," or "our"), registered in Germany under registration number [Registration Number], is the data controller for personal data processed through the Sync app ("App") within the meaning of the General Data Protection Regulation (GDPR) and the German Federal Data Protection Act (Bundesdatenschutzgesetz, BDSG). For any privacy-related requests, including the exercise of your data subject rights, contact us at privacy@sync.io.'}
          </Text>

          {/* §2 — Data We Collect */}
          <Text style={styles.sectionTitle} accessibilityRole="header">
            2. Data We Collect
          </Text>
          <Text style={styles.sectionBody}>
            <Text style={styles.bold}>Account Data: </Text>
            {'Your email address and a cryptographic hash of your password. Your password is never stored in plain text.'}
          </Text>
          <Text style={[styles.sectionBody, styles.paraGap]}>
            <Text style={styles.bold}>Profile Data: </Text>
            {'Your full name, username, profile photo, age, city, country, field of study, university, interests, current projects, and optional LinkedIn URL.'}
          </Text>
          <Text style={[styles.sectionBody, styles.paraGap]}>
            <Text style={styles.bold}>Usage Data: </Text>
            {'Connection requests sent and received, message content and timestamps, match interactions, and notification preferences stored locally and in our database.'}
          </Text>
          <Text style={[styles.sectionBody, styles.paraGap]}>
            <Text style={styles.bold}>Device Data: </Text>
            {'Your Expo push notification token (used solely to deliver notifications you have opted into) and basic device metadata — device type and operating system version — collected exclusively for crash reporting and service stability.'}
          </Text>

          {/* §3 — How We Use Your Data */}
          <Text style={styles.sectionTitle} accessibilityRole="header">
            3. How We Use Your Data
          </Text>
          <Text style={styles.sectionBody}>We process your personal data for the following purposes:</Text>
          <View style={styles.bulletList}>
            {[
              'To create and manage your account and provide the core matching and messaging features of the App',
              'To deliver push notifications to which you have opted in',
              'To enable optional student verification where you choose to participate',
              'To improve match quality using aggregated, anonymised data that cannot identify individual users',
              'To comply with our legal obligations, including applicable tax, audit, and data protection law',
            ].map((item, i, arr) => (
              <View key={i} style={[styles.bulletRow, i < arr.length - 1 && styles.bulletGap]}>
                <Text style={styles.bulletDot}>·</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* §4 — Legal Basis */}
          <Text style={styles.sectionTitle} accessibilityRole="header">
            4. Legal Basis (GDPR — EU/EEA Users)
          </Text>
          <Text style={styles.sectionBody}>
            {'For EU/EEA users, we rely on the following legal bases under Article 6 GDPR: '}
            <Text style={styles.bold}>Contract (Art. 6(1)(b))</Text>
            {' — processing necessary to perform the agreement when you create an account and use the App. '}
            <Text style={styles.bold}>Legitimate Interests (Art. 6(1)(f))</Text>
            {' — to improve the App and prevent fraud, where our interests are not overridden by your fundamental rights. '}
            <Text style={styles.bold}>Consent (Art. 6(1)(a))</Text>
            {' — for optional push notifications, which you may withdraw at any time via Settings → Notifications.'}
          </Text>

          {/* §5 — Data Storage & Security */}
          <Text style={styles.sectionTitle} accessibilityRole="header">
            5. Data Storage & Security
          </Text>
          <Text style={styles.sectionBody}>
            {'Your data is stored in a PostgreSQL database hosted by Supabase on AWS infrastructure (EU region where available). All data transmitted between the App and our servers is encrypted using TLS 1.3. Data at rest is encrypted using AES-256. Profile photos are stored in Supabase Storage with server-side encryption and authenticated access controls that prevent unauthorised access. We conduct regular security reviews and apply the principle of least privilege to all internal data access.'}
          </Text>

          {/* §6 — Data Sharing */}
          <Text style={styles.sectionTitle} accessibilityRole="header">
            6. Data Sharing
          </Text>
          <Text style={styles.sectionBody}>
            {'We do '}
            <Text style={styles.bold}>not sell</Text>
            {' your personal data. We share data only with the following sub-processors, each bound by a Data Processing Agreement (DPA) consistent with GDPR Article 28:'}
          </Text>
          <View style={styles.bulletList}>
            {[
              { label: 'Supabase (Supabase Inc.)', body: '— database hosting, file storage, and authentication infrastructure.' },
              { label: 'Expo (Expo Inc.)', body: '— push notification delivery. Only your push token and notification payload are transmitted.' },
              { label: 'Apple Inc.', body: '— App Store distribution and, if used, Sign in with Apple authentication.' },
              { label: 'Google LLC', body: '— Google Sign-In, only if you choose to authenticate via Google.' },
            ].map((item, i) => (
              <View key={i} style={[styles.bulletRow, styles.bulletGap]}>
                <Text style={styles.bulletDot}>·</Text>
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>{item.label}</Text>
                  {' '}{item.body}
                </Text>
              </View>
            ))}
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>·</Text>
              <Text style={styles.bulletText}>
                Law enforcement or regulatory authorities, where we are required to disclose data by a valid legal process, court order, or statutory obligation.
              </Text>
            </View>
          </View>

          {/* §7 — Your Rights */}
          <Text style={styles.sectionTitle} accessibilityRole="header">
            7. Your Rights
          </Text>
          <View style={styles.tealBox}>
            <Text style={styles.tealBoxText}>
              {'You can access, correct, export, or delete your personal data at any time via Settings → Delete account, or by emailing privacy@sync.io. We will respond to all valid requests within 30 days as required by GDPR Article 12.'}
            </Text>
          </View>
          <Text style={[styles.sectionBody, { marginTop: 10 }]}>
            {'EU/EEA residents have additional rights under GDPR: the right to restrict processing (Art. 18), the right to data portability (Art. 20), and the right to object to processing based on legitimate interests (Art. 21). You have the right to lodge a complaint with your national supervisory authority — in Germany, the '}
            <Text style={styles.bold}>Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg (LfDI BW)</Text>
            {'. California residents have rights under the CCPA, including the right to know, delete, and opt out of sale of personal information; we do not sell personal information.'}
          </Text>

          {/* §8 — Data Retention */}
          <Text style={styles.sectionTitle} accessibilityRole="header">
            8. Data Retention
          </Text>
          <Text style={styles.sectionBody}>
            {'Your account and profile data is retained for as long as your account remains active. When you delete your account, your profile data and message history are permanently deleted from our active database within 30 days. Encrypted database backups are purged within 30 days of account deletion. Certain records may be retained for a longer period where required by applicable law, such as statutory accounting or tax retention obligations under German commercial law (§ 257 HGB, § 147 AO).'}
          </Text>

          {/* §9 — Children's Privacy */}
          <Text style={styles.sectionTitle} accessibilityRole="header">
            9. Children's Privacy
          </Text>
          <Text style={styles.sectionBody}>
            {'The App is not directed at children under the age of 16. We do not knowingly collect personal data from users under 16. If we become aware that a user under 16 has provided personal data without verifiable parental or guardian consent, we will delete that data and terminate the account immediately. If you believe a minor has registered on the App, please notify us at privacy@sync.io.'}
          </Text>

          {/* §10 — Advertising & Tracking */}
          <Text style={styles.sectionTitle} accessibilityRole="header">
            10. Advertising & Tracking
          </Text>
          <Text style={styles.sectionBody}>
            {'Sync does not use advertising SDKs, behavioural tracking technologies, third-party analytics trackers, or cookies for marketing or profiling purposes. We do not share your data with advertising networks, data brokers, or any third party for commercial targeting. Basic crash and error reporting uses only anonymised device metadata as described in Section 2 and is not linked to your identity.'}
          </Text>

          {/* §11 — International Transfers */}
          <Text style={styles.sectionTitle} accessibilityRole="header">
            11. International Transfers
          </Text>
          <Text style={styles.sectionBody}>
            {'Your personal data may be processed in the United States, where Supabase and Expo maintain infrastructure. For transfers of personal data from the EU/EEA to third countries, we rely on Standard Contractual Clauses (SCCs) as approved by the European Commission under Article 46(2)(c) GDPR, incorporated into our Data Processing Agreements with each provider. You may request a copy of the applicable transfer safeguards by contacting privacy@sync.io.'}
          </Text>

          {/* §12 — Changes to This Policy */}
          <Text style={styles.sectionTitle} accessibilityRole="header">
            12. Changes to This Policy
          </Text>
          <Text style={styles.sectionBody}>
            {'We will notify you of any material changes to this Privacy Policy via in-app notification and/or to the email address associated with your account at least 14 days before the changes take effect. We encourage you to review this Policy periodically. Your continued use of the App after the effective date of a revised Policy constitutes your acceptance of the changes. If you do not agree to the revised Policy, you must stop using the App and may delete your account as described in Section 7.'}
          </Text>

        </GlassCard>

        {/* Contact Block */}
        <View style={styles.contactBlock}>
          <Text style={styles.contactLabel}>PRIVACY REQUESTS & DATA PROTECTION CONTACT</Text>
          <Text style={styles.contactEmail}>privacy@sync.io</Text>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 14 },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerSpacer: { width: 32 },

  // Teal highlight box
  tealBox: {
    backgroundColor: 'rgba(27,138,143,0.12)',
    borderWidth: 0.5,
    borderColor: 'rgba(27,138,143,0.25)',
    borderRadius: 10,
    padding: 10,
  },
  tealBoxText: {
    fontSize: 12,
    color: 'rgba(93,216,222,0.9)',
    lineHeight: 12 * 1.5,
  },

  // Content card
  contentCard: {
    padding: 18,
    marginBottom: 12,
  },

  // Section typography
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitleFirst: {
    marginTop: 0,
  },
  sectionBody: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 12 * 1.6,
  },
  bold: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  paraGap: {
    marginTop: 8,
  },

  // Bullet list
  bulletList: {
    marginTop: 6,
    paddingLeft: 14,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletGap: {
    marginBottom: 3,
  },
  bulletDot: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginRight: 6,
    lineHeight: 12 * 1.6,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 12 * 1.6,
  },

  // Contact block
  contactBlock: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  contactLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  contactEmail: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.teal.light,
  },
});
