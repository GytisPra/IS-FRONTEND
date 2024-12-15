import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import Home from "./home/home";
import OrganiserPage from "./organizers";
import UserTickets from "./ticket-buying/UserTickets";
import UserPage from "./User-subsystem/UserPage";
import ProfileUpdatePage from "./User-subsystem/Profile";
import EventManager from "./event-management/EventManager";
import VolunteersPage from "./volunteers/VolunteerPage";
import PaymentConfirmation from "./ticket-buying/PaymentConfirmation";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/event-management",
    element: <EventManager />,
  },
  {
    path: "/organiser",
    element: <OrganiserPage />,
  },
  {
    path: "/volunteers/events",
    element: <VolunteersPage />,
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
    path: "/payment-confirmation",
    element: <PaymentConfirmation />,
  },
]);
