import "./badge.css";

export function createBadge(label) {
  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = label;
  return badge;
}
