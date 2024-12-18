// UserPage.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, Typography, Box } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ViewEventLocation from "../event-location/ViewEventLocation";

interface Event {
  id: number;
  name: string;
  is_free: boolean;
  start_time: string;
  end_time: string;
  seats_count: number;
  max_volunteer_count: number;
  event_location_id: string | null;
  payment_link: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const UserPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
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

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("event").select("*");
      if (error) {
        console.error("Error fetching events:", error.message);
      } else {
        setEvents(data as Event[]);
      }
    };

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

    fetchEvents();
    fetchTicketsSold();
  }, []);

  const handleFilterChange = (name: string, value: string | null) => {
    setFilter((prev) => ({ ...prev, [name]: value || "" }));
  };

  const handleHideNotFree = () => {
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

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          Renginiai
        </Typography>
      </Box>

      {/* Wrap the filter and table in a parent container with equal margins */}
      <div style={{ margin: "0 100px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <button
                id="hideFree"
                name="hideFree"
                className={`min-w-max px-2 py-[0.95rem] ${
                  filter.hideNotFree && "bg-gray-100"
                } border rounded hover:bg-gray-200`}
                onClick={handleHideNotFree}
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
              onChange={(e) =>
                handleFilterChange("searchQuery", e.target.value)
              }
            />
          </div>
        </LocalizationProvider>

        <table
          className="min-w-full bg-white border"
          style={{
            width: "100%",
            background: "white",
            borderCollapse: "collapse",
          }}
        >
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
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="py-2 px-4 border hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSort("end_time")}
              >
                Pabaigos Laikas
                {sortConfig?.key === "end_time" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="py-2 px-4 border hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSort("is_free")}
              >
                Ar Mokamas
                {sortConfig?.key === "is_free" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="py-2 px-4 border">
                Laisvų bilietų/vietų skaičius
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
                  {Number.isNaN(event.seats_count) || event.seats_count == null
                    ? 0
                    : event.seats_count - (ticketsSold[event.id] || 0)}
                </td>
                <td className="py-2 px-4 border">
                  {ticketsSold[event.id] === event.seats_count ? (
                    <span style={{ color: "red" }}>Nebėra vietų</span>
                  ) : !event.is_free ? (
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      onClick={() =>
                        (window.location.href = `http://localhost:5173/payment-confirmation?event_id=${event.id}`)
                      }
                    >
                      Dalyvauti
                    </button>
                  ) : event.payment_link ? (
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      onClick={() =>
                        (window.location.href = event.payment_link!)
                      }
                    >
                      Pirkti bilietą
                    </button>
                  ) : (
                    <span style={{ color: "red" }}>
                      Mokėjimo nuoroda nerasta
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {sortedEvents.length === 0 && (
              <tr>
                <td colSpan={7} className="py-2 px-4 border text-center">
                  Nerasta renginių.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserPage;
