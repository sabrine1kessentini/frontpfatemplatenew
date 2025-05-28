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
        const token = localStorage.getItem("access_token");
        console.log("Token:", token);

        if (!token) {
          console.error("Aucun token trouvé dans le localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/payments", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        console.log("Response complète:", response);
        console.log("Response data:", response.data);

        if (response.data && response.data.data) {
          setPayments(response.data.data);
        } else {
          console.error("Format de réponse invalide:", response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des paiements:", error);
        if (error.response) {
          console.error("Status:", error.response.status);
          console.error("Headers:", error.response.headers);
          console.error("Data:", error.response.data);
        } else if (error.request) {
          console.error("Pas de réponse reçue:", error.request);
        } else {
          console.error("Erreur de configuration:", error.message);
        }
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
                amount={`${payment.amount} Dt`}
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
