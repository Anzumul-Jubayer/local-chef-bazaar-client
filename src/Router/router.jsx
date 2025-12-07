import React from "react";
import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home/Home";
import MainLayout from "../Layouts/Mainlayout";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path:'/login',
        element: <Login/> ,
      },
      {
        path:'/register',
        element: <Register/> ,
      },
    ],
  },
]);

export default router;
