/**
 * Formatea un monto numérico a Pesos Chilenos (CLP)
 * Ej: 14990 -> "$14.990"
 */
export function formatCLP(value) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

/**
 * Formatea una fecha a formato local chileno
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
