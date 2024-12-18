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

export const getEvents = async (userId: string) => {
    const { data, error } = await supabase.from('event')
        .select('*')
        .eq('created_by', userId)
        .returns<Event[]>();

    if (error) {
        throw error;
    }

    return data;
};

export const getVolunteerApplications = async (eventId: string) => {
    const { data, error } = await supabase.from('volunteer_application')
        .select('id, volunteer:volunteer_id(id, name), eventId:event_id, status')
        .eq('event_id', eventId)
        .returns<IApplication[]>();

    if (error) {
        throw error;
    }
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

export const getUser = async (userId: string) => {
    const { data, error } = await supabase.from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        throw error;
    }

    return data;
}
export const createVolunteerStatistics = async (stats: {
    rating: number;
    minutes_worked: number;
    event_count: number;
    volunteer_id: string;
  }) => {
    const { data, error } = await supabase
      .from('volunteer_statistics')
      .insert(stats)
      .select()
      .single();
  
    if (error) {
      throw error;
    }
  
    return data;
  };

export const decrementEventVolunteerCount = async (eventId: string) => {

    const { data } = await supabase.from('event')
        .select('available_volunteers')
        .eq('id', eventId)
        .single();

    if (data?.available_volunteers === 0) {
        throw new Error('No available volunteers seats');
    }

    const { error } = await supabase.from('event')
        .update({ available_volunteers: data?.available_volunteers - 1 })
        .eq('id', eventId)
        .single();

    if (error) {
        throw error;
    }

    return data?.available_volunteers - 1;
};

export const getAttendeeCount = async (eventId: string) => {
    const { data, error } = await supabase.from('ticket')
        .select('id')
        .eq('event_id', eventId);

    if (error) {
        throw error;
    }
    return data.length;
}