import { matrixModel } from '../models/matrixModel.js';
import { vectorModel } from '../models/vectorModel.js';
import { numberModel } from '../models/numberModel.js';
import { stringModel } from '../models/stringModel.js';
import { treeModel } from '../models/treeModel.js';
import { graphModel } from '../models/graphModel.js';
import { exportAsJson, parseTextOutputToArray } from '../utils/exportUtils.js';


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
                    window.location.href = 'login.php';
                    throw new Error('Invalid token');
                }
                return response.json();
            })
            .then(data => {
                if (data.message !== 'valid') {
                    window.location.href = 'login.php';
                }
            })
            .catch(error => {
                console.error('JWT verification failed:', error);
                window.location.href = 'login.php';
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
        document.getElementById('graph-output').textContent = graphs.join(' ');


    },

    generateTree() {

        const node = parseInt(document.getElementById('tree-nodes').value);
        const oriented = document.getElementById('tree-oriented').value;
        const output_format = document.getElementById('tree-format').value;

        const trees = treeModel.generateTree(node, oriented, output_format);

        document.getElementById('tree-output').textContent = trees.join('\n');


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


    loadSidebar() {
        fetch('../views/components/sidebar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load sidebar.html: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => document.getElementById('sidebar').innerHTML = html)
            .catch(error => console.error('Error loading sidebar:', error));
    },

    loadComponents() {
        const components = ['number', 'string', 'vector', 'matrix', 'graph', 'tree'];
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
                })
                .catch(error => console.error(`Error loading ${component}:`, error));

        });
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