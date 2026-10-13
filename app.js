// ==============================
// Load schema
// ==============================

fetch("schema.json")
    .then(response => response.json())
    .then(data => {

        const treePanel = document.getElementById("treePanel");

        treePanel.innerHTML = "";

        const rootList = document.createElement("ul");

        renderNode(data.root, rootList);

        treePanel.appendChild(rootList);
    })
    .catch(error => {
        console.error("Error loading schema:", error);
    });


// ==============================
// Render Tree
// ==============================

function renderNode(node, parentElement) {

    const li = document.createElement("li");

    const toggle = document.createElement("span");
    toggle.className = "toggle";

    const label = document.createElement("span");
    label.className = "node";

    label.addEventListener("click", () => {
        showDetails(node);
    });

    // Folder node
    if (node.children && node.children.length > 0) {

        toggle.textContent = "▶";

        label.innerHTML = "📁 " + node.name;

        const childList = document.createElement("ul");
        childList.style.display = "none";

        node.children.forEach(child => {
            renderNode(child, childList);
        });

        toggle.addEventListener("click", () => {

            if (childList.style.display === "none") {

                childList.style.display = "block";
                toggle.textContent = "▼";
                label.innerHTML = "📂 " + node.name;

            } else {

                childList.style.display = "none";
                toggle.textContent = "▶";
                label.innerHTML = "📁 " + node.name;
            }
        });

        li.appendChild(toggle);
        li.appendChild(label);
        li.
