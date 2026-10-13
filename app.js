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
// Load schema

  li.appendChild(label);
fetch("schema.json")
    .then(response => response.json())
    .then(data => {

  if (node.children && node.children.length > 0) {
        const treeRoot = document.getElementById("treePanel");

    const toggle = document.createElement("span");
    toggle.textContent = "▶ ";
    toggle.className = "toggle";
        treeRoot.innerHTML = "";

    li.insertBefore(toggle, label);
        const rootList = document.createElement("ul");

    const childContainer = document.createElement("div");
    childContainer.className = "children hidden";
        renderNode(data.root, rootList);

    node.children.forEach(child => {
      renderNode(child, childContainer);
        treeRoot.appendChild(rootList);
    })
    .catch(error => {
        console.error("Error loading schema:", error);
    });

    toggle.onclick = () => {

      childContainer.classList.toggle("hidden");
// Render Tree

      toggle.textContent =
        childContainer.classList.contains("hidden")
          ? "▶ "
          : "▼ ";
    };
function renderNode(node, parentElement) {

    li.appendChild(childContainer);
  }
    const li = document.createElement("li");

  label.onclick = () => showDetails(node);

  ul.appendChild(li);
  parent.appendChild(ul);
}

function showDetails(node) {

  let html = "";

  Object.keys(node).forEach(key => {
    const toggle = document.createElement("span");
    toggle.className = "toggle";

    if (key !== "children") {
    const label = document.createElement("span");
    label.className = "node";
    label.textContent = node.name;

      html += `
        <p>
          <strong>${key}</strong><br>
          ${JSON.stringify(node[key])}
        </p>
      `;
    }
  });
    label.addEventListener("click", () => {
        showDetails(node);
    });

  document.getElementById("details").innerHTML = html;
}
    if (node.children && node.children.
