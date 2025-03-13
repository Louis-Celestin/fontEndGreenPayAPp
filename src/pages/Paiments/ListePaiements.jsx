import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPaiementsEnAttente, effectuerPaiement, reporterPaiement } from "../../services/paiemntsServices/paiementsServices"
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import Button from "../../components/ui/button/Button";

export default function ListePaiements() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const DAF_id = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        const response = await getPaiementsEnAttente(DAF_id);
        setPaiements(response);
      } catch (error) {
        Swal.fire("Erreur", "Impossible de charger les paiements en attente.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPaiements();
  }, [DAF_id]);


const handlePaiement = async (id) => {
    const { value: formValues } = await Swal.fire({
      title: "Effectuer le paiement",
      html: `
        <label for="moyen_paiement" class="block text-left text-gray-700 font-medium mb-1">Moyen de paiement :</label>
        <select id="moyen_paiement" class="swal2-input">
          <option value="cheque">Chèque</option>
          <option value="mobile_money">Mobile Money</option>
          <option value="especes">Espèces</option>
        </select>
  
        <label for="fichiers" class="block text-left text-gray-700 font-medium mt-3 mb-1">Preuve de paiement :</label>
        <input type="file" id="fichiers" class="swal2-file">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "💰 Confirmer le paiement",
      preConfirm: () => {
        const moyen_paiement = document.getElementById("moyen_paiement").value;
        const fileInput = document.getElementById("fichiers");
        
        if (!moyen_paiement) {
          Swal.showValidationMessage("Veuillez sélectionner un moyen de paiement");
        }
        console.log("TABLE DE FILEINPUT")
        console.log(fileInput)
        if (fileInput.files.length === 0) {
          Swal.showValidationMessage("Veuillez ajouter une preuve de paiement");
        }
        
        return { moyen_paiement, fichier: fileInput.files[0] };
      }
    });
  
    if (formValues) {
      try {
        const formData = new FormData();
        formData.append("moyen_paiement", formValues.moyen_paiement);
        formData.append("fichiers", formValues.fichier);
  
        await effectuerPaiement(id, formData);
        setPaiements(paiements.filter((paiement) => paiement.id !== id));
  
        Swal.fire("Paiement effectué !", "La demande a été réglée.", "success");
      } catch (error) {
        Swal.fire("Erreur", "Impossible d'effectuer le paiement.", "error");
      }
    }
  };
  

  // ✅ Reporter un paiement
  const handleReport = async (id) => {
    const { value: commentaire } = await Swal.fire({
      title: "Reporter le paiement",
      input: "textarea",
      inputLabel: "Raison du report",
      inputPlaceholder: "Indiquez la raison...",
      showCancelButton: true,
    });

    if (commentaire) {
      try {
        await reporterPaiement(id, commentaire).then((results)=>{console.log(results)}).catch(err=>console.log(err))
        setPaiements(paiements.filter((paiement) => paiement.id !== id));
        Swal.fire("Reporté !", "La demande a été mise en attente.", "success");
      } catch (error) {
        Swal.fire("Erreur", "Impossible de reporter le paiement.", "error");
      }
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "80px" },
    { name: "Montant (FCFA)", selector: (row) => row.montant, sortable: true},
    { name: "Bénéficiaire", selector: (row) => row.beneficiaire, sortable: true },
    { name: "Statut", selector: (row) => row.statut },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          {/* <Button size="xs" variant="primary" onClick={() => navigate(`/paiementDetail/${row.id}`)}>
            🔍 Voir
          </Button> */}
          <Button size="xs" onClick={() => handlePaiement(row.id)}>
            💰 Payer
          </Button>
          <Button size="xs" variant="danger" onClick={() => handleReport(row.id)}>
            ⏳ Reporter
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Demandes en attente de paiement</h2>
      <DataTable columns={columns} data={paiements} progressPending={loading} pagination highlightOnHover striped responsive paginationPerPage={5}
        paginationTotalRows={paiements.length}/>
    </div>
  );
}
