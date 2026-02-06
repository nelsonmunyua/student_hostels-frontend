import { useState, useEffect } from "react";

const HostAnalytics = () => {
  const [period, setPeriod] = useState("month");
  const [analytics] = useState({
    totalRevenue: 24500,
    totalBookings: 42,
    averageOccupancy: 78,
    averageRating: 4.6,
    revenueByMonth: [
      { month: "Sep", revenue: 3200 },
      { month: "Oct", revenue: 4100 },
      { month: "Nov", revenue: 3800 },
      { month: "Dec", revenue: 2900 },
      { month: "Jan", revenue: 3500 },
      { month: "Feb", revenue: 4000 },
    ],
    topProperties: [
      { name: "University View Hostel", bookings: 18, revenue: 8100 },
      { name: "Central Student Living", bookings: 15, revenue: 5700 },
      { name: "Campus Edge Apartments", bookings: 9, revenue: 4680 },
    ],
    bookingTrends: {
      confirmed: 28,
      pending: 8,
      completed: 6,
    },
  });

  const maxRevenue = Math.max(
    ...analytics.revenueByMonth.map((r) => r.revenue),
  );

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
          <button style={styles.exportBtn}>📊 Export Report</button>
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
              ${analytics.totalRevenue.toLocaleString()}
            </span>
            <span style={styles.metricChange}>+12.5% from last month</span>
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricIconWrapper}>
            <span style={styles.metricIcon}>📅</span>
          </div>
          <div style={styles.metricInfo}>
            <span style={styles.metricLabel}>Total Bookings</span>
            <span style={styles.metricValue}>{analytics.totalBookings}</span>
            <span style={styles.metricChange}>+8 from last month</span>
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricIconWrapper}>
            <span style={styles.metricIcon}>📈</span>
          </div>
          <div style={styles.metricInfo}>
            <span style={styles.metricLabel}>Occupancy Rate</span>
            <span style={styles.metricValue}>
              {analytics.averageOccupancy}%
            </span>
            <span style={styles.metricChange}>+5% from last month</span>
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricIconWrapper}>
            <span style={styles.metricIcon}>⭐</span>
          </div>
          <div style={styles.metricInfo}>
            <span style={styles.metricLabel}>Average Rating</span>
            <span style={styles.metricValue}>{analytics.averageRating}</span>
            <span style={styles.metricChange}>Based on 156 reviews</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={styles.chartsRow}>
        {/* Revenue Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Revenue Overview</h3>
          <div style={styles.barChart}>
            {analytics.revenueByMonth.map((item, index) => (
              <div key={index} style={styles.barContainer}>
                <div style={styles.barTooltip}>
                  ${item.revenue.toLocaleString()}
                </div>
                <div
                  style={{
                    ...styles.bar,
                    height: `${(item.revenue / maxRevenue) * 100}%`,
                  }}
                />
                <span style={styles.barLabel}>{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Status */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Booking Status</h3>
          <div style={styles.donutChart}>
            <div style={styles.donutCenter}>
              <span style={styles.donutValue}>{analytics.totalBookings}</span>
              <span style={styles.donutLabel}>Total</span>
            </div>
            <svg viewBox="0 0 100 100" style={styles.donutSvg}>
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#dcfce7"
                strokeWidth="12"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#16a34a"
                strokeWidth="12"
                strokeDasharray={`${(analytics.bookingTrends.confirmed / analytics.totalBookings) * 251.2} 251.2`}
                strokeDashoffset="62.8"
                transform="rotate(-90 50 50)"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="12"
                strokeDasharray={`${(analytics.bookingTrends.pending / analytics.totalBookings) * 251.2} 251.2`}
                strokeDashoffset={`${-62.8 - (analytics.bookingTrends.confirmed / analytics.totalBookings) * 251.2}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
          <div style={styles.legend}>
            <div style={styles.legendItem}>
              <span
                style={{ ...styles.legendDot, backgroundColor: "#16a34a" }}
              />
              <span>Confirmed ({analytics.bookingTrends.confirmed})</span>
            </div>
            <div style={styles.legendItem}>
              <span
                style={{ ...styles.legendDot, backgroundColor: "#fbbf24" }}
              />
              <span>Pending ({analytics.bookingTrends.pending})</span>
            </div>
            <div style={styles.legendItem}>
              <span
                style={{ ...styles.legendDot, backgroundColor: "#d1d5db" }}
              />
              <span>Completed ({analytics.bookingTrends.completed})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Properties */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Top Performing Properties</h3>
        <div style={styles.propertiesTable}>
          <div style={styles.tableHeader}>
            <span style={styles.tableCol}>Property</span>
            <span style={styles.tableCol}>Bookings</span>
            <span style={styles.tableCol}>Revenue</span>
            <span style={styles.tableCol}>Performance</span>
          </div>
          {analytics.topProperties.map((property, index) => (
            <div key={index} style={styles.tableRow}>
              <span style={styles.tableCol}>
                <span style={styles.propertyIcon}>🏠</span>
                {property.name}
              </span>
              <span style={styles.tableCol}>{property.bookings}</span>
              <span style={styles.tableCol}>
                ${property.revenue.toLocaleString()}
              </span>
              <span style={styles.tableCol}>
                <div style={styles.performanceBar}>
                  <div
                    style={{
                      ...styles.performanceFill,
                      width: `${(property.bookings / analytics.totalBookings) * 100}%`,
                    }}
                  />
                </div>
              </span>
            </div>
          ))}
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
              University View Hostel is your top performer
            </span>
          </div>
          <div style={styles.insightCard}>
            <span style={styles.insightIcon}>📅</span>
            <span style={styles.insightText}>
              Peak booking season: October - November
            </span>
          </div>
          <div style={styles.insightCard}>
            <span style={styles.insightIcon}>⭐</span>
            <span style={styles.insightText}>
              Your rating improved by 0.2 stars
            </span>
          </div>
        </div>
      </div>

      <style>{`
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
    animation: "fadeIn 0.4s ease-out",
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
  metricChange: {
    fontSize: "13px",
    color: "#16a34a",
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
    transform: "rotate(-90deg)",
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
  propertiesTable: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    padding: "12px 0",
    alignItems: "center",
  },
  tableCol: {
    fontSize: "14px",
    color: "#374151",
  },
  propertyIcon: {
    marginRight: "8px",
  },
  performanceBar: {
    width: "100px",
    height: "8px",
    backgroundColor: "#f3f4f6",
    borderRadius: "4px",
    overflow: "hidden",
  },
  performanceFill: {
    height: "100%",
    backgroundColor: "#0369a1",
    borderRadius: "4px",
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
