import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import Home from "./home/home";
import EventManagement from "./event-management/EventManagement";
import CreatingTicket from "./ticket-buying/CreatingTicket";

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
]);
