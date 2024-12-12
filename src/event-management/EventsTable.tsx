// EventTable.tsx
import { useState } from "react";
import { Event } from "./types";

interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
}

const EventTable = ({ events, onEdit, onDelete }: EventTableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const sortedEvents = [...events];
  if (sortConfig !== null) {
    sortedEvents.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Vietovės ID</th>
            <th
              className="py-2 px-4 border hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSort("date")}
            >
              Data
              {sortConfig?.key === "date" &&
                (sortConfig.direction === "asc" ? "\u2191" : "\u2193")}
            </th>
            <th
              className="py-2 px-4 border hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSort("start_time")}
            >
              Pradžios Laikas
              {sortConfig?.key === "start_time" &&
                (sortConfig.direction === "asc" ? "\u2191" : "\u2193")}
            </th>
            <th
              className="py-2 px-4 border hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSort("end_time")}
            >
              Pabaigos Laikas
              {sortConfig?.key === "end_time" &&
                (sortConfig.direction === "asc" ? "\u2191" : "\u2193")}
            </th>
            <th
              className="py-2 px-4 border hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSort("is_free")}
            >
              Ar Mokamas
              {sortConfig?.key === "is_free" &&
                (sortConfig.direction === "asc" ? "\u2191" : "\u2193")}
            </th>
            <th
              className="py-2 px-4 border hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSort("seats_count")}
            >
              Vietų Skaičius
              {sortConfig?.key === "seats_count" &&
                (sortConfig.direction === "asc" ? "\u2191" : "\u2193")}
            </th>
            <th
              className="py-2 px-4 border hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSort("max_volunteer_count")}
            >
              Max Savanorių
              {sortConfig?.key === "max_volunteer_count" &&
                (sortConfig.direction === "asc" ? "\u2191" : "\u2193")}
            </th>
            <th className="py-2 px-4 border">Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {sortedEvents.map((event) => (
            <tr key={event.id} className="text-center">
              <td className="py-2 px-4 border">{event.id}</td>
              <td className="py-2 px-4 border">
                {event.event_location_id ?? "Nuotoliniu"}
              </td>
              <td className="py-2 px-4 border text-nowrap">{event.date}</td>
              <td className="py-2 px-4 border">{event.start_time}</td>
              <td className="py-2 px-4 border">{event.end_time}</td>
              <td className="py-2 px-4 border">
                {event.is_free ? "Taip" : "Ne"}
              </td>
              <td className="py-2 px-4 border">{event.seats_count}</td>
              <td className="py-2 px-4 border">{event.max_volunteer_count}</td>
              <td className="py-2 px-4 border">
                <div className="flex">
                  <button
                    onClick={() => onEdit(event)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded-l-lg hover:bg-yellow-600"
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
          {sortedEvents.length === 0 && (
            <tr>
              <td
                colSpan={9}
                className="py-2 px-4 border text-center text-gray-200"
              >
                No events found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default EventTable;
