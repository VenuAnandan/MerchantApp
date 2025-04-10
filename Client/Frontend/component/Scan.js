import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function Scan() {
  const [facing, setFacing] = useState('back');
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState('');
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  const handleBarcodeScanned = (barcode) => {
    if (!scanned) {
      setScanned(true);
      setBarcodeData(barcode.data);
      Alert.alert('Barcode Scanned', `Type: ${barcode.type}\nID: ${barcode.data}`);
    }
  };

  if (!permission || !permission.granted) {
    return <Text>Requesting camera permissions...</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'code128'], // Customize this if needed
        }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      {scanned && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Scanned ID: {barcodeData}</Text>
          <Button title="Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultBox: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignSelf: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
