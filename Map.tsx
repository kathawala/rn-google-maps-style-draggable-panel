import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE, MapEvent } from "react-native-maps";
import places from './places.json';

type Place = typeof places[0];

export type MarkerData = Place | null

interface IMapProps {
  onMarkerPress?: (marker: MarkerData) => void
  onMapPress?: () => void
}

const regionSF: Region = {
  latitude: 37.772050,
  longitude: -122.431680,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.094
};

const Map: React.FunctionComponent<IMapProps> = ({ onMarkerPress, onMapPress }) => {

  function onPress(
    event: MapEvent<{action: "marker-press"; id: string;}>,
    data: MarkerData
  ): void {
    // this is needed so Mapview.onPress is not also triggered
    // which happens on iOS
    // see: https://github.com/react-native-maps/react-native-maps/issues/1689
    event.stopPropagation();
    if (onMarkerPress !== undefined) {
      onMarkerPress(data);
    }    
  } 

  return (
    <MapView
      style={styles.map}
      initialRegion={regionSF}
      provider={PROVIDER_GOOGLE}
      showsUserLocation
      loadingEnabled
      showsMyLocationButton
      onPress={onMapPress}
    >
      {
        places.map((p: Place) => (
          <Marker 
            key={p.name}
            tracksViewChanges={false}
            coordinate={{
              latitude: p.latitude,
              longitude: p.longitude
            }}
            onPress={(event) => onPress(event, p)}
          />
        ))
      }
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  }
})

export default Map;
