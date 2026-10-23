import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const RestaurantContext = createContext();

// Synthetic Audio Chime using Web Audio API
class AudioNotifier {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playAlert(type = 'urgent') {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'urgent') {
        // High-pitched urgent two-tone ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
        osc.frequency.setValueAtTime(880, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.35);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'clean') {
        // Mellow double chime for cleaning
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.15); // E5

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        // Friendly confirmation ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      console.warn('Audio playback not permitted or unavailable:', e);
    }
  }
}

const audioNotifier = new AudioNotifier();

const INITIAL_TABLES = [
  {
    id: 'T01',
    name: 'Table 01',
    capacity: 4,
    status: 'AVAILABLE',
    partySize: 0,
    seatedAt: null,
    waitElapsedSeconds: 0,
    waiterAssigned: null,
    serverApproachTime: null,
    polygon: [
      { x: 74, y: 59 },
      { x: 91, y: 59 },
      { x: 91, y: 86 },
      { x: 73, y: 86 }
    ],
    confidence: 0.98
  },
  {
    id: 'T02',
    name: 'Table 02',
    capacity: 4,
    status: 'OCCUPIED',
    partySize: 2,
    seatedAt: Date.now() - 140 * 1000, // 2 mins 20s
    waitElapsedSeconds: 140,
    waiterAssigned: null,
    serverApproachTime: null,
    polygon: [
      { x: 65, y: 38 },
      { x: 79, y: 38 },
      { x: 79, y: 56 },
      { x: 65, y: 56 }
    ],
    confidence: 0.96
  },
  {
    id: 'T03',
    name: 'Table 03',
    capacity: 6,
    status: 'URGENT', // Crossed 5 mins wait!
    partySize: 4,
    seatedAt: Date.now() - 325 * 1000, // 5 mins 25s
    waitElapsedSeconds: 325,
    waiterAssigned: null,
    serverApproachTime: null,
    polygon: [
      { x: 42, y: 38 },
      { x: 58, y: 38 },
      { x: 58, y: 56 },
      { x: 42, y: 56 }
    ],
    confidence: 0.99
  },
  {
    id: 'T04',
    name: 'Table 04',
    capacity: 6,
    status: 'IN_SERVICE',
    partySize: 5,
    seatedAt: Date.now() - 1200 * 1000,
    waitElapsedSeconds: 110,
    waiterAssigned: 'Marcus L.',
    serverApproachTime: Date.now() - 1090 * 1000,
    polygon: [
      { x: 38, y: 60 },
      { x: 62, y: 60 },
      { x: 62, y: 90 },
      { x: 38, y: 90 }
    ],
    confidence: 0.97
  },
  {
    id: 'T05',
    name: 'Table 05',
    capacity: 2,
    status: 'AVAILABLE',
    partySize: 0,
    seatedAt: null,
    waitElapsedSeconds: 0,
    waiterAssigned: null,
    serverApproachTime: null,
    polygon: [
      { x: 19, y: 41 },
      { x: 33, y: 41 },
      { x: 33, y: 56 },
      { x: 19, y: 56 }
    ],
    confidence: 0.98
  },
  {
    id: 'T06',
    name: 'Table 06',
    capacity: 4,
    status: 'NEEDS_CLEANING',
    partySize: 0,
    seatedAt: null,
    waitElapsedSeconds: 0,
    waiterAssigned: null,
    serverApproachTime: null,
    polygon: [
      { x: 5, y: 55 },
      { x: 28, y: 55 },
      { x: 28, y: 88 },
      { x: 5, y: 88 }
    ],
    confidence: 0.94
  }
];

const INITIAL_ALERTS = [
  {
    id: 'alt-01',
    tableId: 'T03',
    type: 'URGENT',
    title: '5-Minute SLA Violation Alert',
    message: 'Table T03 guests have been waiting 5m 25s without a waiter greeting!',
    timestamp: new Date(Date.now() - 25 * 1000),
    resolved: false,
    severity: 'critical'
  },
  {
    id: 'alt-02',
    tableId: 'T06',
    type: 'CLEANING',
    title: 'Table Vacated - Cleaning Required',
    message: 'Guests departed T06 leaving unbussed dishes. Ready for sanitization & reset.',
    timestamp: new Date(Date.now() - 90 * 1000),
    resolved: false,
    severity: 'warning'
  },
  {
    id: 'alt-03',
    tableId: 'T02',
    type: 'SEATED',
    title: 'New Guest Arrival Detected',
    message: 'Party of 2 seated at Table T02. Wait timer initiated (2m 20s elapsed).',
    timestamp: new Date(Date.now() - 140 * 1000),
    resolved: true,
    severity: 'info'
  }
];

