import React, { useState, useEffect } from "react";
import { Box, Card, Grid, Typography, CircularProgress, Alert, Button } from "@mui/material";
import axios from "axios";

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
      console.log("Documents reçus:", response.data.data);
      setDocuments(response.data.data || []);
    } catch (err) {
      setError("Erreur lors du chargement des documents");
      console.error("Erreur de chargement:", err);
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
        const errorData = await response.text();
        throw new Error(errorData || `Erreur HTTP: ${response.status}`);
      }

      // Vérifier le type de contenu
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/pdf")) {
        throw new Error("Le fichier téléchargé n'est pas un PDF valide");
      }

      // Obtenir le blob directement de la réponse
      const blob = await response.blob();

      // Vérifier la taille du blob
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

      // Envoyer une notification de téléchargement
      await axios.post(
        "http://localhost:8000/api/notifications",
        {
          message: `Vous avez téléchargé le document: ${documentTitle}`,
          type: "document_download",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      if (error.message.includes("401")) {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (error.message.includes("404")) {
        setError("Le document n'a pas été trouvé.");
      } else if (error.message.includes("403")) {
        setError("Vous n'avez pas les droits pour télécharger ce document.");
      } else if (error.message.includes("500")) {
        setError("Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.");
      } else {
        setError(
          error.message || "Impossible de télécharger le document. Veuillez réessayer plus tard."
        );
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mes Documents
      </Typography>

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
                    sx={{
                      bgcolor: "primary.main",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }}
                  >
                    Télécharger PDF
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DocumentList;
