import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import router from "./Router/router.jsx";
import { RouterProvider } from "react-router";
import AuthProvider from "./Context/AuthProvider.jsx";
import { LoadingProvider } from "./Context/LoadingContext.jsx";
import GlobalLoadingSpinner from "./Components/Common/GlobalLoadingSpinner.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <LoadingProvider>
        <RouterProvider router={router} />
        <GlobalLoadingSpinner />
        <Toaster />
      </LoadingProvider>
    </AuthProvider>
  </StrictMode>
);
