import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../../services/api';
import StatsCard from '../../components/admin/StatsCard';
import { ShieldAlert, CheckCircle, Clock, MapPin, AlertTriangle, ArrowRight, Activity, Eye } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard();
        const payload = res?.data || res;
        setData(payload);
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <div style={{ color: '#f87171', padding: '2rem' }}>Error loading dashboard telemetry</div>;

  const categoryMap = {
    1: 'Harassment',
    2: 'Stalking',
    3: 'Threat',
    4: 'Unsafe Area',
    5: 'Poor Lighting',
    6: 'Suspicious Activity',
    7: 'Other'
  };

  const stats = data.stats || {};
  const categoryData = Array.isArray(data.reports_by_category) ? data.reports_by_category : (data.categoryDistribution || []);
  const trendData = Array.isArray(data.reports_over_time) ? data.reports_over_time : (data.trends || []);
  const recentPending = Array.isArray(data.recent_pending) ? data.recent_pending : (data.recentPending || []);

  const doughnutData = {
    labels: categoryData.map(d => categoryMap[d.cat] || d.cat || d.name || d._id || 'General'),
    datasets: [{
      data: categoryData.map(d => parseInt(d.count || 0, 10)),
      backgroundColor: ['#0d9488', '#f97316', '#f43f5e', '#eab308', '#06b6d4', '#8b5cf6', '#64748b'],
      borderColor: '#10192d',
      borderWidth: 2
    }]
  };

  const lineData = {
    labels: trendData.map(d => d._id || (d.date ? new Date(d.date).toLocaleDateString() : '')),
    datasets: [{
      label: 'Incident Volume',
      data: trendData.map(d => parseInt(d.count || 0, 10)),
      borderColor: '#14b8a6',
      backgroundColor: 'rgba(20, 184, 166, 0.1)',
      fill: true,
      tension: 0.35,
      pointBackgroundColor: '#14b8a6',
      pointRadius: 3
    }]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11 }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#64748b', font: { size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.04)' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#64748b', font: { size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.04)' }
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 0.25rem' }}>
          Municipal Intelligence Dashboard
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
          Overview of civic reports, automated AI triage status, and active density clusters.
        </p>
      </div>

      {/* 4 KPI Stats Cards */}
      <div className="grid md:grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatsCard icon={ShieldAlert} label="Total Reports" value={stats.total_reports ?? stats.total ?? 0} color="#0d9488" />
        <StatsCard icon={Clock} label="Pending Review" value={stats.pending ?? 0} color="#f59e0b" />
        <StatsCard icon={CheckCircle} label="Verified Reports" value={stats.verified ?? 0} color="#10b981" />
        <StatsCard icon={MapPin} label="Active Hotspots" value={data.activeHotspots ?? stats.active_hotspots ?? 0} color="#f43f5e" />
      </div>

      {/* 2 Charts Row */}
      <div className="grid md:grid-cols-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              Reports by Incident Category
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Distribution</span>
          </div>
          <div style={{ height: '260px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 10 } } } } }} />
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              30-Day Incident Frequency
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Daily Trajectory</span>
          </div>
          <div style={{ height: '260px' }}>
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Pending Incidents Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', margin: '0 0 0.2rem' }}>
              Pending Incident Verification Queue
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>
              Reports awaiting human moderator classification and verification
            </p>
          </div>
          <Link
            to="/admin/incidents"
            style={{
              fontSize: '0.8rem',
              color: '#2dd4bf',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: '600'
            }}
          >
            View Full Queue <ArrowRight size={13} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Category</th>
                <th>AI Confidence</th>
                <th>Severity</th>
                <th>Logged Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentPending.map(inc => {
                const repId = inc.public_report_id || inc.reportId || `SC-${inc.id}`;
                const cat = inc.final_category || inc.category_name || categoryMap[inc.category_id] || inc.category || 'Incident';
                const confidence = ((inc.ai_confidence || inc.aiConfidence || 0) * 100).toFixed(0);
                const sevLevel = inc.severity_level || inc.severityLevel || 'MEDIUM';

                return (
                  <tr key={inc.id || inc._id || repId}>
                    <td style={{ fontFamily: 'monospace', fontWeight: '600', color: '#2dd4bf' }}>
                      {repId}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.55rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        color: '#ffffff'
                      }}>
                        {cat}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{confidence}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        background: sevLevel === 'HIGH' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        color: sevLevel === 'HIGH' ? '#fda4af' : '#fde047',
                        border: '1px solid ' + (sevLevel === 'HIGH' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)')
                      }}>
                        {sevLevel === 'HIGH' && <AlertTriangle size={12} />}
                        {sevLevel}
                      </span>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      {new Date(inc.created_at || inc.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/admin/incidents/${inc.id || inc._id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          background: 'rgba(13, 148, 136, 0.12)',
                          border: '1px solid rgba(13, 148, 136, 0.25)',
                          color: '#2dd4bf',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}
                      >
                        <Eye size={12} /> Audit
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {recentPending.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    No pending reports currently in queue
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
