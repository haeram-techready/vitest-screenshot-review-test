import "./toggle.css";

export function createToggle(on) {
  const toggle = document.createElement("span");
  toggle.className = "toggle";
  toggle.setAttribute("role", "switch");
  toggle.setAttribute("aria-checked", String(on));
  const knob = document.createElement("span");
  knob.className = "toggle-knob";
  toggle.append(knob);
  return toggle;
}
