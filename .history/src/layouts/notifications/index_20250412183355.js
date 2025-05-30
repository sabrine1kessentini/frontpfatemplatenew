import { useState, useEffect } from "react";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(null);

  // Récupérer les notifications de l'utilisateur
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Créer une nouvelle notification
  const handleCreateNotification = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/notifications", {
        message: "Nouveau message de notification",
        targets: [{ type: "all", value: null }]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOpenSnackbar({
        color: "success",
        icon: "check",
        title: "Succès",
        content: "Notification créée avec succès"
      });
    } catch (error) {
      setOpenSnackbar({
        color: "error",
        icon: "warning",
        title: "Erreur",
        content: error.response?.data?.message || "Erreur lors de la création"
      });
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(null);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Mes Notifications</MDTypography>
              </MDBox>
              <MDBox p={2}>
                {notifications.length === 0 ? (
                  <MDTypography variant="body2">Aucune notification</MDTypography>
                ) : (
                  notifications.map((notification) => (
                    <MDBox key={notification.id} mb={2}>
                      <MDTypography variant="body1">{notification.message}</MDTypography>
                      <MDTypography variant="caption" color="textSecondary">
                        {new Date(notification.created_at).toLocaleString()}
                      </MDTypography>
                    </MDBox>
                  ))
                )}
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Actions</MDTypography>
                <MDBox mt={2}>
                  <MDButton 
                    variant="gradient" 
                    color="info" 
                    onClick={handleCreateNotification}
                  >
                    Créer une notification test
                  </MDButton>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Snackbar pour les feedbacks */}
      {openSnackbar && (
        <MDSnackbar
          color={openSnackbar.color}
          icon={openSnackbar.icon}
          title={openSnackbar.title}
          content={openSnackbar.content}
          dateTime=""
          open={!!openSnackbar}
          onClose={handleCloseSnackbar}
          close={handleCloseSnackbar}
        />
      )}

      <Footer />
    </DashboardLayout>
  );
}

export default Notifications;