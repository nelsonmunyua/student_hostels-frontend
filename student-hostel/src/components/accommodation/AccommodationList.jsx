import AccommodationCard from "./AccommodationCard";

export default function AccommodationList({ data }) {
  if (!data?.length) return <p>No accommodations found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data.map((item) => (
        <AccommodationCard key={item.id} accommodation={item} />
      ))}
    </div>
  );
}
