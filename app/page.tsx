'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { filiais, Filial } from '../data/filiais';
import Sidebar from '../components/Sidebar';
import { optimizeRouteOrder, getOSRMRouting, getGoogleMapsRouteUrl } from '../utils/routing';
import { Sun, Moon, FileText, X, TrendingUp, MapPin, Gauge, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Load Map dynamically to avoid SSR issues with Leaflet
const Map = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => <div style={{ height: '100vh', width: '100%', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="loader"></div>
    <style>{`
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .loader { 
        width: 60px; 
        height: 60px; 
        border: 4px solid rgba(7, 80, 0, 0.1); 
        border-top: 4px solid var(--primary); 
        border-radius: 50%; 
        animation: spin 1s linear infinite;
        box-shadow: 0 0 30px rgba(7, 80, 0, 0.2);
       }
    `}</style>
  </div>
});

export default function Home() {
  const [selectedFilial, setSelectedFilial] = useState<Filial | null>(null);
  const [routeFiliais, setRouteFiliais] = useState<Filial[]>([]);
  const [routeStats, setRouteStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [showReport, setShowReport] = useState(false);

  // Sync theme with body data-attribute for CSS selectors
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleSelect = (filial: Filial) => {
    if (selectedFilial?.id === filial.id) {
      setSelectedFilial(null);
    } else {
      setSelectedFilial(filial);
    }
  };

  const handleOptimizeRoute = async (ids: string[]) => {
    if (ids.length < 2) return;
    
    setLoading(true);
    // Clear old route geometry to avoid confusion if new one fails
    setRouteStats(null);
    
    try {
      const selected = filiais.filter(f => ids.includes(f.id));
      const optimized = optimizeRouteOrder(selected);
      
      const routing = await getOSRMRouting(optimized);
      if (routing) {
        setRouteFiliais(optimized);
        setRouteStats(routing);
        
        if (optimized.length > 0) {
          setSelectedFilial(optimized[0]);
        }
      } else {
        // Fallback or alert if routing fails
        console.error('Falha ao obter dados de rota do OSRM');
        setRouteFiliais(optimized);
        setRouteStats(null);
      }
    } catch (err) {
      console.error('Erro na otimização de rota:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearRoute = () => {
    setRouteFiliais([]);
    setRouteStats(null);
    setShowReport(false);
  };

  return (
    <main style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      background: 'var(--background)',
      userSelect: 'none'
    }}>
      {/* Sidebar Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, height: '100vh', width: 0, 
        zIndex: 1000, display: 'flex', alignItems: 'center', pointerEvents: 'none'
      }}>
        <div style={{ pointerEvents: 'auto' }}>
          <Sidebar 
            filiais={filiais} 
            onSelect={handleSelect} 
            selectedId={selectedFilial?.id || null}
            onOptimizeRoute={handleOptimizeRoute}
            onClearRoute={handleClearRoute}
            isRouteActive={routeFiliais.length > 0}
          />
        </div>
      </div>

      {/* Floating Buttons Group */}
      <div style={{ position: 'absolute', top: '30px', right: '30px', zIndex: 2000, display: 'flex', gap: '12px' }}>
        {/* Report Button */}
        {routeStats && (
          <button 
            onClick={() => setShowReport(true)}
            className="glass glow"
            aria-label="Route Report"
            style={{
              padding: '0 24px', height: '50px', borderRadius: '15px', border: '1px solid var(--border)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
              color: 'var(--foreground)', transition: 'all 0.3s ease', fontSize: '14px', fontWeight: 600
            }}
          >
            <FileText size={20} color="var(--primary)" />
            Relatório de Rota
          </button>
        )}

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="glass glow"
          aria-label="Toggle Theme"
          style={{
            width: '50px', height: '50px', borderRadius: '15px', border: '1px solid var(--border)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--foreground)', transition: 'all 0.3s ease'
          }}
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      {/* Route Report Modal */}
      <AnimatePresence>
        {showReport && routeStats && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: 'absolute', top: '100px', right: '30px', width: '400px',
              zIndex: 2001, borderRadius: '24px', padding: '24px'
            }}
            className="glass glow"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Resumo da Logística</h2>
              <button onClick={() => setShowReport(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
              {routeStats.legs.map((leg: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'var(--surface)', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.6 }}>
                    <span>Trecho {idx + 1}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{(leg.distance / 1000).toFixed(1)} km</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: 600 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
                      <div style={{ width: '1px', height: '10px', background: 'var(--border)' }} />
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span>{routeFiliais[idx]?.name}</span>
                      <span style={{ opacity: 0.8 }}>{routeFiliais[idx + 1]?.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '16px', borderRadius: '16px', background: 'var(--primary)', color: '#fff' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.8 }}>Distância Total</div>
                  <div style={{ fontSize: '20px', fontWeight: 800 }}>{(routeStats.distance / 1000).toFixed(1)} km</div>
                </div>
                <div style={{ padding: '16px', borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.8 }}>Tempo Estimado</div>
                  <div style={{ fontSize: '20px', fontWeight: 800 }}>{(routeStats.duration / 3600).toFixed(1)}h</div>
                </div>
              </div>

              <a 
                href={getGoogleMapsRouteUrl(routeFiliais) || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="glow"
                style={{
                  width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--secondary)',
                  color: '#fff', fontWeight: 800, fontSize: '14px', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  transition: 'all 0.3s ease', textAlign: 'center'
                }}
              >
                <Navigation size={20} />
                INICIAR PERCURSO NO GOOGLE MAPS
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'absolute', bottom: '30px', right: '30px', padding: '12px 24px', borderRadius: '12px',
          zIndex: 2000, display: 'flex', alignItems: 'center', gap: '12px', 
          color: 'var(--primary)', fontSize: '14px', fontWeight: 600
        }} className="glass">
          <div className="mini-spinner"></div>
          Otimizando Logística...
          <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .mini-spinner {
              width: 16px; height: 16px; border: 2px solid rgba(7, 80, 0, 0.2);
              border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite;
            }
          `}</style>
        </div>
      )}

      {/* Map Content */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Map 
          filiais={filiais} 
          selectedFilial={selectedFilial} 
          onSelect={handleSelect}
          routeFiliais={routeFiliais}
          routeGeometry={routeStats?.geometry || null}
          theme={theme}
        />
      </div>

      <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: '0' }}>
        Logistics Hub - Gestão & Geolocalização
      </h1>
    </main>
  );
}
