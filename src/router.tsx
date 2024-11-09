import { createBrowserRouter } from 'react-router-dom';
import Home from './home/home';
import UserPage from './User-subsystem/UserPage';
import ProfileUpdatePage from './User-subsystem/Profile';
import UserEvents from './User-subsystem/UserEvents';



export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/user',
        element: <UserPage />,
    },
    {
        path: '/update-profile',
        element: <ProfileUpdatePage />,
    },
    {
        path: '/my-events',
        element: <UserEvents/>,
    }
]);
