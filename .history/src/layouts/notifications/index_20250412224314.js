import { useState, useEffect } from "react";
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
import dayjs from "dayjs";

function Notifications() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/notifications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setNotifications(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors du chargement des notifications");
        setLoading(false);
        if (err.response?.status === 401) {
          navigate("/authentication/sign-in");
        }
      }
    };

    fetchNotifications();
  }, [navigate]);

  const formatTargets = (targets) => {
    return targets.map((target) => {
      if (target.target_type === "all") return "Tous";
      return `${target.target_type === "filiere" ? "Filière" : "Niveau"} ${target.target_value}`;
    });
  };

  const columns = [
    { Header: "Message", accessor: "message", width: "50%" },
    { Header: "Destinataires", accessor: "targets", width: "30%" },
    { Header: "Date", accessor: "date", width: "20%" },
  ];

  const rows = notifications.map((notification) => ({
    message: (
      <MDTypography variant="caption" color={darkMode ? "white" : "text"} fontWeight="medium">
        {notification.message}
      </MDTypography>
    ),
    targets: (
      <MDBox display="flex" flexDirection="column">
        {formatTargets(notification.targets).map((target, i) => (
          <MDTypography
            key={i}
            variant="caption"
            color={darkMode ? "white" : "text"}
            fontWeight="medium"
          >
            {target}
          </MDTypography>
        ))}
      </MDBox>
    ),
    date: (
      <MDTypography variant="caption" color={darkMode ? "white" : "text"} fontWeight="medium">
        {dayjs(notification.created_at).format("DD/MM/YYYY HH:mm")}
      </MDTypography>
    ),
  }));

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress color="info" />
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
