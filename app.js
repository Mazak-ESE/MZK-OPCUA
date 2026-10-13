// Load schema

fetch("schema.json")
    .then(response => response.json())
    .then(data => {

        const treeRoot = document.getElementById("treePanel");

        treeRoot.innerHTML = "";

        const rootList = document.createElement("ul");

        renderNode(data.root, rootList);

        treeRoot.appendChild(rootList);
    })
    .catch(error => {
        console.error("Error loading schema:", error);
    });


// Render Tree

function renderNode(node, parentElement) {

    const li = document.createElement("li");

    const toggle = document.createElement("span");
    toggle.className = "toggle";

    const label = document.createElement("span");
    label.className = "node";
    label.textContent = node.name;

    label.addEventListener("click", () => {
        showDetails(node);
    });

    if (node.children && node.children.
