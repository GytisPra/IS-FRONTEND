import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import Home from "./home/home";
import OrganiserPage from "./organizers";
import UserTickets from "./ticket-buying/UserTickets";
import UserPage from "./User-subsystem/UserPage";
import ProfileUpdatePage from "./User-subsystem/Profile";
import VolunteerEventDetail from "./volunteers/VolunteerApply";
import MyApplications from "./volunteers/MyApplications";
import EventManager from "./event-management/EventManager";
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
    path: "/volunteer",
    element: <VolunteerEventDetail />,
  },
  {
    path: "/my-applications",
    element: <MyApplications />,
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
