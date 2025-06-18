// Función para crear el tablero de la pecera
function crearPecera(x) {
    const container = document.getElementById('pecera-container');
    container.innerHTML = '';
    const tablero = document.createElement('div');
    tablero.className = 'pecera-tablero';
    tablero.style.gridTemplateColumns = `repeat(${x}, 30px)`;
    tablero.style.gridTemplateRows = `repeat(${x}, 30px)`;
    for (let i = 0; i < x * x; i++) {
        const celda = document.createElement('div');
        celda.className = 'pecera-celda';
        tablero.appendChild(celda);
    }
    container.appendChild(tablero);
}

// Crear una pecera de 10x10 al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    crearPecera(10);
});
