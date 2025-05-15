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

      // Modification ici pour utiliser response.data.data
      setDocuments(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des documents");
      console.error("Erreur détaillée:", err.response);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId, documentTitle) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `http://localhost:8000/api/documents/${documentId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${documentTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Erreur lors du téléchargement");
      console.error(err);
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
