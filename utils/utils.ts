export function formatDateTime(unixSeconds: number): string {
    const date = new Date(unixSeconds * 1000);
    // Example format: "DD MMM HH:mm" (e.g., "1 Jun 04:00")
    const day = date.getDate();
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun",
                        "Jul","Aug","Sep","Oct","Nov","Dec"];
    const month = monthNames[date.getMonth()];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const year = date.getFullYear();
    return `${day} ${month} ${year} ${hours}:${minutes}`;
}