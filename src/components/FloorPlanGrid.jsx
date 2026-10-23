import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  Users, Clock, AlertTriangle, CheckCircle2, RotateCcw, 
  Sparkles, Coffee, UserCheck, FastForward, Filter
} from 'lucide-react';

export default function FloorPlanGrid() {
  const { 
    tables, 
    seatGuests, 
    assignWaiter, 
    trigger5MinBreach, 
    vacateTable, 
    markCleaned 
  } = useRestaurant();

  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredTables = tables.filter((table) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'URGENT') return table.status === 'URGENT';
    if (statusFilter === 'OCCUPIED') return ['OCCUPIED', 'URGENT', 'IN_SERVICE'].includes(table.status);
    if (statusFilter === 'CLEANING') return table.status === 'NEEDS_CLEANING';
    if (statusFilter === 'AVAILABLE') return table.status === 'AVAILABLE';
    return true;
  });

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="glass-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title">
          <Users size={18} color="#10b981" />
          <span>Dining Floor Status Grid</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            [ALL ZONES]
          </span>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: `All (${tables.length})` },
            { id: 'URGENT', label: `🚨 Urgent (${tables.filter(t => t.status === 'URGENT').length})` },
            { id: 'OCCUPIED', label: `Seated (${tables.filter(t => ['OCCUPIED', 'IN_SERVICE', 'URGENT'].includes(t.status)).length})` },
            { id: 'CLEANING', label: `Dirty (${tables.filter(t => t.status === 'NEEDS_CLEANING').length})` },
            { id: 'AVAILABLE', label: `Free (${tables.filter(t => t.status === 'AVAILABLE').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`btn-secondary ${statusFilter === tab.id ? 'active' : ''}`}
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.65rem',
                ...(statusFilter === tab.id ? { borderColor: '#3b82f6', color: '#60a5fa' } : {})
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Table Cards */}
      <div className="tables-grid">
        {filteredTables.map((table) => {
          const isUrgent = table.status === 'URGENT';
          const isCleaning = table.status === 'NEEDS_CLEANING';
          const isOccupied = table.status === 'OCCUPIED';
          const isInService = table.status === 'IN_SERVICE';
          const isAvailable = table.status === 'AVAILABLE';

          return (
            <div
              key={table.id}
              className={`table-card status-${table.status.toLowerCase().replace('_', '')}`}
            >
              {/* Top Row: Table Name + Status Pill */}
              <div className="table-card-top">
                <div>
                  <span className="table-badge">{table.id}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                    ({table.capacity}p)
                  </span>
                </div>

                <div>
                  {isAvailable && <span className="status-pill pill-free">Free</span>}
                  {isOccupied && <span className="status-pill pill-occupied">Seated</span>}
                  {isUrgent && <span className="status-pill pill-urgent">🚨 &gt;5m Wait</span>}
                  {isInService && <span className="status-pill pill-inservice">In Service</span>}
                  {isCleaning && <span className="status-pill pill-cleaning">🧹 Needs Bus</span>}
                </div>
              </div>

              {/* Middle Row: Seating & Wait Timer Details */}
              <div className="table-details">
                {(isOccupied || isUrgent) && (
                  <div className="detail-row">
                    <span>Wait Without Waiter:</span>
                    <span className={`timer-box ${isUrgent ? 'urgent' : ''}`}>
                      <Clock size={13} />
                      {formatTimer(table.waitElapsedSeconds)}
                      {isUrgent && <span style={{ color: '#ef4444', fontWeight: 800 }}>!</span>}
                    </span>
                  </div>
                )}

                {isInService && (
                  <>
                    <div className="detail-row">
                      <span>Server:</span>
                      <strong style={{ color: '#c084fc' }}>{table.waiterAssigned}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Dining Time:</span>
                      <span>18 mins</span>
                    </div>
                  </>
                )}

                {isOccupied && (
                  <div className="detail-row">
                    <span>Party:</span>
                    <span>{table.partySize} Guests</span>
                  </div>
                )}

                {isCleaning && (
                  <div style={{ color: '#fed7aa', fontSize: '0.74rem' }}>
                    Guests departed. Table requires busing, wiping & sanitizing.
                  </div>
                )}

                {isAvailable && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                    Sanitized and ready for incoming guests.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {isAvailable && (
                  <button
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem', padding: '0.4rem' }}
                    onClick={() => seatGuests(table.id, Math.floor(Math.random() * (table.capacity - 1)) + 2)}
                  >
                    <Users size={13} /> Seat Party
                  </button>
                )}

                {isOccupied && (
                  <>
                    <button
                      className="btn-secondary"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem', padding: '0.4rem' }}
                      onClick={() => assignWaiter(table.id, 'Liam R.')}
                    >
                      <CheckCircle2 size={13} color="#10b981" /> Send Waiter
                    </button>
                    <button
                      className="btn-danger"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.72rem', padding: '0.3rem' }}
                      onClick={() => trigger5MinBreach(table.id)}
                      title="Simulate 5-minute threshold breach"
                    >
                      <FastForward size={12} /> Force &gt;5m Wait
                    </button>
                  </>
                )}

                {isUrgent && (
                  <button
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      padding: '0.45rem',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)'
                    }}
                    onClick={() => assignWaiter(table.id, 'Emergency Lead')}
                  >
                    <UserCheck size={13} /> Dispatch Server Now
                  </button>
                )}

                {isInService && (
                  <button
                    className="btn-clean"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem', padding: '0.4rem' }}
                    onClick={() => vacateTable(table.id)}
                  >
                    <Sparkles size={13} /> Clear & Vacate Table
                  </button>
                )}

                {isCleaning && (
                  <button
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      padding: '0.45rem',
                      background: 'linear-gradient(135deg, #f97316, #ea580c)'
                    }}
                    onClick={() => markCleaned(table.id)}
                  >
                    <RotateCcw size={13} /> Mark Table Cleaned
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
