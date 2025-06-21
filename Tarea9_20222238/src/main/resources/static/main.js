// Pregunta 1: Uso de Document Object Model API
// Esta función utiliza la API del DOM para crear dinámicamente un tablero cuadrado de tamaño x en la página.
function crearPecera(x) {
    // Usando la API del DOM para seleccionar el contenedor
    const container = document.getElementById('pecera-container');
    // Limpiar el contenido previo
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    // Crear el tablero usando createElement
    const tablero = document.createElement('div');
    tablero.className = 'pecera-tablero';
    tablero.style.display = 'grid';
    tablero.style.gridTemplateColumns = `repeat(${x}, 30px)`;
    tablero.style.gridTemplateRows = `repeat(${x}, 30px)`;
    // Crear las celdas usando un bucle y la API del DOM
    for (let i = 0; i < x * x; i++) {
        const celda = document.createElement('div');
        celda.className = 'pecera-celda';
        tablero.appendChild(celda);
    }
    // Insertar el tablero en el contenedor
    container.appendChild(tablero);
}

// Pregunta 2: Uso de Web Storage API para los contadores de Nemo y Dory
// Nemo usa localStorage (memoria persistente entre pestañas y recargas)
// Dory usa sessionStorage (memoria solo en la pestaña actual)
function actualizarContadores() {
    // Usar la Web Storage API para obtener los valores
    const nemo = localStorage.getItem('contadorNemo') || 0;
    const dory = sessionStorage.getItem('contadorDory') || 0;
    document.getElementById('contador-nemo').textContent = nemo;
    document.getElementById('contador-dory').textContent = dory;
}

// Pregunta 2 (continuación): Cambio progresivo de color de la pecera
// Usamos la API del DOM y setInterval para cambiar el color de fondo del tablero
let colorStep = 0;
let colorInterval = null;

function resetColorPecera() {
    colorStep = 0;
    setColorPecera(0);
}

function setColorPecera(step) {
    // De azul claro (#b3e0ff) a verde claro (#b3ffb3)
    // Interpolamos el color usando valores RGB
    const start = {r: 179, g: 224, b: 255}; // azul
    const end = {r: 179, g: 255, b: 179};   // verde
    const t = Math.min(step / 60, 1); // 60 pasos (1 min)
    const r = Math.round(start.r + (end.r - start.r) * t);
    const g = Math.round(start.g + (end.g - start.g) * t);
    const b = Math.round(start.b + (end.b - start.b) * t);
    const color = `rgb(${r},${g},${b})`;
    const tablero = document.querySelector('.pecera-tablero');
    if (tablero) tablero.style.background = color;
}

// Pregunta 3: Uso de Drag and Drop API para burbujas flotantes
// Creamos burbujas cada 2 segundos y las hacemos arrastrables usando la API nativa
const burbujasContainer = document.createElement('div');
burbujasContainer.id = 'burbujas-container';
document.body.appendChild(burbujasContainer);

const areasDrop = {
    nemo: document.querySelector('.pez-box:nth-child(1)'),
    dory: document.querySelector('.pez-box:nth-child(2)')
};

function crearBurbuja() {
    // Alternar entre Nemo y Dory
    const tipo = Math.random() < 0.5 ? 'nemo' : 'dory';
    const burbuja = document.createElement('div');
    burbuja.className = 'burbuja ' + tipo;
    burbuja.draggable = true;
    burbuja.textContent = '';
    burbuja.style.left = Math.random() * 80 + 10 + '%';
    burbuja.style.top = '0px';
    burbuja.setAttribute('data-tipo', tipo);
    // Drag events
    burbuja.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', tipo);
        burbuja.classList.add('dragging');
    });
    burbuja.addEventListener('dragend', (e) => {
        burbuja.classList.remove('dragging');
    });
    burbujasContainer.appendChild(burbuja);
    setTimeout(() => {
        if (burbujasContainer.contains(burbuja)) burbujasContainer.removeChild(burbuja);
    }, 10000); // Desaparece tras 10s si no se usa
}

// Hacer las áreas de los peces droppables
Object.entries(areasDrop).forEach(([tipo, area]) => {
    area.addEventListener('dragover', (e) => {
        e.preventDefault();
        area.classList.add('drop-hover');
    });
    area.addEventListener('dragleave', (e) => {
        area.classList.remove('drop-hover');
    });
    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.classList.remove('drop-hover');
        const dragging = document.querySelector('.burbuja.dragging');
        if (dragging && dragging.getAttribute('data-tipo') === tipo) {
            // Sumar al contador correcto
            if (tipo === 'nemo') {
                let nemo = parseInt(localStorage.getItem('contadorNemo') || '0', 10);
                nemo++;
                localStorage.setItem('contadorNemo', nemo);
            } else {
                let dory = parseInt(sessionStorage.getItem('contadorDory') || '0', 10);
                dory++;
                sessionStorage.setItem('contadorDory', dory);
            }
            actualizarContadores();
            dragging.remove();
        } else if (dragging) {
            // Si es incorrecto, vuelve a su posición inicial
            dragging.style.top = '0px';
        }
    });
});

window.addEventListener('DOMContentLoaded', function() {
    crearPecera(10); // Puedes cambiar el tamaño aquí
    actualizarContadores();
    document.getElementById('btn-nemo').addEventListener('click', function() {
        // Usar la Web Storage API para Nemo
        let nemo = parseInt(localStorage.getItem('contadorNemo') || '0', 10);
        nemo++;
        localStorage.setItem('contadorNemo', nemo);
        actualizarContadores();
    });
    document.getElementById('btn-dory').addEventListener('click', function() {
        // Usar la Web Storage API para Dory
        let dory = parseInt(sessionStorage.getItem('contadorDory') || '0', 10);
        dory++;
        sessionStorage.setItem('contadorDory', dory);
        actualizarContadores();
    });
    resetColorPecera();
    if (colorInterval) clearInterval(colorInterval);
    colorInterval = setInterval(() => {
        colorStep++;
        setColorPecera(colorStep);
    }, 1000);
    setInterval(crearBurbuja, 2000);
});
