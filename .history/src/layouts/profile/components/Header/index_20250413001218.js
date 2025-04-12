import { useEffect, useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import defaultAvatar from "assets/images/sabrine2.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";

function Header({ children }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    function handleTabsOrientation() {
      setTabsOrientation(window.innerWidth < breakpoints.values.sm ? "vertical" : "horizontal");
    }

    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();

    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MDAvatar src={defaultAvatar} alt="profile-image" size="xl" shadow="sm" />
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {user?.name || "Utilisateur"}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {user?.filiere ? `${user.filiere} - Groupe ${user.groupe}` : "Étudiant"}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab label="Profil" icon={<Icon fontSize="small">person</Icon>} />
                <Tab label="Notifications" icon={<Icon fontSize="small">notifications</Icon>} />
                <Tab label="Paramètres" icon={<Icon fontSize="small">settings</Icon>} />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

Header.defaultProps = {
  children: "",
};

Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
