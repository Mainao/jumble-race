import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "@/pages/home";
import Room from "@/pages/room";
import ErrorFallback from "@/pages/error";
import AppLayout from "@/layouts/AppLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        errorElement: <ErrorFallback />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/room/:roomId",
                element: <Room />,
            },
        ],
    },
]);

export default function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}
