import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { supabase } from "../../supabase";
import { Event, Location, NewEventForm } from "./types";
import {
  fetchEvents,
  submitEvent,
  deleteEvent,
  deleteEventLocation,
} from "./eventActions";
import EventModal from "./EventModal";
import EventTable from "./EventsTable";
import dayjs from "dayjs";

const EventManager: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [newEventForm, setNewEventForm] = useState<NewEventForm>({
    name: "",
    date: "",
    start_time: "",
    end_time: "",
    is_free: false,
    seats_count: 0,
    max_volunteer_count: 0,
  });
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [showLocationFields, setShowLocationFields] = useState<boolean>(false);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      const { data, error } = await fetchEvents();
      if (error) setError(error);
      else setEvents(data || []);
      setLoading(false);
    };

    getEvents();
  }, []);

  const validateStartEndTimes = (startTime: string, endTime: string) => {
    if (startTime && endTime) {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);

      return startDate >= endDate;
    }

    return false;
  };

  const validateStartTime = (startTime: string) => {
    if (startTime) {
      const startDate = new Date(startTime);

      return startDate < new Date();
    }

    return false;
  };

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | { target: { name: string; value: any; type: string } }
  ) => {
    const { name, value, type } = e.target;

    if (type === "datetime" && value instanceof Object && value.$d) {
      setNewEventForm({
        ...newEventForm,
        [name]: dayjs(value.$d).format("YYYY-MM-DDTHH:mm:ssZ"),
      });

      return;
    }

    let checked: boolean | undefined;
    if (e.target instanceof HTMLInputElement && type === "checkbox") {
      checked = e.target.checked;
    }

    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setNewEventForm((prevForm) => ({
        ...prevForm,
        location: {
          ...(prevForm.location || {
            country: "",
            address: "",
            specified_location: "",
            longitude: 0,
            latitude: 0,
          }),
          [locationField]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setNewEventForm({
        ...newEventForm,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleEditClick = async (event: Event) => {
    setModalLoading(true);
    setModalError(null);
    setIsEditing(true);
    setEditingEventId(event.id);

    try {
      let locationData = null;

      if (event.event_location_id) {
        const { data, error } = await supabase
          .from<Location>("event_location")
          .select("*")
          .eq("id", event.event_location_id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        locationData = data;
      }

      setNewEventForm({
        name: event.name,
        date: event.date,
        start_time: event.start_time,
        end_time: event.end_time,
        is_free: event.is_free,
        seats_count: event.seats_count,
        max_volunteer_count: event.max_volunteer_count,
        location: locationData
          ? {
              country: locationData.country,
              address: locationData.address,
              specified_location: locationData.specified_location,
              longitude: locationData.longitude,
              latitude: locationData.latitude,
            }
          : null,
      });

      setShowLocationFields(!!locationData);
      setShowModal(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setModalError(err.message || "Nepavyko gauti vietovės duomenų.");
    } finally {
      setModalLoading(false);
    }
  };

  const formSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setModalLoading(true);

    const date = newEventForm["date"];
    const startTime = newEventForm["start_time"];
    const endTime = newEventForm["end_time"];

    if (date.trim().length <= 0) {
      setModalError("Įveskite datą");
      setModalLoading(false);
      return;
    }

    if (startTime.trim().length <= 0) {
      setModalError("Įveskite pradžios laiką");
      setModalLoading(false);
      return;
    }

    if (endTime.trim().length <= 0) {
      setModalError("Įveskite pabaigos laiką");
      setModalLoading(false);
      return;
    }

    if (validateStartEndTimes(startTime, endTime)) {
      setModalError("Pradžios laikas turi būti anksčiau nei pabaigos");
      setModalLoading(false);
      return;
    } else if (validateStartTime(startTime)) {
      setModalError("Pradžios laikas negali būti praeityje");
      setModalLoading(false);
      return;
    }

    const { updatedEvents, error } = await submitEvent(
      newEventForm,
      showLocationFields,
      isEditing,
      editingEventId,
      events
    );

    setModalLoading(false);

    if (error) setModalError(error);
    else {
      setEvents(updatedEvents);
      setShowModal(false);
    }
  };

  const handleDelete = async (id: number) => {
    const { updatedEvents, error } = await deleteEvent(id, events);
    if (error) setError(error);
    else setEvents(updatedEvents);
  };

  const resetForm = () => {
    setNewEventForm({
      name: "",
      date: "",
      start_time: "",
      end_time: "",
      is_free: false,
      seats_count: 0,
      max_volunteer_count: 0,
    });

    setShowModal(!showModal);
    setModalError(null);
    setIsEditing(false);
    setEditingEventId(null);
    setShowLocationFields(false);
  };

  const handleLocationDeletion = async (eventId: number | null) => {
    setShowLocationFields(!showLocationFields);

    if (eventId && showLocationFields) {
      const event = events.find((event) => event.id === eventId);

      const { updatedEvents, error } = await deleteEventLocation(
        event!.event_location_id,
        events
      );

      if (error) setError(error);
      else {
        setEvents(updatedEvents);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Renginių tvarkyklė</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
      )}

      <button
        onClick={resetForm}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Pridėti naują renginį
      </button>

      {loading ? (
        <p>Renginiai kraunami...</p>
      ) : (
        <EventTable
          events={events}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}

      {showModal && (
        <EventModal
          isEditing={isEditing}
          editingEventId={editingEventId}
          newEventForm={newEventForm}
          modalLoading={modalLoading}
          modalError={modalError}
          showLocationFields={showLocationFields}
          onClose={resetForm}
          onFormSubmit={formSubmit}
          onFieldChange={handleChange}
          onToggleLocationFields={handleLocationDeletion}
        />
      )}
    </div>
  );
};

export default EventManager;
