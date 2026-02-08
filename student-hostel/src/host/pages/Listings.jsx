export default function Listings() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Listings</h2>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Location</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3">Green Hostel</td>
              <td className="p-3">Nairobi</td>
              <td className="p-3">KES 8,000</td>
              <td className="p-3 text-green-600">Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
