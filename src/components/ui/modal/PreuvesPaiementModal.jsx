import { useState } from "react";
import { Modal } from "../modal"; // Ton composant Modal corrigé
import Button from "../button/Button";
import Swal from "sweetalert2"; // ✅ Ajout de SweetAlert

export default function PreuvesPaiementModal({ show, onClose, onSave }) {
  const [moyenPaiement, setMoyenPaiement] = useState("");
  const [preuves, setPreuves] = useState([]);

  const handleFileChange = (e) => {
    setPreuves(Array.from(e.target.files));
  };

  const handleSubmit = () => {
    if (!moyenPaiement || preuves.length === 0) {
      // ✅ Remplacement de alert par SweetAlert2
      Swal.fire("Attention", "Veuillez sélectionner un moyen de paiement et ajouter au moins une preuve.", "warning");
      return;
    }
    onSave(moyenPaiement, preuves);
  };

  if (!show) return null;

  return (
    <Modal isOpen={show} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Informations de paiement</h2>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Moyen de paiement</label>
          <select
            value={moyenPaiement}
            onChange={(e) => setMoyenPaiement(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">-- Sélectionner --</option>
            <option value="cheque">Chèque</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="especes">Espèces</option>
            <option value="virement_bancaire">Virement Bancaire</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Preuves de paiement (fichiers)</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="button" variant="primary" onClick={handleSubmit}>
            Valider
          </Button>
        </div>
      </div>
    </Modal>
  );
}
