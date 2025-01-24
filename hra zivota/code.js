// Definuje počet řádků a sloupců mřížky
var rows = 24; // Počet řádků
var cols = 24; // Počet sloupců

// Inicializuje hru
function initialize() {
    createTable(); // Vytvoří herní mřížku
    setupControls(); // Nastaví ovládací tlačítka
}

// Vytvoří mřížku (herní plochu)
function createTable() {
    var gridContainer = document.getElementById("gridContainer"); // Najde kontejner pro mřížku
    if (!gridContainer) {
        console.error("Problém: Nebyl nalezen element pro herní mřížku!");
        return;
    }

    var table = document.createElement("table"); // Vytvoří tabulku

    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr"); // Vytvoří řádek
        for (var j = 0; j < cols; j++) {
            var cell = document.createElement("td"); // Vytvoří buňku
            cell.setAttribute("id", i + "_" + j); // Nastaví unikátní ID pro každou buňku
            cell.setAttribute("class", "dead"); // Výchozí stav buňky je "mrtvá"
            tr.appendChild(cell); // Přidá buňku do řádku
        }
        table.appendChild(tr); // Přidá řádek do tabulky
    }
    gridContainer.appendChild(table); // Přidá tabulku do kontejneru
}

// Náhodně nastaví buňky mřížky jako "živé" nebo "mrtvé"
function randomizeGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = document.getElementById(i + "_" + j);
            if (Math.random() > 0.7) {
                cell.className = "live"; // Některé buňky nastaví jako živé
            } else {
                cell.className = "dead"; // Ostatní buňky zůstanou mrtvé
            }
        }
    }
}

// Aktualizuje mřížku na základě pravidel hry "Game of Life"
function updateGrid() {
    var nextGen = []; // Pole pro ukládání stavu další generace

    // Vytvoří kopii aktuálního stavu mřížky
    for (var i = 0; i < rows; i++) {
        nextGen[i] = [];
        for (var j = 0; j < cols; j++) {
            var cell = document.getElementById(i + "_" + j);
            var isAlive = cell.classList.contains("live"); // Zjistí, zda je buňka živá
            var liveNeighbors = countLiveNeighbors(i, j); // Spočítá živé sousedy buňky

            // Aplikuje pravidla hry
            if (isAlive && (liveNeighbors === 2 || liveNeighbors === 3)) {
                nextGen[i][j] = "live"; // Živá buňka přežije
            } else if (!isAlive && liveNeighbors === 3) {
                nextGen[i][j] = "live"; // Mrtvá buňka ožije
            } else {
                nextGen[i][j] = "dead"; // Jinak buňka zůstane nebo se stane mrtvou
            }
        }
    }

    // Aktualizuje mřížku na základě stavu další generace
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = document.getElementById(i + "_" + j);
            cell.className = nextGen[i][j]; // Nastaví stav buňky
        }
    }
}

// Spočítá počet živých sousedů buňky
function countLiveNeighbors(row, col) {
    var count = 0; // Počáteční počet živých sousedů
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue; // Přeskočí aktuální buňku

            var neighborRow = row + i;
            var neighborCol = col + j;

            // Zkontroluje, zda soused existuje a je živý
            if (
                neighborRow >= 0 &&
                neighborRow < rows &&
                neighborCol >= 0 &&
                neighborCol < cols
            ) {
                var neighbor = document.getElementById(neighborRow + "_" + neighborCol);
                if (neighbor.classList.contains("live")) {
                    count++; // Zvýší počet živých sousedů
                }
            }
        }
    }
    return count; // Vrátí počet živých sousedů
}

// Nastaví funkce pro tlačítka "Start" a "Clear"
function setupControls() {
    var startButton = document.getElementById("start"); // Tlačítko "Start"
    var clearButton = document.getElementById("clear"); // Tlačítko "Clear"

    var interval;

    // Funkce pro tlačítko "Start/Stop"
    startButton.addEventListener("click", function () {
        if (startButton.textContent === "start") {
            randomizeGrid(); // Náhodně vyplní mřížku na začátku
            startButton.textContent = "stop";
            interval = setInterval(updateGrid, 500); // Aktualizuje mřížku každých 500 ms
        } else {
            startButton.textContent = "start";
            clearInterval(interval); // Zastaví aktualizaci
        }
    });

    // Funkce pro tlačítko "Clear"
    clearButton.addEventListener("click", function () {
        clearInterval(interval); // Zastaví aktualizaci
        startButton.textContent = "start";

        var cells = document.querySelectorAll("td"); // Najde všechny buňky
        cells.forEach(function (cell) {
            cell.className = "dead"; // Vynuluje všechny buňky na mrtvé
        });
    });
}

// Spustí hru při načtení okna
window.onload = initialize;
