// EventTable.tsx
import { Event } from "./types";

interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
}

const EventTable = ({ events, onEdit, onDelete }: EventTableProps) => {
  return (
    <table className="min-w-full bg-white border">
      <thead>
        <tr>
          <th className="py-2 px-4 border">ID</th>
          <th className="py-2 px-4 border">Data</th>
          <th className="py-2 px-4 border">Pradžios Laikas</th>
          <th className="py-2 px-4 border">Pabaigos Laikas</th>
          <th className="py-2 px-4 border">Ar Mokamas</th>
          <th className="py-2 px-4 border">Vietų skaičius</th>
          <th className="py-2 px-4 border">Vietovės ID</th>
          <th className="py-2 px-4 border">Max Savanorių</th>
          <th className="py-2 px-4 border">Veiksmai</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event.id} className="text-center">
            <td className="py-2 px-4 border">{event.id}</td>
            <td className="py-2 px-4 border text-nowrap">{event.date}</td>
            <td className="py-2 px-4 border">{event.start_time}</td>
            <td className="py-2 px-4 border">{event.end_time}</td>
            <td className="py-2 px-4 border">
              {event.is_free ? "Taip" : "Ne"}
            </td>
            <td className="py-2 px-4 border">{event.seats_count}</td>
            <td className="py-2 px-4 border">
              {event.event_location_id ?? "Nuotoliniu"}
            </td>
            <td className="py-2 px-4 border">{event.max_volunteer_count}</td>
            <td className="py-2 px-4 border">
              <div className="flex">
                <button
                  onClick={() => onEdit(event)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded-l-lg  hover:bg-yellow-600"
                >
                  Redaguoti
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-r-lg hover:bg-red-600"
                >
                  Pašalinti
                </button>
              </div>
            </td>
          </tr>
        ))}
        {events.length === 0 && (
          <tr>
            <td
              colSpan={9}
              className="py-2 px-4 border text-center text-gray-500"
            >
              No events found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default EventTable;
