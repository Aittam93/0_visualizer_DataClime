/**
 * File: calculateBreaks.js
 * Description: Calcola i breakpoint della tematizzazione delle mappe.
 * Author: Mattia Scalas
 * Date: Dicembre 2024
 * Possibili modifiche: si potrebbe usare una logica più raffinata (magari librerie esterne)
 */

/**
 * Calcola i breakpoints (5 intervalli) per l'array di valori fornito.
 * @param {number[]} values - L'array di valori da dividere in classi
 * @returns {number[]} - L'array di breakpoints calcolati
 */
export function calculateBreaks(values) {
  if (!values || values.length === 0) {
    return [];
  }

  // Ordina i valori
  values.sort((a, b) => a - b);

  // Array di breakpoint
  const breaks = [];
  for (let i = 0; i <= 5; i++) {
    const index = Math.floor((i / 5) * (values.length - 1));
    breaks.push(values[index]);
  }

  return breaks;
}
