import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/Mainlayout";

import Error from "../Pages/Error/Error";
import LoadingPage from "../Pages/Loading/LoadingPage";
import Meals from "../Pages/Meals/Meals";
import PrivateRoute from "./PrivateRoute";
import MealDetails from "../Pages/Meals/MealDetails";
import Orders from "../Pages/Orders/Orders";

import MyProfile from "../Pages/Dashboard/UserDashboard/MyProfile";
import MyOrders from "../Pages/Dashboard/UserDashboard/MyOrders";
import MyReviews from "../Pages/Dashboard/UserDashboard/MyReviews";
import FavoriteMeals from "../Pages/Dashboard/UserDashboard/FavoriteMeals";
import UserDashboard from "../Pages/Dashboard/UserDashboard/UserDashboard";

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
            <Meals />
          </Suspense>
        ),
      },
      {
        path: "/meal-details/:id",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <PrivateRoute>
              <MealDetails />
            </PrivateRoute>
          </Suspense>
        ),
      },
      {
        path: "/orders/:id",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          </Suspense>
        ),
      },
      // Dashboard Routes
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <PrivateRoute>
             <UserDashboard/>
            </PrivateRoute>
          </Suspense>
        ),
        children: [
          { path: "profile", element: <MyProfile /> },
          { path: "orders", element: <MyOrders /> },
          { path: "reviews", element: <MyReviews /> },
          { path: "favorites", element: <FavoriteMeals /> },
        ],
      },
    ],
  },
]);

export default router;
