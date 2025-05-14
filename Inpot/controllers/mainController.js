import { numberModel } from '../models/numberModel.js';
import { stringModel } from '../models/stringModel.js';

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
        const min = parseInt(document.getElementById('number-min').value);
        const max = parseInt(document.getElementById('number-max').value);
        const count = parseInt(document.getElementById('number-count').value);
        const parity = document.getElementById('number-parity').value;
        const sign = document.getElementById('number-sign').value;
        const sorted = document.getElementById('number-sorted').value;


        const numbers = numberModel.generateNumbers(min, max, count, parity, sign, sorted);


        document.getElementById('number-output').textContent = numbers.join(', ');
    },

    generateStrings() {
        const minLength = parseInt(document.getElementById('string-min').value);
        const maxLength = parseInt(document.getElementById('string-max').value);
        const unique = document.getElementById('string-unique').value;
        const letters = document.getElementById('string-letter').value.split(',');
        const count = parseInt(document.getElementById('string-count').value);


        const strings = stringModel.generateStrings(minLength, maxLength, unique, letters, count);


        document.getElementById('string-output').textContent = strings.join('\n');
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