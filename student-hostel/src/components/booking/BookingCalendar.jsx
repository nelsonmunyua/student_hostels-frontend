import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const BookingCalendar = ({ accommodationId, onDateSelect, selectedDates }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCheckIn, setSelectedCheckIn] = useState(selectedDates?.checkIn || null);
  const [selectedCheckOut, setSelectedCheckOut] = useState(selectedDates?.checkOut || null);
  const [unavailableDates, setUnavailableDates] = useState([]);

  useEffect(() => {
    // Fetch unavailable dates from API
    // This would call accommodationApi.getAvailability()
    // For now, using mock data
    setUnavailableDates([]);
  }, [accommodationId, currentMonth]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    // Don't allow past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (clickedDate < today) return;

    // Don't allow unavailable dates
    if (isDateUnavailable(clickedDate)) return;

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      // First click or reset
      setSelectedCheckIn(clickedDate);
      setSelectedCheckOut(null);
      onDateSelect({ checkIn: clickedDate, checkOut: null });
    } else {
      // Second click - set check-out
      if (clickedDate <= selectedCheckIn) {
        // If clicked date is before check-in, reset
        setSelectedCheckIn(clickedDate);
        setSelectedCheckOut(null);
        onDateSelect({ checkIn: clickedDate, checkOut: null });
      } else {
        setSelectedCheckOut(clickedDate);
        onDateSelect({ checkIn: selectedCheckIn, checkOut: clickedDate });
      }
    }
  };

  const isDateUnavailable = (date) => {
    return unavailableDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
  };

  const isDateInRange = (day) => {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date > selectedCheckIn && date < selectedCheckOut;
  };

  const isDateSelected = (day) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return (
      date.toDateString() === selectedCheckIn?.toDateString() ||
      date.toDateString() === selectedCheckOut?.toDateString()
    );
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <Calendar size={20} />
          <span>Select Dates</span>
        </div>
        <div style={styles.selectedDates}>
          {selectedCheckIn && (
            <span style={styles.dateText}>
              Check-in: {selectedCheckIn.toLocaleDateString()}
            </span>
          )}
          {selectedCheckOut && (
            <span style={styles.dateText}>
              Check-out: {selectedCheckOut.toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div style={styles.calendar}>
        <div style={styles.calendarHeader}>
          <button onClick={previousMonth} style={styles.navButton}>
            <ChevronLeft size={20} />
          </button>
          <span style={styles.monthYear}>
            {monthName} {year}
          </span>
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
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} style={styles.emptyDay} />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const date = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              day
            );
            const isPast = date < new Date().setHours(0, 0, 0, 0);
            const isUnavailable = isDateUnavailable(date);
            const isSelected = isDateSelected(day);
            const isInRange = isDateInRange(day);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={isPast || isUnavailable}
                style={{
                  ...styles.day,
                  ...(isPast && styles.dayPast),
                  ...(isUnavailable && styles.dayUnavailable),
                  ...(isSelected && styles.daySelected),
                  ...(isInRange && styles.dayInRange),
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendBox, ...styles.daySelected }} />
          <span>Selected</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendBox, ...styles.dayInRange }} />
          <span>In Range</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendBox, ...styles.dayUnavailable }} />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '24px',
  },
  header: {
    marginBottom: '24px',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px',
    fontWeight: 600,
    color: '#1a1a1a',
    marginBottom: '12px',
  },
  selectedDates: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  dateText: {
    fontSize: '14px',
    color: '#6b7280',
  },
  calendar: {
    width: '100%',
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  monthYear: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  navButton: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  weekDays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    marginBottom: '8px',
  },
  weekDay: {
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 600,
    color: '#6b7280',
    padding: '8px 0',
  },
  daysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  },
  emptyDay: {
    padding: '12px',
  },
  day: {
    padding: '12px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#1a1a1a',
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  dayPast: {
    color: '#d1d5db',
    cursor: 'not-allowed',
    backgroundColor: '#f9fafb',
  },
  dayUnavailable: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    cursor: 'not-allowed',
  },
  daySelected: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    borderColor: '#3b82f6',
  },
  dayInRange: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
  },
  legend: {
    display: 'flex',
    gap: '16px',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#6b7280',
  },
  legendBox: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    border: '1px solid #e5e7eb',
  },
};

export default BookingCalendar;