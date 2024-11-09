import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./home/App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/home",
    element: <App />,
  },
]);
