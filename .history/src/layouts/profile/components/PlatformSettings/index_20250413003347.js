import { useState, useEffect } from "react";
import { useAuth } from "authContext";

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
import Header from "profile/components/Header";
import PlatformSettings from "profile/components/PlatformSettings";

function Overview() {
  const { user, loading } = useAuth();

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
                  "Nom complet": user?.name || "-",
                  Email: user?.email || "-",
                  Filière: user?.filiere || "-",
                  Niveau: user?.niveau || "-",
                  Groupe: user?.groupe || "-",
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
