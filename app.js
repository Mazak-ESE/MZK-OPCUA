let nodeMap = {};
let rootNode = null;

// Load XML NodeSet

fetch("UA_MachineTool_NodeSet2.xml")
    .then(response => response.text())
    .then(xmlText => {

        const parser = new DOMParser();

        const xml =
            parser.parseFromString(
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
                node.getAttribute(
                    "BrowseName"
                ) || "",

            browseName:
                node.getAttribute(
                    "BrowseName"
                ) || "",

            displayName:
                node.querySelector(
                    "DisplayName"
                )?.textContent || "",

            description:
                node.querySelector(
                    "Description"
                )?.textContent || "",

            nodeId,

            nodeClass:
                node.tagName,

            dataType:
                node.getAttribute(
                    "DataType"
                ) || "",

            children: []

        };

    });

    allNodes.forEach(node => {

        const parentId =
            node.getAttribute(
                "NodeId"
            );

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
                    refType ===
                        "HasComponent" ||
                    refType ===
                        "HasProperty"
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

// Tree Renderer

function renderNode(
    node,
    parentElement
) {

    const li =
        document.createElement("li");

    const toggle =
        document.createElement("span");

    toggle.className =
        "toggle";

    const label =
        document.createElement("span");

    label.className =
        "node";

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
                    childList.style.display
                    === "none"
                ) {

                    childList.style.display =
                        "block";

                    toggle.textContent =
                        "▼";

                    label.innerHTML =
                        "📂 " +
                        node.name;

                } else {

                    childList.style.display =
                        "none";

                    toggle.textContent =
                        "▶";

                    label.innerHTML =
                        "📁 " +
                        node.name;

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

// Node Inventory

function generateNodeList() {

    const nodeNames =
        Object.values(nodeMap)
            .map(node => node.browseName)
            .sort();

    const inventory =
        document.getElementById(
            "nodeInventory"
        );

    if (!inventory) {
        return;
    }

    inventory.innerHTML =
        `
        <p>
            <strong>Total Nodes:</strong>
            ${nodeNames.length}
        </p>

        <pre>${nodeNames.join("\n")}</pre>
        `;
}
