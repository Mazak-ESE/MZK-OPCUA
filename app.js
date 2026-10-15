let nodeMap = {};
let rootNode = null;

// Load XML NodeSet

fetch("UA_MachineTool_NodeSet2.xml")
    .then(response => response.text())
    .then(xmlText => {

        const parser = new DOMParser();

        const xml = parser.parseFromString(
            xmlText,
            "text/xml"
        );

        buildModel(xml);

    })
    .catch(error => {

        console.error(
            "Error loading NodeSet:",
            error
        );

    });

function buildModel(xml) {

    const allNodes =
        xml.querySelectorAll(
            "UAObject, UAVariable, UAObjectType, UAVariableType"
        );

    allNodes.forEach(node => {

        const nodeId =
            node.getAttribute("NodeId");

        nodeMap[nodeId] = {

            name:
                node.getAttribute("BrowseName") || "",

            browseName:
                node.getAttribute("BrowseName") || "",

            category:
                node.querySelector("Category")
                    ?.textContent || "",

            displayName:
                node.querySelector("DisplayName")
                    ?.textContent || "",

            description:
                node.querySelector("Description")
                    ?.textContent || "",

            nodeId,

            nodeClass:
                node.tagName,

            dataType:
                node.getAttribute("DataType") || "",

            children: []

        };

    });

    allNodes.forEach(node => {

        const parentId =
            node.getAttribute("NodeId");

        const references =
            node.querySelectorAll(
                "References > Reference"
            );

        references.forEach(ref => {

            const refType =
                ref.getAttribute(
                    "ReferenceType"
                );

            const isForward =
                !ref.hasAttribute(
                    "IsForward"
                );

            if (
                isForward &&
                (
                    refType === "HasComponent" ||
                    refType === "HasProperty"
                )
            ) {

                const childId =
                    ref.textContent.trim();

                if (
                    nodeMap[parentId] &&
                    nodeMap[childId]
                ) {

                    nodeMap[parentId]
                        .children
                        .push(
                            nodeMap[childId]
                        );

                }

            }

        });

    });

    rootNode =
        Object.values(nodeMap).find(
            n =>
                n.browseName &&
                n.browseName.includes(
                    "MachineToolType"
                )
        );

    if (!rootNode) {

        rootNode =
            Object.values(nodeMap)[0];

    }

    generateNodeList();
    renderTree(rootNode);

}

function renderTree(root) {

    const treePanel =
        document.getElementById(
            "treePanel"
        );

    treePanel.innerHTML = "";

    const rootList =
        document.createElement("ul");

    renderNode(
        root,
        rootList
    );

    treePanel.appendChild(
        rootList
    );

}

function renderNode(
    node,
    parentElement
) {

    const li =
        document.createElement("li");

    const toggle =
        document.createElement("span");

    toggle.className = "toggle";

    const label =
        document.createElement("span");

    label.className = "node";

    label.addEventListener(
        "click",
        () => showDetails(node)
    );

    if (
        node.children &&
        node.children.length > 0
    ) {

        toggle.textContent = "▶";

        label.innerHTML =
            "📁 " + node.name;

        const childList =
            document.createElement("ul");

        childList.style.display =
            "none";

        node.children.forEach(
            child => {

                renderNode(
                    child,
                    childList
                );

            }
        );

        toggle.addEventListener(
            "click",
            () => {

                if (
                    childList.style.display === "none"
                ) {

                    childList.style.display =
                        "block";

                    toggle.textContent = "▼";

                    label.innerHTML =
                        "📂 " + node.name;

                } else {

                    childList.style.display =
                        "none";

                    toggle.textContent = "▶";

                    label.innerHTML =
                        "📁 " + node.name;

                }

            }
        );

        li.appendChild(toggle);
        li.appendChild(label);
        li.appendChild(childList);

    } else {

        toggle.innerHTML =
            "&nbsp;&nbsp;";

        label.innerHTML =
            "📄 " + node.name;

        li.appendChild(toggle);
        li.appendChild(label);

    }

    parentElement.appendChild(li);

}

function showDetails(node) {

    const details =
        document.getElementById(
            "details"
        );

    details.innerHTML = `
        <table>
            <tr>
                <td><strong>BrowseName</strong></td>
                <td>${node.browseName}</td>
            </tr>

            <tr>
                <td><strong>Category</strong></td>
                <td>${node.category}</td>
            </tr>

            <tr>
                <td><strong>DisplayName</strong></td>
                <td>${node.displayName}</td>
            </tr>

            <tr>
                <td><strong>NodeId</strong></td>
                <td>${node.nodeId}</td>
            </tr>

            <tr>
                <td><strong>NodeClass</strong></td>
                <td>${node.nodeClass}</td>
            </tr>

            <tr>
                <td><strong>DataType</strong></td>
                <td>${node.dataType}</td>
            </tr>

            <tr>
                <td><strong>Description</strong></td>
                <td>${node.description}</td>
            </tr>

            <tr>
                <td><strong>Children</strong></td>
                <td>${node.children.length}</td>
            </tr>
        </table>
    `;

}

function generateNodeList() {

    const inventory =
        document.getElementById(
            "nodeInventory"
        );

    if (!inventory) {
        return;
    }

    const categorised =
        Object.values(nodeMap)
            .filter(node => node.category);

    const uncategorised =
        Object.values(nodeMap)
            .filter(node => !node.category);

    let html = `
        <p>
            <strong>Total Nodes:</strong>
            ${Object.keys(nodeMap).length}
        </p>

        <p>
            <strong>Categorised:</strong>
            ${categorised.length}
            &nbsp;&nbsp;
            <strong>Uncategorised:</strong>
            ${uncategorised.length}
        </p>

        <h3>Categorised Nodes</h3>

        <table>
            <tr>
                <th>Node</th>
                <th>Category</th>
            </tr>
    `;

    categorised.forEach(node => {

        html += `
            <tr>
                <td>${node.browseName}</td>
                <td>${node.category}</td>
            </tr>
        `;

    });

    html += `
        </table>

        <h3>Uncategorised Nodes</h3>

        <ul>
    `;

    uncategorised.forEach(node => {

        html += `
            <li>${node.browseName}</li>
        `;

    });

    html += `
        </ul>
    `;

    inventory.innerHTML = html;

}
function generateCategoryTree() {

    const tree =
        document.getElementById(
            "categoryTree"
        );

    if (!tree) {
        return;
    }

    const categories = {};

    Object.values(nodeMap)
        .filter(node => node.category)
        .forEach(node => {

            if (!categories[node.category]) {
                categories[node.category] = [];
            }

            categories[node.category].push(
                node.browseName
            );

        });

    let html = "";

    Object.keys(categories)
        .sort()
        .forEach(category => {

            html += `<h3>${category}</h3><ul>`;

            categories[category]
                .sort()
                .forEach(name => {

                    html += `<li>${name}</li>`;

                });

            html += "</ul>";

        });

    tree.innerHTML = html;
}
