// Ajoutez ces imports
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

// Dans le composant DashboardNavbar, ajoutez ces props et code
function DashboardNavbar({ children, ...rest }) {
  const navigate = useNavigate();

  return (
    <MDNavbar {...rest}>
      {/* ... autres éléments existants ... */}
      {children || (
        <IconButton color="inherit" onClick={() => navigate("/notifications")} sx={{ ml: 1 }}>
          <Badge badgeContent={0} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      )}
    </MDNavbar>
  );
}
