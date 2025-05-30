import React from "react";
import { useMaterialUIController } from "context";
import { useAuth } from "authContext";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Images
import campusImage from "assets/images/campus.jpg";
import libraryImage from "assets/images/library.jpg";
import eventImage from "assets/images/event.jpg";

function Dashboard() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { user } = useAuth();

  const features = [
    {
      icon: "school",
      title: "Formation",
      description: "Des programmes d'études de qualité adaptés aux besoins du marché",
      color: "info",
    },
    {
      icon: "groups",
      title: "Vie Étudiante",
      description: "Une vie étudiante riche avec de nombreuses activités et clubs",
      color: "success",
    },
    {
      icon: "work",
      title: "Carrière",
      description: "Un accompagnement personnalisé pour votre insertion professionnelle",
      color: "warning",
    },
    {
      icon: "public",
      title: "International",
      description: "Des opportunités d'échanges avec des universités partenaires",
      color: "error",
    },
  ];

  const upcomingEvents = [
    {
      title: "Journée Portes Ouvertes",
      date: "01 Juin 2025",
      description: "Découvrez nos formations et rencontrez nos enseignants",
    },
    {
      title: "Forum des Métiers",
      date: "10 Juin 2025",
      description: "Rencontrez des professionnels et découvrez les opportunités",
    },
    {
      title: "Semaine Culturelle",
      date: "20-27 Juin 2025",
      description: "Une semaine riche en activités culturelles et artistiques",
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* Hero Section */}
      <MDBox
        sx={{
          position: "relative",
          height: "400px",
          overflow: "hidden",
          borderRadius: "15px",
          mb: 4,
        }}
      >
        <Box
          component="img"
          src={campusImage}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.7)",
          }}
        />
        <MDBox
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "100%",
            px: 2,
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          <MDTypography variant="h2" fontWeight="bold" color="white" mb={2}>
            Bienvenue {user?.name}
          </MDTypography>
          <MDTypography variant="h5" color="white">
            Votre portail étudiant pour une expérience universitaire enrichissante
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Features Section */}
      <MDBox mb={4}>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <MDBox
                  sx={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: `${feature.color}.main`,
                    color: "white",
                    mb: 2,
                  }}
                >
                  <Icon fontSize="large">{feature.icon}</Icon>
                </MDBox>
                <MDTypography variant="h5" fontWeight="bold" mb={1}>
                  {feature.title}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {feature.description}
                </MDTypography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MDBox>

      {/* Quick Access Section */}
      <MDBox mb={4}>
        <MDTypography variant="h4" fontWeight="bold" mb={3}>
          Accès Rapide
        </MDTypography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                position: "relative",
                height: "200px",
                overflow: "hidden",
                borderRadius: "15px",
                cursor: "pointer",
                "&:hover .overlay": {
                  bgcolor: "rgba(0,0,0,0.2)",
                },
              }}
            >
              <Box
                component="img"
                src={libraryImage}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <MDBox
                className="overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: "rgba(0,0,0,0.4)",
                  transition: "background-color 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MDTypography variant="h4" color="white" fontWeight="bold">
                  Bibliothèque
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                position: "relative",
                height: "200px",
                overflow: "hidden",
                borderRadius: "15px",
                cursor: "pointer",
                "&:hover .overlay": {
                  bgcolor: "rgba(0,0,0,0.2)",
                },
              }}
            >
              <Box
                component="img"
                src={eventImage}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <MDBox
                className="overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: "rgba(0,0,0,0.4)",
                  transition: "background-color 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MDTypography variant="h4" color="white" fontWeight="bold">
                  Événements
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Upcoming Events Section */}
      <MDBox mb={4}>
        <MDTypography variant="h4" fontWeight="bold" mb={3}>
          Événements à Venir
        </MDTypography>
        <Grid container spacing={3}>
          {upcomingEvents.map((event, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  p: 3,
                  height: "100%",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <MDTypography variant="h5" fontWeight="bold" mb={1}>
                  {event.title}
                </MDTypography>
                <MDTypography variant="body2" color="info" fontWeight="bold" mb={2}>
                  {event.date}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {event.description}
                </MDTypography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
