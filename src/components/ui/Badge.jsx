import { cn } from "@/lib/utils";

const Badge = ({ status, className }) => {
  let variantClass = "bg-gray-100 text-gray-800"; // default

  switch (status?.toLowerCase()) {
    case "resolved":
      variantClass = "bg-[#1F3C88] text-white";
      break;
    case "in-progress":
    case "in progress":
      variantClass = "bg-blue-100 text-blue-700 font-medium";
      break;
    case "settling":
      variantClass =
        "bg-gray-100 text-gray-800 font-bold uppercase text-xs tracking-wide";
      break;
    case "charge":
      variantClass = "text-gray-600 font-medium uppercase text-xs";
      break;
    default:
      variantClass = "bg-gray-100 text-gray-800";
  }

  // Handle "Charge" differently if it's just text, but usually badge implies a pill
  // Based on transaction image, "CHARGE" is just text, "SETTLING" is bold text.
  // "Resolved" / "In Progress" are rounded pills.

  const isPill = ["resolved", "in-progress", "in progress"].includes(
    status?.toLowerCase()
  );

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2.5 py-0.5",
        isPill ? "rounded-full text-xs font-medium" : "text-sm",
        variantClass,
        className
      )}
    >
      {status}
    </span>
  );
};

export default Badge;
