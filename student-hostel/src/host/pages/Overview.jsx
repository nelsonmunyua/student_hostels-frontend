export default function Overview() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Total Listings</p>
          <p className="text-2xl font-semibold">12</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Active Bookings</p>
          <p className="text-2xl font-semibold">5</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Monthly Earnings</p>
          <p className="text-2xl font-semibold">KES 45,000</p>
        </div>
      </div>
    </div>
  );
}
