import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { supabase } from "../userService";
import { user } from "../volunteers/objects/user";
import { PostgrestError, User } from "@supabase/supabase-js";
import TicketModal from "./TicketModal";

interface Ticket {
  id: number;
  event_name: string;
  created_at: Date;
  start_time: Date;
  end_time: Date;
  price: number;
  ticket_id: number;
  event_id: number;
}

interface Event {
  id: number;
  name: string;
  start_time: Date;
  end_time: Date;
}
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
const UserTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null); // State for selected ticket
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  // Fetch the user's tickets and related event details
  useEffect(() => {
    const fetchTickets = async () => {
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
      // Get user's bill entries
      const { data: billData, error: billError } = await supabase
        .from("bill")
        .select("ticket_id")
        .eq("user_id", publicUser.id);

      if (billError) {
        console.error("Error fetching bills:", billError.message);
        return;
      }
      if (billData.length > 0) {
        const ticketIds = billData.map((bill: any) => bill.ticket_id);
        const { data: ticketData, error: ticketError } = await supabase
          .from("ticket")
          .select("id, event_id, created_at, price")
          .in("id", ticketIds)
          .order("created_at", { ascending: false }); // Order by created_at (purchase date) DESC

        if (ticketError) {
          console.error("Error fetching tickets:", ticketError.message);
          return;
        }

        if (ticketData) {
          // Get event details based on event_id from tickets
          const eventIds = ticketData.map((ticket: any) => ticket.event_id);
          const { data: eventData, error: eventError } = await supabase
            .from("event")
            .select("id, name, start_time, end_time")
            .in("id", eventIds); // Fetch event details using event_ids

          if (eventError) {
            console.error("Error fetching events:", eventError.message);
            return;
          }

          // Combine ticket data with event data
          const ticketsWithEventInfo = ticketData.map((ticket: any) => {
            const event = eventData.find(
              (event: any) => event.id === ticket.event_id
            );
            return {
              ...ticket,
              event_name: event?.name || "Unknown Event",
              start_time: event?.start_time || new Date(),
              end_time: event?.end_time || new Date(),
            };
          });

          setTickets(ticketsWithEventInfo);
        }
      }
    };

    fetchTickets();
  }, []);

  // Function to handle ticket view button click
  const handleViewTicket = (ticket: Ticket) => {
    const event = tickets.find((t) => t.id === ticket.event_id); // Find event associated with this ticket
    setSelectedTicket(ticket); // Set selected ticket
    setSelectedEvent({
      id: ticket.event_id,
      name: ticket.event_name,
      start_time: ticket.start_time,
      end_time: ticket.end_time,
    });
    console.log(ticket);
    setShowTicketModal(!showTicketModal); // Show modal
  };
  const onClose = () => {
    setShowTicketModal(!showTicketModal);
  };

  return (
    <Container>
      <Box sx={{ marginTop: "20px" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="user tickets table">
            <TableHead>
              <TableRow>
                <TableCell>Renginio Pavadinimas</TableCell>
                <TableCell align="center">Pirkimo Data</TableCell>
                <TableCell align="center">Bilieto Kaina</TableCell>
                <TableCell align="center">Renginio Pradžios Laikas</TableCell>
                <TableCell align="center">Veiksmai</TableCell>{" "}
                {/* New column for actions */}
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell component="th" scope="row">
                    {ticket.event_name}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(ticket.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell align="center">{ticket.price} €</TableCell>
                  <TableCell align="center">
                    {new Date(ticket.start_time).toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    {/* View Ticket Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewTicket(ticket)}
                    >
                      Peržiūrėti
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {tickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Nėra užsakytų bilietų.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {showTicketModal && (
        <TicketModal
          ticket={selectedTicket}
          eventData={selectedEvent}
          ticketRef={React.createRef()} // Can be used if needed for the modal content
          onClose={onClose}
        />
      )}
    </Container>
  );
};

export default UserTickets;
