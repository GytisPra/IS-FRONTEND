import { useEffect, useState } from "react";
import { Event } from "./types";
import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import ViewEventLocation from "../event-location/ViewEventLocation";
import { supabase } from "../userService";

interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
}

const EventTable = ({ events, onEdit, onDelete }: EventTableProps) => {
  const [ticketsSold, setTicketsSold] = useState<Record<number, number>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [filter, setFilter] = useState<{
    startDate: string;
    endDate: string;
    hideNotFree: boolean;
    searchQuery: string;
  }>({
    startDate: "",
    endDate: "",
    hideNotFree: false,
    searchQuery: "",
  });

  const handleFilterChange = (name: string, value: string | null) => {
    setFilter((prev) => ({ ...prev, [name]: value || "" }));
  };

  const handlehideNotFree = () => {
    setFilter((prev) => ({ ...prev, hideNotFree: !prev.hideNotFree }));
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.start_time);
    const startDate = filter.startDate ? new Date(filter.startDate) : null;
    const endDate = filter.endDate ? new Date(filter.endDate) : null;

    if (filter.hideNotFree && event.is_free) {
      return false;
    }
    if (startDate && eventDate < startDate) {
      return false;
    }
    if (endDate && eventDate > endDate) {
      return false;
    }
    if (
      filter.searchQuery &&
      !event.name.toLowerCase().includes(filter.searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const sortedEvents = [...filteredEvents];
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
  useEffect(() => {
    const fetchTicketsSold = async () => {
      const { data, error } = await supabase
        .from("ticket") // Replace 'tickets' with your actual table name
        .select("event_id"); // Only select event_id column

      if (error) {
        console.error("Error fetching tickets:", error.message);
        return;
      }

      // Process the data into a record { event_id: count }
      const ticketCounts: Record<number, number> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.forEach((ticket: any) => {
        const eventId = ticket.event_id;
        ticketCounts[eventId] = (ticketCounts[eventId] || 0) + 1; // Count tickets per event
      });

      setTicketsSold(ticketCounts);
    };
    fetchTicketsSold();
  }, []);
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex space-x-4 mb-4">
          <div>
            <button
              id="hideFree"
              name="hideFree"
              className={`min-w-max px-2 py-[0.95rem] ${
                filter.hideNotFree && "bg-gray-100"
              } border rounded hover:bg-gray-200`}
              onClick={handlehideNotFree}
            >
              {filter.hideNotFree ? "Rodyti mokamus" : "Paslėpti mokamus"}
            </button>
          </div>
          <div>
            <DatePicker
              label="Nuo datos"
              value={filter.startDate ? dayjs(filter.startDate) : null}
              onChange={(date) =>
                handleFilterChange(
                  "startDate",
                  date ? date.format("YYYY-MM-DD") : null
                )
              }
              slotProps={{ textField: { id: "startDate" } }}
            />
          </div>
          <div>
            <DatePicker
              label="Iki datos"
              value={filter.endDate ? dayjs(filter.endDate) : null}
              onChange={(date) =>
                handleFilterChange(
                  "endDate",
                  date ? date.format("YYYY-MM-DD") : null
                )
              }
              slotProps={{ textField: { id: "endDate" } }}
            />
          </div>
          <TextField
            className="pr-2 border rounded"
            name="searchQuery"
            label="Ieškoti renginio &#x1F50E;&#xFE0E;"
            value={filter.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
          />
        </div>
      </LocalizationProvider>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Pavadinimas</th>
            <th className="py-2 px-4 border">Vietovė</th>
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
            <th className="py-2 px-4 border">Dalyvių skaičius</th>
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
              <td className="py-2 px-4 border">{event.name}</td>
              <td className="py-2 px-4 border">
                {event.event_location_id ? (
                  <ViewEventLocation
                    eventLocationId={event.event_location_id}
                    disable={false}
                  />
                ) : (
                  "Nuotoliniu"
                )}
              </td>
              <td className="py-2 px-4 border">
                {dayjs(event.start_time).format("YYYY-MM-DD, HH:mm:ss")}
              </td>
              <td className="py-2 px-4 border">
                {dayjs(event.end_time).format("YYYY-MM-DD, HH:mm:ss")}
              </td>
              <td className="py-2 px-4 border">
                {event.is_free ? "Taip" : "Ne"}
              </td>
              <td className="py-2 px-4 border">
                {!ticketsSold[event.id] ? 0 : ticketsSold[event.id]}
              </td>
              <td className="py-2 px-4 border">{event.max_volunteer_count}</td>
              <td className="py-2 px-4 border">
                <div className="flex items-center justify-center">
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
              <td colSpan={9} className="py-2 px-4 border text-center">
                Nerasta renginių.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default EventTable;
