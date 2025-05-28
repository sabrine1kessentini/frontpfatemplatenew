import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
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
import { useAuth } from "authContext";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";

function Notes() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [notes, setNotes] = useState([]);
  const [semestre, setSemestre] = useState("1");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/authentication/sign-in");
      return;
    }

    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/authentication/sign-in");
          return;
        }

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
  }, [semestre, navigate, user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const handleSemestreClick = (selectedSemestre) => {
    setSemestre(selectedSemestre);
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
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Card
                      onClick={() => handleSemestreClick("1")}
                      sx={{
                        flex: 1,
                        p: 2,
                        cursor: "pointer",
                        bgcolor: semestre === "1" ? "info.main" : "background.paper",
                        color: semestre === "1" ? "white" : "text.primary",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: (theme) => theme.shadows[4],
                          bgcolor: semestre === "1" ? "info.main" : alpha("#1976d2", 0.1),
                        },
                      }}
                    >
                      <MDTypography variant="h6" align="center">
                        Semestre 1
                      </MDTypography>
                    </Card>
                    <Card
                      onClick={() => handleSemestreClick("2")}
                      sx={{
                        flex: 1,
                        p: 2,
                        cursor: "pointer",
                        bgcolor: semestre === "2" ? "info.main" : "background.paper",
                        color: semestre === "2" ? "white" : "text.primary",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: (theme) => theme.shadows[4],
                          bgcolor: semestre === "2" ? "info.main" : alpha("#1976d2", 0.1),
                        },
                      }}
                    >
                      <MDTypography variant="h6" align="center">
                        Semestre 2
                      </MDTypography>
                    </Card>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  {notes.length === 0 ? (
                    <MDTypography variant="body2" color={darkMode ? "white" : "text"}>
                      Aucune note disponible pour le semestre {semestre}
                    </MDTypography>
                  ) : (
                    <TableContainer 
                      component={Paper}
                      sx={{
                        boxShadow: (theme) => theme.shadows[3],
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: "info.main" }}>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Matière</TableCell>
                            <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>Note</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {notes.map((note) => (
                            <TableRow 
                              key={`${note.matiere}-${note.semestre}`}
                              sx={{
                                "&:nth-of-type(odd)": {
                                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.05),
                                },
                                "&:hover": {
                                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                                },
                              }}
                            >
                              <TableCell>
                                <MDTypography variant="body2" color={darkMode ? "white" : "text"}>
                                  {note.matiere}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="right">
                                <MDTypography 
                                  variant="body2" 
                                  color={darkMode ? "white" : "text"}
                                  sx={{
                                    fontWeight: "bold",
                                    color: note.note >= 10 ? "success.main" : "error.main",
                                  }}
                                >
                                  {`${note.note}/20`}
                                </MDTypography>
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="body2" color={darkMode ? "white" : "text"}>
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
