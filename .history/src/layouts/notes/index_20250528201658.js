/* eslint-disable react/jsx-no-undef */
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
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
          <MDBox display="flex" flexDirection="column">
            <span>Note</span>
            <MDTypography variant="caption" sx={{ opacity: 0.8 }}>
              Sur 20
            </MDTypography>
          </MDBox>
        </TableCell>
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
          <TableCell>
            <MDBox display="flex" flexDirection="column">
              <MDTypography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: note.note >= 10 ? "success.main" : "error.main",
                }}
              >
                {note.note}
              </MDTypography>
              <MDTypography variant="caption" color="text.secondary">
                /20
              </MDTypography>
            </MDBox>
          </TableCell>
          <TableCell>
            <MDBox display="flex" flexDirection="column">
              <MDTypography variant="body2" color={darkMode ? "white" : "text"}>
                {formatDate(note.created_at)}
              </MDTypography>
            </MDBox>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>