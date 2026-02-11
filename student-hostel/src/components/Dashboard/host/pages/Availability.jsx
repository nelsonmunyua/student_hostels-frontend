import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Save,
  Check,
  X,
} from "lucide-react";
import {
  fetchAccommodationAvailability,
  updateAccommodation,
} from "../../../../redux/slices/Thunks/accommodationThunks";

const HostAvailability = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentAccommodation, loading, error } = useSelector(
    (state) => state.accommodation,
  );

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [pricing, setPricing] = useState({
    basePrice: 8500,
    weekendPrice: 9500,
    seasonalPrice: 10000,
  });
  const [minStay, setMinStay] = useState(1);
  const [maxStay, setMaxStay] = useState(30);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch availability on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchAccommodationAvailability({ id }));
    }
  }, [dispatch, id]);

  // Mock listing info - use real data from Redux when available
  const listing = currentAccommodation || {
    name: currentAccommodation?.name || "University View Hostel",
    price: currentAccommodation?.price_per_night || 8500,
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const formatDate = (year, month, day) => {
    const date = new Date(year, month, day);
    return date.toISOString().split("T")[0];
  };

  const handleDateToggle = (dateStr) => {
    setAvailability((prev) => ({
      ...prev,
      [dateStr]: !prev[dateStr],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save availability to backend via Redux
      await dispatch(
        updateAccommodation({
          id,
          data: {
            availability,
            pricing: {
              base_price: pricing.basePrice,
              weekend_price: pricing.weekendPrice,
              seasonal_price: pricing.seasonalPrice,
            },
            min_stay: minStay,
            max_stay: maxStay,
          },
        }),
      );
      alert("Availability settings saved successfully!");
    } catch (error) {
      console.error("Error saving availability:", error);
      alert("Failed to save availability settings");
    } finally {
      setIsSaving(false);
    }
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Availability Management</h1>
          <p style={styles.subtitle}>{listing.name}</p>
        </div>
        <button style={styles.saveButton} onClick={handleSave}>
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.calendarSection}>
          {/* Calendar */}
          <div style={styles.calendarCard}>
            <div style={styles.calendarHeader}>
              <button onClick={previousMonth} style={styles.navButton}>
                <ChevronLeft size={20} />
              </button>
              <div style={styles.calendarTitle}>
                <Calendar size={20} />
                <span>
                  {monthName} {year}
                </span>
              </div>
              <button onClick={nextMonth} style={styles.navButton}>
                <ChevronRight size={20} />
              </button>
            </div>

            <div style={styles.weekDays}>
              {weekDays.map((day) => (
                <div key={day} style={styles.weekDay}>
                  {day}
                </div>
              ))}
            </div>

            <div style={styles.daysGrid}>
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} style={styles.emptyDay} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dateStr = formatDate(year, currentMonth.getMonth(), day);
                const isUnavailable = availability[dateStr] === false;
                const date = new Date(year, currentMonth.getMonth(), day);
                const isPast = date < new Date().setHours(0, 0, 0, 0);

                return (
                  <button
                    key={day}
                    onClick={() => !isPast && handleDateToggle(dateStr)}
                    disabled={isPast}
                    style={{
                      ...styles.day,
                      ...(isPast && styles.dayPast),
                      ...(!isPast && isUnavailable && styles.dayUnavailable),
                      ...(!isPast && !isUnavailable && styles.dayAvailable),
                    }}
                  >
                    <span style={styles.dayNumber}>{day}</span>
                    {!isPast && (
                      <span style={styles.dayStatus}>
                        {isUnavailable ? <X size={12} /> : <Check size={12} />}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={styles.legend}>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendBox, ...styles.dayAvailable }} />
                <span>Available</span>
              </div>
              <div style={styles.legendItem}>
                <div
                  style={{ ...styles.legendBox, ...styles.dayUnavailable }}
                />
                <span>Unavailable</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendBox, ...styles.dayPast }} />
                <span>Past</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.settingsSection}>
          {/* Quick Actions */}
          <div style={styles.settingsCard}>
            <h3 style={styles.cardTitle}>Quick Actions</h3>
            <div style={styles.actionButtons}>
              <button
                style={styles.actionBtn}
                onClick={() => {
                  // Mark all dates as available
                  const newAvailability = { ...availability };
                  Object.keys(newAvailability).forEach((key) => {
                    newAvailability[key] = true;
                  });
                  setAvailability(newAvailability);
                }}
              >
                <Check size={18} />
                Mark All Available
              </button>
              <button
                style={styles.actionBtn}
                onClick={() => {
                  // Set range unavailable (example: next 7 days)
                  const newAvailability = { ...availability };
                  for (let i = 0; i < 7; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const dateStr = date.toISOString().split("T")[0];
                    newAvailability[dateStr] = false;
                  }
                  setAvailability(newAvailability);
                }}
              >
                <X size={18} />
                Block Next 7 Days
              </button>
            </div>
          </div>

          {/* Pricing Settings */}
          <div style={styles.settingsCard}>
            <h3 style={styles.cardTitle}>Pricing</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Base Price (KSh/night)</label>
              <input
                type="number"
                value={pricing.basePrice}
                onChange={(e) =>
                  setPricing({
                    ...pricing,
                    basePrice: parseInt(e.target.value),
                  })
                }
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Weekend Price (KSh/night)</label>
              <input
                type="number"
                value={pricing.weekendPrice}
                onChange={(e) =>
                  setPricing({
                    ...pricing,
                    weekendPrice: parseInt(e.target.value),
                  })
                }
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Seasonal Price (KSh/night)</label>
              <input
                type="number"
                value={pricing.seasonalPrice}
                onChange={(e) =>
                  setPricing({
                    ...pricing,
                    seasonalPrice: parseInt(e.target.value),
                  })
                }
                style={styles.input}
              />
            </div>
          </div>

          {/* Stay Settings */}
          <div style={styles.settingsCard}>
            <h3 style={styles.cardTitle}>Stay Requirements</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Min. Nights</label>
                <input
                  type="number"
                  value={minStay}
                  onChange={(e) => setMinStay(parseInt(e.target.value))}
                  min="1"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Max. Nights</label>
                <input
                  type="number"
                  value={maxStay}
                  onChange={(e) => setMaxStay(parseInt(e.target.value))}
                  min="1"
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Current Stats */}
          <div style={styles.settingsCard}>
            <h3 style={styles.cardTitle}>Availability Summary</h3>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <span style={styles.statValue}>365</span>
                <span style={styles.statLabel}>Total Days</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statValue}>
                  {365 -
                    Object.values(availability).filter((v) => v === false)
                      .length}
                </span>
                <span style={styles.statLabel}>Available</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statValue}>
                  {
                    Object.values(availability).filter((v) => v === false)
                      .length
                  }
                </span>
                <span style={styles.statLabel}>Blocked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "32px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
  },
  saveButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    backgroundColor: "#059669",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "32px",
  },
  calendarSection: {},
  calendarCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "24px",
  },
  calendarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  calendarTitle: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "18px",
    fontWeight: 600,
    color: "#1e293b",
  },
  navButton: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
  },
  weekDays: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
    marginBottom: "8px",
  },
  weekDay: {
    textAlign: "center",
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
    padding: "12px 0",
  },
  daysGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
  },
  emptyDay: {
    padding: "12px",
  },
  day: {
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "none",
    backgroundColor: "#f8fafc",
  },
  dayPast: {
    backgroundColor: "#f1f5f9",
    color: "#94a3b8",
    cursor: "not-allowed",
  },
  dayAvailable: {
    backgroundColor: "#ecfdf5",
    color: "#059669",
  },
  dayUnavailable: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
  },
  dayNumber: {
    fontSize: "14px",
    fontWeight: 500,
  },
  dayStatus: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    display: "flex",
    gap: "24px",
    marginTop: "24px",
    paddingTop: "24px",
    borderTop: "1px solid #e5e7eb",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#64748b",
  },
  legendBox: {
    width: "20px",
    height: "20px",
    borderRadius: "4px",
  },
  settingsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "24px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: "20px",
  },
  actionButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  formGroup: {
    marginBottom: "16px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    color: "#374151",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  statItem: {
    textAlign: "center",
  },
  statValue: {
    display: "block",
    fontSize: "24px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#64748b",
  },
};

export default HostAvailability;
