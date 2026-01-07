// cette fontion pour calculé le nouveau price avec la réduction

// export function calculateTotalPrice(my_obj, quantity, unitPrice) {
//   const { quantité, price: reduction } = my_obj;
  
//   // Calculer le prix total sans réduction
//   let totalPrice = quantity * unitPrice;
  
//   // Calculer le nombre de réductions applicables
//   const numberOfReductions = Math.floor(quantity / quantité);
  
//   // Appliquer la réduction
//   totalPrice -= numberOfReductions * reduction;
  
//   return totalPrice;
// }



export function calculateTotalPrice(reductions, totalQuantity, unitPrice) {
  // Trier les réductions par quantité décroissante
  reductions.sort((a, b) => b.quantite - a.quantite);

  let totalPrice = totalQuantity * unitPrice; // Prix total sans réduction
  let remainingQuantity = totalQuantity; // Quantité restante à traiter

  // Appliquer les réductions en cascade
  for (const reduction of reductions) {
    const { quantite: reductionQuantity, reduction: reductionAmount } = reduction;

    // Vérifier si la réduction peut être appliquée
    if (remainingQuantity >= reductionQuantity) {
      const numberOfReductions = Math.floor(remainingQuantity / reductionQuantity); // Nombre de fois où la réduction est appliquée
      totalPrice -= numberOfReductions * reductionAmount; // Soustraire la réduction du prix total
      remainingQuantity -= numberOfReductions * reductionQuantity; // Mettre à jour la quantité restante
    }

    // Si la quantité restante est nulle, on arrête
    if (remainingQuantity === 0) break;
  }

  return totalPrice;
}



// Version optimisée de calculateTotalPricev2
export function calculateTotalPricev2(reductions, totalQuantity, totalPrice) {
  // Créer une copie triée pour ne pas modifier l'original
  const sortedReductions = [...reductions].sort((a, b) => b.quantite - a.quantite);
  
  let remainingQuantity = totalQuantity;
  let finalPrice = totalPrice;

  for (const reduction of sortedReductions) {
    if (remainingQuantity <= 0) break;
    
    const { quantite: reductionQuantity, reduction: reductionAmount } = reduction;
    
    if (remainingQuantity >= reductionQuantity) {
      const reductionCount = Math.floor(remainingQuantity / reductionQuantity);
      finalPrice -= reductionCount * reductionAmount;
      remainingQuantity -= reductionCount * reductionQuantity;
    }
  }

  return finalPrice;
}

