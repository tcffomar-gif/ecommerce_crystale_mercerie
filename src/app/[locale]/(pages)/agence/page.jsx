// components/AgencyList.js
"use client"
import { useState, useEffect } from 'react';

export default function AgencyList() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAgencies() {
      try {
        const response = await fetch('/api/yalidine-agencies');
        
        if (!response.ok) {
          throw new Error('Impossible de charger les agences');
        }

        const data = await response.json();
        setAgencies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAgencies();
  }, []);

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p style={{ color: 'red' }}>Erreur : {error}</p>;

  return (
    <div style={{ margin: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Agences Yalidine</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {agencies.map((agency) => (
          <div key={agency.id} style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>{agency.name}</h3>
            <p style={{ color: '#666', marginBottom: '8px' }}>{agency.address}</p>
            {agency.wilaya && (
              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' }}>
                {agency.wilaya}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}