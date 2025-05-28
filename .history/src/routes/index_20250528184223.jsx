import React from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/dashboard";
import NotesList from "../layouts/notes/NotesList";
import { Dashboard } from "@mui/icons-material";
import Billing from "layouts/billing";
import DocumentList from "layouts/documents/DocumentList";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";

const routes = [
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "profile", element: <Profile /> },
      { path: "billing", element: <Billing /> },
      { path: "documents", element: <DocumentList /> },
      { path: "notes", element: <NotesList /> },
      { path: "notifications", element: <Notifications /> },
    ],
  },
];

export default routes;
