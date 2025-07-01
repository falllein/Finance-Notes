import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, Slash as Flash, RotateCcw, X, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function ScannerScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);
  
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Memeriksa izin kamera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera size={64} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <Text style={styles.permissionTitle}>Izin Kamera Diperlukan</Text>
          <Text style={styles.permissionText}>
            Aplikasi memerlukan akses kamera untuk memindai struk belanja
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Berikan Izin</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlashMode(current => (current === 'off' ? 'on' : 'off'));
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      setIsScanning(true);
      
      if (Platform.OS === 'web') {
        // Web implementation - simulate OCR processing
        setTimeout(() => {
          const mockData = {
            merchantName: 'Indomaret',
            total: 85000,
            items: [
              { name: 'Beras 5kg', price: 60000 },
              { name: 'Minyak Goreng', price: 25000 },
            ],
            date: new Date().toISOString(),
          };
          setScannedData(mockData);
          setIsScanning(false);
        }, 2000);
      } else {
        // Mobile implementation would use actual camera
        const photo = await cameraRef.current.takePictureAsync();
        // Process with OCR service
        processReceiptOCR(photo);
      }
    } catch (error) {
      setIsScanning(false);
      Alert.alert('Error', 'Gagal memindai struk. Silakan coba lagi.');
    }
  };

  const processReceiptOCR = async (photo: any) => {
    // In a real app, this would call an OCR service
    // For demo purposes, we'll simulate the process
    setTimeout(() => {
      const mockData = {
        merchantName: 'Alfamart',
        total: 125000,
        items: [
          { name: 'Susu UHT 1L', price: 15000 },
          { name: 'Roti Tawar', price: 12000 },
          { name: 'Telur 1kg', price: 25000 },
          { name: 'Mie Instan', price: 3000 },
        ],
        date: new Date().toISOString(),
      };
      setScannedData(mockData);
      setIsScanning(false);
    }, 3000);
  };

  const confirmScan = () => {
    if (scannedData) {
      // Add transaction logic here
      Alert.alert(
        'Berhasil!',
        'Transaksi berhasil ditambahkan ke riwayat.',
        [
          {
            text: 'OK',
            onPress: () => {
              setScannedData(null);
              // Navigate back or reset
            },
          },
        ]
      );
    }
  };

  const retryScan = () => {
    setScannedData(null);
    setIsScanning(false);
  };

  if (scannedData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <CheckCircle size={32} color="#10B981" />
            <Text style={styles.resultTitle}>Struk Berhasil Dipindai</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.merchantName}>{scannedData.merchantName}</Text>
            <Text style={styles.resultDate}>
              {new Date(scannedData.date).toLocaleDateString('id-ID')}
            </Text>
            
            <View style={styles.itemsList}>
              {scannedData.items.map((item: any, index: number) => (
                <View key={index} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    Rp {item.price.toLocaleString('id-ID')}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>
                Rp {scannedData.total.toLocaleString('id-ID')}
              </Text>
            </View>
          </View>

          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.retryButton} onPress={retryScan}>
              <Text style={styles.retryButtonText}>Pindai Ulang</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.confirmButton} onPress={confirmScan}>
              <Text style={styles.confirmButtonText}>Simpan Transaksi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pindai Struk</Text>
        <Text style={styles.subtitle}>
          Arahkan kamera ke struk belanja untuk otomatis menambah transaksi
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flashMode}
        >
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            
            <View style={styles.controls}>
              <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
                <Flash size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.captureButton, isScanning && styles.captureButtonDisabled]}
                onPress={takePhoto}
                disabled={isScanning}
              >
                {isScanning ? (
                  <Text style={styles.captureButtonText}>Memproses...</Text>
                ) : (
                  <Camera size={32} color="#FFFFFF" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
                <RotateCcw size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>

      <View style={styles.instructions}>
        <AlertCircle size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
        <Text style={styles.instructionsText}>
          Pastikan struk terlihat jelas dan tidak buram untuk hasil terbaik
        </Text>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1F2937' : '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#9CA3AF' : '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#9CA3AF' : '#6B7280',
    lineHeight: 20,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  scanFrame: {
    width: 280,
    height: 200,
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  captureButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    gap: 12,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#9CA3AF' : '#6B7280',
    lineHeight: 20,
  },
  resultContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40,
  },
  resultTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
    marginTop: 12,
  },
  resultCard: {
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  merchantName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
    marginBottom: 4,
  },
  resultDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#9CA3AF' : '#6B7280',
    marginBottom: 20,
  },
  itemsList: {
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#4B5563' : '#E5E7EB',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: isDark ? '#4B5563' : '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    flex: 1,
    backgroundColor: isDark ? '#4B5563' : '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F3F4F6' : '#1F2937',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});