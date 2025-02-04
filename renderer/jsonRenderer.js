export function renderJSON(json, element) {
  for (const [key, value] of Object.entries(json)) {
    const div = document.createElement("div");

    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      const collapsible = document.createElement("button");
      collapsible.classList.add("collapsible");
      collapsible.textContent = `${key}:`;
      const content = document.createElement("div");
      content.classList.add("content");

      renderJSON(value, content); // Recursively render nested objects

      collapsible.onclick = () => {
        content.style.display =
          content.style.display === "none" ? "block" : "none";
      };

      div.appendChild(collapsible);
      div.appendChild(content);
    } else if (Array.isArray(value)) {
      div.innerHTML = `<span class="json-key">${key}:</span> <span class="json-value">${JSON.stringify(value)}</span>`;
    } else {
      div.innerHTML = `<span class="json-key">${key}:</span> <span class="json-value">${value}</span>`;
    }

    element.appendChild(div);
  }
}
