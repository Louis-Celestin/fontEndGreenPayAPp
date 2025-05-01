import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { effectuerPaiement, reporterPaiement } from "../../services/paiemntsServices/paiementsServices";
import Swal from "sweetalert2";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import API_URL from "../../config/url";

export default function PaiementDetail() {
  const { demande_id } = useParams();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemandeDetail = async () => {
      try {
        const response = await fetch(`${API_URL}/demandes/getDemandePaiementById/${demande_id}`);
        const data = await response.json();
        setDemande(data.demande);
      } catch (error) {
        Swal.fire("Erreur", "Impossible de charger les détails de la demande.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchDemandeDetail();
  }, [demande_id]);

  if (loading) return <p>Chargement...</p>;
  if (!demande) return <p>Aucune demande trouvée.</p>;

  return (
    <>
      <PageMeta title={`Détails du paiement #${demande.id}`} />
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Détails de la Demande #{demande.id}</h2>
      <p><strong>Montant:</strong> {demande.montant} FCFA</p>
      <p><strong>Bénéficiaire:</strong> {demande.beneficiaire}</p>
      <p><strong>Motif:</strong> {demande.motif}</p>
      <div className="mt-4 flex gap-2">
        <Button onClick={() => effectuerPaiement(demande.id, "Chèque")}>💰 Payer</Button>
        <Button variant="danger" onClick={() => reporterPaiement(demande.id, "Manque de fonds")}>⏳ Reporter</Button>
      </div>
    </div>
    </>
  );
}
