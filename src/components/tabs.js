import "./tabs.css";

export function createTabs(labels, selected) {
  const tabs = document.createElement("div");
  tabs.className = "tabs";
  tabs.setAttribute("role", "tablist");
  for (const [index, label] of labels.entries()) {
    const tab = document.createElement("span");
    tab.className = "tab";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", String(index === selected));
    tab.textContent = label;
    tabs.append(tab);
  }
  return tabs;
}
