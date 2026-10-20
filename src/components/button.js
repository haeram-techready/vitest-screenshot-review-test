import "./button.css";

export function createButton(label) {
  const button = document.createElement("button");
  button.className = "button";
  button.type = "button";
  button.textContent = label;
  return button;
}