export function RestaurantProvider({ children }) {
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAutoSimulating, setIsAutoSimulating] = useState(true);
  const [activeCamera, setActiveCamera] = useState('CAM-01');
  const [visionMode, setVisionMode] = useState('detect'); // 'detect', 'calibrate', 'heatmap'

  // Master Timer Tick (Every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setTables((prevTables) =>
        prevTables.map((t) => {
          if (t.status === 'OCCUPIED' && t.seatedAt) {
            const nextWait = t.waitElapsedSeconds + 1;
            // 5 Minute Rule: Check if reached 300 seconds (5 mins)
            if (nextWait >= 300 && t.status !== 'URGENT') {
              // Trigger Alert
              triggerAlert({
                tableId: t.id,
                type: 'URGENT',
                title: '5-Minute SLA Violation Alert',
                message: `Table ${t.id} has waited over 5 minutes without waiter contact!`,
                severity: 'critical'
              });
              if (soundEnabled) audioNotifier.playAlert('urgent');
              return {
                ...t,
                status: 'URGENT',
                waitElapsedSeconds: nextWait
              };
            }
            return {
              ...t,
              waitElapsedSeconds: nextWait
            };
          } else if (t.status === 'URGENT') {
            return {
              ...t,
              waitElapsedSeconds: t.waitElapsedSeconds + 1
            };
          }
          return t;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [soundEnabled]);

  // Trigger alert helper
  const triggerAlert = ({ tableId, type, title, message, severity = 'warning' }) => {
    const newAlert = {
      id: `alt-${Date.now()}`,
      tableId,
      type,
      title,
      message,
      timestamp: new Date(),
      resolved: false,
      severity
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Action: Seat Guests at Table
  const seatGuests = (tableId, partySize = 2) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          return {
            ...t,
            status: 'OCCUPIED',
            partySize,
            seatedAt: Date.now(),
            waitElapsedSeconds: 0,
            waiterAssigned: null,
            serverApproachTime: null
          };
        }
        return t;
      })
    );
    triggerAlert({
      tableId,
      type: 'SEATED',
      title: 'Guest Seating Detected',
      message: `Party of ${partySize} seated at ${tableId}. AI tracking initiated.`,
      severity: 'info'
    });
    if (soundEnabled) audioNotifier.playAlert('info');
  };

  // Action: Assign Waiter / Greet Table
  const assignWaiter = (tableId, waiterName = 'David S.') => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          return {
            ...t,
            status: 'IN_SERVICE',
            waiterAssigned: waiterName,
            serverApproachTime: Date.now()
          };
        }
        return t;
      })
    );
    // Resolve alerts for this table
    setAlerts((prev) =>
      prev.map((a) => (a.tableId === tableId ? { ...a, resolved: true } : a))
    );
    if (soundEnabled) audioNotifier.playAlert('info');
  };

  // Action: Fast-forward Wait to >5 mins (For Live Demo testing)
  const trigger5MinBreach = (tableId) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          return {
            ...t,
            status: 'URGENT',
            seatedAt: Date.now() - 310 * 1000,
            waitElapsedSeconds: 310
          };
        }
        return t;
      })
    );
    triggerAlert({
      tableId,
      type: 'URGENT',
      title: '5-Minute SLA Violation Alert',
      message: `CRITICAL: Table ${tableId} exceeded 5-minute wait threshold without waiter contact!`,
      severity: 'critical'
    });
    if (soundEnabled) audioNotifier.playAlert('urgent');
  };

  // Action: Customer Vacates Table (Leaves dirty dishes)
  const vacateTable = (tableId) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          return {
            ...t,
            status: 'NEEDS_CLEANING',
            partySize: 0,
            seatedAt: null,
            waitElapsedSeconds: 0,
            waiterAssigned: null,
            serverApproachTime: null
          };
        }
        return t;
      })
    );
    triggerAlert({
      tableId,
      type: 'CLEANING',
      title: 'Table Vacated - Cleaning Required',
      message: `Guests departed Table ${tableId}. Computer vision detected uncleaned surface. Ready for busing.`,
      severity: 'warning'
    });
    if (soundEnabled) audioNotifier.playAlert('clean');
  };

  // Action: Mark Cleaned & Reset to Free
  const markCleaned = (tableId) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          return {
            ...t,
            status: 'AVAILABLE',
            partySize: 0,
            seatedAt: null,
            waitElapsedSeconds: 0,
            waiterAssigned: null,
            serverApproachTime: null
          };
        }
        return t;
      })
    );
    setAlerts((prev) =>
      prev.map((a) => (a.tableId === tableId ? { ...a, resolved: true } : a))
    );
    if (soundEnabled) audioNotifier.playAlert('info');
  };

  // Action: Dismiss / Resolve single alert
  const dismissAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  };

  // Action: Update Table Polygon (For calibration tool)
  const updateTablePolygon = (tableId, newPolygon) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, polygon: newPolygon } : t))
    );
  };

  // Quick stats calculation
  const totalTables = tables.length;
  const occupiedCount = tables.filter((t) => ['OCCUPIED', 'URGENT', 'IN_SERVICE'].includes(t.status)).length;
  const urgentCount = tables.filter((t) => t.status === 'URGENT').length;
  const cleaningCount = tables.filter((t) => t.status === 'NEEDS_CLEANING').length;
  const freeCount = tables.filter((t) => t.status === 'AVAILABLE').length;

  const value = {
    tables,
    alerts,
    soundEnabled,
    setSoundEnabled,
    isAutoSimulating,
    setIsAutoSimulating,
    activeCamera,
    setActiveCamera,
    visionMode,
    setVisionMode,
    seatGuests,
    assignWaiter,
    trigger5MinBreach,
    vacateTable,
    markCleaned,
    dismissAlert,
    updateTablePolygon,
    stats: {
      totalTables,
      occupiedCount,
      urgentCount,
      cleaningCount,
      freeCount,
      occupancyRate: Math.round((occupiedCount / totalTables) * 100),
      avgWaitTime: '2m 14s',
      turnaroundTime: '42m'
    }
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
