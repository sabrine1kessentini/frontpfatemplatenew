import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:8000/api/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, title) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`http://localhost:8000/api/documents/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      // Création du blob et téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Erreur de téléchargement:", err);
      setError("Erreur lors du téléchargement du document");
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      releve_notes: "Relevé de notes",
      attestation: "Attestation",
      certificat: "Certificat",
    };
    return types[type] || type;
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Mes Documents
      </Typography>

      {documents.length === 0 ? (
        <Alert severity="info">Aucun document disponible</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Titre</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Taille</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{getTypeLabel(doc.type)}</TableCell>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{formatDate(doc.created_at)}</TableCell>
                  <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDownload(doc.id, doc.title)}
                      size="small"
                    >
                      Télécharger
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default DocumentList;
