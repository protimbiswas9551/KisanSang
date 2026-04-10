import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchWeatherData, reverseGeocode } from '../services';
import { Thermometer, Droplets, Wind, CloudRain, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../utils';

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
  const [clickedInfo, setClickedInfo] = useState<{ 
    lat: number; 
    lng: number; 
    name: string; 
    weather: any; 
    loading: boolean;
    error: string | null;
  } | null>(null);
  
  // Robust API key retrieval
  const apiKey = (import.meta as any).env?.VITE_WEATHER_API_KEY;

  const weatherLayers = [
    { id: 'temp', name: 'Temperature', layer: 'temp_new' },
    { id: 'precipitation', name: 'Precipitation', layer: 'precip_new' },
    { id: 'wind', name: 'Wind Speed', layer: 'wind_new' },
    { id: 'clouds', name: 'Clouds', layer: 'clouds_new' },
  ];

  const handleMapClick = async (clickLat: number, clickLng: number) => {
    setClickedInfo({ lat: clickLat, lng: clickLng, name: 'Loading...', weather: null, loading: true, error: null });
    
    try {
      const [weather, name] = await Promise.all([
        fetchWeatherData(clickLat, clickLng),
        reverseGeocode(clickLat, clickLng)
      ]);
      setClickedInfo({ lat: clickLat, lng: clickLng, name, weather, loading: false, error: null });
    } catch (error) {
      console.error("Error fetching map point data:", error);
      setClickedInfo({ lat: clickLat, lng: clickLng, name: 'Error', weather: null, loading: false, error: 'Failed to fetch weather data' });
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
              opacity={0.8}
              minZoom={0}
              maxZoom={19}
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
                <div className="min-w-[180px] p-0 overflow-hidden rounded-lg">
                  {clickedInfo.loading ? (
                    <div className="flex flex-col items-center justify-center py-6 px-4 gap-3 bg-white dark:bg-slate-900">
                      <Loader2 size={24} className="text-primary animate-spin" />
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Fetching Data...</span>
                    </div>
                  ) : clickedInfo.error ? (
                    <div className="flex flex-col items-center justify-center py-6 px-4 gap-3 bg-red-50 dark:bg-red-900/10">
                      <AlertCircle size={24} className="text-red-500" />
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center">{clickedInfo.error}</span>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-900">
                      <div className="bg-primary/5 px-3 py-2 border-b border-border/50">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-primary" />
                          <div className="text-[11px] font-bold text-text truncate max-w-[140px]">{clickedInfo.name}</div>
                        </div>
                        <div className="text-[9px] text-secondary font-medium mt-0.5">
                          {clickedInfo.lat.toFixed(3)}°, {clickedInfo.lng.toFixed(3)}°
                        </div>
                      </div>
                      
                      <div className="p-3 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-orange-500">
                              <Thermometer size={10} />
                              <span className="text-[8px] font-bold uppercase tracking-tighter">Temp</span>
                            </div>
                            <div className="text-sm font-bold text-text">{clickedInfo.weather.temp}°C</div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-blue-500">
                              <CloudRain size={10} />
                              <span className="text-[8px] font-bold uppercase tracking-tighter">Rain</span>
                            </div>
                            <div className="text-sm font-bold text-text">{clickedInfo.weather.rain}mm</div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-amber-600">
                              <Wind size={10} />
                              <span className="text-[8px] font-bold uppercase tracking-tighter">Wind</span>
                            </div>
                            <div className="text-sm font-bold text-text">{clickedInfo.weather.windSpeed}km/h</div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-indigo-500">
                              <Droplets size={10} />
                              <span className="text-[8px] font-bold uppercase tracking-tighter">Humid</span>
                            </div>
                            <div className="text-sm font-bold text-text">{clickedInfo.weather.humidity}%</div>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-border/50">
                          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg px-2 py-1.5 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-[10px] font-medium text-secondary capitalize">{clickedInfo.weather.description}</span>
                          </div>
                        </div>
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
