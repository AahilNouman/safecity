import React, { useEffect, useState } from 'react';
import { getDashboard } from '../../services/api';
import StatsCard from '../../components/admin/StatsCard';
import { ShieldAlert, CheckCircle, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard();
        setData(res);
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <div>Error loading dashboard</div>;

  const doughnutData = {
    labels: data.categoryDistribution.map(d => d._id),
    datasets: [{
      data: data.categoryDistribution.map(d => d.count),
      backgroundColor: ['#D97706', '#E11D48', '#7C3AED', '#2563EB', '#059669', '#0D9488', '#475569'],
    }]
  };

  const lineData = {
    labels: data.trends.map(d => d._id),
    datasets: [{
      label: 'Reports per Day',
      data: data.trends.map(d => d.count),
      borderColor: 'var(--blue)',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: 'var(--navy)' }}>System Dashboard</h1>

      <div className="grid md:grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatsCard icon={ShieldAlert} label="Total Reports" value={data.stats.total} color="var(--blue)" />
        <StatsCard icon={Clock} label="Pending Review" value={data.stats.pending} color="var(--amber)" />
        <StatsCard icon={CheckCircle} label="Verified" value={data.stats.verified} color="var(--emerald)" />
        <StatsCard icon={MapPin} label="Active Hotspots" value={data.activeHotspots} color="var(--rose)" />
      </div>

      <div className="grid md:grid-cols-2" style={{ gap: '2rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Reports by Category</h3>
          <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>30-Day Trend</h3>
          <div style={{ height: '300px' }}>
            <Line data={lineData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Recent Pending Incidents</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 0' }}>ID</th>
                <th>Category</th>
                <th>AI Confidence</th>
                <th>Severity</th>
                <th>Reported</th>
              </tr>
            </thead>
            <tbody>
              {data.recentPending.map(inc => (
                <tr key={inc._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 0', fontFamily: 'monospace' }}>{inc.reportId}</td>
                  <td>{inc.category}</td>
                  <td>{(inc.aiConfidence * 100).toFixed(0)}%</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: inc.severityLevel > 7 ? 'var(--rose)' : 'inherit' }}>
                      {inc.severityLevel > 7 && <AlertTriangle size={14} />}
                      {inc.severityLevel}/10
                    </span>
                  </td>
                  <td>{new Date(inc.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {data.recentPending.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>No pending incidents</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
