export default function AccommodationCard({ accommodation }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h3 className="font-semibold text-lg">{accommodation.title}</h3>
      <p className="text-sm text-gray-600">{accommodation.location}</p>
      <p className="text-sm font-medium mt-2">
        KES {accommodation.price} / night
      </p>
    </div>
  );
}
