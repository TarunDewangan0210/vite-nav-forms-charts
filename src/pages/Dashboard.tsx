import React, { useState, useEffect } from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import { getCheckIns } from '../utils/storage';
import { processStressData, processMoraleData } from '../utils/chartData';
import LineChart from '../components/LineChart';
import type { CheckIn, ChartData } from '../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [showMorale, setShowMorale] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const data = getCheckIns();
    setCheckIns(data);
  }, []);

  useEffect(() => {
    if (checkIns.length > 0) {
      const data = showMorale ? processMoraleData(checkIns) : processStressData(checkIns);
      setChartData(data);
    } else {
      setChartData([]);
    }
  }, [checkIns, showMorale]);

  const getAverageValue = (data: ChartData[]) => {
    if (data.length === 0) return 0;
    return (data.reduce((sum, item) => sum + item.value, 0) / data.length).toFixed(1);
  };

  const getLatestValue = (data: ChartData[]) => {
    if (data.length === 0) return 0;
    return data[data.length - 1].value.toFixed(1);
  };

  const getTrend = (data: ChartData[]) => {
    if (data.length < 2) return 'stable';
    const latest = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    if (latest > previous) return 'up';
    if (latest < previous) return 'down';
    return 'stable';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '➡️';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visualize team stress and morale levels over time</p>
      </div>

      <div className="dashboard-controls">
        <FormControlLabel
          control={
            <Switch
              checked={showMorale}
              onChange={(e) => setShowMorale(e.target.checked)}
              color="primary"
            />
          }
          label={showMorale ? 'Showing Morale Levels' : 'Showing Stress Levels'}
        />
      </div>

      {checkIns.length === 0 ? (
        <div className="empty-dashboard">
          <h3>No Data Available</h3>
          <p>No check-ins found. <a href="/form">Create your first check-in</a> to see charts.</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Average {showMorale ? 'Morale' : 'Stress'}</h3>
              <div className="stat-value">{getAverageValue(chartData)}</div>
              <div className="stat-label">out of 5</div>
            </div>
            <div className="stat-card">
              <h3>Latest {showMorale ? 'Morale' : 'Stress'}</h3>
              <div className="stat-value">{getLatestValue(chartData)}</div>
              <div className="stat-label">
                {getTrendIcon(getTrend(chartData))} {getTrend(chartData)}
              </div>
            </div>
            <div className="stat-card">
              <h3>Total Check-ins</h3>
              <div className="stat-value">{checkIns.length}</div>
              <div className="stat-label">submissions</div>
            </div>
          </div>

          <div className="chart-container">
            <LineChart
              data={chartData}
              title={`Average ${showMorale ? 'Morale' : 'Stress'} Level Over Time`}
              color={showMorale ? '#10b981' : '#ef4444'}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 