import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, CircularProgress, Alert, Button, Card } from "@mui/material";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:8000/api/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(response.data.data || []);
    } catch (err) {
      setError("Erreur lors du chargement des documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId, documentTitle) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Vous devez être connecté pour télécharger des documents");
        return;
      }

      setError(null);

      const response = await fetch(`http://localhost:8000/api/documents/${documentId}/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Vérifier si la réponse est du JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
        } else {
          // Si ce n'est pas du JSON, c'est probablement une erreur serveur
          throw new Error(`Erreur serveur: ${response.status}`);
        }
      }

      // Vérifier si la réponse est bien un PDF
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/pdf")) {
        throw new Error("Le fichier téléchargé n'est pas un PDF valide");
      }

      const blob = await response.blob();

      // Vérifier si le blob n'est pas vide
      if (blob.size === 0) {
        throw new Error("Le fichier téléchargé est vide");
      }

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${documentTitle}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur de téléchargement:", error);
      if (error.message.includes("401")) {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (error.message.includes("404")) {
        setError("Le document n'a pas été trouvé.");
      } else if (error.message.includes("403")) {
        setError("Vous n'avez pas les droits pour accéder à ce document.");
      } else if (error.message.includes("500")) {
        setError("Erreur serveur. Veuillez réessayer plus tard.");
      } else {
        setError(error.message || "Impossible de télécharger le document.");
      }
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      releve_notes: "Relevé de notes",
      attestation: "Attestation de présence",
      certificat: "Certificat",
    };
    return types[type] || type;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox px={3} py={2}>
            <MDTypography variant="h5" gutterBottom>
              Mes Documents
            </MDTypography>

            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : documents.length === 0 ? (
              <Alert severity="info">Aucun document disponible</Alert>
            ) : (
              <Grid container spacing={3}>
                {documents.map((doc) => (
                  <Grid item xs={12} md={6} lg={4} key={doc.id}>
                    <Card sx={{ p: 2, height: "100%" }}>
                      <Typography variant="h6">{doc.title}</Typography>
                      <Typography color="text.secondary">Type: {getTypeLabel(doc.type)}</Typography>
                      <Typography color="text.secondary">
                        Ajouté le: {new Date(doc.created_at).toLocaleDateString()}
                      </Typography>
                      <Typography color="text.secondary">
                        Taille: {(doc.file_size / 1024).toFixed(2)} KB
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleDownload(doc.id, doc.title)}
                        >
                          Télécharger PDF
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default DocumentList;
