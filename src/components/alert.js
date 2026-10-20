import "./alert.css";

export function createAlert(message) {
  const alert = document.createElement("div");
  alert.className = "alert";
  alert.setAttribute("role", "alert");
  alert.textContent = message;
  return alert;
}
