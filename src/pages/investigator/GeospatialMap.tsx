import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Loader2, AlertTriangle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { geoService } from '../../services/api/geoService';

// Fix Leaflet's default icon path issues with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export function GeospatialMap() {
  const navigate = useNavigate();
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGeoData() {
      try {
        setLoading(true);
        const data = await geoService.getGeoData();
        setHotspots(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load geo intelligence');
      } finally {
        setLoading(false);
      }
    }
    loadGeoData();
  }, []);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Geospatial Intelligence</h2>
          <p className="text-text-secondary">Track geographic distribution of scam hotspots and clusters.</p>
        </div>
        <div className="flex gap-2">
        </div>
      </div>

      <div className="flex-1 min-h-[600px] relative rounded-xl overflow-hidden border border-surface-raised z-0">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b1120]/80 z-20">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-cyan" />
            <p className="text-text-primary">Loading Map Data...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0b1120]/80 z-20">
            <div className="p-4 bg-status-critical/10 border border-status-critical/30 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-status-critical shrink-0" />
              <p className="text-status-critical">{error}</p>
            </div>
          </div>
        )}
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }} className="bg-[#0b1120]">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {!loading && !error && hotspots.map((hotspot, idx) => (
            <div key={hotspot.id || idx}>
              {/* Radius Circle */}
              <Circle
                center={[hotspot.lat || hotspot.latitude, hotspot.lng || hotspot.longitude]}
                radius={(hotspot.cases || hotspot.case_count || 1) * 1000} // Dynamic radius based on cases
                pathOptions={{
                  color: (hotspot.risk || hotspot.risk_level) === 'CRITICAL' ? '#EF4444' : (hotspot.risk || hotspot.risk_level) === 'HIGH' ? '#F59E0B' : '#06B6D4',
                  fillColor: (hotspot.risk || hotspot.risk_level) === 'CRITICAL' ? '#EF4444' : (hotspot.risk || hotspot.risk_level) === 'HIGH' ? '#F59E0B' : '#06B6D4',
                  fillOpacity: 0.2,
                  weight: 1
                }}
              />
              
              {/* Marker with Popup */}
              <Marker position={[hotspot.lat || hotspot.latitude, hotspot.lng || hotspot.longitude]}>
                <Popup className="custom-popup">
                  <div className="p-1">
                    <h4 className="font-bold text-gray-900 text-base">{hotspot.city || hotspot.location} Hotspot</h4>
                    <div className="mt-2 space-y-1 text-sm text-gray-700">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Total Cases:</span>
                        <span className="font-bold">{hotspot.cases || hotspot.case_count}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Primary Type:</span>
                        <span className="font-semibold">{hotspot.type || hotspot.primary_scam_type || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between gap-4 mt-2 pt-2 border-t border-gray-200">
                        <span className="text-gray-500">Risk Level:</span>
                        <span className={`font-bold ${(hotspot.risk || hotspot.risk_level) === 'CRITICAL' ? 'text-red-600' : 'text-orange-600'}`}>
                          {hotspot.risk || hotspot.risk_level}
                        </span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-3 h-8 text-xs"
                      onClick={() => navigate('/intelligence/cases')}
                    >
                      View Cases
                    </Button>
                  </div>
                </Popup>
              </Marker>
            </div>
          ))}
        </MapContainer>
        
        {/* Legend Overlay */}
        <Card className="absolute bottom-6 left-6 z-[1000] bg-surface-elevated/90 backdrop-blur border-surface-raised p-4 w-48 shadow-xl">
          <h4 className="text-sm font-bold mb-3 uppercase text-text-muted">Risk Legend</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-critical shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
              <span>Critical Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-warning shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
              <span>High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
              <span>Medium Risk</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
