import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatDisplayData(value) {
    if (value === null || value === undefined) return "-";
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed === "" || trimmed === "N/A" || trimmed === "n/a") return "-";
    }
    return value;
}
