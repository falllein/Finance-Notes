import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { User, Bell, Shield, Database, Download, Upload, MessageSquare, Moon, Sun, ChevronRight, LogOut, Settings as SettingsIcon, CreditCard, Target, CircleHelp as HelpCircle } from 'lucide-react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);
  
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(isDark);
  const [telegramConnected, setTelegramConnected] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Keluar',
      'Apakah Anda yakin ingin keluar dari aplikasi?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Keluar', 
          style: 'destructive',
          onPress: () => {
            // Handle logout logic
            console.log('Logging out...');
          }
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Ekspor Data',
      'Data akan diekspor dalam format Excel. Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Ekspor', 
          onPress: () => {
            // Handle export logic
            console.log('Exporting data...');
          }
        },
      ]
    );
  };

  const handleBackupData = () => {
    Alert.alert(
      'Backup Data',
      'Data akan dicadangkan ke cloud storage. Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Backup', 
          onPress: () => {
            // Handle backup logic
            console.log('Backing up data...');
          }
        },
      ]
    );
  };

  const handleTelegramConnect = () => {
    if (telegramConnected) {
      Alert.alert(
        'Putuskan Koneksi Telegram',
        'Apakah Anda yakin ingin memutuskan koneksi dengan Telegram bot?',
        [
          { text: 'Batal', style: 'cancel' },
          { 
            text: 'Putuskan', 
            style: 'destructive',
            onPress: () => setTelegramConnected(false)
          },
        ]
      );
    } else {
      Alert.alert(
        'Hubungkan Telegram',
        'Untuk menghubungkan Telegram bot, scan QR code atau klik link berikut: @FinanceTrackerBot',
        [
          { text: 'Batal', style: 'cancel' },
          { 
            text: 'Hubungkan', 
            onPress: () => setTelegramConnected(true)
          },
        ]
      );
    }
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement, 
    showChevron = true 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>{icon}</View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightElement}
        {showChevron && <ChevronRight size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pengaturan</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akun</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={<User size={20} color="#10B981" />}
              title="Profil Pengguna"
              subtitle="Kelola informasi akun Anda"
              onPress={() => console.log('Profile pressed')}
            />
            
            <SettingItem
              icon={<CreditCard size={20} color="#3B82F6" />}
              title="Akun Bank"
              subtitle="Kelola akun bank dan kartu kredit"
              onPress={() => console.log('Bank accounts pressed')}
            />
            
            <SettingItem
              icon={<Target size={20} color="#F59E0B" />}
              title="Target & Budget"
              subtitle="Atur target keuangan dan budget"
              onPress={() => console.log('Budget pressed')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifikasi & Integrasi</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={<Bell size={20} color="#8B5CF6" />}
              title="Notifikasi"
              subtitle="Pengingat transaksi dan laporan"
              rightElement={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                />
              }
              showChevron={false}
            />
            
            <SettingItem
              icon={<MessageSquare size={20} color="#06B6D4" />}
              title="Telegram Bot"
              subtitle={telegramConnected ? "Terhubung" : "Tidak terhubung"}
              onPress={handleTelegramConnect}
              rightElement={
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: telegramConnected ? '#10B981' : '#6B7280' }
                ]} />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Keamanan</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={<Database size={20} color="#10B981" />}
              title="Backup Data"
              subtitle="Cadangkan data ke cloud"
              onPress={handleBackupData}
            />
            
            <SettingItem
              icon={<Download size={20} color="#3B82F6" />}
              title="Ekspor Data"
              subtitle="Unduh data dalam format Excel"
              onPress={handleExportData}
            />
            
            <SettingItem
              icon={<Upload size={20} color="#F97316" />}
              title="Impor Data"
              subtitle="Impor data dari file Excel/CSV"
              onPress={() => console.log('Import pressed')}
            />
            
            <SettingItem
              icon={<Shield size={20} color="#EF4444" />}
              title="Keamanan"
              subtitle="PIN, biometrik, dan enkripsi"
              onPress={() => console.log('Security pressed')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tampilan</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={isDark ? <Moon size={20} color="#6366F1" /> : <Sun size={20} color="#F59E0B" />}
              title="Mode Gelap"
              subtitle="Gunakan tema gelap"
              rightElement={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                />
              }
              showChevron={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bantuan</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon={<HelpCircle size={20} color="#8B5CF6" />}
              title="Bantuan & FAQ"
              subtitle="Pertanyaan yang sering diajukan"
              onPress={() => console.log('Help pressed')}
            />
            
            <SettingItem
              icon={<SettingsIcon size={20} color="#6B7280" />}
              title="Tentang Aplikasi"
              subtitle="Versi 1.0.0"
              onPress={() => console.log('About pressed')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Keluar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            FinanceTracker v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            © 2024 All rights reserved
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#4B5563' : '#E5E7EB',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#4B5563' : '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#9CA3AF' : '#6B7280',
    marginTop: 2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingBottom: 100,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#6B7280' : '#9CA3AF',
    marginTop: 4,
  },
});