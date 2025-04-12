import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Icons
import Refresh from "@mui/icons-material/Refresh";

function EmploiDuTemps() {
  const [emploi, setEmploi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const navigate = useNavigate();

  const fetchEmploi = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/authentication/sign-in");
        return;
      }

      const response = await axios.get("http://127.0.0.1:8000/api/mon-emploi", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.data || !response.data.image_url) {
        setError("Aucun emploi du temps disponible");
      } else {
        setEmploi(response.data);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/authentication/sign-in");
      }
      setError(err.response?.data?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmploi();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
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
                <Grid container alignItems="center" justifyContent="space-between">
                  <MDTypography variant="h6" color="white">
                    Emploi du Temps
                  </MDTypography>
                  <MDButton
                    variant="gradient"
                    color="dark"
                    size="small"
                    onClick={fetchEmploi}
                    disabled={loading}
                  >
                    <Refresh sx={{ mr: 1 }} />
                    {loading ? "Chargement..." : "Actualiser"}
                  </MDButton>
                </Grid>
              </MDBox>
              <MDBox p={3}>
                {loading && (
                  <MDBox display="flex" justifyContent="center" py={6}>
                    <CircularProgress color="info" />
                  </MDBox>
                )}

                {error && (
                  <MDBox mb={3}>
                    <Alert severity="error" onClose={() => setError("")}>
                      {error}
                    </Alert>
                  </MDBox>
                )}

                {!loading && emploi?.image_url && (
                  <>
                    <MDBox
                      component="img"
                      src={emploi.image_url}
                      alt={`Emploi du temps groupe ${emploi.groupe}`}
                      sx={{
                        width: "100%",
                        height: "auto",
                        maxWidth: "900px",
                        display: "block",
                        margin: "0 auto",
                        border: "1px solid #eee",
                        borderRadius: 1,
                        boxShadow: 3,
                      }}
                    />
                    <MDBox mt={2} display="flex" justifyContent="space-between" alignItems="center">
                      <MDTypography variant="button" color="text">
                        Groupe: {emploi.groupe}
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        Dernière actualisation: {lastUpdated}
                      </MDTypography>
                    </MDBox>
                  </>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default EmploiDuTemps;
