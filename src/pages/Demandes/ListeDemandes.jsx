import { useEffect, useState } from "react";
import { getDemandes, deleteDemande } from "../../services/demandesServices/demandeService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaInfo, FaPrint } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { telechargerPDF } from "../../services/paiemntsServices/paiementsServices";

// ✅ Définition des colonnes du DataTable
// const columns = (handleDelete, navigate) => [
//   {
//     name: "ID",
//     selector: (row) => row.id,
//     sortable: true,
//     width: "80px",
//   },
//   {
//     name: "Motif",
//     selector: (row) => row.motif,
//     sortable: true,
//   },
//   {
//     name: "Bénéficiaire",
//     selector: (row) => row.beneficiaire,
//     sortable: true,
//   },
//   {
//     name: "Montant",
//     selector: (row) => `${row.montant} FCFA`,
//     sortable: true,
//   },
//   {
//     name: "Statut",
//     selector: (row) => row.statut,
//     sortable: true,
//     cell: (row) => (
//       <span
//         className={`px-2 py-1 text-sm rounded ${
//           row.statut === "paye"
//             ? "bg-green-100 text-green-700"
//             : row.statut.includes("validation")
//             ? "bg-yellow-100 text-yellow-700"
//             : row.statut === "approuve"
//             ? "bg-blue-100 text-blue-700"
//             : row.statut === "rejete"
//             ? "bg-red-100 text-red-700"
//             : ""
//         }`}
//       >
//         {row.statut}
//       </span>
//     ),
//   },
//   {
//     name: "Actions",
//     cell: (row) => (
//       <div className="flex gap-2">
//         <button
//           onClick={() => navigate(`/demandes/${row.id}`)}
//           className="text-blue-500 hover:text-blue-700"
//           title="Voir"
//         >
//           <FaInfo />
//         </button>
//         <button
//           onClick={() => navigate(`/demandeEdit/${row.id}`)}
//           className="text-blue-500 hover:text-blue-700"
//           title="Modifier"
//         >
//           <FaEdit />
//         </button>
//         <button
//           onClick={() => handleDelete(row.id)}
//           className="text-red-500 hover:text-red-700"
//           title="Supprimer"
//         >
//           <FaTrash />
//         </button>
//         {row.statut === "validation_entite_generale" && (
//         <button
//           className="text-green-600 hover:text-green-800"
//           onClick={() => telechargerPDF(row.id)}
//           title="Télécharger PDF"
//         >
//           <FaPrint/>
//           </button>)}
//       </div>
//     ),
//     ignoreRowClick: true,
//     allowOverflow: true,
//     button: true,
//   },
// ];

