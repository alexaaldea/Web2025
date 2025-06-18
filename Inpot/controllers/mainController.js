import { matrixModel } from '../models/matrixModel.js';
import { vectorModel } from '../models/vectorModel.js';
import { numberModel } from '../models/numberModel.js';
import { stringModel } from '../models/stringModel.js';
import { treeModel } from '../models/treeModel.js';
import { graphModel } from '../models/graphModel.js';
import { createGraphSVG } from '../models/create_svg.js';
import { exportAsJson, parseTextOutputToArray } from '../utils/exportUtils.js';
import { exportAsCsv } from '../utils/exportCSV.js';


export const mainController = {
    showContainer(containerId) {
        const containers = document.querySelectorAll('.container');
        containers.forEach(el => el.style.display = 'none');

        const selected = document.getElementById(containerId);
        if (selected) {
            selected.style.display = 'block';
        }
    },
    verifyJWT() {
        fetch('../config/verify-jwt.php')
            .then(response => {
                if (!response.ok) {
                    window.location.href = 'login.html';
                    throw new Error('Invalid token');
                }
                return response.json();
            })
            .then(data => {
                if (data.message != 'valid') {
                    window.location.href = 'login.html';
                }
            })
            .catch(error => {
                console.error('JWT verification failed:', error);
                window.location.href = 'login.html';
            });
    },


    generateNumbers() {
        const min = parseFloat(document.getElementById('number-min').value);
        const max = parseFloat(document.getElementById('number-max').value);
        const count = parseInt(document.getElementById('number-count').value);
        const parity = document.getElementById('number-parity').value;
        const sign = document.getElementById('number-sign').value;
        const sorted = document.getElementById('number-sorted').value;
        const unique = document.getElementById('number-unique').value === 'yes';
        const type = document.getElementById('number-type').value;
        const pattern = document.getElementById('number-pattern').value;

        const includeZero = document.getElementById('include-zero').checked;
        const includeMin = document.getElementById('include-min').checked;
        const includeMax = document.getElementById('include-max').checked;


        const edgeEmpty = document.getElementById('edge-empty').checked;
        const edgeSingle = document.getElementById('edge-single').checked;
        const edgeAllEqual = document.getElementById('edge-all-equal').checked;

        const step = parseFloat(document.getElementById('step-size').value);

        const numbers = numberModel.generateNumbers(min, max, count, parity, sign, sorted, unique, type, pattern, includeZero, includeMin, includeMax, edgeEmpty, edgeSingle, edgeAllEqual, step);


        document.getElementById('number-output').textContent = numbers.join(', ');
    },

    generateStrings() {
        const minLength = parseInt(document.getElementById('string-min').value);
        const maxLength = parseInt(document.getElementById('string-max').value);
        const unique = document.getElementById('string-unique').value;
        const letters = document.getElementById('string-letter').value.split(',');
        const count = parseInt(document.getElementById('string-count').value);
        const sameLength = parseInt(document.getElementById('same-length').value);
        const prefix = document.getElementById('include-prefix').value;
        const suffix = document.getElementById('include-suffix').value;
        const sorting = document.getElementById('sorting').value;


        const strings = stringModel.generateStrings(minLength, maxLength, unique, letters, count, sameLength, prefix, suffix, sorting);


        document.getElementById('string-output').textContent = strings.join('\n');
    },

    generateVector() {

        const elem = parseInt(document.getElementById('vector-length').value);
        const min = parseInt(document.getElementById('vector-min').value);
        const max = parseInt(document.getElementById('vector-max').value);
        const parity = document.getElementById('vector-parity').value;
        const sign = document.getElementById('vector-sign').value;
        const sorted = document.getElementById('vector-sorted').value;
        const unique = document.getElementById('vector-unique').value === 'yes';
        const type = document.getElementById('vector-type').value;
        const palindrome = document.getElementById('vector-palindrome').value;
        const line = parseInt(document.getElementById('vector-line').value);

        const vect = vectorModel.generateVector(elem, min, max, parity, sign, sorted, unique, type, palindrome, line);


        let output = "";
        if (!isNaN(line) && line > 0) {
            for (let i = 0; i < vect.length; i += line) {
                output += vect.slice(i, i + line).join(' ') + "\n";
            }
        } else {
            output = vect.join(' ');
        }
        document.getElementById('vector-output').textContent = output;
    },


    generateMatrix() {

        const row = parseInt(document.getElementById('matrix-rows').value);
        const col = parseInt(document.getElementById('matrix-cols').value);
        const min = parseInt(document.getElementById('matrix-min').value);
        const max = parseInt(document.getElementById('matrix-max').value);
        const parity = document.getElementById('matrix-parity').value;
        const sign = document.getElementById('matrix-sign').value;
        const unique = document.getElementById('matrix-unique').value;
        const map = document.getElementById('matrix-map').value;

        const matrixs = matrixModel.generateMatrix(row, col, min, max, parity, sign, unique, map);

        document.getElementById('matrix-output').textContent = matrixs.join('\n');

    },
    generateGraph() {

        const node = parseInt(document.getElementById('graph-nodes').value);
        const edge = parseInt(document.getElementById('graph-edges').value);
        const oriented = document.getElementById('graph-oriented').value;
        const connected = document.getElementById('graph-connected').value;
        const bipartit = document.getElementById('graph-bipartit').value;
        const weighted = document.getElementById('graph-weighted').value;
        const min_weight = parseInt(document.getElementById('graph-min-weight').value);
        const max_weight = parseInt(document.getElementById('graph-max-weight').value);
        const format = document.getElementById('graph-format').value;


        const graphs = graphModel.generateGraph(node, edge, oriented, connected, bipartit, weighted, min_weight, max_weight, format);
        window.currentGraphResult = graphs;
        window.currentGraphOriented = (oriented == 'yes');
        document.getElementById('graph-output').textContent = graphs;


    },

    generateTree() {
        const node = parseInt(document.getElementById('tree-nodes').value);
        const binary = document.getElementById('tree-binary').value;
        const levels = parseInt(document.getElementById('tree-lvl').value);
        const weighted = document.getElementById('tree-weighted').value;
        const min_weight = parseInt(document.getElementById('graph-min-weight').value);
        const max_weight = parseInt(document.getElementById('graph-max-weight').value);
        const format = document.getElementById('tree-format').value;

        try {
            const trees = treeModel.generateTree(node, binary, levels, weighted, min_weight, max_weight, format);
            if (Array.isArray(trees)) {
                document.getElementById('tree-output').textContent = trees.join("\n");
            } else {
                document.getElementById('tree-output').textContent = trees;
            }
        } catch (e) {
            document.getElementById('tree-output').textContent = "Error: " + e.message;
        }


    },

    saveNumberInputs() {
        const payload = {
            min: parseFloat(document.getElementById('number-min').value),
            max: parseFloat(document.getElementById('number-max').value),
            count: parseInt(document.getElementById('number-count').value),
            parity: document.getElementById('number-parity').value,
            sign: document.getElementById('number-sign').value,
            sorted: document.getElementById('number-sorted').value,
            type: document.getElementById('number-type').value,
            unique: document.getElementById('number-unique').value === 'yes',
            pattern: document.getElementById('number-pattern').value,
            step: parseFloat(document.getElementById('step-size').value),
            includeZero: document.getElementById('include-zero').checked,
            includeMin: document.getElementById('include-min').checked,
            includeMax: document.getElementById('include-max').checked,
            edgeEmpty: document.getElementById('edge-empty').checked,
            edgeSingle: document.getElementById('edge-single').checked,
            edgeAllEqual: document.getElementById('edge-all-equal').checked
        };

        fetch('../config/save-number-inputs.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                const statusDiv = document.getElementById('save-status');
                if (data.success) {
                    statusDiv.textContent = 'Inputs saved successfully!';
                    statusDiv.style.color = 'green';
                } else {
                    statusDiv.textContent = data.error || 'Failed to save inputs.';
                    statusDiv.style.color = 'red';
                }
            })
            .catch(err => {
                console.error('Save error:', err);
                document.getElementById('save-status').textContent = 'Save failed';
            });
    },

    saveStringInputs() {
        const payload = {
            stringMin: parseInt(document.getElementById('string-min').value),
            stringMax: parseInt(document.getElementById('string-max').value),
            sameLength: parseInt(document.getElementById('same-length').value),
            includePrefix: document.getElementById('include-prefix').value || null,
            includeSuffix: document.getElementById('include-suffix').value || null,
            sorting: document.getElementById('sorting').value || null,
            stringUnique: document.getElementById('string-unique').checked,
            stringLetter: document.getElementById('string-letter').value || null,
            stringCount: parseInt(document.getElementById('string-count').value)
        };

        fetch('../config/save-string-inputs.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                const statusDiv = document.getElementById('save-status-string');
                if (data.success) {
                    statusDiv.textContent = 'Inputs saved successfully!';
                    statusDiv.style.color = 'green';
                } else {
                    statusDiv.textContent = data.error || 'Failed to save inputs.';
                    statusDiv.style.color = 'red';
                }
            })
            .catch(err => {
                console.error('Save error:', err);
                document.getElementById('save-status-string').textContent = 'Save failed';
            });
    },
    saveVectorInputs() {
        const payload = {
            length: parseInt(document.getElementById('vector-length').value),
            min: parseFloat(document.getElementById('vector-min').value),
            max: parseFloat(document.getElementById('vector-max').value),
            parity: document.getElementById('vector-parity').value || null,
            sign: document.getElementById('vector-sign').value || null,
            type: document.getElementById('vector-type').value || null,
            unique: document.getElementById('vector-unique').value === 'yes',
            palindrome: document.getElementById('vector-palindrome').value === 'yes',
            line: parseInt(document.getElementById('vector-line').value),
            sorted: document.getElementById('vector-sorted').value || null
        };

        fetch('../config/save-vector-inputs.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                const statusDiv = document.getElementById('save-status-vector');
                if (data.success) {
                    statusDiv.textContent = 'Vector inputs saved successfully!';
                    statusDiv.style.color = 'green';
                } else {
                    statusDiv.textContent = data.error || 'Failed to save vector inputs.';
                    statusDiv.style.color = 'red';
                }
            })
            .catch(err => {
                console.error('Save error:', err);
                document.getElementById('save-status-vector').textContent = 'Save failed';
            });
    },

    saveMatrixInputs() {
        const payload = {
            rows: parseInt(document.getElementById('matrix-rows').value),
            cols: parseInt(document.getElementById('matrix-cols').value),
            map: document.getElementById('matrix-map').value,
            min: parseFloat(document.getElementById('matrix-min').value),
            max: parseFloat(document.getElementById('matrix-max').value),
            parity: document.getElementById('matrix-parity').value || null,
            unique: document.getElementById('matrix-unique').value === 'yes',
            sign: document.getElementById('matrix-sign').value || null
        };

        fetch('../config/save-matrix-inputs.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                const statusDiv = document.getElementById('save-status-matrix');
                if (data.success) {
                    statusDiv.textContent = 'Matrix inputs saved successfully!';
                    statusDiv.style.color = 'green';
                } else {
                    statusDiv.textContent = data.error || 'Failed to save matrix inputs.';
                    statusDiv.style.color = 'red';
                }
            })
            .catch(err => {
                console.error('Save error:', err);
                document.getElementById('save-status-matrix').textContent = 'Save failed';
            });
    },

    exportVectorAsJson() {
        const outputText = document.getElementById('vector-output').textContent;
        const data = parseTextOutputToArray(outputText);
        exportAsJson(data, 'vector_output.json');
    },

    exportMatrixAsJson() {
        const outputText = document.getElementById('matrix-output').textContent;
        const data = parseTextOutputToArray(outputText);
        exportAsJson(data, 'matrix_output.json');
    },

    exportTreeAsJson() {
        const outputText = document.getElementById('tree-output').textContent;
        const lines = outputText.trim().split('\n');
        exportAsJson(lines, 'tree_output.json');
    },

    exportStringAsJson() {
        const outputText = document.getElementById('string-output').textContent;
        const lines = outputText.trim().split('\n');
        exportAsJson(lines, 'string_output.json');
    },

    exportGraphAsJson() {
        const outputText = document.getElementById('graph-output').textContent;
        const items = outputText.trim().split(/\s+/);
        exportAsJson(items, 'graph_output.json');
    },

    exportNumbersAsJson() {
        const outputText = document.getElementById('number-output').textContent;
        const numbers = outputText.trim().split(',').map(Number);
        exportAsJson(numbers, 'numbers_output.json');
    },

    exportVectorAsCsv() {
        const outputText = document.getElementById('vector-output').textContent;
        const data = parseTextOutputToArray(outputText);
        exportAsCsv(data, 'vector_output.csv');
    },

    exportMatrixAsCsv() {
        const outputText = document.getElementById('matrix-output').textContent;
        const data = parseTextOutputToArray(outputText);
        exportAsCsv(data, 'matrix_output.csv');
    },

    exportTreeAsCsv() {
        const outputText = document.getElementById('tree-output').textContent;
        const lines = outputText.trim().split('\n');
        exportAsCsv(lines, 'tree_output.csv');
    },

    exportStringAsCsv() {
        const outputText = document.getElementById('string-output').textContent;
        const lines = outputText.trim().split('\n');
        exportAsCsv(lines, 'string_output.csv');
    },

    exportGraphAsCsv() {
        const outputText = document.getElementById('graph-output').textContent;
        const items = outputText.trim().split(/\s+/);
        exportAsCsv(items, 'graph_output.csv');
    },

    exportNumbersAsCsv() {
        const outputText = document.getElementById('number-output').textContent;
        const numbers = outputText.trim().split(',').map(Number);
        exportAsCsv(numbers, 'numbers_output.csv');
    },


    loadSidebar() {
        fetch('../views/components/sidebar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load sidebar.html: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                document.getElementById('sidebar').innerHTML = html;

                const script = document.createElement('script');
                script.src = '../models/admin-check.js';
                document.body.appendChild(script);
            })
            .catch(error => console.error('Error loading sidebar:', error));
    },


    loadComponents() {
        const components = ['number', 'string', 'vector', 'matrix', 'graph', 'tree', 'admin'];
        components.forEach(component => {
            fetch(`../views/components/${component}.html`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load ${component}.html: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(html => {
                    document.getElementById(component).innerHTML = html;
                    if (component === 'matrix') {
                        this.setupMatrixMapListener();
                    }
                    if (component === 'graph') {
                        document.getElementById(component).innerHTML = html;
                        mainController.setupGraphListeners();
                    }

                    if (component === 'admin') {
                        const waitForAdmin = setInterval(() => {
                            if (typeof window.isAdmin !== 'undefined') {
                                clearInterval(waitForAdmin);

                                if (window.isAdmin) {
                                    if (typeof adminPanel?.loadUsers === 'function') {
                                        adminPanel.loadUsers();
                                    } else {
                                        console.warn("adminPanel.loadUsers is not a function");
                                    }
                                }
                            }
                        }, 100);
                    }

                })
                .catch(error => console.error(`Error loading ${component}:`, error));

        });
    },
    showContainer: function (id) {
  const containers = ['number', 'string', 'vector', 'matrix', 'graph', 'tree', 'history', 'admin'];
  containers.forEach(container => {
    const el = document.getElementById(container);
    if (el) el.style.display = container === id ? 'block' : 'none';
  });

  if (id === 'history') {
    this.loadHistory(); // Load history dynamically
  }
},

loadHistory: async function () {
  const container = document.getElementById('history');
  container.innerHTML = '<p>Loading history...</p>';

  try {
    const [historyRes, statsRes] = await Promise.all([
      fetch('/Web2025/Inpot/config/history.php'),
      fetch('/Web2025/Inpot/config/user_stats.php')
    ]);

    if (!historyRes.ok) throw new Error('Failed to load history');
    if (!statsRes.ok) throw new Error('Failed to load stats');

    const historyData = await historyRes.json();
    const statsData = await statsRes.json();

    container.innerHTML = ''; // Clear previous content

    container.appendChild(this.createTable('Number Inputs', historyData.number));
    container.appendChild(this.createTable('String Inputs', historyData.string));
    container.appendChild(this.createTable('Vector Inputs', historyData.vector));
    container.appendChild(this.createTable('Matrix Inputs', historyData.matrix));
    container.appendChild(this.createTable('Graph Inputs', historyData.graph));
    container.appendChild(this.createTable('Tree Inputs', historyData.tree));
    container.appendChild(this.createStatsTable(statsData));

  } catch (err) {
    container.innerHTML = `<div class="error">Error: ${err.message}</div>`;
  }
},

createTable: function (sectionTitle, data) {
  const section = document.createElement('div');
  section.className = 'section';

  const title = document.createElement('div');
  title.className = 'section-title';
  title.textContent = sectionTitle;
  section.appendChild(title);

  if (data.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No inputs generated yet.';
    section.appendChild(empty);
  } else {
    const table = document.createElement('table');
    table.className = 'history-table';

    const thead = document.createElement('thead');
    thead.innerHTML = `<tr><th>ID</th><th>Created At</th><th>Input Summary</th><th>Actions</th></tr>`;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.id}</td>
        <td>${entry.created_at}</td>
        <td>${entry.input}</td>
        <td><button class="delete-btn">Delete</button></td>
      `;

      row.querySelector('.delete-btn').addEventListener('click', async () => {
        const response = await fetch(`/Web2025/Inpot/config/delete.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: entry.id,
            type: sectionTitle.toLowerCase().split(' ')[0]
          })
        });

        if (response.ok) {
          alert('Entry deleted successfully');
          mainController.loadHistory(); // reload updated history
        } else {
          alert('Failed to delete entry');
        }
      });

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    section.appendChild(table);
  }

  return section;
},

