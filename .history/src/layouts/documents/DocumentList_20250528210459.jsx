import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, CircularProgress, Alert, Button, Card } from "@mui/material";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

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

      setError(null); // Réinitialiser les erreurs précédentes

      const response = await fetch(`http://localhost:8000/api/documents/${documentId}/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || errorData.message || `Erreur HTTP: ${response.status}`
          );
        } else {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("Le fichier téléchargé est vide");
      }

      // Vérifier le type MIME
      if (!blob.type.includes("pdf")) {
        throw new Error("Le fichier téléchargé n'est pas un PDF valide");
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${documentTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Afficher un message de succès
      setError(null);
    } catch (error) {
      console.error("Erreur de téléchargement:", error);
      if (error.message.includes("401")) {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (error.message.includes("404")) {
        setError("Le document n'a pas été trouvé.");
      } else if (error.message.includes("403")) {
        setError("Vous n'avez pas les droits pour accéder à ce document.");
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
    </DashboardLayout>
  );
};

export default DocumentList;
