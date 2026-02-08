export default function Bookings() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Bookings</h2>

      <div className="bg-white p-4 rounded shadow space-y-3">
        <div className="flex justify-between">
          <span>Room A – Green Hostel</span>
          <span className="text-blue-600">Confirmed</span>
        </div>

        <div className="flex justify-between">
          <span>Room C – Blue Apartments</span>
          <span className="text-yellow-600">Pending</span>
        </div>
      </div>
    </div>
  );
}
