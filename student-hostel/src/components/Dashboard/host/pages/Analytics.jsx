import { useState, useEffect } from "react";
import { AlertCircle, Download, TrendingUp, TrendingDown } from "lucide-react";
import hostApi from "../../../../api/hostApi";

const HostAnalytics = () => {
  const [period, setPeriod] = useState("month");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await hostApi.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        setError(error.response?.data?.message || "Failed to load analytics");
        // Use fallback mock data if API fails
        setAnalytics({
          total_views: 1250,
          total_bookings: 42,
          total_revenue: 245000,
          occupancy_rate: 78,
          avg_rating: 4.6,
          revenue_by_month: [
            { month: "Sep", revenue: 32000 },
            { month: "Oct", revenue: 41000 },
            { month: "Nov", revenue: 38000 },
            { month: "Dec", revenue: 29000 },
            { month: "Jan", revenue: 35000 },
            { month: "Feb", revenue: 40000 },
          ],
          bookings_by_month: {
            "09": 5,
            "10": 8,
            "11": 7,
            "12": 4,
            "01": 6,
            "02": 7
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  const maxRevenue = analytics?.revenue_by_month 
    ? Math.max(...analytics.revenue_by_month.map((r) => r.revenue))
    : 0;

  // Calculate mock data for display if backend doesn't provide all fields
  const displayRevenue = analytics?.total_revenue || analytics?.totalRevenue || 0;
  const displayBookings = analytics?.total_bookings || analytics?.totalBookings || 0;
  const displayOccupancy = analytics?.occupancy_rate || analytics?.averageOccupancy || 0;
  const displayRating = analytics?.avg_rating || analytics?.averageRating || 0;

  const revenueByMonth = analytics?.revenue_by_month || analytics?.revenueByMonth || [];
  const bookingsByMonth = analytics?.bookings_by_month || {};

  // Calculate booking trends
  const confirmedBookings = Math.floor(displayBookings * 0.65);
  const pendingBookings = Math.floor(displayBookings * 0.20);
  const completedBookings = displayBookings - confirmedBookings - pendingBookings;

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorState}>
          <AlertCircle size={24} style={{ color: '#dc2626' }} />
          <span>{error}</span>
          <button 
            style={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Analytics Dashboard</h1>
          <p style={styles.subtitle}>Track your performance and earnings</p>
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
          <button style={styles.exportBtn}>
            <Download size={16} style={{ marginRight: '8px' }} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricIconWrapper}>
            <span style={styles.metricIcon}>💰</span>
          </div>
          <div style={styles.metricInfo}>
            <span style={styles.metricLabel}>Total Revenue</span>
            <span style={styles.metricValue}>
              KES {displayRevenue.toLocaleString()}
            </span>
            <span style={styles.metricChangePositive}>
              <TrendingUp size={14} /> +12.5% from last month
            </span>
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricIconWrapper}>
            <span style={styles.metricIcon}>📅</span>
          </div>
          <div style={styles.metricInfo}>
            <span style={styles.metricLabel}>Total Bookings</span>
            <span style={styles.metricValue}>{displayBookings}</span>
            <span style={styles.metricChangePositive}>
              <TrendingUp size={14} /> +8 from last month
            </span>
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricIconWrapper}>
            <span style={styles.metricIcon}>📈</span>
          </div>
          <div style={styles.metricInfo}>
            <span style={styles.metricLabel}>Occupancy Rate</span>
            <span style={styles.metricValue}>{displayOccupancy}%</span>
            <span style={styles.metricChangePositive}>
              <TrendingUp size={14} /> +5% from last month
            </span>
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricIconWrapper}>
            <span style={styles.metricIcon}>⭐</span>
          </div>
          <div style={styles.metricInfo}>
            <span style={styles.metricLabel}>Average Rating</span>
            <span style={styles.metricValue}>{displayRating}</span>
            <span style={styles.metricChangeNeutral}>Based on {Math.floor(displayBookings * 3)} reviews</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={styles.chartsRow}>
        {/* Revenue Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Revenue Overview</h3>
          {revenueByMonth.length > 0 ? (
            <div style={styles.barChart}>
              {revenueByMonth.map((item, index) => (
                <div key={index} style={styles.barContainer}>
                  <div style={styles.barTooltip}>
                    KES {item.revenue.toLocaleString()}
                  </div>
                  <div
                    style={{
                      ...styles.bar,
                      height: `${maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0}%`,
                    }}
                  />
                  <span style={styles.barLabel}>{item.month}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyChart}>
              <p>No revenue data available</p>
            </div>
          )}
        </div>

        {/* Booking Status */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Booking Status</h3>
          {displayBookings > 0 ? (
            <>
              <div style={styles.donutChart}>
                <div style={styles.donutCenter}>
                  <span style={styles.donutValue}>{displayBookings}</span>
                  <span style={styles.donutLabel}>Total</span>
                </div>
                <svg viewBox="0 0 100 100" style={styles.donutSvg}>
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                  />
                  {/* Confirmed segment */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="12"
                    strokeDasharray={`${(confirmedBookings / displayBookings) * 251.2} 251.2`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                  {/* Pending segment */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="12"
                    strokeDasharray={`${(pendingBookings / displayBookings) * 251.2} 251.2`}
                    strokeDashoffset={`${-(confirmedBookings / displayBookings) * 251.2}`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <div style={styles.legend}>
                <div style={styles.legendItem}>
                  <span
                    style={{ ...styles.legendDot, backgroundColor: "#16a34a" }}
                  />
                  <span>Confirmed ({confirmedBookings})</span>
                </div>
                <div style={styles.legendItem}>
                  <span
                    style={{ ...styles.legendDot, backgroundColor: "#fbbf24" }}
                  />
                  <span>Pending ({pendingBookings})</span>
                </div>
                <div style={styles.legendItem}>
                  <span
                    style={{ ...styles.legendDot, backgroundColor: "#d1d5db" }}
                  />
                  <span>Completed ({completedBookings})</span>
                </div>
              </div>
            </>
          ) : (
            <div style={styles.emptyChart}>
              <p>No bookings data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Properties */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Booking Trends (Last 6 Months)</h3>
        <div style={styles.trendsGrid}>
          {Object.entries(bookingsByMonth).slice(0, 6).map(([month, count], index) => {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIndex = parseInt(month) - 1 || index;
            return (
              <div key={month} style={styles.trendCard}>
                <span style={styles.trendMonth}>{monthNames[monthIndex]}</span>
                <span style={styles.trendCount}>{count} bookings</span>
                <div style={styles.trendBar}>
                  <div
                    style={{
                      ...styles.trendFill,
                      width: `${Math.min((count / Math.max(...Object.values(bookingsByMonth))) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div style={styles.insightsSection}>
        <h3 style={styles.sectionTitle}>Key Insights</h3>
        <div style={styles.insightsGrid}>
          <div style={styles.insightCard}>
            <span style={styles.insightIcon}>📈</span>
            <span style={styles.insightText}>
              Revenue is up 12.5% compared to last month
            </span>
          </div>
          <div style={styles.insightCard}>
            <span style={styles.insightIcon}>🏆</span>
            <span style={styles.insightText}>
              Keep up the good work! Your occupancy rate is healthy
            </span>
          </div>
          <div style={styles.insightCard}>
            <span style={styles.insightIcon}>📅</span>
            <span style={styles.insightText}>
              Peak booking season approaching
            </span>
          </div>
          <div style={styles.insightCard}>
            <span style={styles.insightIcon}>⭐</span>
            <span style={styles.insightText}>
              Your rating is above average ({displayRating}/5)
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    animation: "fadeIn 0.4s ease-out",
  },
  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    gap: "16px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e5e7eb",
    borderTopColor: "#0369a1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  errorState: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#fee2e2",
    borderRadius: "8px",
    marginBottom: "24px",
    color: "#dc2626",
  },
  retryButton: {
    marginLeft: "auto",
    padding: "8px 16px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    margin: 0,
  },
  headerActions: {
    display: "flex",
    gap: "12px",
  },
  periodSelect: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#374151",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },
  exportBtn: {
    display: "flex",
    alignItems: "center",
    padding: "10px 16px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "32px",
  },
  metricCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    padding: "24px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  metricIconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "#f0f9ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  metricIcon: {
    fontSize: "24px",
  },
  metricInfo: {
    display: "flex",
    flexDirection: "column",
  },
  metricLabel: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "4px",
  },
  metricValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "4px",
  },
  metricChangePositive: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "13px",
    color: "#16a34a",
  },
  metricChangeNeutral: {
    fontSize: "13px",
    color: "#6b7280",
  },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
    marginBottom: "32px",
  },
  chartCard: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  chartTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "24px",
  },
  barChart: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: "200px",
    paddingTop: "20px",
  },
  barContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  barTooltip: {
    fontSize: "11px",
    color: "#6b7280",
    marginBottom: "8px",
    opacity: 0,
    transition: "opacity 0.2s",
  },
  bar: {
    width: "40px",
    backgroundColor: "#0369a1",
    borderRadius: "6px 6px 0 0",
    minHeight: "20px",
    transition: "height 0.3s ease",
  },
  barLabel: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "8px",
  },
  emptyChart: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "200px",
    color: "#6b7280",
  },
  donutChart: {
    position: "relative",
    width: "160px",
    height: "160px",
    margin: "0 auto 20px",
  },
  donutCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
  donutValue: {
    display: "block",
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a1a",
  },
  donutLabel: {
    fontSize: "14px",
    color: "#6b7280",
  },
  donutSvg: {
    width: "100%",
    height: "100%",
  },
  legend: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#6b7280",
  },
  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  section: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "20px",
  },
  trendsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "12px",
  },
  trendCard: {
    textAlign: "center",
    padding: "16px 8px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },
  trendMonth: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },
  trendCount: {
    display: "block",
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "8px",
  },
  trendBar: {
    width: "100%",
    height: "6px",
    backgroundColor: "#e5e7eb",
    borderRadius: "3px",
    overflow: "hidden",
  },
  trendFill: {
    height: "100%",
    backgroundColor: "#0369a1",
    borderRadius: "3px",
    transition: "width 0.3s ease",
  },
  insightsSection: {
    marginTop: "32px",
  },
  insightsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },
  insightCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#f0f9ff",
    borderRadius: "8px",
    border: "1px solid #bae6fd",
  },
  insightIcon: {
    fontSize: "20px",
  },
  insightText: {
    fontSize: "13px",
    color: "#0369a1",
    fontWeight: "500",
  },
};

export default HostAnalytics;

