import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../userService";
import { user } from "../volunteers/objects/user";
import { PostgrestError, User } from "@supabase/supabase-js";
import ReactToPdf from "react-to-pdf";

// Function to fetch user by email
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

interface Ticket {
  id: string;
  price: number;
  discount: number;
  event_id: string;
  created_at: string;
}

interface Event {
  id: number;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  is_free: boolean;
  created_at: string;
  updated_at: string;
  seats_count: number;
  event_location_id: string | null;
  max_volunteer_count: number;
  price: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const PaymentConfirmation: React.FC = () => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [eventData, setEventData] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const hasExecuted = useRef(false); // Ref to track execution

  const createTicketAndBill = async () => {
    if (hasExecuted.current) return; // Prevent double execution
    hasExecuted.current = true;

    setIsProcessing(true);

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("event_id");

    if (!eventId) {
      setError("Event ID not found. Please contact support.");
      setIsProcessing(false);
      return;
    }

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

      /*const { data: existingTicket } = await supabase
        .from("ticket")
        .select("*")
        .eq("event_id", eventId)
        .single();

      if (existingTicket) {
        setTicket(existingTicket);
        setMessage("Your ticket has been found!");
        setIsProcessing(false);
        return;
      }*/

      const { data: eventData, error: eventError } = await supabase
        .from("event")
        .select("*")
        .eq("id", eventId)
        .single();

      if (eventError || !eventData) throw new Error("Event not found");
      setEventData(eventData);
      const { data: ticketData, error: ticketError } = await supabase
        .from("ticket")
        .insert([
          {
            price: eventData.price ?? 0, // Use 0 if price is null or undefined
            event_id: eventId,
          },
        ])
        .select()
        .single();

      if (ticketError) throw new Error(ticketError.message);

      setTicket(ticketData);

      const { error: billError } = await supabase
        .from("bill")
        .insert([{ ticket_id: ticketData.id, user_id: publicUser.id }]);

      if (billError) throw new Error(billError.message);

      setMessage(
        "Bilietas sėkmingai nupirktas! Jį galėsite rasti prie visų savo bilietų"
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    createTicketAndBill();
  }, []);

  const handleDownloadPdf = () => {
    const options = {
      filename: "event-ticket.pdf",
    };
    ReactToPdf(ticketRef, options);
  };
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isProcessing && <p>Processing your ticket...</p>}

      {ticket && (
        <div
          ref={ticketRef}
          style={{
            margin: "2rem auto",
            maxWidth: "800px",
            border: "1px solid #ddd",
            padding: "2rem",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* QR Code Placeholder */}
            <div>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.id}`}
                alt="QR Code"
              />
            </div>
            {/* Ticket Details */}
            <div style={{ textAlign: "right" }}>
              <h2 style={{ margin: 0 }}>Bilieto ID: {ticket.id}</h2>
              <p style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>
                Apmokėjimo data:{" "}
                {new Date(ticket.created_at).toLocaleDateString()}
              </p>
              <p style={{ color: "red", fontWeight: "bold" }}>
                Bilietas galioja tik vieną kartą!
              </p>
            </div>
          </div>

          <hr style={{ margin: "1.5rem 0", border: "0.5px solid #ccc" }} />

          {/* Product Details Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "1.5rem",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "0.5rem",
                    textAlign: "left",
                  }}
                >
                  Renginys
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "0.5rem",
                    textAlign: "center",
                  }}
                >
                  Kiekis
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "0.5rem",
                    textAlign: "right",
                  }}
                >
                  Kaina
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>
                  <strong>{eventData?.name}</strong>
                  <br />
                  <small>
                    Renginio data:{" "}
                    {eventData?.start_time
                      ? new Date(eventData.start_time).toLocaleString("en-UK", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      : "Date not available"}
                    <br />
                    Bilietas galioja iki:{" "}
                    {eventData?.end_time
                      ? new Date(eventData.end_time).toLocaleString("en-UK", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      : "Date not available"}
                  </small>
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "0.5rem",
                    textAlign: "center",
                  }}
                >
                  1
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "0.5rem",
                    textAlign: "right",
                  }}
                >
                  €{ticket.price.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
          <p
            style={{
              textAlign: "right",
              margin: "0.5rem 0",
              fontSize: "1.1rem",
            }}
          >
            <strong>Iš viso:</strong> €{ticket.price.toFixed(2)}
          </p>
        </div>
      )}
      <div className="justify-item: space-x-2">
        <button
          onClick={() =>
            (window.location.href = "http://localhost:5173/tickets")
          }
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Peržiūrėti visus bilietus
        </button>
        <button
          onClick={handleDownloadPdf}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Atsisiųsti PDF
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
