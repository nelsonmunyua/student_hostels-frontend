export default function AccommodationForm() {
  return (
    <form className="space-y-4 max-w-xl">
      <h2 className="text-xl font-semibold">Create / Edit Listing</h2>

      <input
        type="text"
        placeholder="Title"
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="number"
        placeholder="Price per night"
        className="w-full border px-3 py-2 rounded"
      />

      <textarea
        placeholder="Description"
        className="w-full border px-3 py-2 rounded"
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
}
