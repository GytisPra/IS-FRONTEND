// EventModal.tsx
import React from "react";
import { Ticket } from "./types";
import ReactToPdf from "react-to-pdf";

interface EventModalProps {
  ticket: Ticket;
  ticketRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
}
const TicketModal: React.FC<EventModalProps> = ({
  ticket,
  ticketRef,
  onClose,
}) => {
  const handleDownloadPdf = () => {
    const options = {
      filename: "event-ticket.pdf",
    };
    ReactToPdf(ticketRef, options);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 justify-items-center">
        <div className="flex justify-between items-center p-4 border-b w-full">
          <h2 className="text-xl font-semibold">Bilieto informacija</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <div
          ref={ticketRef}
          style={{
            width: "100%", // Full width
            maxWidth: "100%", // Remove any max width limitation
            margin: 0, // Remove margins to span the whole page
            padding: "2rem", // Optional padding for better visual alignment
            boxShadow: "none", // Remove any shadows for cleaner PDF
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
                  <strong>{ticket?.event_name}</strong>
                  <br />
                  <small>
                    Renginio data:{" "}
                    {ticket?.start_time
                      ? new Date(ticket.start_time).toLocaleString("en-UK", {
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
                    {ticket?.end_time
                      ? new Date(ticket.end_time).toLocaleString("en-UK", {
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
            marginBottom: "1rem",
          }}
        >
          Atsisiųsti PDF
        </button>
      </div>
    </div>
  );
};

export default TicketModal;
