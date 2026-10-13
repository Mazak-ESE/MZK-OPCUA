fetch("schema.json")
  .then(response => response.json())
  .then(data => {
    renderNode(data.root, document.getElementById("treePanel"));
  });

function renderNode(node, parent) {

  const ul = document.createElement("ul");
  const li = document.createElement("li");

  const label = document.createElement("span");
  label.className = "node";
  label.textContent = node.name;

  li.appendChild(label);

  if (node.children && node.children.length > 0) {

    const toggle = document.createElement("span");
    toggle.textContent = "▶ ";
    toggle.className = "toggle";

    li.insertBefore(toggle, label);

    const childContainer = document.createElement("div");
    childContainer.className = "children hidden";

    node.children.forEach(child => {
      renderNode(child, childContainer);
    });

    toggle.onclick = () => {

      childContainer.classList.toggle("hidden");

      toggle.textContent =
        childContainer.classList.contains("hidden")
          ? "▶ "
          : "▼ ";
    };

    li.appendChild(childContainer);
  }

  label.onclick = () => showDetails(node);

  ul.appendChild(li);
  parent.appendChild(ul);
}

function showDetails(node) {

  let html = "";

  Object.keys(node).forEach(key => {

    if (key !== "children") {

      html += `
        <p>
          <strong>${key}</strong><br>
          ${JSON.stringify(node[key])}
        </p>
      `;
    }
  });

  document.getElementById("details").innerHTML = html;
}
