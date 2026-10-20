import "./avatar.css";

export function createAvatar(name) {
  const avatar = document.createElement("span");
  avatar.className = "avatar";
  avatar.textContent = name
    .split(" ")
    .map((part) => part[0])
    .join("");
  return avatar;
}
