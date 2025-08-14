
export async function handleResponse<T>(response: Response): Promise<{ jsonResponse: T; httpStatusCode: number }> {
    if (!response.ok) {
        console.log(response.json())
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    try {
        const jsonResponse = await response.json();
        return { jsonResponse, httpStatusCode: response.status };
    } catch (err: unknown) {
        const errorMessage = (err as Error).message;
        throw new Error(`Error parsing response: ${errorMessage}`);
    }
}

export function isExpiry(dateString: string | null | undefined): boolean {
    if (!dateString) {
        console.warn("La date fournie est null ou undefined.");
        return false; // Par défaut, considérer qu'il n'est pas expiré si aucun paramètre n'est fourni
    }

    const inputDate = new Date(dateString);
    const currentDate = new Date();

    if (isNaN(inputDate.getTime())) {
        console.error("La date fournie n'est pas valide.");
        return false;
    }

    return inputDate < currentDate;
}

export const formatDateT = (dt:any) => {
  const date = new Date(dt);

  if (isNaN(date.getTime())) {
    return 'Date invalide';
  }

  const pad = (n:number) => (n < 10 ? '0' + n : n);

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

 export const formatCurrency = (value: number | string): string => {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  if (isNaN(value)) {
    return '';
  }
   return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(value) // Optional: replace 'XOF' with 'FCFA'
}   

/**
 * Generates a unique transaction ID with a prefix.
 * Format: PREFIX-YYYYMMDD-RANDOM_ALPHANUM
 * @param {string} [prefix='TR'] - A short prefix for the transaction ID.
 * @returns {string} A unique transaction ID, e.g., "PAY-20231027-4B9A1X".
 */
export function generateTransactionId(prefix = 'PAY') {
  const date = new Date();
  const datePart = date.getFullYear().toString() +
                   (date.getMonth() + 1).toString().padStart(2, '0') +
                   date.getDate().toString().padStart(2, '0');

  // Generates a 6-character random alphanumeric string
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `${prefix}-${datePart}-${randomPart}`;
}


export const  formatTime = (datetimeStr : any) => {
  const date = new Date(datetimeStr)
  return date.toISOString().substring(11, 16)
}
