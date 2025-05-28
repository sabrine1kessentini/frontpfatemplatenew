import React from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/dashboard";
import NotesList from "../layouts/notes/NotesList";

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