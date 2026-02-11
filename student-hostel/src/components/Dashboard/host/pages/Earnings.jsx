import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DollarSign, Calendar, CreditCard, Banknote, ArrowUpRight } from 'lucide-react';
import { fetchEarnings, fetchTransactions, withdrawFunds } from '../../../../redux/slices/Thunks/earningsThunks';

const HostEarnings = () => {
  const dispatch = useDispatch();
  const { earnings, monthlyEarnings, transactions, loading, withdrawalStatus, error } = useSelector((state) => state.earnings);
  
  const [period, setPeriod] = useState('month');
  const [localError, setLocalError] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(null);

  // Fetch earnings on mount
  useEffect(() => {
    dispatch(fetchEarnings({ period }));
    dispatch(fetchTransactions({ limit: 10 }));
  }, [dispatch, period]);

  // Handle error/success messages
  useEffect(() => {
    if (error) {
      setLocalError(error);
      setTimeout(() => setLocalError(null), 5000);
    }
    if (withdrawalStatus?.success) {
      setLocalSuccess('Withdrawal request submitted successfully!');
      setTimeout(() => setLocalSuccess(null), 5000);
    }
  }, [error, withdrawalStatus]);

  // Default mock data for demo when Redux data is empty
  const defaultEarnings = {
    total_earnings: 125000,
    pending_payouts: 18500,
    available_balance: 45000,
    total_bookings: 45,
    average_booking_value: 8500,
  };

  const defaultMonthlyEarnings = [
    { month: 'Sep', amount: 15000 },
    { month: 'Oct', amount: 22500 },
    { month: 'Nov', amount: 18000 },
    { month: 'Dec', amount: 12000 },
    { month: 'Jan', amount: 28000 },
    { month: 'Feb', amount: 29500 },
  ];

  const defaultTransactions = [
    { id: 1, date: '2024-02-15', description: 'Booking #1234 - University View Hostel', amount: 8500, status: 'completed' },
    { id: 2, date: '2024-02-12', description: 'Booking #1230 - Central Student Living', amount: 6500, status: 'completed' },
    { id: 3, date: '2024-02-10', description: 'Payout - Bank Transfer', amount: -35000, status: 'pending' },
    { id: 4, date: '2024-02-08', description: 'Booking #1225 - University View Hostel', amount: 17000, status: 'completed' },
    { id: 5, date: '2024-02-05', description: 'Booking #1220 - Green Valley Hostel', amount: 5500, status: 'completed' },
  ];

  // Use Redux data if available, otherwise fall back to mock data
  const earningsData = (earnings && earnings.total_earnings > 0) ? earnings : defaultEarnings;
  const monthlyData = (monthlyEarnings && monthlyEarnings.length > 0) ? monthlyEarnings : defaultMonthlyEarnings;
  const transactionsData = (transactions && transactions.length > 0) ? transactions : defaultTransactions;

  const maxAmount = Math.max(...monthlyData.map(e => e.amount));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleWithdraw = () => {
    if (earningsData.available_balance < 5000) {
      setLocalError('Minimum withdrawal amount is KSh 5,000');
      return;
    }
    dispatch(withdrawFunds({ 
      amount: earningsData.available_balance, 
      payment_method: 'bank_transfer' 
    }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Earnings</h1>
          <p style={styles.subtitle}>Track your income and payouts</p>
        </div>
        <button style={styles.withdrawButton} onClick={handleWithdraw} disabled={withdrawalStatus?.loading}>
          <Banknote size={18} />
          {withdrawalStatus?.loading ? 'Processing...' : 'Withdraw Funds'}
        </button>
      </div>

      {/* Error/Success Messages */}
      {localError && (
        <div style={styles.errorMessage}>{localError}</div>
      )}
      {localSuccess && (
        <div style={styles.successMessage}>{localSuccess}</div>
      )}

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={{ ...styles.statIcon, ...styles.statBlue }}>
              <DollarSign size={24} />
            </div>
            <span style={{ ...styles.trend, ...styles.trendUp }}>
              <ArrowUpRight size={16} />
              +12.5%
            </span>
          </div>
          <span style={styles.statValue}>{formatCurrency(earningsData.total_earnings)}</span>
          <span style={styles.statLabel}>Total Earnings</span>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={{ ...styles.statIcon, ...styles.statOrange }}>
              <Calendar size={24} />
            </div>
          </div>
          <span style={styles.statValue}>{formatCurrency(earningsData.pending_payouts)}</span>
          <span style={styles.statLabel}>Pending Payouts</span>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={{ ...styles.statIcon, ...styles.statGreen }}>
              <CreditCard size={24} />
            </div>
          </div>
          <span style={styles.statValue}>{formatCurrency(earningsData.available_balance)}</span>
          <span style={styles.statLabel}>Available Balance</span>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={{ ...styles.statIcon, ...styles.statPurple }}>
              <DollarSign size={24} />
            </div>
          </div>
          <span style={styles.statValue}>{earningsData.total_bookings}</span>
          <span style={styles.statLabel}>Total Bookings</span>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Earnings Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Earnings Overview</h3>
            <div style={styles.periodButtons}>
              <button
                style={{ ...styles.periodBtn, ...(period === 'week' && styles.periodBtnActive) }}
                onClick={() => setPeriod('week')}
              >
                Week
              </button>
              <button
                style={{ ...styles.periodBtn, ...(period === 'month' && styles.periodBtnActive) }}
                onClick={() => setPeriod('month')}
              >
                Month
              </button>
              <button
                style={{ ...styles.periodBtn, ...(period === 'year' && styles.periodBtnActive) }}
                onClick={() => setPeriod('year')}
              >
                Year
              </button>
            </div>
          </div>

          <div style={styles.chart}>
            <div style={styles.chartBars}>
              {monthlyData.map((item, index) => (
                <div key={index} style={styles.chartBarContainer}>
                  <div
                    style={{
                      ...styles.chartBar,
                      height: `${(item.amount / maxAmount) * 100}%`,
                    }}
                  />
                  <span style={styles.chartBarLabel}>{item.month}</span>
                </div>
              ))}
            </div>
            <div style={styles.chartTotal}>
              <span style={styles.chartTotalLabel}>Total</span>
              <span style={styles.chartTotalValue}>
                {formatCurrency(monthlyData.reduce((acc, e) => acc + e.amount, 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={styles.transactionsCard}>
          <div style={styles.transactionsHeader}>
            <h3 style={styles.transactionsTitle}>Recent Transactions</h3>
            <button style={styles.viewAllBtn}>View All</button>
          </div>

          <div style={styles.transactionsList}>
            {transactionsData.map((transaction) => (
              <div key={transaction.id} style={styles.transactionItem}>
                <div style={styles.transactionInfo}>
                  <span style={styles.transactionDate}>{transaction.date}</span>
                  <span style={styles.transactionDescription}>{transaction.description}</span>
                </div>
                <span style={{
                  ...styles.transactionAmount,
                  ...(transaction.amount > 0 ? styles.amountPositive : styles.amountNegative),
                }}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payout Information */}
      <div style={styles.payoutSection}>
        <div style={styles.payoutCard}>
          <h3 style={styles.payoutTitle}>Payout Method</h3>
          <div style={styles.payoutMethod}>
            <div style={styles.bankIcon}>
              <Banknote size={24} />
            </div>
            <div style={styles.bankInfo}>
              <span style={styles.bankName}>Equity Bank Kenya</span>
              <span style={styles.bankAccount}>Account: ***1234</span>
            </div>
            <button style={styles.changeBtn}>Change</button>
          </div>
        </div>

        <div style={styles.payoutCard}>
          <h3 style={styles.payoutTitle}>Payout Schedule</h3>
          <div style={styles.scheduleInfo}>
            <p style={styles.scheduleText}>Next payout: <strong>February 20, 2024</strong></p>
            <p style={styles.scheduleText}>Frequency: <strong>Weekly</strong></p>
            <p style={styles.scheduleText}>Minimum payout: <strong>KSh 5,000</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '32px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
  },
  withdrawButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  errorMessage: {
    padding: '12px 16px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  successMessage: {
    padding: '12px 16px',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e5e7eb',
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBlue: {
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
  },
  statOrange: {
    backgroundColor: '#fff7ed',
    color: '#ea580c',
  },
  statGreen: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
  },
  statPurple: {
    backgroundColor: '#faf5ff',
    color: '#9333ea',
  },
  trend: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: 600,
  },
  trendUp: {
    color: '#16a34a',
  },
  trendDown: {
    color: '#dc2626',
  },
  statValue: {
    display: 'block',
    fontSize: '28px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    marginBottom: '32px',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '24px',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1e293b',
    margin: 0,
  },
  periodButtons: {
    display: 'flex',
    gap: '8px',
  },
  periodBtn: {
    padding: '6px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#64748b',
    cursor: 'pointer',
  },
  periodBtnActive: {
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
  },
  chart: {
    height: '200px',
  },
  chartBars: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '160px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e5e7eb',
  },
  chartBarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: '40px',
    background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
    borderRadius: '4px 4px 0 0',
    minHeight: '20px',
    transition: 'height 0.3s ease',
  },
  chartBarLabel: {
    marginTop: '8px',
    fontSize: '12px',
    color: '#64748b',
  },
  chartTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
  },
  chartTotalLabel: {
    fontSize: '14px',
    color: '#64748b',
  },
  chartTotalValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1e293b',
  },
  transactionsCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '24px',
  },
  transactionsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  transactionsTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1e293b',
    margin: 0,
  },
  viewAllBtn: {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  transactionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  transactionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid #f1f5f9',
  },
  transactionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  transactionDate: {
    fontSize: '12px',
    color: '#64748b',
  },
  transactionDescription: {
    fontSize: '14px',
    color: '#374151',
  },
  transactionAmount: {
    fontSize: '14px',
    fontWeight: 600,
  },
  amountPositive: {
    color: '#16a34a',
  },
  amountNegative: {
    color: '#dc2626',
  },
  payoutSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
  },
  payoutCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '24px',
  },
  payoutTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1e293b',
    margin: '0 0 16px 0',
  },
  payoutMethod: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  bankIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  bankName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
  },
  bankAccount: {
    fontSize: '13px',
    color: '#64748b',
  },
  changeBtn: {
    padding: '8px 16px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#374151',
    cursor: 'pointer',
  },
  scheduleInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  scheduleText: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
};

export default HostEarnings;
