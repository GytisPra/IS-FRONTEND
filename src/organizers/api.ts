import { supabase } from "../userService";
import { Event } from "../volunteers/objects/types";

export interface IApplication {
    id: string;
    volunteer: {
        id: string;
        name: string;
    };
    eventId: string;
    status: string;
}

export const getEvents = async () => {
  const { data, error } = await supabase.from('event')
    .select('*')
    .returns<Event[]>();

    if (error) {
        throw error;
    }

    return data;
};

export const getVolunteerApplications = async (eventId: string) => {
    console.log(eventId);
    const { data, error } = await supabase.from('volunteer_application')
    .select('id, volunteer:volunteer_id(id, name), eventId:event_id, status')
    .eq('event_id', eventId)
    .returns<IApplication[]>();

    if (error) {
        throw error;
    }

    console.log(data);

    return data;
}

export const setApplicationStatus = async (applicationId: string, status: 'priimta' | 'atmesta' | 'laukiama') => {
    const { data, error } = await supabase.from('volunteer_application')
    .update({ status })
    .eq('id', applicationId)
    .single();

    if (error) {
        throw error;
    }

    return data;
}