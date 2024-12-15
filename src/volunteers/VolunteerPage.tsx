import React, { useState, useEffect, useCallback } from "react";
import { Event, VolunteerApplication } from "./objects/types";
import {
  fetchEvents,
  fetchVolunteerApplications,
  submitVolunteerApplication,
  declineVolunteerApplication,
} from "./services/volunteerActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import FormModal from "../organizers/formModal";
import { user } from "./objects/user";

const VolunteersPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [loadingApplications, setLoadingApplications] = useState<boolean>(true);
  const [applyingEventId, setApplyingEventId] = useState<string | null>(null);
  const [decliningApplicationId, setDecliningApplicationId] = useState<string | null>(null);
  const [removedEvents, setRemovedEvents] = useState<Record<string, Event>>({});
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    searchTerm: "", 
  });

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      setLoadingEvents(true);

      const { data: eventsData, error: eventsError } = await fetchEvents();

      if (eventsError) {
        throw new Error(`Klaida kraunant renginius: ${eventsError}`);
      }
      setEvents(eventsData || []);
      setLoadingEvents(false);

      setLoadingApplications(true);
      const { data: applicationsData, error: applicationsError } =
        await fetchVolunteerApplications(user.id);
      if (applicationsError) {
        throw new Error(`Įvyko klaida kraunant aplikacijas: ${applicationsError}`);
      }

      if (applicationsData) {
        applicationsData.forEach((app) => {
          if (eventsData) {
            const event = eventsData.find((e) => e.id === app.event_id);
            app.form_url = event?.form_url || undefined;
          }
        });
      }

      setApplications(applicationsData || []);
      setLoadingApplications(false);

      const appliedEventIds = applicationsData!.map((app) => app.event_id);
      const newRemovedEvents: Record<string, Event> = {};

      const updatedEvents =
        eventsData?.filter((event) => {
          if (appliedEventIds.includes(event.id)) {
            newRemovedEvents[event.id] = event;
            return false;
          }
          return true;
        }) || [];

      setEvents(updatedEvents);
      setRemovedEvents(newRemovedEvents);
    } catch (err: any) {
      toast.error(err.message || "Įvyko netikėta klaida.");
      setLoadingEvents(false);
      setLoadingApplications(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const handleApply = async (eventId: string) => {
    if (!user) {
      toast.error("Jūs privalote būti prisijungęs, kad aplikuoti savanorystei.");
      return;
    }

    const existingApplication = applications.find((app) => app.event_id === eventId);
    if (existingApplication) {
      toast.error("Jūs jau pateikėte savanorystės aplikaciją šiam renginiui.");
      return;
    }

    setApplyingEventId(eventId);

    const eventToApply = events.find((e) => e.id === eventId);
    if (!eventToApply) {
      toast.error("Renginys nerastas.");
      setApplyingEventId(null);
      return;
    }

    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    setRemovedEvents((prev) => ({ ...prev, [eventId]: eventToApply }));

    try {
      const { data, error } = await submitVolunteerApplication(eventId, user.id);

      if (error) {
        throw new Error(error);
      }

      toast.success("Prašymas pateiktas sėkmingai!");
      await fetchData();
    } catch (err: any) {
      toast.error(err.message || "Įvyko netikėta klaida.");

      setEvents((prev) => [eventToApply, ...prev]);
      setRemovedEvents((prev) => {
        const updated = { ...prev };
        delete updated[eventId];
        return updated;
      });
    } finally {
      setApplyingEventId(null);
    }
  };

  const handleDecline = async (applicationId: string) => {
    const applicationToDecline = applications.find((app) => app.id === applicationId);

    if (!applicationToDecline) {
      toast.error("Aplikacija nerasta.");
      return;
    }

    const { event_id } = applicationToDecline;

    setDecliningApplicationId(applicationId);

    const eventData = removedEvents[event_id];
    if (!eventData) {
      toast.error("Renginio duomenys nerasti.");
      setDecliningApplicationId(null);
      return;
    }

    setApplications((prev) => prev.filter((app) => app.id !== applicationId));
    setEvents((prev) => [eventData, ...prev]);
    setRemovedEvents((prev) => {
      const updated = { ...prev };
      delete updated[event_id];
      return updated;
    });

    try {
      const { data, error } = await declineVolunteerApplication(applicationId);

      if (error) {
        throw new Error(error);
      }

      toast.success("Aplikacija atmesta sėkmingai!");
      await fetchData();
    } catch (err: any) {
      toast.error(err.message || "Įvyko netikėta klaida.");

      setApplications((prev) => [applicationToDecline, ...prev]);
      setEvents((prev) => prev.filter((event) => event.id !== event_id));
      setRemovedEvents((prev) => ({ ...prev, [event_id]: eventData }));
    } finally {
      setDecliningApplicationId(null);
    }
  };

  const getApplicationStatus = (eventId: string): string | null => {
    const application = applications.find((app) => app.event_id === eventId);
    return application ? application.status : null;
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilters((prev) => ({ ...prev, searchTerm: value }));
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    const searchTerm = filters.searchTerm.trim().toLowerCase();

    if (startDate && eventDate < startDate) {
      return false;
    }
    if (endDate && eventDate > endDate) {
      return false;
    }
    if (searchTerm && !event.name.toLowerCase().includes(searchTerm)) {
      return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto p-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <h1 className="text-2xl font-bold mb-4">Savanorystės aplikacija</h1>

      <div className="flex flex-wrap space-x-4 mb-4">
        <div className="mb-2">
          <label htmlFor="startDate" className="block mb-1">
            Nuo datos
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="endDate" className="block mb-1">
            Iki datos
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-2 flex flex-col">
          <label htmlFor="searchTerm" className="block mb-1">
            Ieškoti pagal pavadinimą
          </label>
          <input
            type="text"
            id="searchTerm"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleSearchChange}
            placeholder="Įveskite renginio pavadinimą..."
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Renginiai</h2>
      {loadingEvents ? (
        <p>Renginiai kraunami...</p>
      ) : filteredEvents.length === 0 ? (
        <p>Renginių nėra.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Pavadinimas</th>
                <th className="py-2 px-4 border">Data</th>
                <th className="py-2 px-4 border">Pradžios laikas</th>
                <th className="py-2 px-4 border">Pabaigos laikas</th>
                <th className="py-2 px-4 border">Laisvos savanorystės vietos</th>
                <th className="py-2 px-4 border">Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => {
                const status = getApplicationStatus(event.id);
                return (
                  <tr key={event.id} className="text-center">
                    <td className="py-2 px-4 border">{event.name}</td>
                    <td className="py-2 px-4 border">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border">{event.start_time}</td>
                    <td className="py-2 px-4 border">{event.end_time}</td>
                    <td className="py-2 px-4 border">{event.available_volunteers}</td>
                    <td className="py-2 px-4 border">
                      {status === "priimta" ? (
                        <span className="text-green-600 font-semibold">Priimta</span>
                      ) : status === "atmesta" ? (
                        <span className="text-red-600 font-semibold">Atmesta</span>
                      ) : status === "laukiama" ? (
                        <span className="text-yellow-600 font-semibold">Laukiama</span>
                      ) : (
                        <button
                          onClick={() => handleApply(event.id)}
                          disabled={applyingEventId === event.id || event.available_volunteers <= 0}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          {applyingEventId === event.id ? "Pateikiama..." : "Pateikti"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-8 mb-2">Mano savanorystės</h2>
      {loadingApplications ? (
        <p>Jūsų savanorystės kraunamos...</p>
      ) : applications.length === 0 ? (
        <p>Jūs nepateikėte savanorystės aplikacijų.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Aplikacijos data</th>
                <th className="py-2 px-4 border">Būsena</th>
                <th className="py-2 px-4 border">Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="text-center">
                  <td className="py-2 px-4 border">
                    {new Date(app.date).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border capitalize">{app.status}</td>
                  <td className="py-2 px-4 border">
                    {app.status === "laukiama" ? (
                      <>
                        <button
                          onClick={() => handleDecline(app.id)}
                          disabled={decliningApplicationId === app.id}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
                        >
                          {decliningApplicationId === app.id ? "Atšaukiama..." : "Atšaukti"}
                        </button>
                        {app.form_url && (
                          <FormModal formUrl={app.form_url}>
                            <Button
                              variant="contained"
                              color="primary"
                              size="medium"
                            >
                              Užpildyti savanorių formą
                            </Button>
                          </FormModal>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-500">Veiksmai neprieinami</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VolunteersPage;
