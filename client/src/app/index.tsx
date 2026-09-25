import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import ErrorFallback from "@/pages/error";
import Home from "@/pages/home";
import Room from "@/pages/room";

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
