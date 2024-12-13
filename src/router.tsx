import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import Home from "./home/home";
import OrganiserPage from "./organizers";
import UserTickets from "./ticket-buying/UserTickets";
import UserPage from "./User-subsystem/UserPage";
import ProfileUpdatePage from "./User-subsystem/Profile";
import VolunteerEventDetail from "./volunteers/VolunteerApply";
import EventManager from "./event-management/EventManager";
import VolunteersPage from "./volunteers/VolunteerPage";
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
]);
