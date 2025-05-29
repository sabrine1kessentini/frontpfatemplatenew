import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import Box from "@mui/material/Box";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";

function Notifications() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setNotifications(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des notifications");
      if (err.response?.status === 401) {
        navigate("/authentication/sign-in");
      }
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/notifications/unread-count", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setUnreadCount(response.data.count);
    } catch (err) {
      console.error("Erreur lors du chargement du compteur de notifications", err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        `http://localhost:8000/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      await Promise.all([fetchNotifications(), fetchUnreadCount()]);
    } catch (err) {
      console.error("Erreur lors du marquage comme lu", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchNotifications(), fetchUnreadCount()]);
      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    { Header: "Message", accessor: "message", width: "70%" },
    { Header: "Date", accessor: "date", width: "30%" },
  ];

  const rows = notifications.map((notification) => ({
    message: (
      <MDTypography variant="caption" color={darkMode ? "white" : "text"} fontWeight="medium">
        {notification.message}
      </MDTypography>
    ),
    date: (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <MDTypography variant="caption" color={darkMode ? "white" : "text"} fontWeight="medium">
          {formatDate(notification.created_at)}
        </MDTypography>
        {!notification.read_at && (
          <IconButton size="small" onClick={() => markAsRead(notification.id)} sx={{ ml: 1 }}>
            <CheckCircleOutline fontSize="small" />
          </IconButton>
        )}
      </Box>
    ),
  }));

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar>
          <IconButton color="inherit" onClick={() => navigate("/notifications")} sx={{ ml: 1 }}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </DashboardNavbar>
        <MDBox display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress color="info" />
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar>
        <IconButton color="inherit" onClick={() => navigate("/notifications")} sx={{ ml: 1 }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </DashboardNavbar>

      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox
            mx={2}
            mt={-3}
            py={3}
            px={2}
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <MDTypography variant="h6" color="white">
              Mes Notifications
            </MDTypography>
          </MDBox>
          <MDBox pt={3}>
            {error ? (
              <Alert severity="error" sx={{ mx: 2, mb: 2 }}>
                {error}
              </Alert>
            ) : notifications.length === 0 ? (
              <MDBox p={3} textAlign="center">
                <MDTypography variant="body2" color={darkMode ? "white" : "text"}>
                  Aucune notification disponible
                </MDTypography>
              </MDBox>
            ) : (
              <DataTable
                table={{ columns, rows }}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
            )}
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default Notifications;
