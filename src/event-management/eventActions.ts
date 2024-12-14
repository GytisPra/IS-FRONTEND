import { fetchEventLocation } from "../event-location/locationActions";
import { supabase } from "../userService";
import { Event, NewEventForm, User } from "./types";
import { user } from "../volunteers/objects/user";
import { PostgrestError } from "@supabase/supabase-js";
import Stripe from "stripe";

const getUserByEmail = async (
  userEmail: string
): Promise<{
  data: User | null;
  error: PostgrestError | null;
}> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", userEmail)
    .single();

  return { data, error };
};

export const fetchEvents = async (): Promise<{
  data: Event[] | null;
  error: string | null;
}> => {
  if (!user || user.email === undefined) {
    throw new Error("User not found");
  }

  const { data: publicUser, error: errorDb } = await getUserByEmail(user.email);

  if (!publicUser) {
    throw new Error("User not found");
  }

  if (errorDb) {
    throw new Error(errorDb.message);
  }

  const { data, error } = await supabase
    .from("event")
    .select("*")
    .eq("created_by", publicUser.id)
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
    if (!user || user.email === undefined) {
      throw new Error("User not found");
    }

    const { data: publicUser, error } = await getUserByEmail(user.email);

    if (!publicUser) {
      throw new Error("User not found");
    }

    if (error) {
      throw new Error(error.message);
    }

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
        created_by: publicUser.id,
      };

      delete eventDataToUpdate.location;

      const { data: eventData, error: eventError } = await supabase
        .from("event")
        .update(eventDataToUpdate)
        .eq("id", editingEventId)
        .select();

      if (eventError) throw new Error(eventError.message);
      const { success, error } = await updatePaymenLink(
        editingEventId,
        eventDataToUpdate.price
      );
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
            created_by: publicUser.id,
          },
        ])
        .select();

      if (eventError) throw new Error(eventError.message);
      if (newEventForm.is_free) {
        const { url, productId } = await createProductLink(newEventForm);
        console.log(url);
        addPaymentLink(eventData[0].id, url, productId);
      }
      return { updatedEvents: [...events, eventData[0]], error: null };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return { updatedEvents: events, error: err.message || "An error occurred" };
  }
};
const createProductLink = async (newEventForm: NewEventForm) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const apiKey = import.meta.env.VITE_STRIPE_SECRET_KEY;
  const stripe = new Stripe(apiKey);
  const product = await stripe.products.create({
    name: newEventForm.name,
  });
  // Create the price for the product
  const price = await stripe.prices.create({
    unit_amount: newEventForm.price * 100,
    currency: "eur",
    product: product.id,
  });
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    after_completion: {
      type: "redirect",
      redirect: {
        url: "http://localhost:5173/",
      },
    },
  });
  return { url: paymentLink.url, productId: product.id };
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
export const updatePaymenLink = async (
  eventId: number,
  newPrice: number
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Fetch the event data to retrieve the product_id
    const { data: eventData, error: eventFetchError } = await supabase
      .from("event")
      .select("product_id")
      .eq("id", eventId)
      .single();

    if (eventFetchError) {
      throw new Error(`Failed to fetch event: ${eventFetchError.message}`);
    }

    if (!eventData || !eventData.product_id) {
      throw new Error("Product ID not found for the specified event");
    }

    const productId = eventData.product_id;

    // Initialize Stripe
    const apiKey = import.meta.env.VITE_STRIPE_SECRET_KEY;
    const stripe = new Stripe(apiKey);

    // Fetch the product's current price to update it
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
    });

    if (prices.data.length === 0) {
      throw new Error("No active prices found for the product");
    }

    // Deactivate the existing prices
    for (const price of prices.data) {
      await stripe.prices.update(price.id, { active: false });
    }

    // Create a new price with the updated amount
    const newStripePrice = await stripe.prices.create({
      unit_amount: newPrice * 100, // Convert to cents
      currency: "eur",
      product: productId,
    });

    // Create a new payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: newStripePrice.id,
          quantity: 1,
        },
      ],
      after_completion: {
        type: "redirect",
        redirect: {
          url: "http://localhost:5173/",
        },
      },
    });

    // Update the event with the new payment link
    const { error: updateError } = await supabase
      .from("event")
      .update([
        {
          payment_link: paymentLink.url,
          product_id: productId,
        },
      ])
      .eq("id", eventId);

    if (updateError) {
      throw new Error(
        `Failed to update event payment link: ${updateError.message}`
      );
    }

    return { success: true, error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const addPaymentLink = async (
  eventId: number,
  paymentLink: string,
  productId: string
) => {
  const { data: eventData, error: eventError } = await supabase
    .from("event")
    .update([
      {
        payment_link: paymentLink,
        product_id: productId,
      },
    ])
    .eq("id", eventId)
    .single();

  if (eventError) throw new Error(eventError.message);
  if (eventData != null) throw new Error("Event not found");
};
