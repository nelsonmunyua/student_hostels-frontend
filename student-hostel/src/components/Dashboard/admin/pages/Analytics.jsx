import React, { useState, useEffect } from "react";
import {
  Users,
  Home,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Download,
  RefreshCw,
} from "lucide-react";
import { toast } from "../../../../main";
import adminApi from "../../../../api/adminApi";

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState("month");

  // Fetch analytics from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAnalytics();
      setAnalytics(data);
      toast.success("Analytics updated");
    } catch (error) {
      toast.error("Failed to refresh analytics");
    } finally {
      setLoading(false);
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      toast.info("Exporting analytics report...");
      // In real app, this would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Report exported successfully!");
    } catch (error) {
      toast.error("Failed to export report");
    }
  };

  // Default values for loading state
  const stats = analytics || {
    bookings_by_status: {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
    },
    payments_by_status: {
      paid: 0,
      pending: 0,
      failed: 0,
      refunded: 0,
    },
    total_revenue: 0,
    users_by_role: {
      student: 0,
      host: 0,
      admin: 0,
    },
    hostels_stats: {
      total: 0,
      active: 0,
      verified: 0,
    },
    monthly_signups: [],
  };

  // Calculate totals
  const totalBookings = Object.values(stats.bookings_by_status).reduce(
    (a, b) => a + b,
    0
  );
  const totalPayments = Object.values(stats.payments_by_status).reduce(
    (a, b) => a + b,
    0
  );
  const totalUsers = Object.values(stats.users_by_role).reduce(
    (a, b) => a + b,
    0
  );

  // Calculate percentages
  const getPercentage = (value, total) =>
    total > 0 ? ((value / total) * 100).toFixed(1) : 0;

  // Max value for bar chart
  const maxRevenue = Math.max(
    ...(stats.monthly_signups?.map((m) => m.count) || [1])
  );

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Analytics Dashboard</h1>
          <p style={styles.subtitle}>
            Comprehensive platform analytics and insights
          </p>
        </div>
        <div style={styles.headerActions}>
          <select
            style={styles.periodSelect}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            style={styles.refreshBtn}
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "spinning" : ""} />
            Refresh
          </button>
          <button style={styles.exportBtn} onClick={handleExport}>
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {loading && !analytics ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div
                style={{ ...styles.metricIconWrapper, backgroundColor: "#f0f9ff" }}
              >
                <Users size={24} color="#0369a1" />
              </div>
              <div style={styles.metricInfo}>
                <span style={styles.metricLabel}>Total Users</span>
                <span style={styles.metricValue}>
                  {totalUsers.toLocaleString()}
                </span>
              </div>
            </div>

            <div style={styles.metricCard}>
              <div
                style={{ ...styles.metricIconWrapper, backgroundColor: "#f0fdfa" }}
              >
                <Home size={24} color="#0d9488" />
              </div>
              <div style={styles.metricInfo}>
                <span style={styles.metricLabel}>Active Hostels</span>
                <span style={styles.metricValue}>
                  {stats.hostels_stats.active.toLocaleString()}
                </span>
              </div>
            </div>

            <div style={styles.metricCard}>
              <div
                style={{ ...styles.metricIconWrapper, backgroundColor: "#f5f3ff" }}
              >
                <Calendar size={24} color="#7c3aed" />
              </div>
              <div style={styles.metricInfo}>
                <span style={styles.metricLabel}>Total Bookings</span>
                <span style={styles.metricValue}>
                  {totalBookings.toLocaleString()}
                </span>
              </div>
            </div>

            <div style={styles.metricCard}>
              <div
                style={{ ...styles.metricIconWrapper, backgroundColor: "#ecfdf5" }}
              >
                <DollarSign size={24} color="#059669" />
              </div>
              <div style={styles.metricInfo}>
                <span style={styles.metricLabel}>Total Revenue</span>
                <span style={styles.metricValue}>
                  Ksh{stats.total_revenue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div style={styles.chartsRow}>
            {/* Bookings by Status */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>
                  <Activity size={20} />
                  Bookings by Status
                </h3>
              </div>
              <div style={styles.chartContent}>
                <div style={styles.statusBars}>
                  {Object.entries(stats.bookings_by_status).map(
                    ([status, count]) => {
                      const percentage = getPercentage(count, totalBookings);
                      const colors = {
                        pending: "#d97706",
                        confirmed: "#059669",
                        cancelled: "#dc2626",
                        completed: "#0369a1",
                      };
                      return (
                        <div key={status} style={styles.statusBarItem}>
                          <div style={styles.statusBarHeader}>
                            <span style={styles.statusLabel}>
                              {status.charAt(0).toUpperCase() +
                                status.slice(1)}
                            </span>
                            <span style={styles.statusCount}>{count}</span>
                          </div>
                          <div style={styles.statusBarTrack}>
                            <div
                              style={{
                                ...styles.statusBarFill,
                                width: `${percentage}%`,
                                backgroundColor: colors[status] || "#6b7280",
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Payments by Status */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>
                  <DollarSign size={20} />
                  Payments by Status
                </h3>
              </div>
              <div style={styles.chartContent}>
                <div style={styles.statusBars}>
                  {Object.entries(stats.payments_by_status).map(
                    ([status, count]) => {
                      const percentage = getPercentage(count, totalPayments);
                      const colors = {
                        paid: "#059669",
                        pending: "#d97706",
                        failed: "#dc2626",
                        refunded: "#7c3aed",
                      };
                      return (
                        <div key={status} style={styles.statusBarItem}>
                          <div style={styles.statusBarHeader}>
                            <span style={styles.statusLabel}>
                              {status.charAt(0).toUpperCase() +
                                status.slice(1)}
                            </span>
                            <span style={styles.statusCount}>{count}</span>
                          </div>
                          <div style={styles.statusBarTrack}>
                            <div
                              style={{
                                ...styles.statusBarFill,
                                width: `${percentage}%`,
                                backgroundColor: colors[status] || "#6b7280",
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Signups Chart */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>
                <BarChart3 size={20} />
                User Signups (Last 6 Months)
              </h3>
            </div>
            <div style={styles.chartContent}>
              <div style={styles.barChart}>
                {stats.monthly_signups && stats.monthly_signups.length > 0 ? (
                  stats.monthly_signups.map((item, index) => (
                    <div key={index} style={styles.barContainer}>
                      <div style={styles.barTooltip}>
                        {item.count} signups
                      </div>
                      <div
                        style={{
                          ...styles.bar,
                          height: `${Math.max((item.count / maxRevenue) * 100, 5)}%`,
                        }}
                      />
                      <span style={styles.barLabel}>
                        {item.month || "-"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={styles.noData}>
                    <p>No signup data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Insights Section */}
          <div style={styles.insightsSection}>
            <h3 style={styles.sectionTitle}>Key Insights</h3>
            <div style={styles.insightsGrid}>
              <div style={styles.insightCard}>
                <div style={styles.insightIcon}>
                  <TrendingUp size={20} />
                </div>
                <div style={styles.insightContent}>
                  <span style={styles.insightLabel}>Booking Rate</span>
                  <span style={styles.insightValue}>
                    {totalBookings > 0
                      ? (
                          (stats.bookings_by_status.confirmed / totalBookings) *
                          100
                        ).toFixed(1)
                      : 0}
                    % confirmed
                  </span>
                </div>
              </div>

              <div style={styles.insightCard}>
                <div style={styles.insightIcon}>
                  <DollarSign size={20} />
                </div>
                <div style={styles.insightContent}>
                  <span style={styles.insightLabel}>Revenue</span>
                  <span style={styles.insightValue}>
                    Ksh{stats.total_revenue.toLocaleString()} total
                  </span>
                </div>
              </div>

              <div style={styles.insightCard}>
                <div style={styles.insightIcon}>
                  <Users size={20} />
                </div>
                <div style={styles.insightContent}>
                  <span style={styles.insightLabel}>Student Ratio</span>
                  <span style={styles.insightValue}>
                    {totalUsers > 0
                      ? (
                          (stats.users_by_role.student / totalUsers) *
                          100
                        ).toFixed(1)
                      : 0}
                    % students
                  </span>
                </div>
              </div>

              <div style={styles.insightCard}>
                <div style={styles.insightIcon}>
                  <Home size={20} />
                </div>
                <div style={styles.insightContent}>
                  <span style={styles.insightLabel}>Hostel Activity</span>
                  <span style={styles.insightValue}>
                    {stats.hostels_stats.total > 0
                      ? (
                          (stats.hostels_stats.active / stats.hostels_stats.total) *
                          100
                        ).toFixed(1)
                      : 0}
                    % active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    padding: "24px",
    backgroundColor: "#f8fafc",
    minHeight: "100%",
    animation: "fadeIn 0.4s ease-out",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    margin: 0,
  },
  headerActions: {
    display: "flex",
    gap: "12px",
  },
  periodSelect: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#374151",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    cursor: "pointer",
  },
  exportBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#0369a1",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#ffffff",
    cursor: "pointer",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 0",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e2e8f0",
    borderTopColor: "#0369a1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  metricCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    padding: "24px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
  metricIconWrapper: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  metricInfo: {
    display: "flex",
    flexDirection: "column",
  },
  metricLabel: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "4px",
  },
  metricValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "8px",
  },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
  },
  chartHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #f1f5f9",
  },
  chartTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0,
  },
  chartContent: {
    padding: "24px",
  },
  statusBars: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  statusBarItem: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  statusBarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    textTransform: "capitalize",
  },
  statusCount: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
  },
  statusBarTrack: {
    height: "8px",
    backgroundColor: "#f1f5f9",
    borderRadius: "4px",
    overflow: "hidden",
  },
  statusBarFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  barChart: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: "200px",
    paddingTop: "20px",
    gap: "12px",
  },
  barContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  barTooltip: {
    position: "absolute",
    top: "-24px",
    fontSize: "11px",
    color: "#64748b",
    opacity: 0,
    transition: "opacity 0.2s",
    whiteSpace: "nowrap",
  },
  bar: {
    width: "100%",
    maxWidth: "60px",
    backgroundColor: "#0369a1",
    borderRadius: "6px 6px 0 0",
    minHeight: "20px",
    transition: "height 0.3s ease",
  },
  barLabel: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "8px",
    textAlign: "center",
  },
  noData: {
    width: "100%",
    textAlign: "center",
    color: "#94a3b8",
    padding: "40px 0",
  },
  insightsSection: {
    marginTop: "24px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "16px",
  },
  insightsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  insightCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  insightIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    backgroundColor: "#f0f9ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#0369a1",
  },
  insightContent: {
    display: "flex",
    flexDirection: "column",
  },
  insightLabel: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "4px",
  },
  insightValue: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
  },
};

export default AdminAnalytics;

