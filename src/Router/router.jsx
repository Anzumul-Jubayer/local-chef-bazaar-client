import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/Mainlayout";

import Error from "../Pages/Error/Error";
import LoadingPage from "../Pages/Loading/LoadingPage";
import Meals from "../Pages/Meals/Meals";
import PrivateRoute from "./PrivateRoute";
import MealDetails from "../Pages/Meals/MealDetails";
import Orders from "../Pages/Orders/Orders";

const Home = lazy(() => import("../Pages/Home/Home"));
const Login = lazy(() => import("../Pages/Auth/Login"));
const Register = lazy(() => import("../Pages/Auth/Register"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingPage />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <Register />
          </Suspense>
        ),
      },
      
      {
        path: "meals",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <Meals/>
          </Suspense>
        ),
      },
      {
        path: "/meal-details/:id",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <PrivateRoute>
              <MealDetails/>
            </PrivateRoute>
          </Suspense>
        ),
      },
      {
        path: "/orders/:id",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <PrivateRoute>
              <Orders/>
            </PrivateRoute>
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
