import React from 'react';
import { View, Button } from 'react-native';

export default function LanguageButtons({ onTranslate }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
      <Button title="Hindi" onPress={() => onTranslate('hi')} />
      <Button title="French" onPress={() => onTranslate('fr')} />
      <Button title="Tamil" onPress={() => onTranslate('ta')} />
    </View>
  );
}