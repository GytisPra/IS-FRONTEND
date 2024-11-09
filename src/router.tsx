import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import Home from "./home/home";
import EventManagement from "./event-management/EventManagement";
import OrganiserPage from "./organizers";
import VolunteerEventDetail from "./volunteers/VolunteerApply";
import MyApplications from "./volunteers/MyApplications";
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
    path: "/volunteer",
    element: <VolunteerEventDetail />
  },
  {
    path: "/my-applications",
    element: <MyApplications/>
  }
]);
