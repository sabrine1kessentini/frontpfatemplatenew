import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Invoice({ date, id, amount, mode, status, noGutter }) {
  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "info";
    }
  };

  return (
    <MDBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={1}
      pr={1}
      mb={noGutter ? 0 : 1}
    >
      <MDBox lineHeight={1.125}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {date}
        </MDTypography>
        <MDTypography variant="caption" fontWeight="regular" color="text">
          {id} • {mode}
        </MDTypography>
      </MDBox>
      <MDBox display="flex" alignItems="center">
        <MDTypography ml={2} variant="button" fontWeight="medium">
          {amount}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

Invoice.propTypes = {
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default Invoice;
