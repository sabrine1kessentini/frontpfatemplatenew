import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import DocumentUpload from "./DocumentUpload";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [types, setTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openUpload, setOpenUpload] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(response.data.documents);
      setTypes(response.data.types);
    } catch (err) {
      setError("Erreur lors du chargement des documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDocuments();
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mes Documents
      </Typography>

      <Button variant="contained" onClick={() => setOpenUpload(true)} sx={{ mb: 3 }}>
        Ajouter un Document
      </Button>

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
              <Card sx={{ p: 2 }}>
                <Typography variant="h6">{doc.title}</Typography>
                <Typography color="text.secondary">Type: {types[doc.type]}</Typography>
                <Typography color="text.secondary">
                  Taille: {(doc.file_size / 1024).toFixed(2)} KB
                </Typography>
                <Typography color={doc.is_verified ? "success.main" : "warning.main"}>
                  Statut: {doc.is_verified ? "Vérifié" : "En attente"}
                </Typography>
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => window.open(`/documents/${doc.id}/download`, "_blank")}
                  >
                    Télécharger
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(doc.id)}>
                    Supprimer
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <DocumentUpload
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        types={types}
        refresh={fetchDocuments}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        message={error}
      />
    </Box>
  );
};

export default DocumentList;
