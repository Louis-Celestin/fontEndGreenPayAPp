import { useEffect, useState } from "react";
import { getValidationsByDemande } from "../../services/validationsServices/validationServices";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import Button from "../../components/ui/button/Button";
import { useNavigate } from "react-router-dom";

export default function ValidationsDone() {
  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);
  const utilisateurId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchValidations = async () => {
      try {
        const response = await getValidationsByDemande(utilisateurId);
        setValidations(response);
      } catch (error) {
        Swal.fire({
          title: "Erreur",
          text: "Vous n'avez effectué aucune validation.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchValidations();
  }, [utilisateurId]);

  // ✅ Définition des colonnes pour react-data-table
  const columns = [
    { name: "ID Validation", selector: (row) => row.id, sortable: true, },
    { name: "ID Demande", selector: (row) => row.demande_id, sortable: true,},
    { name: "Montant (FCFA)", selector: (row) => row.demandes_paiement.montant, sortable: true, right: true },
    { name: "Bénéficiaire", selector: (row) => row.demandes_paiement.beneficiaire, sortable: true },
    { name: "Statut", selector: (row) => row.statut, sortable: true, 
      cell: (row) => (
        <span
          className={`px-2 py-1 text-sm rounded ${
            row.statut === "approuve" ? "bg-green-100 text-green-700" :
            row.statut === "rejete" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.statut}
        </span>
      ),
    },
    {
      name: "Commentaire",
      selector: (row) => row.commentaire || "Aucun",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button size="xs" onClick={() => navigate(`/demandes/${row.demande_id}`)}>
          🔍 Voir Demande
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Mes validations effectuées</h2>
      
      <DataTable
        columns={columns}
        data={validations}
        progressPending={loading}
        pagination
        paginationPerPage={5}
        paginationTotalRows={validations.length}
        highlightOnHover
        striped
        responsive
      />
    </div>
  );
}
