import { fetchEventLocation } from "../event-location/locationActions";
import { supabase } from "../userService";
import { Event, NewEventForm } from "./types";

export const fetchEvents = async (): Promise<{
  data: Event[] | null;
  error: string | null;
}> => {
  const { data, error } = await supabase
    .from("event")
    .select("*")
    .order("start_time", { ascending: true });

  return { data, error: error?.message || null };
};

export const deleteEventLocation = async (
  locationId: string | null,
  events: Event[]
): Promise<{
  updatedEvents: Event[];
  error: string | null;
}> => {
  try {
    if (!locationId) {
      throw new Error("Invalid location ID.");
    }

    // Check if the location exists
    const { data: location, error: fetchLocationError } =
      await fetchEventLocation(locationId);

    if (fetchLocationError || !location) {
      throw new Error("Location does not exist or could not be fetched.");
    }

    const { error: updateEventError } = await supabase
      .from("event")
      .update({ event_location_id: null })
      .eq("event_location_id", locationId);

    if (updateEventError) {
      throw new Error(updateEventError.message);
    }

    const { error: deleteLocationError } = await supabase
      .from("event_location")
      .delete()
      .eq("id", locationId);

    if (deleteLocationError) {
      throw new Error(deleteLocationError.message);
    }

    // Update events array locally
    const updatedEvents = events.map((evt) =>
      evt.event_location_id === locationId
        ? ({ ...evt, event_location_id: null } as Event)
        : evt
    );

    return { updatedEvents, error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return { updatedEvents: events, error: err.message || "An error occurred" };
  }
};

export const submitEvent = async (
  newEventForm: NewEventForm,
  showLocationFields: boolean,
  isEditing: boolean,
  editingEventId: number | null,
  events: Event[]
): Promise<{
  updatedEvents: Event[];
  error: string | null;
}> => {
  try {
    let locationId: string | null = null;

    if (showLocationFields && newEventForm.location) {
      if (isEditing && editingEventId !== null) {
        const eventToEdit = events.find((evt) => evt.id === editingEventId);
        if (!eventToEdit) throw new Error("Event not found.");

        if (eventToEdit.event_location_id !== null) {
          const { data: updatedLocationData, error: updateLocationError } =
            await supabase
              .from("event_location")
              .update({
                country: newEventForm.location.country,
                address: newEventForm.location.address,
                specified_location: newEventForm.location.specified_location,
                longitude: newEventForm.location.longitude,
                latitude: newEventForm.location.latitude,
              })
              .eq("id", eventToEdit.event_location_id)
              .select();

          if (updateLocationError) throw new Error(updateLocationError.message);
          locationId = updatedLocationData?.[0]?.id || null;
        } else {
          const { data: locationData, error: locationError } = await supabase
            .from("event_location")
            .insert([newEventForm.location])
            .select();

          if (locationError) throw new Error(locationError.message);
          locationId = locationData?.[0]?.id || null;
        }
      } else {
        const { data: locationData, error: locationError } = await supabase
          .from("event_location")
          .insert([newEventForm.location])
          .select();

        if (locationError) throw new Error(locationError.message);
        locationId = locationData?.[0]?.id || null;
      }
    }

    if (isEditing && editingEventId !== null) {
      const eventDataToUpdate = {
        ...newEventForm,
        event_location_id: locationId || null,
      };

      delete eventDataToUpdate.location;

      const { data: eventData, error: eventError } = await supabase
        .from("event")
        .update(eventDataToUpdate)
        .eq("id", editingEventId)
        .select();

      if (eventError) throw new Error(eventError.message);
      return {
        updatedEvents: events.map((evt) =>
          evt.id === editingEventId ? eventData[0] : evt
        ),
        error: null,
      };
    } else {
      delete newEventForm.location;

      const { data: eventData, error: eventError } = await supabase
        .from("event")
        .insert([
          {
            ...newEventForm,
            available_volunteers: newEventForm.max_volunteer_count,
            event_location_id: locationId,
          },
        ])
        .select();

      if (eventError) throw new Error(eventError.message);
      return { updatedEvents: [...events, eventData[0]], error: null };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return { updatedEvents: events, error: err.message || "An error occurred" };
  }
};

export const deleteEvent = async (
  id: number,
  events: Event[]
): Promise<{ updatedEvents: Event[]; error: string | null }> => {
  const { error } = await supabase.from("event").delete().eq("id", id);
  if (error) return { updatedEvents: events, error: error.message };
  return {
    updatedEvents: events.filter((event) => event.id !== id),
    error: null,
  };
};
