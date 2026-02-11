import { useState, useEffect } from "react";
import { AlertCircle, DollarSign, TrendingUp, Calendar, Download, CreditCard, Banknote } from "lucide-react";
import hostApi from "../../../../api/hostApi";

const HostEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hostApi.getEarnings();
      setEarnings(data);
    } catch (error) {
      console.error("Failed to fetch earnings:", error);
      setError(error.response?.data?.message || "Failed to load earnings");
      // Fallback mock data if API fails
      setEarnings({
        total_earnings: 245000,
        total_bookings: 42,
        pending_payouts: 45000,
        completed_payouts: 200000,
        earnings_by_month: {
          "01": 35000,
          "02": 42000,
          "03": 38000,
          "04": 45000,
          "05": 40000,
          "06": 45000
        },
        recent_payouts: [
          { id: 1, amount: 45000, status: "completed", date: "2024-02-15", method: "Bank Transfer" },
          { id: 2, amount: 32000, status: "completed", date: "2024-01-30", method: "M-Pesa" },
          { id: 3, amount: 28000, status: "completed", date: "2024-01-15", method: "Bank Transfer" },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <p>Loading earnings...</p>
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
            onClick={() => fetchEarnings()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalEarnings = earnings?.total_earnings || 0;
  const totalBookings = earnings?.total_bookings || 0;
  const pendingPayouts = earnings?.pending_payouts || 0;
  const completedPayouts = earnings?.completed_payouts || 0;
  const earningsByMonth = earnings?.earnings_by_month || {};
  const recentPayouts = earnings?.recent_payouts || [];

  const maxMonthlyEarnings = Math.max(...Object.values(earningsByMonth), 1);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Earnings Dashboard</h1>
          <p style={styles.subtitle}>Track your revenue and payouts</p>
        </div>
        <button style={styles.exportBtn}>
          <Download size={16} style={{ marginRight: '8px' }} />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricIconWrapper}>
            <DollarSign size={24} style={{ color: '#16a34a' }} />
          </div>
          <div style={styles.metricInfo}>
            <span style={styles.metricLabel}>Total Earnings</span>
            <span style={styles.metricValue}>KES {totalEarnings.toLocaleString()}</span>
            <span style={styles.metricChange}>
              <TrendingUp size={14} style={{ marginRight: '4px' }} />
              +15% from last month
            </span>
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricIconWrapper}>
            <Calendar size={24} style={{ color: '#0369a1' }} />
          </div>
          <div style={styles.metricInfo}>
            <span style={styles.metricLabel}>Total Bookings</span>
            <span style={styles.metricValue}>{totalBookings}</span>
            <span style={styles.metricSubtext}>Confirmed & Completed</span>
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricIconWrapper}>
            <Banknote size={24} style={{ color: '#d97706' }} />
          </div>
          <div style={styles.metricInfo}>
            <span style={styles.metricLabel}>Pending Payouts</span>
            <span style={styles.metricValue}>KES {pendingPayouts.toLocaleString()}</span>
            <span style={styles.metricSubtext}>Awaiting processing</span>
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricIconWrapper}>
            <CreditCard size={24} style={{ color: '#7c3aed' }} />
          </div>
          <div style={styles.metricInfo}>
            <span style={styles.metricLabel}>Completed Payouts</span>
            <span style={styles.metricValue}>KES {completedPayouts.toLocaleString()}</span>
            <span style={styles.metricSubtext}>Already paid out</span>
          </div>
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      <div style={styles.chartSection}>
        <h2 style={styles.sectionTitle}>Monthly Earnings</h2>
        <div style={styles.chartContainer}>
          <div style={styles.barChart}>
            {Object.entries(earningsByMonth).map(([month, amount]) => {
              const monthIndex = parseInt(month) - 1;
              return (
                <div key={month} style={styles.barWrapper}>
                  <div style={styles.barTooltip}>
                    KES {amount.toLocaleString()}
                  </div>
                  <div
                    style={{
                      ...styles.bar,
                      height: `${(amount / maxMonthlyEarnings) * 180}px`,
                    }}
                  />
                  <span style={styles.barLabel}>{monthNames[monthIndex] || month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Payouts */}
      <div style={styles.payoutsSection}>
        <h2 style={styles.sectionTitle}>Recent Payouts</h2>
        {recentPayouts.length > 0 ? (
          <div style={styles.payoutsList}>
            {recentPayouts.map((payout) => (
              <div key={payout.id} style={styles.payoutCard}>
                <div style={styles.payoutInfo}>
                  <div style={styles.payoutAmount}>KES {payout.amount.toLocaleString()}</div>
                  <div style={styles.payoutMeta}>
                    <span style={styles.payoutMethod}>{payout.method}</span>
                    <span style={styles.payoutDate}>{formatDate(payout.date)}</span>
                  </div>
                </div>
                <div style={{
                  ...styles.payoutStatus,
                  backgroundColor: payout.status === 'completed' ? '#dcfce7' : '#fef3c7',
                  color: payout.status === 'completed' ? '#16a34a' : '#d97706',
                }}>
                  {payout.status === 'completed' ? 'Paid' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <DollarSign size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
            <p style={styles.emptyText}>No payouts yet. Your earnings will appear here after bookings are confirmed.</p>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div style={styles.methodsSection}>
        <h2 style={styles.sectionTitle}>Payment Methods</h2>
        <div style={styles.methodsGrid}>
          <div style={styles.methodCard}>
            <div style={styles.methodIcon}>
              <Banknote size={24} />
            </div>
            <div style={styles.methodInfo}>
              <span style={styles.methodName}>Bank Transfer</span>
              <span style={styles.methodDetails}>Account: ****4589</span>
            </div>
            <span style={styles.methodBadge}>Primary</span>
          </div>
          <div style={styles.methodCard}>
            <div style={styles.methodIcon}>
              <CreditCard size={24} />
            </div>
            <div style={styles.methodInfo}>
              <span style={styles.methodName}>M-Pesa</span>
              <span style={styles.methodDetails}>Phone: +254 ***789</span>
            </div>
            <span style={styles.methodBadgeSecondary}>Secondary</span>
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
    borderTopColor: "#16a34a",
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
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    backgroundColor: "#f0f9ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "13px",
    color: "#16a34a",
  },
  metricSubtext: {
    fontSize: "13px",
    color: "#6b7280",
  },
  chartSection: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "24px",
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "24px",
  },
  chartContainer: {
    height: "220px",
  },
  barChart: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: "100%",
    paddingTop: "20px",
  },
  barWrapper: {
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
    width: "48px",
    backgroundColor: "#16a34a",
    borderRadius: "6px 6px 0 0",
    minHeight: "20px",
    transition: "height 0.3s ease",
  },
  barLabel: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "8px",
  },
  payoutsSection: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "24px",
    marginBottom: "32px",
  },
  payoutsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  payoutCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  payoutInfo: {
    display: "flex",
    flexDirection: "column",
  },
  payoutAmount: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "4px",
  },
  payoutMeta: {
    display: "flex",
    gap: "12px",
    fontSize: "13px",
    color: "#6b7280",
  },
  payoutStatus: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#6b7280",
  },
  emptyText: {
    fontSize: "14px",
    maxWidth: "400px",
    margin: "0 auto",
  },
  methodsSection: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "24px",
  },
  methodsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },
  methodCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  methodIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#374151",
  },
  methodInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  methodName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "4px",
  },
  methodDetails: {
    fontSize: "13px",
    color: "#6b7280",
  },
  methodBadge: {
    padding: "4px 10px",
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
  },
  methodBadgeSecondary: {
    padding: "4px 10px",
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
  },
};

export default HostEarnings;

