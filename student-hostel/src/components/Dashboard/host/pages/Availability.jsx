import { useState, useEffect } from "react";
import { AlertCircle, Calendar, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import hostApi from "../../../../api/hostApi";

const HostAvailability = () => {
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hostApi.getAvailability();
      setHostels(data.hostels || []);
      if (data.hostels && data.hostels.length > 0) {
        setSelectedHostel(data.hostels[0]);
      }
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      setError(error.response?.data?.message || "Failed to load availability");
      // Use mock data if API fails
      setHostels([
        {
          id: 1,
          name: "University View Hostel",
          location: "Near Main Campus",
          rooms: [
            { id: 101, room_type: "Single", price: 8000, is_available: true },
            { id: 102, room_type: "Double", price: 6000, is_available: true },
            { id: 103, room_type: "Studio", price: 10000, is_available: false },
          ]
        },
        {
          id: 2,
          name: "Central Student Living",
          location: "City Center",
          rooms: [
            { id: 201, room_type: "Single", price: 8500, is_available: true },
            { id: 202, room_type: "Bed Sitter", price: 7000, is_available: true },
          ]
        }
      ]);
      setSelectedHostel({
        id: 1,
        name: "University View Hostel",
        location: "Near Main Campus",
        rooms: [
          { id: 101, room_type: "Single", price: 8000, is_available: true },
          { id: 102, room_type: "Double", price: 6000, is_available: true },
          { id: 103, room_type: "Studio", price: 10000, is_available: false },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (roomId, currentStatus) => {
    try {
      setUpdating(true);
      const newStatus = !currentStatus;
      await hostApi.updateAvailability(roomId, new Date().toISOString().split('T')[0], newStatus);
      
      // Update local state
      setHostels(prev => prev.map(h => {
        if (h.id === selectedHostel.id) {
          return {
            ...h,
            rooms: h.rooms.map(r => 
              r.id === roomId ? { ...r, is_available: newStatus } : r
            )
          };
        }
        return h;
      }));
      
      setSelectedHostel(prev => ({
        ...prev,
        rooms: prev.rooms.map(r => 
          r.id === roomId ? { ...r, is_available: newStatus } : r
        )
      }));
    } catch (error) {
      console.error("Failed to update availability:", error);
      alert("Failed to update availability. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const formatDate = (date) => date.toISOString().split('T')[0];

  const isDateAvailable = (room, date) => {
    // Simplified logic: room is available if is_available is true
    return room.is_available;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <p>Loading availability...</p>
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
            onClick={() => fetchAvailability()}
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
          <h1 style={styles.title}>Availability Calendar</h1>
          <p style={styles.subtitle}>Manage your room availability and bookings</p>
        </div>
      </div>

      {/* Hostel Selector */}
      {hostels.length > 1 && (
        <div style={styles.hostelSelector}>
          <label style={styles.selectorLabel}>Select Property:</label>
          <select
            style={styles.selector}
            value={selectedHostel?.id || ""}
            onChange={(e) => {
              const hostel = hostels.find(h => h.id === parseInt(e.target.value));
              setSelectedHostel(hostel);
            }}
          >
            {hostels.map(hostel => (
              <option key={hostel.id} value={hostel.id}>
                {hostel.name} - {hostel.location}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedHostel ? (
        <>
          {/* Selected Hostel Info */}
          <div style={styles.hostelInfo}>
            <h2 style={styles.hostelName}>{selectedHostel.name}</h2>
            <p style={styles.hostelLocation}>📍 {selectedHostel.location}</p>
          </div>

          {/* Rooms Overview */}
          <div style={styles.roomsSection}>
            <h3 style={styles.sectionTitle}>Your Rooms</h3>
            <div style={styles.roomsGrid}>
              {selectedHostel.rooms.map(room => (
                <div key={room.id} style={styles.roomCard}>
                  <div style={styles.roomHeader}>
                    <span style={styles.roomType}>{room.room_type}</span>
                    <span style={{
                      ...styles.availabilityBadge,
                      backgroundColor: room.is_available ? '#dcfce7' : '#fee2e2',
                      color: room.is_available ? '#16a34a' : '#dc2626',
                    }}>
                      {room.is_available ? 'Available' : 'Booked'}
                    </span>
                  </div>
                  <div style={styles.roomDetails}>
                    <span style={styles.roomPrice}>KES {room.price.toLocaleString()}/month</span>
                    <span style={styles.roomId}>Room {room.id}</span>
                  </div>
                  <button
                    style={{
                      ...styles.toggleButton,
                      opacity: updating ? 0.5 : 1,
                    }}
                    onClick={() => handleToggleAvailability(room.id, room.is_available)}
                    disabled={updating}
                  >
                    {room.is_available ? (
                      <>
                        <XCircle size={16} style={{ marginRight: '8px' }} />
                        Mark as Unavailable
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} style={{ marginRight: '8px' }} />
                        Mark as Available
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div style={styles.calendarSection}>
            <div style={styles.calendarHeader}>
              <button 
                style={styles.calendarNav}
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              >
                <ChevronLeft size={20} />
              </button>
              <h3 style={styles.calendarTitle}>
                <Calendar size={20} style={{ marginRight: '8px' }} />
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button 
                style={styles.calendarNav}
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div style={styles.calendarGrid}>
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={styles.dayHeader}>{day}</div>
              ))}

              {/* Calendar days */}
              {getDaysInMonth(currentMonth).map((date, index) => {
                const dateStr = formatDate(date);
                const isToday = dateStr === formatDate(new Date());
                
                return (
                  <div 
                    key={dateStr} 
                    style={{
                      ...styles.calendarDay,
                      backgroundColor: isToday ? '#f0f9ff' : '#ffffff',
                      borderColor: isToday ? '#0369a1' : '#e5e7eb',
                    }}
                  >
                    <span style={styles.dayNumber}>{date.getDate()}</span>
                    <div style={styles.dayRooms}>
                      {selectedHostel.rooms.slice(0, 3).map(room => (
                        <div
                          key={room.id}
                          style={{
                            ...styles.dayRoomDot,
                            backgroundColor: isDateAvailable(room, date) ? '#16a34a' : '#dc2626',
                          }}
                          title={`Room ${room.id}: ${room.room_type}`}
                        />
                      ))}
                      {selectedHostel.rooms.length > 3 && (
                        <span style={styles.moreRooms}>+{selectedHostel.rooms.length - 3}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div style={styles.legend}>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendDot, backgroundColor: '#16a34a' }} />
              <span>Available</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendDot, backgroundColor: '#dc2626' }} />
              <span>Booked/Unavailable</span>
            </div>
          </div>
        </>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🏠</div>
          <h3 style={styles.emptyTitle}>No Properties Found</h3>
          <p style={styles.emptyText}>
            You don&apos;t have any properties yet. Add your first property to manage availability.
          </p>
        </div>
      )}

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
  hostelSelector: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
    padding: "16px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  selectorLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  },
  selector: {
    flex: 1,
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#374151",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },
  hostelInfo: {
    marginBottom: "24px",
  },
  hostelName: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: "0 0 8px 0",
  },
  hostelLocation: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  roomsSection: {
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "16px",
  },
  roomsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  },
  roomCard: {
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  roomHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  roomType: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a1a1a",
    textTransform: "capitalize",
  },
  availabilityBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
  },
  roomDetails: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  roomPrice: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#16a34a",
  },
  roomId: {
    fontSize: "14px",
    color: "#6b7280",
  },
  toggleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "10px",
    backgroundColor: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  calendarSection: {
    backgroundColor: "#ffffff",
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
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: 0,
  },
  calendarNav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    backgroundColor: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#374151",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
  },
  dayHeader: {
    padding: "8px",
    textAlign: "center",
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  calendarDay: {
    minHeight: "60px",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid",
  },
  dayNumber: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "4px",
  },
  dayRooms: {
    display: "flex",
    gap: "2px",
    flexWrap: "wrap",
  },
  dayRoomDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  moreRooms: {
    fontSize: "10px",
    color: "#6b7280",
  },
  legend: {
    display: "flex",
    gap: "24px",
    marginTop: "24px",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#6b7280",
  },
  legendDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  emptyText: {
    fontSize: "14px",
    color: "#6b7280",
  },
};

export default HostAvailability;

export default HostAvailability;
