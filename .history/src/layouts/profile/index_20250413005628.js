import { useState, useEffect } from "react";
import axios from "axios";
import { useMaterialUIController } from "context";

// @mui material components
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Profile components
import Header from "layouts/profile/components/Header";
import ProfileInfo from "layouts/profile/components/PlatformSettings"; // Renommer l'import si nécessaire

function Overview() {
  const [controller] = useMaterialUIController();
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    filiere: "",
    niveau: "",
    groupe: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setUserProfile({
          name: response.data.name || "",
          email: response.data.email || "",
          filiere: response.data.filiere || "",
          niveau: response.data.niveau || "",
          groupe: response.data.groupe || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

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
            <Grid item xs={12} md={6} xl={6}>
              <ProfileInfo />
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <ProfileInfoCard
                title="Détails supplémentaires"
                description={`Profil étudiant`}
                info={{
                  "Nom complet": userProfile.name || "-",
                  Email: userProfile.email || "-",
                  Filière: userProfile.filiere || "-",
                  Niveau: userProfile.niveau || "-",
                  Groupe: userProfile.groupe || "-",
                }}
                action={{ route: "", tooltip: "Modifier le profil" }}
                shadow={false}
              />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
