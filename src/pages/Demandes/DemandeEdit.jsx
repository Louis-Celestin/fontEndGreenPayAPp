import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Button from "../../components/ui/button/Button";
import { getDemandeById, updateDemande } from "../../services/demandesServices/demandeService";
import { effectuerPaiement } from "../../services/paiemntsServices/paiementsServices";
import PreuvesPaiementModal from "../../components/ui/modal/PreuvesPaiementModal";
import { ClipLoader } from "react-spinners"; // ✅ Ajout react-spinners pour loader
import PageMeta from "../../components/common/PageMeta";

export default function DemandeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proformaFile, setProformaFile] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [moyenPaiement, setMoyenPaiement] = useState("");
  const [preuvesPaiement, setPreuvesPaiement] = useState([]);

  const [statutEditable, setStatutEditable] = useState(false);

  useEffect(() => {
    const fetchDemande = async () => {
      try {
        const data = await getDemandeById(id);
        setDemande(data.demande);
        setStatutEditable(data.demande.statut === "validation_entite_generale");
      } catch (err) {
        Swal.fire("Erreur", "Impossible de charger la demande", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchDemande();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (demande.statut === "paye") {
        if (!moyenPaiement || preuvesPaiement.length === 0) {
          setShowModal(true);
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("moyen_paiement", moyenPaiement);
        preuvesPaiement.forEach((file) => {
          formData.append("preuvesPaiement", file);
        });

        await effectuerPaiement(demande.id, formData);
        Swal.fire("Succès", "Paiement enregistré avec succès.", "success");
        navigate("/listeDemandes");
      } else {
        const formData = new FormData();
        formData.append("statut", demande.statut);

        if (!statutEditable) {
          formData.append("montant", demande.montant);
          formData.append("motif", demande.motif);
          formData.append("beneficiaire", demande.beneficiaire);
          formData.append("requiert_proforma", demande.requiert_proforma);
          if (proformaFile) formData.append("proforma", proformaFile);
        }

        await updateDemande(id, formData);
        Swal.fire("Succès", "Demande mise à jour avec succès", "success");
        navigate("/listeDemandes");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "Erreur lors de la mise à jour", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatut = (e) => {
    const nouveauStatut = e.target.value;
    setDemande({ ...demande, statut: nouveauStatut });

    if (nouveauStatut === "paye") {
      setShowModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <ClipLoader size={45} color="#4F46E5" loading={true} />
      </div>
    );
  }

  if (!demande) return <p>Aucune demande trouvée</p>;

  return (
    <>
      <PageMeta title="Modifier la demande" description="Modifier les détails de la demande" />
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Modifier la demande #{id}</h2>
      <form onSubmit={handleSubmit}>
        {!statutEditable && (
          <>
            <div className="mb-4">
              <label>Montant</label>
              <input
                type="number"
                value={demande.montant}
                onChange={(e) => setDemande({ ...demande, montant: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label>Motif</label>
              <input
                type="text"
                value={demande.motif}
                onChange={(e) => setDemande({ ...demande, motif: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label>Bénéficiaire</label>
              <input
                type="text"
                value={demande.beneficiaire}
                onChange={(e) => setDemande({ ...demande, beneficiaire: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={demande.requiert_proforma}
                onChange={() =>
                  setDemande({ ...demande, requiert_proforma: !demande.requiert_proforma })
                }
              />
              <label>Cette demande nécessite une proforma</label>
            </div>

            {demande.requiert_proforma && (
              <div className="mb-4">
                <label>Uploader un nouveau fichier proforma (optionnel)</label>
                <input
                  type="file"
                  onChange={(e) => setProformaFile(e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            )}
          </>
        )}

        {statutEditable && (
          <div className="mb-4">
            <label>Nouveau statut</label>
            <select
              value={demande.statut}
              onChange={handleChangeStatut}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="en_attente_paiement">En attente de paiement</option>
              <option value="paye">Payé</option>
              <option value="rejete">Rejeté</option>
            </select>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={() => navigate("/listeDemandes")}>
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            Enregistrer
          </Button>
        </div>
      </form>

      {showModal && (
        <PreuvesPaiementModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={(moyen, fichiers) => {
            setMoyenPaiement(moyen);
            setPreuvesPaiement(fichiers);
            setShowModal(false);
          }}
        />
      )}
    </div>
    </>
  );
}
