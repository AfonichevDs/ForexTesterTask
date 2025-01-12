import { monthNames } from "./constants.js";

// Example format: "DD MMM YYYY HH:mm" (e.g., "1 Jun 2003 04:00")
export function formatDateTime(unixSeconds: number): string {
    if (unixSeconds < 0 || !Number.isFinite(unixSeconds)) {
        throw new Error('Invalid input: unixSeconds must represent a valid timestamp.');
    }
    const date = new Date(unixSeconds * 1000);
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const year = date.getFullYear();
    return `${day} ${month} ${year} ${hours}:${minutes}`;
}