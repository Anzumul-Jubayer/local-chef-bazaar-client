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
import Payment from "../Pages/Dashboard/UserDashboard/Payment";
import PaymentSuccess from "../Pages/Dashboard/UserDashboard/PaymentSuccess";
import ChefDashboard from "../Pages/Dashboard/ChefDashboard/ChefDashboard";
import ChefRoute from "./ChefRoute";
import ChefProfile from "../Pages/Dashboard/ChefDashboard/ChefProfile";
import CreateMeal from "../Pages/Dashboard/ChefDashboard/CreateMeal";
import MyMeals from "../Pages/Dashboard/ChefDashboard/MyMeals";
import OrderRequests from "../Pages/Dashboard/ChefDashboard/OrderRequests";
import ChefDashboardLayout from "../Layouts/ChefDashboardLayout";
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../Pages/Dashboard/AdminDashboard/AdminDashboard";
import AdminProfile from "../Pages/Dashboard/AdminDashboard/AdminProfile";
import ManageUsers from "../Pages/Dashboard/AdminDashboard/ManageUsers";
import ManageRequests from "../Pages/Dashboard/AdminDashboard/ManageRequests";
import PlatformStatistics from "../Pages/Dashboard/AdminDashboard/PlatformStatistics";

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
      // user Dashboard
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<LoadingPage />}>
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          </Suspense>
        ),
        children: [
          { path: "profile", element: <MyProfile /> },
          { path: "orders", element: <MyOrders /> },
          { path: "payment", element: <Payment /> },
          { path: "payment-success", element: <PaymentSuccess /> },
          { path: "reviews", element: <MyReviews /> },
          { path: "favorites", element: <FavoriteMeals /> },
        ],
      },
      // Chef Dashboard
      {
        path: "chef-dashboard",
        element: (
          <Suspense fallback={<LoadingPage/>}>
            <ChefRoute>
               <ChefDashboard />
            </ChefRoute>
          </Suspense>
            
            
          
        ),
        children: [
          { path: "chef-profile", element: <ChefProfile /> },
          { path: "create-meals", element: <CreateMeal /> },
          { path: "my-meals", element: <MyMeals /> },
          { path: "order-request", element: <OrderRequests /> },
        ],
      },
      // Admin Dashboard
      {
        path: "admin-dashboard",
        element: (
           <AdminRoute>
             <AdminDashboard/>
           </AdminRoute>   
          
        ),
        children: [
          { path: "admin-profile", element: <AdminProfile/> },
          { path: "manage-user", element: <ManageUsers /> },
          { path: "manage-request", element: <ManageRequests /> },
          { path: "statistics", element: <PlatformStatistics/> },
        ],
      },
    ],
  },
]);

export default router;
