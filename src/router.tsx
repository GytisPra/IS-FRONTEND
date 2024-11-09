import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import Home from "./home/home";
import EventManagement from "./event-management/EventManagement";
import CreatingTicket from "./ticket-buying/CreatingTicket";
import OrganiserPage from "./organizers";
import UserTickets from "./ticket-buying/UserTickets";
import UserPage from "./User-subsystem/UserPage";
import ProfileUpdatePage from "./User-subsystem/Profile";
import UserEvents from "./User-subsystem/UserEvents";

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
    path: "/organiser",
    element: <OrganiserPage />,
  },
  {
    path: "/tickets",
    element: <UserTickets />,
  },
  {
    path: "/user",
    element: <UserPage />,
  },
  {
    path: "/update-profile",
    element: <ProfileUpdatePage />,
  },
  {
    path: "/my-events",
    element: <UserEvents />,
  },
]);
