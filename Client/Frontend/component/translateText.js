import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';

export default function NumberToTamilScreen() {
  const [number, setNumber] = useState('');
  const [tamilText, setTamilText] = useState('');

  function numberToTamilText(number) {
    const ones = ['', 'ஒன்று', 'இரண்டு', 'மூன்று', 'நான்கு', 'ஐந்து', 'ஆறு', 'ஏழு', 'எட்டு', 'ஒன்பது'];
    const tens = ['', 'பத்து', 'இருபது', 'முப்பது', 'நாற்பது', 'ஐம்பது', 'அறுபது', 'எழுபது', 'எண்பது', 'தொன்னூறு'];

    if (number === 0) return 'பூஜ்ஜியம்';

    function twoDigitToTamil(n) {
      if (n < 10) return ones[n];
      if (n >= 10 && n < 20) {
        if (n === 10) return 'பத்து';
        return 'பதின்' + ones[n - 10];
      }
      const tensPlace = Math.floor(n / 10);
      const onesPlace = n % 10;
      return tens[tensPlace] + (onesPlace ? ' ' + ones[onesPlace] : '');
    }

    function threeDigitToTamil(n) {
      if (n === 0) return '';
      if (n < 100) return twoDigitToTamil(n);
      const hundredsPlace = Math.floor(n / 100);
      const remainder = n % 100;
      let text = ones[hundredsPlace] + ' நூறு';
      if (remainder) text += 'த்து ' + twoDigitToTamil(remainder);
      return text;
    }

    let result = '';

    const crore = Math.floor(number / 10000000);
    number %= 10000000;
    const lakh = Math.floor(number / 100000);
    number %= 100000;
    const thousand = Math.floor(number / 1000);
    number %= 1000;
    const hundreds = number;

    if (crore > 0) {
      result += (crore > 1 ? twoDigitToTamil(crore) : 'ஒரு') + ' கோடி ';
    }
    if (lakh > 0) {
      result += (lakh > 1 ? twoDigitToTamil(lakh) : 'இரண்டு') + ' லட்சத்து ';
    }
    if (thousand > 0) {
      result += (thousand > 1 ? twoDigitToTamil(thousand) : 'ஓர்') + ' ஆயிரத்து ';
    }
    if (hundreds > 0) {
      result += threeDigitToTamil(hundreds) + ' ';
    }

    return result.trim().replace(/\s+/g, ' ');
  }

  function handleNumberChange(text) {
    const num = parseInt(text, 10);
    if (!isNaN(num)) {
      setTamilText(numberToTamilText(num));
    } else {
      setTamilText('');
    }
    setNumber(text);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>எண்களை தமிழில் மாற்றுக</Text>
      <TextInput
        style={styles.input}
        placeholder="எண்ணை உள்ளிடவும்"
        value={number}
        keyboardType="numeric"
        onChangeText={handleNumberChange}
      />
      <Text style={styles.output}>
        {tamilText}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  output: {
    fontSize: 22,
    fontWeight: '500',
    color: '#2E7D32',
    textAlign: 'center',
    marginTop: 20,
  },
});
