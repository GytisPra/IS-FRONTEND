import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import Home from "./home/home";
import EventManagement from "./event-management/EventManagement";
import CreatingTicket from "./ticket-buying/CreatingTicket";
import OrganiserPage from "./organizers";
import UserTickets from "./ticket-buying/UserTickets";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/event-management",
    element: <EventManagement />,
  },
  {
    path: "/creating-ticket",
    element: <CreatingTicket />,
  },
  {
    path: "/organiser",
    element: <OrganiserPage />,
  },
  {
    path: "/tickets",
    element: <UserTickets />,
  },
]);
