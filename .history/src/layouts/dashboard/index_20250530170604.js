/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import { useMaterialUIController } from "context";
import { useAuth } from "authContext";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

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
      date: "15 Mars 2024",
      description: "Découvrez nos formations et rencontrez nos enseignants",
    },
    {
      title: "Forum des Métiers",
      date: "22 Mars 2024",
      description: "Rencontrez des professionnels et découvrez les opportunités",
    },
    {
      title: "Semaine Culturelle",
      date: "1-5 Avril 2024",
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
            color: "white", // Couleur globale pour tout le contenu
            width: "100%",
            padding: "0 20px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              mb: 2,
              fontWeight: "bold",
              color: "white", // Explicitement défini en blanc
            }}
          >
            Bienvenue {user?.name}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "white", // Explicitement défini en blanc
            }}
          >
            Votre portail étudiant pour une expérience universitaire enrichissante
          </Typography>
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
                "&:hover": {
                  "& .overlay": {
                    bgcolor: "rgba(0,0,0,0.2)",
                  },
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
                "&:hover": {
                  "& .overlay": {
                    bgcolor: "rgba(0,0,0,0.2)",
                  },
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
