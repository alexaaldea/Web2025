import { matrixModel } from '../models/matrixModel.js';
import { vectorModel } from '../models/vectorModel.js';
import { numberModel } from '../models/numberModel.js';
import { stringModel } from '../models/stringModel.js';
import { treeModel } from '../models/treeModel.js';
import { graphModel } from '../models/graphModel.js';

export const mainController = {
    showContainer(containerId) {
        const containers = document.querySelectorAll('.container');
        containers.forEach(el => el.style.display = 'none');

        const selected = document.getElementById(containerId);
        if (selected) {
            selected.style.display = 'block';
        }
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
    
    generateVector(){

        const elem =parseInt(document.getElementById('vector-length').value);
        const min = parseInt(document.getElementById('vector-min').value);
        const max = parseInt(document.getElementById('vector-max').value);
        const parity = document.getElementById('vector-parity').value;
        const sign = document.getElementById('vector-sign').value;
        const sorted = document.getElementById('vector-sorted').value;
        const unique = document.getElementById('vector-unique').value === 'yes';
        const type = document.getElementById('vector-type').value;
        const palindrome = document.getElementById('vector-palindrome').value;
        const line =parseInt(document.getElementById('vector-line').value);


        const vect=vectorModel.generateVector(elem,min,max,parity,sign,sorted,unique,type,palindrome,line);

        document.getElementById('vector-output').textContent=vect.join('\n');

    },

    generateMatrix(){

        const row =parseInt(document.getElementById('matrix-rows').value);
        const col =parseInt(document.getElementById('matrix-cols').value);
        const min = parseInt(document.getElementById('matrix-min').value);
        const max = parseInt(document.getElementById('matrix-max').value);
        const parity = document.getElementById('matrix-parity').value;
        const sign = document.getElementById('matrix-sign').value;
        const map = document.getElementById('matrix-map').value;

        const matrixs=matrixModel.generateMatrix(row,col,min,max,parity,sign,map);

        document.getElementById('matrix-output').textContent=matrixs.join('\n');

    },
    generateGraph(){

        const node =parseInt(document.getElementById('graph-nodes').value);
        const edge =parseInt(document.getElementById('graph-edges').value);
        const oriented = document.getElementById('graph-oriented').value;
        const connected = document.getElementById('graph-connected').value;
        const bipartit = document.getElementById('graph-bipartit').value;
        const weighted = document.getElementById('graph-weighted').value;
        const min_weight =parseInt(document.getElementById('graph-min-weight').value);
        const max_weight =parseInt(document.getElementById('graph-max-weight').value);
        const format = document.getElementById('graph-format').value;


        const graphs=graphModel.generateGraph(node,edge,oriented,connected,bipartit,weighted,min_weight,max_weight,format);

        document.getElementById('graph-output').textContent=graphs.join('\n');

    },

    generateTree(){

        const node =parseInt(document.getElementById('tree-nodes').value);
        const oriented = document.getElementById('tree-oriented').value;
        const output_format = document.getElementById('tree-format').value;

        const trees=treeModel.generateTree(node,oriented,output_format);

        document.getElementById('tree-output').textContent=trees.join('\n');

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
                })
                .catch(error => console.error(`Error loading ${component}:`, error));
        });
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

        document.addEventListener('DOMContentLoaded', () => {
            this.addNavigationListeners();
        });
    }
};


document.addEventListener('DOMContentLoaded', () => {
    mainController.init();
});

window.mainController = mainController;