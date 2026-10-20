import "./card.css";

export function createCard(title, body) {
  const card = document.createElement("article");
  card.className = "card";
  const heading = document.createElement("h2");
  heading.className = "card-title";
  heading.textContent = title;
  const text = document.createElement("p");
  text.className = "card-body";
  text.textContent = body;
  card.append(heading, text);
  return card;
}
