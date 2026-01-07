import { NextResponse } from "next/server";

export async function GET(request) {
  // Récupérer le paramètre wilaya de l'URL
  const { searchParams } = new URL(request.url);
  const wilaya = searchParams.get('wilaya');
  console.log(wilaya)

  if (!wilaya) {
    return NextResponse.json(
      { error: "Le paramètre 'wilaya' est requis" },
      { status: 400 }
    );
  }

  try {
    const apiUrl = `https://api.yalidine.com/v1/centers?wilaya_id=${Number(wilaya)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-API-ID': process.env.YALIDINE_API_ID,
        'X-API-TOKEN': process.env.YALIDINE_API_TOKEN,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 3600 } // Cache les données pendant 1 heure
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Échec de la récupération des centres');
    }

    const my_data = await response.json();
    console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa***************************************************")
    console.log(my_data)

    // Formater la réponse
    const formattedCenters = my_data.data

    
    return NextResponse.json(formattedCenters);

  } catch (error) {
    console.error('Erreur API Yalidine:', error);
    return NextResponse.json(
      { 
        error: error.message || "Erreur lors de la récupération des centres",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}