import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchWeatherData, reverseGeocode } from '../services';

// Fix for default marker icon in Leaflet using CDN to avoid build issues
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface WeatherMapProps {
  lat: number;
  lng: number;
  locationName: string;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ lat, lng, locationName }) => {
  const [activeLayer, setActiveLayer] = useState('temp');
  const [clickedInfo, setClickedInfo] = useState<{ lat: number; lng: number; name: string; weather: any; loading: boolean } | null>(null);
  const apiKey = (import.meta as any).env.VITE_WEATHER_API_KEY;

  const weatherLayers = [
    { id: 'temp', name: 'Temperature', layer: 'temp_new' },
    { id: 'precipitation', name: 'Precipitation', layer: 'precipitation_new' },
    { id: 'wind', name: 'Wind Speed', layer: 'wind_new' },
    { id: 'clouds', name: 'Clouds', layer: 'clouds_new' },
  ];

  const handleMapClick = async (clickLat: number, clickLng: number) => {
    setClickedInfo({ lat: clickLat, lng: clickLng, name: 'Loading...', weather: null, loading: true });
    
    try {
      const [weather, name] = await Promise.all([
        fetchWeatherData(clickLat, clickLng),
        reverseGeocode(clickLat, clickLng)
      ]);
      setClickedInfo({ lat: clickLat, lng: clickLng, name, weather, loading: false });
    } catch (error) {
      console.error("Error fetching map point data:", error);
      setClickedInfo(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {weatherLayers.map((l) => (
          <button
            key={l.id}
            onClick={() => setActiveLayer(l.id)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
              activeLayer === l.id
                ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-sm"
                : "bg-card text-gray-500 border-border"
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      <div className="h-[350px] w-full rounded-2xl overflow-hidden border border-border shadow-sm z-0 relative">
        <MapContainer center={[lat, lng]} zoom={8} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {apiKey && (
            <TileLayer
              key={activeLayer}
              attribution='&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
              url={`https://tile.openweathermap.org/map/${weatherLayers.find(l => l.id === activeLayer)?.layer}/{z}/{x}/{y}.png?appid=${apiKey}`}
              opacity={0.6}
            />
          )}

          <MapClickHandler onMapClick={handleMapClick} />

          <Marker position={[lat, lng]}>
            <Popup>
              <div className="text-xs font-bold">{locationName} (Home)</div>
            </Popup>
          </Marker>

          {clickedInfo && (
            <Marker position={[clickedInfo.lat, clickedInfo.lng]}>
              <Popup onClose={() => setClickedInfo(null)}>
                <div className="min-w-[150px] p-1">
                  {clickedInfo.loading ? (
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <div className="w-3 h-3 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
                      Fetching details...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="border-b border-gray-100 pb-1">
                        <div className="text-[10px] font-bold text-gray-800 truncate">{clickedInfo.name}</div>
                        <div className="text-[8px] text-gray-400">Lat: {clickedInfo.lat.toFixed(2)}, Lng: {clickedInfo.lng.toFixed(2)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-gray-400 uppercase">Temp</span>
                          <span className="text-xs font-bold text-[#2D6A4F]">{clickedInfo.weather.temp}°C</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-gray-400 uppercase">Rain</span>
                          <span className="text-xs font-bold text-blue-500">{clickedInfo.weather.rain}mm</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-gray-400 uppercase">Wind</span>
                          <span className="text-xs font-bold text-amber-600">{clickedInfo.weather.windSpeed}km/h</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-gray-400 uppercase">Humidity</span>
                          <span className="text-xs font-bold text-indigo-500">{clickedInfo.weather.humidity}%</span>
                        </div>
                      </div>
                      <div className="text-[9px] text-gray-500 italic pt-1 border-t border-gray-50">
                        {clickedInfo.weather.description}
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
        
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-border shadow-lg z-[1000] pointer-events-none">
          <div className="text-[10px] font-bold text-gray-700 dark:text-slate-200 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#2D6A4F] rounded-full animate-pulse" />
            Click anywhere to see details
          </div>
        </div>
      </div>
      
      {!apiKey && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 p-3 rounded-xl text-amber-800 dark:text-amber-200 text-[10px] leading-tight">
          Weather layers require an OpenWeatherMap API key. Please add <strong>VITE_WEATHER_API_KEY</strong> to your environment variables.
        </div>
      )}
    </div>
  );
};

export default WeatherMap;
