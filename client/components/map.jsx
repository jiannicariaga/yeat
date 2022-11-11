import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

export default function Map({ results, center }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.MAPS_API_KEY
  });
  if (!isLoaded) return;
  const marker = {
    orange: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
    blue: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  };
  const resultMarkers = results.map(result => {
    const key = result.id;
    const lat = result.coordinates.latitude;
    const lng = result.coordinates.longitude;
    return (
      <Marker key={key} position={{ lat, lng }} icon={marker.orange} />
    );
  });
  return (
    <GoogleMap zoom={10} center={center} mapContainerClassName='map'>
      <Marker position={center} icon={marker.blue} />;
      {resultMarkers}
    </GoogleMap>
  );
}