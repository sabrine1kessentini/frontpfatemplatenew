import { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Invoice from "layouts/billing/components/Invoice";

function Invoices() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/payments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(response.data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des paiements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <MDBox p={3}>Chargement en cours...</MDBox>;
  }

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Historique des Paiements
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <Invoice
                key={payment.id}
                date={new Date(payment.created_at).toLocaleDateString("fr-FR")}
                id={`#PY-${payment.id}`}
                amount={`${payment.amount} DH`}
                mode={payment.payment_mode}
                status={payment.status}
              />
            ))
          ) : (
            <MDTypography variant="body2" color="textSecondary">
              Aucun paiement enregistré
            </MDTypography>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Invoices;
