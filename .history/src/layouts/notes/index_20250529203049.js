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
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Icon from "@mui/material/Icon";
import LinearProgress from "@mui/material/LinearProgress";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";

function Notes() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [notes, setNotes] = useState([]);
  const [semestre, setSemestre] = useState("1");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedNote, setExpandedNote] = useState(null);
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
        // Trier les notes par matière
        const sortedNotes = response.data.sort((a, b) => a.matiere.localeCompare(b.matiere));
        setNotes(sortedNotes);
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

  const handleExpandClick = (noteId) => {
    setExpandedNote(expandedNote === noteId ? null : noteId);
  };

  const calculateStats = () => {
    if (!notes.length) return { moyenne: 0, reussite: 0, echec: 0 };

    const moyenne = notes.reduce((acc, note) => acc + note.note, 0) / notes.length;
    const reussite = notes.filter((note) => note.note >= 10).length;
    const echec = notes.filter((note) => note.note < 10).length;

    return {
      moyenne: moyenne.toFixed(2),
      reussite,
      echec,
    };
  };

  const stats = calculateStats();
  const pieData = [
    { name: "Réussite", value: stats.reussite },
    { name: "Échec", value: stats.echec },
  ];

  const COLORS = ["#4CAF50", "#f44336"];

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
        <Grid container spacing={3}>
          {/* En-tête avec statistiques */}
          <Grid item xs={12}>
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
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <MDTypography variant="h6" color="white">
                      Mes Notes - Semestre {semestre}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                      <Card
                        onClick={() => handleSemestreClick("1")}
                        sx={{
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
                </Grid>
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <MDBox p={3}>
                <MDBox display="flex" alignItems="center">
                  <MDBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="4rem"
                    height="4rem"
                    borderRadius="lg"
                    bgColor="success"
                    color="white"
                    mr={2}
                  >
                    <Icon fontSize="large">check_circle</Icon>
                  </MDBox>
                  <MDBox>
                    <MDTypography variant="h6" color="text">
                      Réussite
                    </MDTypography>
                    <MDTypography variant="h4" color="text">
                      {stats.reussite}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <MDBox p={3}>
                <MDBox display="flex" alignItems="center">
                  <MDBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="4rem"
                    height="4rem"
                    borderRadius="lg"
                    bgColor="error"
                    color="white"
                    mr={2}
                  >
                    <Icon fontSize="large">warning</Icon>
                  </MDBox>
                  <MDBox>
                    <MDTypography variant="h6" color="text">
                      Échec
                    </MDTypography>
                    <MDTypography variant="h4" color="text">
                      {stats.echec}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          {/* Graphique et tableau */}
          <Grid item xs={12} md={4}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h6" color="text" mb={2}>
                  Répartition des résultats
                </MDTypography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <MDBox p={3}>
                {error ? (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                ) : notes.length === 0 ? (
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
                          <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                            Note
                          </TableCell>
                          <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                          <TableCell sx={{ width: "50px" }} />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {notes.map((note) => (
                          <React.Fragment key={`${note.matiere}-${note.semestre}`}>
                            <TableRow
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
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={(note.note / 20) * 100}
                                    sx={{
                                      width: 100,
                                      height: 8,
                                      borderRadius: 4,
                                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                                      "& .MuiLinearProgress-bar": {
                                        bgcolor: note.note >= 10 ? "success.main" : "error.main",
                                      },
                                    }}
                                  />
                                  <MDTypography
                                    variant="body2"
                                    sx={{
                                      fontWeight: "bold",
                                      color: note.note >= 10 ? "success.main" : "error.main",
                                    }}
                                  >
                                    {`${note.note}/20`}
                                  </MDTypography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="body2" color={darkMode ? "white" : "text"}>
                                  {formatDate(note.created_at)}
                                </MDTypography>
                              </TableCell>
                              <TableCell>
                                {note.commentaire && (
                                  <IconButton
                                    size="small"
                                    onClick={() => handleExpandClick(note.id)}
                                    sx={{
                                      transform:
                                        expandedNote === note.id
                                          ? "rotate(180deg)"
                                          : "rotate(0deg)",
                                      transition: "transform 0.3s",
                                    }}
                                  >
                                    <Icon>expand_more</Icon>
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                            {note.commentaire && (
                              <TableRow>
                                <TableCell colSpan={4} sx={{ py: 0 }}>
                                  <Collapse
                                    in={expandedNote === note.id}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <MDBox
                                      sx={{
                                        p: 2,
                                        bgcolor: (theme) => alpha(theme.palette.info.main, 0.05),
                                        borderTop: 1,
                                        borderColor: "divider",
                                      }}
                                    >
                                      <MDTypography
                                        variant="body2"
                                        color={darkMode ? "white" : "text"}
                                        sx={{ fontStyle: "italic" }}
                                      >
                                        {note.commentaire}
                                      </MDTypography>
                                    </MDBox>
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Notes;
