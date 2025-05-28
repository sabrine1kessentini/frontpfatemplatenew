import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

function Notes() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [notes, setNotes] = useState([]);
  const [semestre, setSemestre] = useState("1");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8000/api/notes?semestre=${semestre}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors du chargement des notes");
        setLoading(false);
        if (err.response?.status === 401) {
          navigate("/authentication/sign-in");
        }
      }
    };

    fetchNotes();
  }, [semestre, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress color="info" />
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox
            mx={2}
            mt={-3}
            py={3}
            px={2}
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <MDTypography variant="h6" color="white">
              Mes Notes
            </MDTypography>
          </MDBox>
          <MDBox p={3}>
            {error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Select value={semestre} onChange={(e) => setSemestre(e.target.value)} fullWidth>
                    <MenuItem value="1">Semestre 1</MenuItem>
                    <MenuItem value="2">Semestre 2</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  {notes.length === 0 ? (
                    <MDTypography variant="body2" color={darkMode ? "white" : "text"}>
                      Aucune note disponible
                    </MDTypography>
                  ) : (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Matière</TableCell>
                            <TableCell align="right">Note</TableCell>
                            <TableCell>Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {notes.map((note) => (
                            <TableRow key={`${note.matiere}-${note.semestre}`}>
                              <TableCell>
                                <MDTypography variant="caption" color={darkMode ? "white" : "text"}>
                                  {note.matiere}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="right">
                                <MDTypography variant="caption" color={darkMode ? "white" : "text"}>
                                  {`${note.note}/20`}
                                </MDTypography>
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="caption" color={darkMode ? "white" : "text"}>
                                  {formatDate(note.created_at)}
                                </MDTypography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Grid>
              </Grid>
            )}
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default Notes;
