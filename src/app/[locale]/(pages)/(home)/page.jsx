import ChildPage from "./child_page";

// app/[locale]/api/getTopProducts.js
export async function getTopProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_MY_URL}/api/get_Products_plus_vendus`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 }, // Revalidation toutes les heures
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function HomePage() {
  try {
    // Récupération des données avec revalidation côté serveur
    const initialData = await getTopProducts();
    
    // Passer les données au composant client
    return <ChildPage initialData={initialData} />;
  } catch (error) {
    console.error('Error loading initial data:', error);
    // En cas d'erreur, nous passons un tableau vide au composant client
    return <ChildPage initialData={[]} />;
  }
}

// Définir la configuration de revalidation au niveau de la page également
export const revalidate = 3600; // Revalider toutes les heures