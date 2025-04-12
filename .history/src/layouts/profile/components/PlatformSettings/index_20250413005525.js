import { useState } from "react";
import { useAuth } from "authContext";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function ProfileInfo() {
  const { user } = useAuth();

  return (
    <Card sx={{ boxShadow: "none" }}>
      <MDBox p={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Informations du profil
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Détails personnels
        </MDTypography>
        <MDBox mt={2}>
          <MDTypography variant="button" fontWeight="regular" color="text">
            Nom: {user?.name || "Non spécifié"}
          </MDTypography>
        </MDBox>
        <MDBox mt={1}>
          <MDTypography variant="button" fontWeight="regular" color="text">
            Email: {user?.email || "Non spécifié"}
          </MDTypography>
        </MDBox>
        <MDBox mt={1}>
          <MDTypography variant="button" fontWeight="regular" color="text">
            Filière: {user?.filiere || "Non spécifié"}
          </MDTypography>
        </MDBox>
        <MDBox mt={1}>
          <MDTypography variant="button" fontWeight="regular" color="text">
            Groupe: {user?.groupe || "Non spécifié"}
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default ProfileInfo;
