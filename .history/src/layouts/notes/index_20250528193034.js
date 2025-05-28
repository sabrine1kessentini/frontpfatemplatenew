import React, { useState, useEffect } from "react"; // Added React import
import axios from "axios";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [semestre, setSemestre] = useState("1");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/notes?semestre=${semestre}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(response.data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [semestre]);

  return React.createElement(
    Card,
    { sx: { p: 3 } },
    React.createElement(
      Grid,
      { container: true, spacing: 3 },
      React.createElement(
        Grid,
        { item: true, xs: 12 },
        React.createElement(
          Select,
          {
            value: semestre,
            onChange: (e) => setSemestre(e.target.value),
            fullWidth: true,
          },
          React.createElement(MenuItem, { value: "1" }, "Semestre 1"),
          React.createElement(MenuItem, { value: "2" }, "Semestre 2")
        )
      ),
      React.createElement(
        Grid,
        { item: true, xs: 12 },
        loading
          ? React.createElement(Typography, null, "Chargement...")
          : notes.length > 0
          ? React.createElement(
              TableContainer,
              { component: Paper },
              React.createElement(
                Table,
                null,
                React.createElement(
                  TableHead,
                  null,
                  React.createElement(
                    TableRow,
                    null,
                    React.createElement(TableCell, null, "Matière"),
                    React.createElement(TableCell, { align: "right" }, "Note"),
                    React.createElement(TableCell, null, "Date")
                  )
                ),
                React.createElement(
                  TableBody,
                  null,
                  notes.map((note) =>
                    React.createElement(
                      TableRow,
                      {
                        key: `${note.matiere}-${note.semestre}`,
                      },
                      React.createElement(TableCell, null, note.matiere),
                      React.createElement(TableCell, { align: "right" }, `${note.note}/20`),
                      React.createElement(
                        TableCell,
                        null,
                        new Date(note.created_at).toLocaleDateString("fr-FR")
                      )
                    )
                  )
                )
              )
            )
          : React.createElement(Typography, null, "Aucune note trouvée")
      )
    )
  );
}

export default Notes;
