import "./text-field.css";

export function createTextField(label, value) {
  const field = document.createElement("label");
  field.className = "text-field";
  const caption = document.createElement("span");
  caption.className = "text-field-label";
  caption.textContent = label;
  const input = document.createElement("input");
  input.className = "text-field-input";
  input.value = value;
  field.append(caption, input);
  return field;
}
