import React, { useState, useEffect } from 'react';
import { getCheckIns, exportToCSV, deleteCheckIn, updateCheckIn } from '../utils/storage';
import EditCheckInModal from '../components/EditCheckInModal';
import type { CheckIn } from '../types';
import './CheckInTable.css';

const CheckInTable: React.FC = () => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [editingCheckIn, setEditingCheckIn] = useState<CheckIn | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    setCheckIns(getCheckIns());
  }, []);

  const handleExport = () => {
    exportToCSV(checkIns);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this check-in?')) {
      deleteCheckIn(id);
      setCheckIns(getCheckIns());
    }
  };

  const handleEdit = (checkIn: CheckIn) => {
    setEditingCheckIn(checkIn);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedCheckIn: CheckIn) => {
    updateCheckIn(updatedCheckIn);
    setCheckIns(getCheckIns());
    setEditingCheckIn(null);
    setIsEditModalOpen(false);
  };

  const handleCloseEdit = () => {
    setEditingCheckIn(null);
    setIsEditModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString();
  };

  const getStressLevelColor = (level: number) => {
    if (level <= 2) return 'var(--success-color)';
    if (level <= 3) return 'var(--warning-color)';
    return 'var(--error-color)';
  };

  const getMoraleLevelColor = (level: number) => {
    if (level >= 4) return 'var(--success-color)';
    if (level >= 3) return 'var(--warning-color)';
    return 'var(--error-color)';
  };

  return (
    <div className="check-in-table-container">
      <div className="table-header">
        <h1>Check-in Table</h1>
        <button 
          onClick={handleExport}
          className="export-btn"
          disabled={checkIns.length === 0}
        >
          Export CSV
        </button>
      </div>

      {checkIns.length === 0 ? (
        <div className="empty-state">
          <p>No check-ins found. <a href="/form">Create your first check-in</a></p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="check-in-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Activities Since</th>
                <th>Activities Planned</th>
                <th>Blockers</th>
                <th>Stress Level</th>
                <th>Morale Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {checkIns.map((checkIn) => (
                <tr key={checkIn.id}>
                  <td data-label="Name">{checkIn.name}</td>
                  <td data-label="Date">{formatDate(checkIn.date)}</td>
                  <td data-label="Activities Since" className="text-cell">
                    {checkIn.activitiesSince}
                  </td>
                  <td data-label="Activities Planned" className="text-cell">
                    {checkIn.activitiesPlanned}
                  </td>
                  <td data-label="Blockers" className="text-cell">
                    {checkIn.blockers}
                  </td>
                  <td data-label="Stress Level">
                    <span 
                      className="level-badge"
                      style={{ backgroundColor: getStressLevelColor(checkIn.stressLevel) }}
                    >
                      {checkIn.stressLevel}
                    </span>
                    {checkIn.stressLevel === 5 && checkIn.whyStressed && (
                      <div className="stress-reason">
                        <small>{checkIn.whyStressed}</small>
                      </div>
                    )}
                  </td>
                  <td data-label="Morale Level">
                    <span 
                      className="level-badge"
                      style={{ backgroundColor: getMoraleLevelColor(checkIn.moraleLevel) }}
                    >
                      {checkIn.moraleLevel}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(checkIn)}
                        className="action-btn edit-btn"
                        title="Edit check-in"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(checkIn.id)}
                        className="action-btn delete-btn"
                        title="Delete check-in"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingCheckIn && (
        <EditCheckInModal
          checkIn={editingCheckIn}
          isOpen={isEditModalOpen}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default CheckInTable; 