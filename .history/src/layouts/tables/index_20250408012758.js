import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
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

  const fetchEmploi = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/mon-emploi", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEmploi(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur de chargement");
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
                    Actualiser
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
                    <Alert severity="error">{error}</Alert>
                  </MDBox>
                )}

                {emploi?.image_url ? (
                  <>
                    <MDBox
                      component="img"
                      src={emploi.image_url}
                      alt={`Emploi du temps groupe ${emploi.groupe}`}
                      sx={{
                        width: "100%",
                        height: "auto",
                        border: "1px solid #eee",
                        borderRadius: 1,
                        boxShadow: 3,
                      }}
                    />
                    <MDBox mt={1} display="flex" justifyContent="space-between">
                      <MDTypography variant="button" color="text">
                        Groupe: {emploi.groupe}
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        Dernière actualisation: {lastUpdated}
                      </MDTypography>
                    </MDBox>
                  </>
                ) : (
                  !loading && (
                    <MDBox py={6} textAlign="center">
                      <MDTypography variant="body2" color="text">
                        Aucun emploi du temps disponible pour votre groupe
                      </MDTypography>
                    </MDBox>
                  )
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
