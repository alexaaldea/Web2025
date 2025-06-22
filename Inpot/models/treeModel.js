export const treeModel = {
    generateTree(node, binary, levels, weighted, min_weight, max_weight, format) {
        min_weight = parseInt(min_weight);
        max_weight = parseInt(max_weight);
        if (isNaN(min_weight)) {
            min_weight = 1;
        }
        if (isNaN(max_weight)) {
            max_weight = 10;
        }

        if (node < 1) {
            throw new Error("Number of nodes must be at least 1");
        }
        if (levels < 1) {
            throw new Error("Number of levels must be at least 1");
        }
        if (binary == "yes" && node > Math.pow(2, levels) - 1) {
            throw new Error("Too many nodes for a binary tree with " + levels + " levels.");
        }
        if (levels > node) {
            throw new Error("Number of levels cannot exceed number of nodes.");
        }

        let available = [{ id: 1, level: 0, children: 0 }];
        let edges = [];
        let parentVector = new Array(node + 1).fill(0);

        function randomWeight() {
            return Math.floor(Math.random() * (max_weight - min_weight + 1)) + min_weight;
        }

      //imi fac lungimea
        let lastNode = 1;
        let used = new Set([1]);
        for (let l = 1; l < levels; l++) {
            let newNode = l + 1;
            let w;
            if (weighted == "yes") {
                w = randomWeight();
            } else {
                w = 1;
            }
            edges.push({ parent: lastNode, child: newNode, weight: w });
            parentVector[newNode] = lastNode;
            available.push({ id: newNode, level: l, children: 0 });
            lastNode = newNode;
            used.add(newNode);
        }
       
        for (let newNode = levels + 1; newNode <= node; newNode++) {
            if (available.length == 0) {
                throw new Error("Not enough levels to place all nodes; consider increasing levels.");
            }
            let idx = Math.floor(Math.random() * available.length);
            let parentObj = available[idx];
            let w;
            if (weighted == "yes") {
                w = randomWeight();
            } else {
                w = 1;
            }
            edges.push({ parent: parentObj.id, child: newNode, weight: w });
            parentVector[newNode] = parentObj.id;
            let newLevel = parentObj.level + 1;
            parentObj.children = parentObj.children + 1;

            if (binary == "yes" && parentObj.children == 2) {
                available.splice(idx, 1);
            } else if (parentObj.level == levels - 1) {
                available.splice(idx, 1);
                
            }
            //daca nu e ultimul lvl il adaug in available sa fie parinte
            if (newLevel < levels) {
                available.push({ id: newNode, level: newLevel, children: 0 });
            }
        }

        if (format == "edge") {
            let result = [];
            for (let i = 0; i < edges.length; i++) {
                if (weighted == "yes") {
                    result.push(edges[i].parent + " " + edges[i].child + " " + edges[i].weight);
                } else {
                    result.push(edges[i].parent + " " + edges[i].child);
                }
            }
            return result;
        } else if (format == "parent") {
            parentVector[1] = 0;
            let result = [];
            for (let i = 1; i <= node; i++) {
                if (parentVector[i] == 0) {
                    result.push("0");
                } else {
                    result.push("" + parentVector[i]);
                }
            }
            return result.join(" ");
        } else {
            return edges;
        }
    }
};