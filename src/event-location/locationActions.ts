import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../supabase";
import { EventLocation } from "./types";

export const fetchEventLocation = async (
  eventLocationId: string
): Promise<{
  data: EventLocation | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase
    .from<EventLocation>("event_location")
    .select("*")
    .eq("id", eventLocationId)
    .single();

  return { data, error };
};