const columns = (handleDelete, navigate) => [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
    width: "80px",
  },
  {
    name: "Motif",
    selector: (row) => row.motif,
    sortable: true,
  },
  {
    name: "Bénéficiaire",
    selector: (row) => row.beneficiaire,
    sortable: true,
  },
  {
    name: "Montant",
    selector: (row) => `${row.montant} FCFA`,
    sortable: true,
  },
  {
    name: "Statut",
    selector: (row) => row.statut,
    sortable: true,
    cell: (row) => (
      <span
        className={`px-2 py-1 text-sm rounded ${
          row.statut === "paye"
            ? "bg-green-100 text-green-700"
            : row.statut.includes("validation")
            ? "bg-yellow-100 text-yellow-700"
            : row.statut === "approuve"
            ? "bg-blue-100 text-blue-700"
            : row.statut === "rejete"
            ? "bg-red-100 text-red-700"
            : ""
        }`}
      >
        {row.statut}
      </span>
    ),
  },
  {
    name: "Actions",
    cell: (row) => (
      <div className="flex gap-2">
        {/* 🔍 Voir toujours disponible */}
        <button
          onClick={() => navigate(`/demandes/${row.id}`)}
          className="text-blue-500 hover:text-blue-700"
          title="Voir"
        >
          <FaInfo />
        </button>

        {/* ✏️ Modifier : caché si payé ou rejeté */}
        {row.statut !== "paye" && row.statut !== "rejete" && (
          <button
            onClick={() => navigate(`/demandeEdit/${row.id}`)}
            className="text-blue-500 hover:text-blue-700"
            title="Modifier"
          >
            <FaEdit />
          </button>
        )}

        {/* 🗑️ Supprimer : caché si payé ou rejeté */}
        {row.statut !== "paye" && row.statut !== "rejete" && (
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-500 hover:text-red-700"
            title="Supprimer"
          >
            <FaTrash />
          </button>
        )}

        {/* 🖨️ Télécharger PDF : seulement si validation_entite_generale */}
        {row.statut === "validation_entite_generale" && (
          <button
            className="text-green-600 hover:text-green-800"
            onClick={() => telechargerPDF(row.id)}
            title="Télécharger PDF"
          >
            <FaPrint />
          </button>
        )}
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];


export default function ListeDemandes() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filtreMotif, setFiltreMotif] = useState("");
  const [filtreBenef, setFiltreBenef] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const navigate = useNavigate();
  const utilisateur_id = localStorage.getItem("user_id");

  const fetchDemandes = async () => {
    setLoading(true);
    try {
      const response = await getDemandes(utilisateur_id, currentPage);
      let filtered = response.demandes;

      if (filtreMotif) {
        filtered = filtered.filter((d) =>
          d.motif?.toLowerCase().includes(filtreMotif.toLowerCase())
        );
      }

      if (filtreBenef) {
        filtered = filtered.filter((d) =>
          d.beneficiaire?.toLowerCase().includes(filtreBenef.toLowerCase())
        );
      }

      if (filtreStatut) {
        filtered = filtered.filter((d) => d.statut === filtreStatut);
      }

      if (startDate) {
        filtered = filtered.filter(
          (d) => new Date(d.date_creation) >= new Date(startDate)
        );
      }

      if (endDate) {
        filtered = filtered.filter(
          (d) => new Date(d.date_creation) <= new Date(endDate)
        );
      }

      setDemandes(filtered);
      setTotalPages(response.totalPages);
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: "Impossible de charger les demandes.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
    // eslint-disable-next-line
  }, [currentPage, filtreMotif, filtreBenef, filtreStatut, startDate, endDate]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteDemande(id);
        setDemandes((prev) => prev.filter((demande) => demande.id !== id));
        Swal.fire("Supprimée !", "La demande a été supprimée.", "success");
      } catch (error) {
        Swal.fire("Erreur", "Impossible de supprimer la demande, elle a déjà validée au moins une fois", "error");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Liste des demandes de paiement
      </h2>

      {/* 🔍 Filtres */}
      <div className="p-4 mb-4 bg-gray-50 rounded grid md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold mb-1">Motif</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Rechercher par motif..."
            value={filtreMotif}
            onChange={(e) => setFiltreMotif(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Bénéficiaire</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Rechercher par bénéficiaire..."
            value={filtreBenef}
            onChange={(e) => setFiltreBenef(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Statut</label>
          <select
            className="w-full p-2 border rounded"
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
          >
            <option value="">-- Tous --</option>
            <option value="validation_section">Validation Section</option>
            <option value="validation_entite">Validation Entité</option>
            <option value="validation_entite_generale">Validation Entité Générale</option>
            <option value="approuve">Approuvé</option>
            <option value="paye">Payé</option>
            <option value="rejete">Rejeté</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Date début</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 border rounded"
            placeholderText="Date début"
            isClearable
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Date fin</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 border rounded"
            placeholderText="Date fin"
            isClearable
          />
        </div>
      </div>

      {/* 📄 Tableau */}
      <DataTable
        columns={columns(handleDelete, navigate)}
        data={demandes}
        progressPending={loading}
        pagination
        paginationPerPage={5}
        highlightOnHover
        striped
        responsive
      />
    </div>
  );
}
