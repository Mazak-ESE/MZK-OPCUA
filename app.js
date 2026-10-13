// Load schema

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


// Render Tree

function renderNode(node, parentElement) {

    const li = document.createElement("li");

    const toggle = document.createElement("span");
    toggle.className = "toggle";

    const label = document.createElement("span");
    label.className = "node";

    label.addEventListener("click", () => {
        showDetails(node);
    });

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
        li.appendChild(childList);

    } else {

        toggle.innerHTML = "&nbsp;&nbsp;";

        label.innerHTML = "📄 " + node.name;

        li.appendChild(toggle);
        li.appendChild(label);
    }

    parentElement.appendChild(li);
}


// Details Panel

function showDetails(node) {

    const details = document.getElementById("details");

    let html = "<table>";

    for (const key in node) {

        if (key === "children") {
            continue;
        }

        let value = node[key];

        if (typeof value === "object") {
            value = JSON.stringify(value, null, 2);
        }

        html += `
            <tr>
                <td><strong>${key}</strong></td>
                <td>${value}</td>
            </tr>
        `;
    }

    html += "</table>";

    details.innerHTML = html;
}


// Expand All

function expandAll() {

    document
        .querySelectorAll("#treePanel ul")
        .forEach(ul => {
            ul.style.display = "block";
        });

    document
        .querySelectorAll(".toggle")
        .forEach(toggle => {

            if (toggle.textContent.trim() !== "") {
                toggle.textContent = "▼";
            }
        });

    document
        .querySelectorAll(".node")
        .forEach(label => {

            if (label.innerHTML.startsWith("📁")) {

                label.innerHTML =
                    label.innerHTML.replace("📁", "📂");
            }
        });
}


// Collapse All

function collapseAll() {

    const allLists =
        document.querySelectorAll("#treePanel ul");

    allLists.forEach((ul, index) => {

        if (index !== 0) {
            ul.style.display = "none";
        }
    });

    document
        .querySelectorAll(".toggle")
        .forEach(toggle => {

            if (toggle.textContent.trim() !== "") {
                toggle.textContent = "▶";
            }
        });

    document
        .querySelectorAll(".node")
        .forEach(label => {

            if (label.innerHTML.startsWith("📂")) {

                label.innerHTML =
                    label.innerHTML.replace("📂", "📁");
            }
        });
}
