import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  Sliders, Camera, Wifi, Video, ShieldCheck, CheckCircle2, 
  Settings2, Plus, RefreshCw, Layers, Crosshair, HardDrive
} from 'lucide-react';

export default function CameraConfigCalibration() {
  const { 
    tables, 
    updateTablePolygon, 
    activeCamera, 
    setActiveCamera 
  } = useRestaurant();

  const [cameraSource, setCameraSource] = useState('demo');
  const [rtspUrl, setRtspUrl] = useState('rtsp://admin:••••••••@192.168.1.145:554/h264Preview_01_main');
  const [selectedTableId, setSelectedTableId] = useState('T01');
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [waitAlertThresholdMins, setWaitAlertThresholdMins] = useState(5);
  const [saveStatus, setSaveStatus] = useState('');

  const selectedTable = tables.find((t) => t.id === selectedTableId) || tables[0];

  const handleSaveConfig = () => {
    setSaveStatus('Calibration & Camera Stream Saved Successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handlePolygonShift = (axis, delta) => {
    const updated = selectedTable.polygon.map((p) => ({
      ...p,
      [axis]: Math.max(2, Math.min(98, p[axis] + delta))
    }));
    updateTablePolygon(selectedTable.id, updated);
  };

  return (
    <div className="analytics-section">
      <div className="glass-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Camera size={18} color="#38bdf8" />
            <span>Security Camera Integration & Table Polygon Calibration</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              [SURVEILLANCE CONFIG]
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="live-dot"></span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              CCTV STREAM ACTIVE
            </span>
          </div>
        </div>

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Stream Source Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              {
                id: 'demo',
                title: 'High-Res CCTV Simulation',
                desc: 'Pre-loaded 1080p dining room camera stream',
                icon: <Camera size={20} color="#10b981" />
              },
              {
                id: 'rtsp',
                title: 'Existing RTSP / NVR Stream',
                desc: 'Connect your Hikvision, Dahua, or Axis NVR',
                icon: <Wifi size={20} color="#38bdf8" />
              },
              {
                id: 'webcam',
                title: 'Direct Webcam / USB Cam',
                desc: 'Use local system camera or testing lens',
                icon: <Video size={20} color="#f59e0b" />
              },
              {
                id: 'file',
                title: 'Surveillance Video Upload',
                desc: 'Run analysis on recorded MP4 footage',
                icon: <HardDrive size={20} color="#a78bfa" />
              }
            ].map((src) => (
              <div
                key={src.id}
                onClick={() => setCameraSource(src.id)}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: cameraSource === src.id ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${cameraSource === src.id ? '#3b82f6' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {src.icon}
                  {cameraSource === src.id && <CheckCircle2 size={16} color="#3b82f6" />}
                </div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{src.title}</strong>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{src.desc}</p>
              </div>
            ))}
          </div>

          {/* RTSP Stream URL Input */}
          {cameraSource === 'rtsp' && (
            <div
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(59, 130, 246, 0.06)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <label style={{ fontSize: '0.78rem', color: '#93c5fd', fontWeight: 600 }}>
                RTSP IP Camera URI:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={rtspUrl}
                  onChange={(e) => setRtspUrl(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'var(--bg-darkest)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    padding: '0.5rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem'
                  }}
                />
                <button className="btn-primary" onClick={handleSaveConfig}>
                  <RefreshCw size={14} /> Reconnect
                </button>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Supports standard H.264 / H.265 RTSP streams from any commercial security DVR / NVR.
              </span>
            </div>
          )}

          {/* Table Polygon Fine-Tuning */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
              padding: '1rem',
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Table Zone Boundary Adjuster
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
                Fine-tune bounding polygon coordinates for table detection.
              </p>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {tables.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTableId(t.id)}
                    className={`btn-secondary ${selectedTableId === t.id ? 'active' : ''}`}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.35rem 0.65rem',
                      ...(selectedTableId === t.id ? { borderColor: '#10b981', color: '#10b981' } : {})
                    }}
                  >
                    {t.id}
                  </button>
                ))}
              </div>

              {/* Directional Nudge Controls */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={() => handlePolygonShift('y', -2)}>
                  ⬆️ Shift Up
                </button>
                <button className="btn-secondary" onClick={() => handlePolygonShift('y', 2)}>
                  ⬇️ Shift Down
                </button>
                <button className="btn-secondary" onClick={() => handlePolygonShift('x', -2)}>
                  ⬅️ Shift Left
                </button>
                <button className="btn-secondary" onClick={() => handlePolygonShift('x', 2)}>
                  ➡️ Shift Right
                </button>
              </div>
            </div>

            {/* AI Detection Parameters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                  <span>SLA Alert Wait Threshold:</span>
                  <strong style={{ color: '#ef4444' }}>{waitAlertThresholdMins} Minutes</strong>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={waitAlertThresholdMins}
                  onChange={(e) => setWaitAlertThresholdMins(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Triggers urgent waiter ping when unassisted wait exceeds this time (defaults to 5m).
                </span>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                  <span>Computer Vision Confidence Filter:</span>
                  <strong style={{ color: '#38bdf8' }}>{confidenceThreshold}%</strong>
                </div>
                <input
                  type="range"
                  min="60"
                  max="98"
                  step="1"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <button className="btn-primary" onClick={handleSaveConfig} style={{ width: '100%', justifyContent: 'center' }}>
                  <CheckCircle2 size={16} /> Save Calibration & Apply Parameters
                </button>
                {saveStatus && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#10b981', textAlign: 'center' }}>
                    {saveStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
