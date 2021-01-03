import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Map, { MarkerData } from './Map';
import MapPanel from './MapPanel';

export default function App() {
  const [selectedMarker, setSelectedMarker] = useState(null as MarkerData);

  function onMarkerPress(marker: MarkerData): void {
    setSelectedMarker(marker);
  }

  function onMapPress(): void {
    setSelectedMarker(null);
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Map onMarkerPress={onMarkerPress} onMapPress={onMapPress} />
        {selectedMarker !== null
          ?
            <MapPanel marker={selectedMarker} />
          :
            null
        }
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
