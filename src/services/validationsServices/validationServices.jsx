import axios from "axios";

// URL de base de l'API backend
const API_URL = "http://localhost:5000/api/validations";

/**
 * ✅ Récupérer les demandes en attente de validation pour l'utilisateur connecté
 * @param {number} validateur_id - ID de l'utilisateur connecté
 * @returns {Promise<Array>} - Liste des demandes en attente
 */
export const getDemandesEnAttente = async (validateur_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/en_attente/${validateur_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.demandes;
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors du chargement des demandes en attente.";
  }
};

/**
 * ✅ Valider une demande de paiement
 * @param {number} demande_id - ID de la demande à valider
 * @param {number} valideur_id - ID du validateur
 * @returns {Promise<Object>} - Réponse de l'API
 */
export const validerDemande = async (demande_id, valideur_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/${demande_id}/valider`,
      { valideur_id, statut: "approuve" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors de la validation.";
  }
};

/**
 * ✅ Rejeter une demande de paiement avec un commentaire
 * @param {number} demande_id - ID de la demande à rejeter
 * @param {number} valideur_id - ID du validateur
 * @param {string} commentaire - Raison du rejet
 * @returns {Promise<Object>} - Réponse de l'API
 */
export const rejeterDemande = async (demande_id, valideur_id, commentaire) => {
  console.log(demande_id)
  console.log(commentaire)
  console.log(valideur_id)
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/${demande_id}/valider`,
      { valideur_id, statut: "rejete", commentaire },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.log(error)
    throw error.response?.data?.message || "Erreur lors du rejet de la demande.";
  }
};

/**
 * ✅ Récupérer l'historique des validations d'une demande
 * @param {number} demande_id - ID de la demande concernée
 * @returns {Promise<Array>} - Liste des validations effectuées sur cette demande
 */
export const getValidationsByDemande = async (validateur_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/getValidationsByValidateur/${validateur_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors du chargement de l'historique des validations.";
  }
};
