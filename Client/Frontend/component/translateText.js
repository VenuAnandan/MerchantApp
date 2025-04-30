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
      let result;
      if (n < 10) return ones[n];
      if (n >= 10 && n < 20) {
        if (n === 10) return 'பத்து';
        return 'பதின்' + ones[n - 10];
      }
      const tensPlace = Math.floor(n / 10);
      const onesPlace = n % 10;

      if (onesPlace == 0) {
        result = tens[tensPlace] + (onesPlace ? ' ' + ones[onesPlace] : '');
      } else {
        if (tensPlace == 2) {
          result = "இருபத்தி" + (onesPlace ? ' ' + ones[onesPlace] : '');
        } else if (tensPlace == 3) {
          result = "முப்பத்தி" + (onesPlace ? ' ' + ones[onesPlace] : '');
        } else if (tensPlace == 4) {
          result = "நாற்பத்தி" + (onesPlace ? ' ' + ones[onesPlace] : '');
        } else if (tensPlace == 5) {
          result = "ஐம்பத்தி" + (onesPlace ? ' ' + ones[onesPlace] : '');
        } else if (tensPlace == 6) {
          result = "அறுபத்து" + (onesPlace ? ' ' + ones[onesPlace] : '');
        } else if (tensPlace == 7) {
          result = "எழுபத்து" + (onesPlace ? ' ' + ones[onesPlace] : '');
        } else if (tensPlace == 8) {
          result = "எண்பத்து" + (onesPlace ? ' ' + ones[onesPlace] : '');
        } else if (tensPlace == 9) {
          result = "தொன்னூற்று" + (onesPlace ? ' ' + ones[onesPlace] : '');
        } else {
          result = tens[tensPlace] + (onesPlace ? ' ' + ones[onesPlace] : '');
        }
      }
      return result;
    }

    function threeDigitToTamil(n) {
      let result ='';
      if (n === 0) return '';
      if (n < 100) return twoDigitToTamil(n);
      const hundredsPlace = Math.floor(n / 100);  //366
      const remainder = n % 100;
      if (hundredsPlace > 0) {
        if (remainder > 0) {
          if (hundredsPlace == 1) {
            result += 'நூற்று ' + twoDigitToTamil(remainder);
          } else if (hundredsPlace == 2) {
            result += 'இருநூற்று ' + twoDigitToTamil(remainder);
          } else if (hundredsPlace == 3) {
            result += 'முன்னூற்று ' + twoDigitToTamil(remainder);
          } else if (hundredsPlace == 4) {
            result += 'நானூற்று ' + twoDigitToTamil(remainder);
          } else if (hundredsPlace == 5) {
            result += 'ஐந்நூற்று ' + twoDigitToTamil(remainder);
          } else if (hundredsPlace == 6) {
            result += 'அறுநூற்று ' + twoDigitToTamil(remainder);
          } else if (hundredsPlace == 7) {
            result += 'எழுநூற்று ' + twoDigitToTamil(remainder);
          } else if (hundredsPlace == 8) {
            result += 'எண்ணூற்று ' + twoDigitToTamil(remainder);
          } else {
            result += 'தொள்ளாயிரத்து ' + twoDigitToTamil(remainder);
          }
        } else {
          if (hundredsPlace == 1) {
            result = "நூறு"
          } else if (hundredsPlace == 2) {
            result = "இருநூறு"
          } else if (hundredsPlace == 3) {
            result = "முன்னூறு"
          } else if (hundredsPlace == 4) {
            result = "நானூறு"
          } else if (hundredsPlace == 5) {
            result = "ஐந்நூறு"
          } else if (hundredsPlace == 6) {
            result = "அறுநூறு"
          } else if (hundredsPlace == 7) {
            result = "எழுநூறு"
          } else if (hundredsPlace == 8) {
            result = "எண்ணூறு"
          } else {
            result = "தொள்ளாயிரம்"
          }
        }
      }
      return result;
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
      console.log(result,"crore");
    }
    if (lakh > 0) {
      result += (lakh > 1 ? twoDigitToTamil(lakh) : 'இரண்டு') + ' லட்சத்து ';
      console.log(result,"lakhs");
    }
    if (thousand > 0) {
      result += (thousand > 1 ? twoDigitToTamil(thousand) : 'ஓர்') + ' ஆயிரத்து ';
      console.log(result,"thousend");
    }
    if (hundreds > 0) {
      result += threeDigitToTamil(hundreds) + ' ';
      console.log(result,"hundred");
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
        maxLength={9}
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
