// volunteerActions.ts

import { supabase } from "../../userService";
import { Event, VolunteerApplication, User } from "../objects/types";
import { user } from "../objects/user";

/**
 * Fetches all events ordered by date ascending.
 */
export const fetchEvents = async (): Promise<{
  data: Event[] | null;
  error: string | null;
}> => {
  const { data, error } = await supabase
    .from<Event>("event")
    .select("*")
    .gt("available_volunteers", 0)
    .order("date", { ascending: true });

  return { data, error: error?.message || null };
};

/**
 * Fetches volunteer applications for a specific volunteer ordered by date descending.
 *
 * @param volunteerId - The ID of the volunteer.
 */
export const fetchVolunteerApplications = async (
  volunteerId: string
): Promise<{
  data: VolunteerApplication[] | null;
  error: string | null;
}> => {
  const { data, error } = await supabase
    .from<VolunteerApplication>("volunteer_application")
    .select("*")
    .eq("volunteer_id", volunteerId)
    .order("date", { ascending: false });

  return { data, error: error?.message || null };
};

/**
 * Submits a new volunteer application.
 *
 * @param eventId - The ID of the event to apply for.
 * @param volunteerId - The ID of the volunteer applying.
 */
export const submitVolunteerApplication = async (
  eventId: string,
  volunteerId: string
): Promise<{
  data: VolunteerApplication | null;
  error: string | null;
}> => {
  const { data, error } = await supabase
    .from<VolunteerApplication>("volunteer_application")
    .insert([
      {
        event_id: eventId,
        volunteer_id: volunteerId,
        status: "laukiama",
        date: new Date().toISOString(),
      },
    ]);

  if (error) {
    return { data: null, error: error.message };
  }

  const { data: eventData, error: selectError } = await supabase
    .from<Event>("event")
    .select("available_volunteers")
    .eq("id", eventId)
    .single();

  if (selectError) {
    return {
      data,
      error: `Prašymas pateiktas, tačiau nepavyko gauti renginio duomenų: ${selectError.message}`,
    };
  }

  const currentAvailableVolunteers = eventData.available_volunteers;

  const newAvailableVolunteers = currentAvailableVolunteers - 1;

  const { error: updateError } = await supabase
    .from<Event>("event")
    .update({ available_volunteers: newAvailableVolunteers })
    .eq("id", eventId);

  if (updateError) {
    return {
      data,
      error: `Prašymas pateiktas, tačiau nepavyko atnaujinti renginio savanorių prieinamumo skaičių: ${updateError.message}`,
    };
  }

  return { data, error: null };
};

export const declineVolunteerApplication = async (
  applicationId: string
): Promise<{
  data: VolunteerApplication | null;
  error: string | null;
}> => {
  const { data: event } = await supabase
    .from<VolunteerApplication>("volunteer_application")
    .select("event_id")
    .eq("id", applicationId)
    .single();

  const currentEventId = event?.event_id;

  const { data, error } = await supabase
    .from<VolunteerApplication>("volunteer_application")
    .delete()
    .eq("id", applicationId);

  const { data: eventData, error: selectError } = await supabase
    .from<Event>("event")
    .select("available_volunteers")
    .eq("id", currentEventId)
    .single();

  if (selectError) {
    return {
      data,
      error: `Prašymas pateiktas, tačiau nepavyko gauti renginio duomenų: ${selectError.message}`,
    };
  }

  const currentAvailableVolunteers = eventData.available_volunteers;

  const newAvailableVolunteers = currentAvailableVolunteers + 1;

  const { error: updateError } = await supabase
    .from<Event>("event")
    .update({ available_volunteers: newAvailableVolunteers })
    .eq("id", currentEventId);

  if (updateError) {
    return {
      data,
      error: `Prašymas pateiktas, tačiau nepavyko atnaujinti renginio savanorių prieinamumo skaičių: ${updateError.message}`,
    };
  }

  return { data, error: error?.message || null };
};

export const getCurrentUser = async (
  userId: string
): Promise<{
  data: User | null;
  error: string | null;
}> => {
  const { data, error } = await supabase
    .from<User>("users")
    .select("*")
    .eq("id", userId)
    .single()

  return { data, error: error?.message || null };
};