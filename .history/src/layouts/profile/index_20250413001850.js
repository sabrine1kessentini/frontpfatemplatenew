import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "authContext"; // Importez le contexte d'authentification

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Profile components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

function Overview() {
  const { user } = useAuth(); // Récupérez l'utilisateur depuis le contexte
  const [loading, setLoading] = useState(!user); // Chargement seulement si user n'est pas déjà disponible

  // Si vous devez rafraîchir les données utilisateur
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        // Les données seront stockées dans le contexte via AuthProvider
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUserProfile();
    }
  }, [user]);

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
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings />
            </Grid>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <ProfileInfoCard
                title="Informations du profil"
                description={`Bienvenue ${user?.name || "Utilisateur"}`}
                info={{
                  "Nom complet": user?.name || "Non disponible",
                  Email: user?.email || "Non disponible",
                  Filière: user?.filiere || "Non disponible",
                  Niveau: user?.niveau || "Non disponible",
                  Groupe: user?.groupe || "Non disponible",
                }}
                social={[]}
                action={{ route: "", tooltip: "Modifier le profil" }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
