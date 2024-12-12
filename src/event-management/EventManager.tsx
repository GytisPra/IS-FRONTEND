import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { supabase } from "../../supabase";

interface Event {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_free: boolean;
  created_at: string;
  updated_at: string;
  seats_count: number;
  event_location_id: string;
  max_volunteer_count: number;
}

interface Location {
  id: string;
  country: string;
  address: string;
  specified_location: string;
  longitude: number;
  latitude: number;
}

interface NewEventForm {
  date: string;
  start_time: string;
  end_time: string;
  is_free: boolean;
  seats_count: number;
  max_volunteer_count: number;
  location?: {
    // manau, kad gali but nullable, nes renginys gali but ir online
    country?: string;
    address?: string;
    specified_location?: string;
    longitude?: number;
    latitude?: number;
  };
}

const EventManager: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [newEventForm, setNewEventForm] = useState<NewEventForm>({
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

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from<Event>("event")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;

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

  const editEvent = async (event: Event) => {
    setModalLoading(true);
    setModalError(null);
    setIsEditing(true);
    setEditingEventId(event.id);

    try {
      const { data: locationData, error: locationError } = await supabase
        .from<Location>("event_location")
        .select("*")
        .eq("id", event.event_location_id)
        .single();

      if (locationError) {
        throw new Error(locationError.message);
      }

      setNewEventForm({
        date: event.date,
        start_time: event.start_time,
        end_time: event.end_time,
        is_free: event.is_free,
        seats_count: event.seats_count,
        max_volunteer_count: event.max_volunteer_count,
        location: {
          country: locationData.country,
          address: locationData.address,
          specified_location: locationData.specified_location,
          longitude: locationData.longitude,
          latitude: locationData.latitude,
        },
      });

      setShowLocationFields(true);

      setShowModal(true);
    } catch (err: any) {
      setModalError(err.message || "Nepavyko gauti vietovės duomenų.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);

    try {
      let locationId: string | null = null;

      if (showLocationFields && newEventForm.location) {
        if (isEditing && editingEventId !== null) {
          const eventToEdit = events.find((evt) => evt.id === editingEventId);
          if (!eventToEdit) {
            throw new Error("Renginys nerastas.");
          }

          const { data: updatedLocationData, error: updateLocationError } =
            await supabase
              .from<Location>("event_location")
              .update({
                country: newEventForm.location.country,
                address: newEventForm.location.address,
                specified_location: newEventForm.location.specified_location,
                longitude: newEventForm.location.longitude,
                latitude: newEventForm.location.latitude,
              })
              .eq("id", eventToEdit.event_location_id)
              .select();

          if (updateLocationError) {
            throw new Error(updateLocationError.message);
          }

          const updatedLocation = updatedLocationData && updatedLocationData[0];
          if (!updatedLocation) {
            throw new Error("Nepavyko atnaujinti vietovės.");
          }

          locationId = updatedLocation.id;
        } else {
          const { data: locationData, error: locationError } = await supabase
            .from<Location>("event_location")
            .insert([
              {
                country: newEventForm.location.country,
                address: newEventForm.location.address,
                specified_location: newEventForm.location.specified_location,
                longitude: newEventForm.location.longitude,
                latitude: newEventForm.location.latitude,
              },
            ])
            .select();

          if (locationError) {
            throw new Error(locationError.message);
          }

          const newLocation = locationData && locationData[0];
          if (!newLocation) {
            throw new Error("Nepavyko sukurti vietovės.");
          }

          locationId = newLocation.id;
        }
      }

      if (isEditing && editingEventId !== null) {
        const { data: eventData, error: eventError } = await supabase
          .from<Event>("event")
          .update({
            date: newEventForm.date,
            start_time: newEventForm.start_time,
            end_time: newEventForm.end_time,
            is_free: newEventForm.is_free,
            seats_count: newEventForm.seats_count,
            event_location_id: locationId || undefined,
            max_volunteer_count: newEventForm.max_volunteer_count,
          })
          .eq("id", editingEventId)
          .select();

        if (eventError) {
          throw new Error(eventError.message);
        }

        const updatedEvent = eventData && eventData[0];
        if (!updatedEvent) {
          throw new Error("Nepavyko atnaujinti renginio.");
        }

        setEvents(
          events.map((evt) => (evt.id === editingEventId ? updatedEvent : evt))
        );
      } else {
        const { data: eventData, error: eventError } = await supabase
          .from<Event>("event")
          .insert([
            {
              date: newEventForm.date,
              start_time: newEventForm.start_time,
              end_time: newEventForm.end_time,
              is_free: newEventForm.is_free,
              seats_count: newEventForm.seats_count,
              event_location_id: locationId,
              max_volunteer_count: newEventForm.max_volunteer_count,
            },
          ])
          .select();

        if (eventError) {
          throw new Error(eventError.message);
        }

        const newEvent = eventData && eventData[0];
        if (!newEvent) {
          throw new Error("Nepavyko sukurti renginio.");
        }

        setEvents([...events, newEvent]);
      }

      setNewEventForm({
        date: "",
        start_time: "",
        end_time: "",
        is_free: false,
        seats_count: 0,
        max_volunteer_count: 0,
      });

      setIsEditing(false);
      setEditingEventId(null);

      setShowLocationFields(false);

      setShowModal(false);
    } catch (err: any) {
      setModalError(err.message || "Įvyko klaida.");
    } finally {
      setModalLoading(false);
    }
  };

  const deleteEvent = async (id: number) => {
    const { error } = await supabase.from("event").delete().eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event Manager</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
      )}

      <button
        onClick={() => {
          setShowModal(true);
          setIsEditing(false);
          setEditingEventId(null);
          setNewEventForm({
            date: "",
            start_time: "",
            end_time: "",
            is_free: false,
            seats_count: 0,
            max_volunteer_count: 0,
          });
          setShowLocationFields(false);
        }}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Pridėti naują renginį
      </button>

      {loading ? (
        <p>Renginiai kraunami...</p>
      ) : (
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
                <td className="py-2 px-4 border">
                  {event.max_volunteer_count}
                </td>
                <td className="py-2 px-4 border">
                  <div className="flex">
                    <button
                      onClick={() => editEvent(event)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-l-lg  hover:bg-yellow-600"
                    >
                      Redaguoti
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
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
                  Nerasta renginių.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">
                {isEditing ? "Update Event" : "Create New Event"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setModalError(null);
                  setNewEventForm({
                    date: "",
                    start_time: "",
                    end_time: "",
                    is_free: false,
                    seats_count: 0,
                    max_volunteer_count: 0,
                  });
                  setShowLocationFields(false);
                  setIsEditing(false);
                  setEditingEventId(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              {modalError && (
                <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
                  {modalError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <h3 className="text-lg font-semibold mb-2">
                    Renginio detalės
                  </h3>
                  <div className="mb-4">
                    <label className="block mb-1">Data</label>
                    <input
                      type="date"
                      name="date"
                      value={newEventForm.date}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Pradžios laikas</label>
                    <input
                      type="time"
                      name="start_time"
                      value={newEventForm.start_time}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Pabaigos laikas</label>
                    <input
                      type="time"
                      name="end_time"
                      value={newEventForm.end_time}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      name="is_free"
                      checked={newEventForm.is_free}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label>Is Free</label>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Vietų skaičius</label>
                    <input
                      type="number"
                      name="seats_count"
                      value={newEventForm.seats_count}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      min="0"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Max Savanorių</label>
                    <input
                      type="number"
                      name="max_volunteer_count"
                      value={newEventForm.max_volunteer_count}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      min="0"
                      required
                    />
                  </div>

                  {!showLocationFields && (
                    <button
                      type="button"
                      onClick={() => setShowLocationFields(true)}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Pridėti vietovę
                    </button>
                  )}
                </div>

                {showLocationFields && (
                  <div className="col-span-1">
                    <h3 className="text-lg font-semibold mb-2">
                      Vietovės duomenys
                    </h3>
                    <div className="mb-4">
                      <label className="block mb-1">Šalis</label>
                      <input
                        type="text"
                        name="location.country"
                        value={newEventForm.location?.country || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1">Adresas</label>
                      <input
                        type="text"
                        name="location.address"
                        value={newEventForm.location?.address || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1">Patikslinta vietovė</label>
                      <input
                        type="text"
                        name="location.specified_location"
                        value={newEventForm.location?.specified_location || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1">Ilguma</label>
                      <input
                        type="number"
                        step="0.000001"
                        name="location.longitude"
                        value={newEventForm.location?.longitude || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1">Platuma</label>
                      <input
                        type="number"
                        step="0.000001"
                        name="location.latitude"
                        value={newEventForm.location?.latitude || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLocationFields(false);
                        setNewEventForm((prevForm) => ({
                          ...prevForm,
                          location: undefined,
                        }));
                      }}
                      className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Pašalinti vietovę
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setModalError(null);
                    setNewEventForm({
                      date: "",
                      start_time: "",
                      end_time: "",
                      is_free: false,
                      seats_count: 0,
                      max_volunteer_count: 0,
                    });
                    setShowLocationFields(false);
                    setIsEditing(false);
                    setEditingEventId(null);
                  }}
                  className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Atšaukti
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                    modalLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {modalLoading
                    ? isEditing
                      ? "Naujinama..."
                      : "Kuriama..."
                    : isEditing
                    ? "Atnaujinti Renginį"
                    : "Sukurti Renginį"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManager;
