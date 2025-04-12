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
  const [noData, setNoData] = useState(false);

  const fetchEmploi = async () => {
    try {
      setLoading(true);
      setError("");
      setNoData(false);

      const token = localStorage.getItem("token");
      const response = await axios.get("/api/mon-emploi", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data || !response.data.image_url) {
        setNoData(true);
      } else {
        setEmploi(response.data);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data?.error || err.response.statusText
        : err.message;
      setError(`Erreur de chargement: ${errorMessage}`);
      console.error("Erreur API:", err);
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

                {!loading && !error && (noData || !emploi?.image_url) ? (
                  <MDBox py={6} textAlign="center">
                    <MDTypography variant="body2" color="text">
                      Aucun emploi du temps disponible pour votre groupe
                    </MDTypography>
                    <MDBox mt={2}>
                      <MDButton variant="outlined" color="info" onClick={fetchEmploi}>
                        Réessayer
                      </MDButton>
                    </MDBox>
                  </MDBox>
                ) : null}

                {!loading && !error && emploi?.image_url && (
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
                      <MDBox>
                        <MDTypography variant="caption" color="text" sx={{ mr: 2 }}>
                          Dernière actualisation: {lastUpdated}
                        </MDTypography>
                        <MDButton
                          variant="text"
                          color="info"
                          size="small"
                          onClick={fetchEmploi}
                          disabled={loading}
                        >
                          <Refresh fontSize="small" sx={{ mr: 0.5 }} />
                          Rafraîchir
                        </MDButton>
                      </MDBox>
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
