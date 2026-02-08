const amenities = ["WiFi", "Parking", "Water", "Electricity", "Security"];

export default function AmenitySelector({ selected, onChange }) {
  return (
    <div className="space-y-2">
      {amenities.map((item) => (
        <label key={item} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected.includes(item)}
            onChange={() => onChange(item)}
          />
          {item}
        </label>
      ))}
    </div>
  );
}
