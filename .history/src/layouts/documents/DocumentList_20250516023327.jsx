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
      setDocuments(response.data.data || []);
    } catch (err) {
      setError("Erreur lors du chargement des documents");
      console.error(err);
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

      const response = await axios({
        method: "GET",
        url: `http://localhost:8000/api/documents/${documentId}/download`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/pdf",
        },
        responseType: "blob",
      });

      // Vérifier si la réponse est valide
      if (!response.data || response.data.size === 0) {
        throw new Error("Le fichier est vide");
      }

      // Créer un lien de téléchargement
      const blob = new Blob([response.data], { type: "application/pdf" });
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
      console.error("Erreur lors du téléchargement:", error);
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        switch (error.response.status) {
          case 401:
            setError("Session expirée. Veuillez vous reconnecter.");
            break;
          case 404:
            setError("Le document n'a pas été trouvé.");
            break;
          case 403:
            setError("Vous n'avez pas les droits pour télécharger ce document.");
            break;
          default:
            setError(`Erreur serveur: ${error.response.status}`);
        }
      } else if (error.request) {
        // La requête a été faite mais pas de réponse
        setError("Le serveur ne répond pas. Veuillez vérifier votre connexion.");
      } else {
        // Erreur lors de la configuration de la requête
        setError("Erreur lors du téléchargement: " + error.message);
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
