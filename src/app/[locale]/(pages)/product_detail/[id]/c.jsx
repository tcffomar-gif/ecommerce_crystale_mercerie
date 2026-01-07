import { useState, useEffect } from 'react';

const DeliveryForm = () => {
  // Votre état existant
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    confirmedPhoneNumber: "",
    wilaya: "",
    deliveryType: "relayPoint", // Valeur par défaut
    commune: "",  
    address: "",
    relayPoint: "",
    relayPointId: "",
    relayPointAddress: ""
  });

  const [relayPoints, setRelayPoints] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [pointsError, setPointsError] = useState(null);

  // Récupération des points relais
  useEffect(() => {
    const fetchRelayPoints = async () => {
      if (formData.wilaya) {
        setLoadingPoints(true);
        setPointsError(null);
        
        try {
          const wilayaId = wilayasWithPrices2.find(w => 
            w.name.includes(formData.wilaya) || 
            w.name_sans_Nm === formData.wilaya
          )?.name.split(" - ")[0];
          
          if (wilayaId) {
            const response = await fetch(`/api/yalidine/relay-points?wilayaId=${wilayaId}`);
            
            if (!response.ok) throw new Error('Erreur de récupération');
            
            const data = await response.json();
            setRelayPoints(data);
            
            // Réinitialiser la sélection si les points changent
            if (formData.relayPointId && !data.some(p => p.id === formData.relayPointId)) {
              setFormData(prev => ({
                ...prev,
                relayPointId: "",
                relayPoint: "",
                relayPointAddress: ""
              }));
            }
          }
        } catch (error) {
          console.error("Erreur:", error);
          setPointsError("Impossible de charger les points relais");
          setRelayPoints([]);
        } finally {
          setLoadingPoints(false);
        }
      }
    };
    
    fetchRelayPoints();
  }, [formData.wilaya]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRelayPointChange = (e) => {
    const selectedId = Number(e.target.value);
    const selectedPoint = relayPoints.find(p => p.id === selectedId);
    
    if (selectedPoint) {
      setFormData(prev => ({
        ...prev,
        relayPointId: selectedPoint.id,
        relayPoint: selectedPoint.name,
        relayPointAddress: selectedPoint.address,
        // Effacer l'adresse si on passe en point relais
        ...(prev.deliveryType === "homeDelivery" && { address: "" })
      }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Champs de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Nom complet</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label>Téléphone</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      {/* Sélection de la wilaya */}
      <div>
        <label>Wilaya</label>
        <select
          name="wilaya"
          value={formData.wilaya}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Sélectionnez une wilaya</option>
          {wilayasWithPrices2.map(wilaya => (
            <option key={wilaya.name} value={wilaya.name}>
              {wilaya.name}
            </option>
          ))}
        </select>
      </div>

      {/* Type de livraison */}
      <div className="flex space-x-6 my-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="deliveryType"
            checked={formData.deliveryType === "relayPoint"}
            onChange={() => setFormData(prev => ({
              ...prev,
              deliveryType: "relayPoint",
              address: "" // Effacer l'adresse si on passe en point relais
            }))}
            className="mr-2"
          />
          Point Relais
        </label>
        
        <label className="flex items-center">
          <input
            type="radio"
            name="deliveryType"
            checked={formData.deliveryType === "homeDelivery"}
            onChange={() => setFormData(prev => ({
              ...prev,
              deliveryType: "homeDelivery",
              relayPointId: "", // Effacer le point relais
              relayPoint: "",
              relayPointAddress: ""
            }))}
            className="mr-2"
          />
          Livraison à domicile
        </label>
      </div>

      {/* Point relais OU adresse */}
      {formData.deliveryType === "relayPoint" ? (
        <div>
          <label>Point Relais</label>
          {loadingPoints ? (
            <div className="p-3 text-center bg-gray-100 rounded">
              Chargement des points relais...
            </div>
          ) : pointsError ? (
            <div className="p-3 text-red-500 bg-red-50 rounded">
              {pointsError}
            </div>
          ) : (
            <select
              name="relayPointId"
              value={formData.relayPointId}
              onChange={handleRelayPointChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sélectionnez un point relais</option>
              {relayPoints.map(point => (
                <option key={point.id} value={point.id}>
                  {point.name} - {point.address}
                </option>
              ))}
            </select>
          )}
          
          {formData.relayPointId && (
            <div className="mt-2 p-3 bg-blue-50 rounded">
              <p className="font-medium">{formData.relayPoint}</p>
              <p className="text-sm">{formData.relayPointAddress}</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <label>Adresse de livraison</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows="3"
            required
          />
        </div>
      )}

      {/* Commune (si nécessaire) */}
      {formData.deliveryType === "homeDelivery" && (
        <div>
          <label>Commune</label>
          <input
            type="text"
            name="commune"
            value={formData.commune}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      )}
    </div>
  );
};

export default DeliveryForm;