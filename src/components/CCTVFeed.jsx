import React, { useRef, useEffect, useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  Camera, Eye, Activity, AlertTriangle, Sparkles, CheckCircle2, 
  RotateCcw, Volume2, VolumeX, Maximize2, Zap, Flame, Move
} from 'lucide-react';

export default function CCTVFeed() {
  const { 
    tables, 
    soundEnabled, 
    setSoundEnabled, 
    visionMode, 
    setVisionMode,
    seatGuests,
    assignWaiter,
    trigger5MinBreach,
    vacateTable,
    markCleaned,
    activeCamera
  } = useRestaurant();

  const canvasRef = useRef(null);
  const [selectedTableId, setSelectedTableId] = useState('T03');
  const [showConfidence, setShowConfidence] = useState(true);
  const [fps, setFps] = useState(29.8);
  const [latency, setLatency] = useState(16);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);

  // Preload background camera snapshot
  useEffect(() => {
    const img = new Image();
    img.src = '/restaurant_cctv_feed.jpg';
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
  }, []);

  // Jitter FPS and latency slightly for realistic CV engine feeling
  useEffect(() => {
    const interval = setInterval(() => {
      setFps((29.5 + Math.random() * 0.8).toFixed(1));
      setLatency(Math.floor(14 + Math.random() * 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. Draw Background Image or Fallback
      if (imageRef.current && imageLoaded) {
        ctx.drawImage(imageRef.current, 0, 0, width, height);
      } else {
        ctx.fillStyle = '#0a0f1d';
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Render Heatmap if Heatmap Mode Active
      if (visionMode === 'heatmap') {
        const gradient = ctx.createRadialGradient(
          width * 0.5, height * 0.6, 20,
          width * 0.5, height * 0.6, width * 0.45
        );
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
        gradient.addColorStop(0.35, 'rgba(245, 158, 11, 0.35)');
        gradient.addColorStop(0.7, 'rgba(16, 185, 129, 0.2)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Draw Polygon Overlays for each table
      tables.forEach((table) => {
        const isSelected = selectedTableId === table.id;
        let strokeColor = '#10b981';
        let fillColor = 'rgba(16, 185, 129, 0.15)';
        let badgeColor = '#10b981';
        let badgeText = `${table.id} Free`;

        if (table.status === 'OCCUPIED') {
          strokeColor = '#06b6d4';
          fillColor = 'rgba(6, 182, 212, 0.2)';
          badgeColor = '#06b6d4';
          badgeText = `${table.id} Seated (${Math.floor(table.waitElapsedSeconds / 60)}m ${table.waitElapsedSeconds % 60}s)`;
        } else if (table.status === 'URGENT') {
          // Pulsing red effect
          const pulse = Math.sin(Date.now() / 200);
          strokeColor = '#ef4444';
          fillColor = pulse > 0 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.18)';
          badgeColor = '#ef4444';
          badgeText = `⚠️ ${table.id} WAIT > 5M! (${Math.floor(table.waitElapsedSeconds / 60)}m ${table.waitElapsedSeconds % 60}s)`;
        } else if (table.status === 'IN_SERVICE') {
          strokeColor = '#8b5cf6';
          fillColor = 'rgba(139, 92, 246, 0.2)';
          badgeColor = '#8b5cf6';
          badgeText = `${table.id} In Service (${table.waiterAssigned || 'Staff'})`;
        } else if (table.status === 'NEEDS_CLEANING') {
          strokeColor = '#f97316';
          fillColor = 'rgba(249, 115, 22, 0.25)';
          badgeColor = '#f97316';
          badgeText = `🧹 ${table.id} Needs Cleaning`;
        }

        // Draw Polygon Path
        if (table.polygon && table.polygon.length > 0) {
          ctx.beginPath();
          table.polygon.forEach((pt, i) => {
            const px = (pt.x / 100) * width;
            const py = (pt.y / 100) * height;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.closePath();

          ctx.fillStyle = fillColor;
          ctx.fill();

          ctx.lineWidth = isSelected ? 3.5 : 2.2;
          ctx.strokeStyle = strokeColor;
          ctx.stroke();

          // Calculate center of polygon for badge placement
          const avgX = table.polygon.reduce((acc, p) => acc + p.x, 0) / table.polygon.length;
          const avgY = table.polygon.reduce((acc, p) => acc + p.y, 0) / table.polygon.length;
          const badgeX = (avgX / 100) * width;
          const badgeY = (avgY / 100) * height;

          // Draw Badge Background Pill
          ctx.font = 'bold 12px "JetBrains Mono", monospace';
          const textMetrics = ctx.measureText(badgeText);
          const paddingX = 10;
          const paddingY = 6;
          const bWidth = textMetrics.width + paddingX * 2;
          const bHeight = 24;

          ctx.fillStyle = 'rgba(7, 10, 18, 0.88)';
          ctx.strokeStyle = badgeColor;
          ctx.lineWidth = 1.5;

          // Draw rounded rectangle for badge
          const rx = badgeX - bWidth / 2;
          const ry = badgeY - bHeight / 2;
          const radius = 6;

          ctx.beginPath();
          ctx.moveTo(rx + radius, ry);
          ctx.lineTo(rx + bWidth - radius, ry);
          ctx.quadraticCurveTo(rx + bWidth, ry, rx + bWidth, ry + radius);
          ctx.lineTo(rx + bWidth, ry + bHeight - radius);
          ctx.quadraticCurveTo(rx + bWidth, ry + bHeight, rx + bWidth - radius, ry + bHeight);
          ctx.lineTo(rx + radius, ry + bHeight);
          ctx.quadraticCurveTo(rx, ry + bHeight, rx, ry + bHeight - radius);
          ctx.lineTo(rx, ry + radius);
          ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Draw text inside badge
          ctx.fillStyle = badgeColor;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(badgeText, badgeX, badgeY);

          // Draw Confidence score if enabled
          if (showConfidence) {
            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillText(`conf: ${Math.round((table.confidence || 0.95) * 100)}%`, badgeX, badgeY + 18);
          }
        }
      });

      // 4. Subtle CCTV Scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1.5);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [tables, selectedTableId, showConfidence, visionMode, imageLoaded]);

  // Handle Canvas Click to Select Table
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Find table closest to click
    const clickedTable = tables.find((t) => {
      const minX = Math.min(...t.polygon.map((p) => p.x));
      const maxX = Math.max(...t.polygon.map((p) => p.x));
      const minY = Math.min(...t.polygon.map((p) => p.y));
      const maxY = Math.max(...t.polygon.map((p) => p.y));
      return clickX >= minX && clickX <= maxX && clickY >= minY && clickY <= maxY;
    });

    if (clickedTable) {
      setSelectedTableId(clickedTable.id);
    }
  };

  const selectedTable = tables.find((t) => t.id === selectedTableId) || tables[0];

  return (
    <div className="glass-panel">
      {/* CCTV Viewport Header */}
      <div className="panel-header">
        <div className="panel-title">
          <Camera size={19} color="#38bdf8" />
          <span>Surveillance Perception Engine</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            [LIVE CCTV OVERLAY]
          </span>
        </div>

        <div className="panel-actions">
          <button
            className={`btn-secondary ${visionMode === 'detect' ? 'active' : ''}`}
            onClick={() => setVisionMode('detect')}
            title="Bounding Polygon Detection"
          >
            <Eye size={15} /> Detection
          </button>
          <button
            className={`btn-secondary ${visionMode === 'heatmap' ? 'active' : ''}`}
            onClick={() => setVisionMode('heatmap')}
            title="Occupancy Thermal Heatmap"
          >
            <Flame size={15} color="#f97316" /> Heatmap
          </button>
          <button
            className="icon-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Alert Chimes' : 'Enable Alert Chimes'}
          >
            {soundEnabled ? <Volume2 size={16} color="#10b981" /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* Main Camera Viewport */}
      <div className="camera-viewport" onClick={handleCanvasClick}>
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="camera-canvas"
        />

        {/* HUD Top Bar Overlay */}
        <div className="cctv-hud-header">
          <div className="cctv-cam-tag">
            <span className="live-dot"></span>
            <span>{activeCamera} • RESTAURANT MAIN DINING FLOOR</span>
          </div>
          <div className="cctv-timestamp">
            {new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC
          </div>
        </div>

        {/* HUD Left Status List (Directly from Reel) */}
        <div className="cctv-hud-left">
          {tables.map((t) => (
            <div
              key={t.id}
              className={`hud-table-item ${
                t.status === 'OCCUPIED'
                  ? 'occupied'
                  : t.status === 'URGENT'
                  ? 'urgent'
                  : t.status === 'NEEDS_CLEANING'
                  ? 'cleaning'
                  : ''
              }`}
            >
              {t.id}: {t.status === 'AVAILABLE' ? 'Available' : t.status === 'URGENT' ? '🚨 >5m WAIT' : t.status}
            </div>
          ))}
        </div>

        {/* Scanline CRT overlay */}
        <div className="cctv-feed-overlay"></div>
      </div>

      {/* Vision Engine Stats & Control Strip */}
      <div className="vision-controls">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <Activity size={14} color="#10b981" />
            <span>YOLO-Hospitality Vision: <strong style={{ color: '#10b981' }}>ONLINE</strong></span>
          </div>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            FPS: <strong style={{ color: '#38bdf8' }}>{fps}</strong> | Latency: <strong>{latency}ms</strong>
          </div>
        </div>

        {/* Fast Action Controls for Selected Table */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Selected: <strong style={{ color: 'var(--text-primary)' }}>{selectedTable.id}</strong>
          </span>

          {selectedTable.status === 'AVAILABLE' && (
            <button
              className="btn-primary"
              onClick={() => seatGuests(selectedTable.id, 2)}
            >
              <Zap size={14} /> Seat Party (2)
            </button>
          )}

          {selectedTable.status === 'OCCUPIED' && (
            <>
              <button
                className="btn-danger"
                onClick={() => trigger5MinBreach(selectedTable.id)}
                title="Fast-forward wait to test the 5-minute reel alert"
              >
                <AlertTriangle size={14} /> Fast-Forward 5m Wait
              </button>
              <button
                className="btn-secondary"
                onClick={() => assignWaiter(selectedTable.id, 'Sophia M.')}
              >
                <CheckCircle2 size={14} color="#10b981" /> Waiter Arrived
              </button>
            </>
          )}

          {selectedTable.status === 'URGENT' && (
            <button
              className="btn-primary"
              onClick={() => assignWaiter(selectedTable.id, 'Marcus L.')}
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
            >
              <CheckCircle2 size={14} /> Dispatch Waiter Now
            </button>
          )}

          {selectedTable.status === 'IN_SERVICE' && (
            <button
              className="btn-clean"
              onClick={() => vacateTable(selectedTable.id)}
            >
              <Sparkles size={14} /> Guests Vacate (Dirty)
            </button>
          )}

          {selectedTable.status === 'NEEDS_CLEANING' && (
            <button
              className="btn-primary"
              onClick={() => markCleaned(selectedTable.id)}
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
            >
              <RotateCcw size={14} /> Clean & Reset Table
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
