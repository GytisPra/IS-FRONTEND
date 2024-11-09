import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import Home from "./home/home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);
