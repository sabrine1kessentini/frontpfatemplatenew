import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";

const DocumentUpload = ({ open, onClose, types, refresh }) => {
  const [form, setForm] = useState({
    type: "",
    title: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.type || !form.title || !form.file) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("type", form.type);
      formData.append("title", form.title);
      formData.append("file", form.file);

      const token = localStorage.getItem("access_token");
      await axios.post("http://localhost:8000/api/documents", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      refresh();
      onClose();
      setForm({ type: "", title: "", file: null });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un Document</DialogTitle>
      <DialogContent sx={{ pt: 2, minWidth: 400 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Type de document</InputLabel>
          <Select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            label="Type de document"
          >
            {Object.entries(types).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Titre du document"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          sx={{ mb: 3 }}
        />

        <Button variant="contained" component="label" fullWidth>
          Sélectionner un fichier PDF
          <input
            type="file"
            hidden
            accept=".pdf"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
          />
        </Button>
        {form.file && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Fichier sélectionné : {form.file.name}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Envoyer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DocumentUpload.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  types: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default DocumentUpload;