createStatsTable: function (statsData) {
  // Example for stats rendering if you have user_stats.php
  const section = document.createElement('div');
  section.className = 'stats-section';

  const title = document.createElement('div');
  title.className = 'section-title';
  title.textContent = 'User Stats';
  section.appendChild(title);

  const list = document.createElement('ul');
  for (let key in statsData) {
    const item = document.createElement('li');
    item.textContent = `${key}: ${statsData[key]}`;
    list.appendChild(item);
  }

  section.appendChild(list);
  return section;
},
    logout() {
        window.location.href = '../config/logout.php';
    },

    setupMatrixMapListener() {
        const mapSelect = document.getElementById('matrix-map');
        const signGroup = document.getElementById('matrix-sign');
        const parityGroup = document.getElementById('matrix-parity');
        const uniqueGroup = document.getElementById('matrix-unique');
        const maxGroup = document.getElementById('matrix-max');
        const minGroup = document.getElementById('matrix-min');


        if (!mapSelect || !signGroup || !parityGroup || !uniqueGroup || !maxGroup || !minGroup) {
            console.warn('Matrix input elements not found.');
            return;
        }

        const toggleVisibility = () => {
            const shouldHide = mapSelect.value === 'yes';
            signGroup.style.display = shouldHide ? 'none' : 'inline-block';
            parityGroup.style.display = shouldHide ? 'none' : 'inline-block';
            uniqueGroup.style.display = shouldHide ? 'none' : 'inline-block';
            minGroup.style.display = shouldHide ? 'none' : 'inline-block';
            maxGroup.style.display = shouldHide ? 'none' : 'inline-block';

            ['matrix-sign', 'matrix-parity', 'matrix-unique', 'matrix-min', 'matrix-max'].forEach(id => {
                const label = document.querySelector(`label[for="${id}"]`);
                if (label) label.style.display = shouldHide ? 'none' : 'inline-block';
            });
        };

        mapSelect.addEventListener('change', toggleVisibility);
        toggleVisibility();
    },

    setupGraphListeners() {
        const bipartitSelect = document.getElementById('graph-bipartit');
        const orientedSelect = document.getElementById('graph-oriented');
        const weightedSelect = document.getElementById('graph-weighted');
        const minWeightInput = document.getElementById('graph-min-weight');
        const maxWeightInput = document.getElementById('graph-max-weight');


        if (!bipartitSelect || !orientedSelect || !weightedSelect || !minWeightInput || !maxWeightInput) {
            console.warn('One or more Graph component elements not found.');
            return;
        }

        function toggleGraphFields() {
            const orientedLabel = document.querySelector('label[for="graph-oriented"]');
            const bipartitLabel = document.querySelector('label[for="graph-bipartit"]');
            const minWeightLabel = document.querySelector('label[for="graph-min-weight"]');
            const maxWeightLabel = document.querySelector('label[for="graph-max-weight"]');

            if (bipartitSelect.value === 'yes') {
                orientedSelect.style.display = 'none';
                if (orientedLabel) {
                    orientedLabel.style.display = 'none';
                }
            } else {
                orientedSelect.style.display = 'inline-block';
                if (orientedLabel) {
                    orientedLabel.style.display = 'inline-block';
                }
            }

            if (orientedSelect.value === 'yes') {
                bipartitSelect.style.display = 'none';
                if (bipartitLabel) {
                    bipartitLabel.style.display = 'none';
                }
            } else {
                bipartitSelect.style.display = 'inline-block';
                if (bipartitLabel) {
                    bipartitLabel.style.display = 'inline-block';
                }
            }


            if (weightedSelect.value === 'yes') {
                minWeightInput.style.display = 'inline-block';
                maxWeightInput.style.display = 'inline-block';
                if (minWeightLabel) {
                    minWeightLabel.style.display = 'inline-block';
                }
                if (maxWeightLabel) {
                    maxWeightLabel.style.display = 'inline-block';
                }
            } else {
                minWeightInput.style.display = 'none';
                maxWeightInput.style.display = 'none';
                if (minWeightLabel) {
                    minWeightLabel.style.display = 'none';
                }
                if (maxWeightLabel) {
                    maxWeightLabel.style.display = 'none';
                }
            }


        }


        bipartitSelect.addEventListener('change', toggleGraphFields);
        orientedSelect.addEventListener('change', toggleGraphFields);
        weightedSelect.addEventListener('change', toggleGraphFields);

        toggleGraphFields();
    },


    addNavigationListeners() {
        const navLinks = document.querySelectorAll('[data-container]');
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const containerId = link.getAttribute('data-container');
                this.showContainer(containerId);
            });
        });

    },
    exportGraphSVG() {

        const graphData = window.currentGraphResult;
        if (!graphData) {
            console.warn('No graph generated yet.');
            return;
        }
        const svgOutput = createGraphSVG(graphData);

        document.getElementById('graph-output').innerHTML = svgOutput;
    },

    init() {
        this.loadSidebar();
        this.loadComponents();
        this.addNavigationListeners();

    }
};


document.addEventListener('DOMContentLoaded', () => {
    mainController.verifyJWT();
    mainController.init();
});

window.mainController = mainController;