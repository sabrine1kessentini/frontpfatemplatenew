import { useState } from "react";
import { Card, Grid, TextField, Button, Typography, Container, Box } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Reclamation() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Vous devez être connecté pour envoyer une réclamation");
        return;
      }

      const response = await fetch("http://localhost:8000/reclamations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Votre réclamation a été envoyée avec succès!");
        setFormData({ title: "", description: "" });
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Une erreur est survenue lors de l'envoi de votre réclamation.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de l'envoi de votre réclamation. Veuillez réessayer.");
    }
  };

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
                <MDTypography variant="h6" color="white">
                  Formulaire de Réclamation
                </MDTypography>
              </MDBox>
              <MDBox p={4}>
                <Typography
                  variant="h5"
                  align="center"
                  color="textSecondary"
                  paragraph
                  sx={{ mb: 4 }}
                >
                  Votre confort et votre satisfaction sont notre priorité
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Titre de la réclamation"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description de la réclamation"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        multiline
                        rows={4}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="center">
                        <Button type="submit" variant="contained" color="primary" size="large">
                          Envoyer la réclamation
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Reclamation;
