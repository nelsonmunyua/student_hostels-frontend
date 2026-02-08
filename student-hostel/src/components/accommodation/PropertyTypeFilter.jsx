export default function PropertyTypeFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border px-3 py-2 rounded"
    >
      <option value="">All Types</option>
      <option value="hostel">Hostel</option>
      <option value="bedsitter">Bedsitter</option>
      <option value="apartment">Apartment</option>
    </select>
  );
}
