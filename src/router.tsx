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
import ProtectedRoute from "./components/common/protectedRoute/ProtectedRoute";
import Unauthorized from "./components/common/protectedRoute/Unauthorized";
import VolunteerStatisticsPage from "./volunteers/StatisticsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/event-management",
    element: (
      <ProtectedRoute requiredRole="admin">
        <EventManager />
      </ProtectedRoute>
    ),
  },
  {
    path: "/organiser",
    element: <OrganiserPage />,
  },
  {
    path: "/volunteers/events",
    element: (
      <ProtectedRoute requiredRole="volunteer">
        <VolunteersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/volunteers/statistics",
    element: (
      <ProtectedRoute requiredRole="volunteer">
        <VolunteerStatisticsPage />
      </ProtectedRoute>
    ),
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
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);
