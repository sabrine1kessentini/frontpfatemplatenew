import Dashboard from "layouts/dashboard";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import EmploiDuTemps from "layouts/tables";

// @mui icons
import Icon from "@mui/material/Icon";
import DocumentList from "layouts/documents/DocumentList";
import Notes from "layouts/notes";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Emploi du Temps",
    key: "tables",
    icon: <Icon fontSize="small">schedule</Icon>,
    route: "/tables",
    component: <EmploiDuTemps />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Paiement",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Notes",
    key: "notes",
    icon: <Icon fontSize="small">grade</Icon>, // Icône "notes"
    route: "/notes",
    component: <Notes />,
    protected: true, // Si l'accès nécessite une authentification
  },
  {
    type: "collapse",
    name: "Documents",
    key: "documents",
    icon: <Icon fontSize="small">description</Icon>,
    route: "/documents",
    component: <DocumentList />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Logout",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
    protected: false,
  },
];

export default routes;
