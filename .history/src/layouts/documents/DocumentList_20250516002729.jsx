import React, { useState, useEffect } from "react";
import { Box, Card, Grid, Typography, CircularProgress, Alert, Button } from "@mui/material";
import axios from "axios";
import DocumentUpload from "./DocumentUpload";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);

  const documentTypes = {
    releve_notes: "Relevé de notes",
    attestation: "Attestation de présence",
    certificat: "Certificat",
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:8000/api/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(response.data.documents);
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
    return documentTypes[type] || type;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Mes Documents
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setUploadOpen(true)}>
          Ajouter un Document
        </Button>
      </Box>

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

      <DocumentUpload
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        types={documentTypes}
        refresh={fetchDocuments}
      />
    </Box>
  );
};

export default DocumentList;
