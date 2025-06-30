import React, { useState, useEffect, useCallback } from 'react';

// Define ELEMENTS directly within the component for self-containment in the immersive
const ELEMENTS = {
    // Groep 1: Alkali Metalen (exclusief Waterstof, dat is uniek) - Zacht Roze/Rood
    1: { symbol: 'H', name: 'Waterstof', color: '#B3E0FF' }, // Unieke kleur voor Waterstof
    3: { symbol: 'Li', name: 'Lithium', color: '#FF9999' },
    11: { symbol: 'Na', name: 'Natrium', color: '#FF9999' },
    19: { symbol: 'K', name: 'Kalium', color: '#FF9999' },
    37: { symbol: 'Rb', name: 'Rubidium', color: '#FF9999' },
    55: { symbol: 'Cs', name: 'Cesium', color: '#FF9999' },
    87: { symbol: 'Fr', name: 'Francium', color: '#FF9999' },

    // Groep 2: Aardalkali Metalen - Licht Oranje
    4: { symbol: 'Be', name: 'Beryllium', color: '#FFCC99' },
    12: { symbol: 'Mg', name: 'Magnesium', color: '#FFCC99' },
    20: { symbol: 'Ca', name: 'Calcium', color: '#FFCC99' },
    38: { symbol: 'Sr', name: 'Strontium', color: '#FFCC99' },
    56: { symbol: 'Ba', name: 'Barium', color: '#FFCC99' },
    88: { symbol: 'Ra', name: 'Radium', color: '#FFCC99' },

    // Overgangsmetalen - Gedifferentieerde tinten blauw/grijs
    // Periode 4 (Sc-Zn)
    21: { symbol: 'Sc', name: 'Scandium', color: '#A0BBE0' },
    22: { symbol: 'Ti', name: 'Titanium', color: '#A5C0E5' },
    23: { symbol: 'V', name: 'Vanadium', color: '#AAC5EA' },
    24: { symbol: 'Cr', name: 'Chroom', color: '#B0CAEF' },
    25: { symbol: 'Mn', name: 'Mangaan', color: '#B5CFF4' },
    26: { symbol: 'Fe', name: 'IJzer', color: '#BBDAF9' },
    27: { symbol: 'Co', name: 'Kobalt', color: '#C0DFFD' },
    28: { symbol: 'Ni', name: 'Nikkel', color: '#C5E4FF' },
    29: { symbol: 'Cu', name: 'Koper', color: '#CAE9FF' },
    30: { symbol: 'Zn', name: 'Zink', color: '#CFEEFF' },

    // Periode 5 (Y-Cd)
    39: { symbol: 'Y', name: 'Yttrium', color: '#8FB0D0' },
    40: { symbol: 'Zr', name: 'Zirkonium', color: '#94B5D5' },
    41: { symbol: 'Nb', name: 'Niobium', color: '#99BADF' },
    42: { symbol: 'Mo', name: 'Molybdeen', color: '#9EBFE4' },
    43: { symbol: 'Tc', name: 'Technetium', color: '#A3C4E9' },
    44: { symbol: 'Ru', name: 'Ruthenium', color: '#A8C9EE' },
    45: { symbol: 'Rh', name: 'Rhodium', color: '#ADD3F3' },
    46: { symbol: 'Pd', name: 'Palladium', color: '#B2D8F8' },
    47: { symbol: 'Ag', name: 'Zilver', color: '#B7DEFD' },
    48: { symbol: 'Cd', name: 'Cadmium', color: '#BCE3FF' },

    // Periode 6 (Hf-Hg) - Lutetium (71) is hier ook vaak bij ingedeeld, start hier.
    71: { symbol: 'Lu', name: 'Lutetium', color: '#7FA0B0' },
    72: { symbol: 'Hf', name: 'Hafnium', color: '#84A5B5' },
    73: { symbol: 'Ta', name: 'Tantalium', color: '#89AABA' },
    74: { symbol: 'W', name: 'Wolfraam', color: '#8EA0BF' },
    75: { symbol: 'Re', name: 'Rhenium', color: '#93A5C4' },
    76: { symbol: 'Os', name: 'Osmium', color: '#98AAC9' },
    77: { symbol: 'Ir', name: 'Iridium', color: '#9DB2CE' },
    78: { symbol: 'Pt', name: 'Platina', color: '#A2B7D3' },
    79: { symbol: 'Au', name: 'Goud', color: '#A7BBD8' },
    80: { symbol: 'Hg', name: 'Kwik', color: '#ACC2DD' },

    // Periode 7 (Rf-Cn) - Lawrencium (103) is hier ook vaak bij ingedeeld.
    103: { symbol: 'Lr', name: 'Lawrencium', color: '#6F90A0' },
    104: { symbol: 'Rf', name: 'Rutherfordium', color: '#7495A5' },
    105: { symbol: 'Db', name: 'Dubnium', color: '#799AAC' },
    106: { symbol: 'Sg', name: 'Seaborgium', color: '#7EA0B1' },
    107: { symbol: 'Bh', name: 'Bohrium', color: '#83A5B6' },
    108: { symbol: 'Hs', name: 'Hassium', color: '#88AABD' },
    109: { symbol: 'Mt', name: 'Meitnerium', color: '#8DADC2' },
    110: { symbol: 'Ds', name: 'Darmstadtium', color: '#92B2C7' },
    111: { symbol: 'Rg', name: 'Roentgenium', color: '#97B7CC' },
    112: { symbol: 'Cn', name: 'Copernicium', color: '#9CBBD1' },

    // Groep 13: Boorgroep - Roze/Paars
    5: { symbol: 'B', name: 'Boor', color: '#E0BBE4' },
    13: { symbol: 'Al', name: 'Aluminium', color: '#E0BBE4' },
    31: { symbol: 'Ga', name: 'Gallium', color: '#E0BBE4' },
    49: { symbol: 'In', name: 'Indium', color: '#E0BBE4' },
    81: { symbol: 'Tl', name: 'Thallium', color: '#E0BBE4' },
    113: { symbol: 'Nh', name: 'Nihonium', color: '#E0BBE4' },

    // Groep 14: Koolstofgroep - Grijs
    6: { symbol: 'C', name: 'Koolstof', color: '#9E9E9E' },
    14: { symbol: 'Si', name: 'Silicium', color: '#9E9E9E' },
    32: { symbol: 'Ge', name: 'Germanium', color: '#9E9E9E' },
    50: { symbol: 'Sn', name: 'Tin', color: '#9E9E9E' },
    82: { symbol: 'Pb', name: 'Lood', color: '#9E9E9E' },
    114: { symbol: 'Fl', name: 'Flerovium', color: '#9E9E9E' },

    // Groep 15: Stikstofgroep - Groenachtig
    7: { symbol: 'N', name: 'Stikstof', color: '#B3E0C2' },
    15: { symbol: 'P', name: 'Fosfor', color: '#B3E0C2' },
    33: { symbol: 'As', name: 'Arseen', color: '#B3E0C2' },
    51: { symbol: 'Sb', name: 'Antimoon', color: '#B3E0C2' },
    83: { symbol: 'Bi', name: 'Bismut', color: '#B3E0C2' },
    115: { symbol: 'Mc', name: 'Moscovium', color: '#B3E0C2' },

    // Groep 16: Zuurstofgroep (Chalcogenen) - Bruinachtig
    8: { symbol: 'O', name: 'Zuurstof', color: '#D4AA77' },
    16: { symbol: 'S', name: 'Zwavel', color: '#D4AA77' },
    34: { symbol: 'Se', name: 'Seleen', color: '#D4AA77' },
    52: { symbol: 'Te', name: 'Telluur', color: '#D4AA77' },
    84: { symbol: 'Po', name: 'Polonium', color: '#D4AA77' },
    116: { symbol: 'Lv', name: 'Livermorium', color: '#D4AA77' },

    // Groep 17: Halogenen - Lichtgroen/Cyaan
    9: { symbol: 'F', name: 'Fluor', color: '#9EE0C9' },
    17: { symbol: 'Cl', name: 'Chloor', color: '#9EE0C9' },
    35: { symbol: 'Br', name: 'Broom', color: '#9EE0C9' },
    53: { symbol: 'I', name: 'Jodium', color: '#9EE0C9' },
    85: { symbol: 'At', name: 'Astaat', color: '#9EE0C9' },
    117: { symbol: 'Ts', name: 'Tennessine', color: '#9EE0C9' },

    // Groep 18: Edelgassen - Helder Geel
    2: { symbol: 'He', name: 'Helium', color: '#FFFF99' },
    10: { symbol: 'Ne', name: 'Neon', color: '#FFFF99' },
    18: { symbol: 'Ar', name: 'Argon', color: '#FFFF99' },
    36: { symbol: 'Kr', name: 'Krypton', color: '#FFFF99' },
    54: { symbol: 'Xe', name: 'Xenon', color: '#FFFF99' },
    86: { symbol: 'Rn', name: 'Radon', color: '#FFFF99' },
    118: { symbol: 'Og', name: 'Oganesson', color: '#FFFF99' },

    // Lanthaniden - Gedifferentieerde tinten paars
    // De kleuren lopen hier op, beginnend bij de donkerste tint voor La
    57: { symbol: 'La', name: 'Lanthanium', color: '#BB99CC' },
    58: { symbol: 'Ce', name: 'Cerium', color: '#C0A0D1' },
    59: { symbol: 'Pr', name: 'Praseodymium', color: '#C5A7D6' },
    60: { symbol: 'Nd', name: 'Neodymium', color: '#CAADD7' },
    61: { symbol: 'Pm', name: 'Promethium', color: '#CFB4DD' },
    62: { symbol: 'Sm', name: 'Samarium', color: '#D4BBDF' },
    63: { symbol: 'Eu', name: 'Europium', color: '#D9C2E0' },
    64: { symbol: 'Gd', name: 'Gadolinium', color: '#DEC9E2' },
    65: { symbol: 'Tb', name: 'Terbium', color: '#E3D0E4' },
    66: { symbol: 'Dy', name: 'Dysprosium', color: '#E8D7E6' },
    67: { symbol: 'Ho', name: 'Holmium', color: '#EEDEE8' },
    68: { symbol: 'Er', name: 'Erbium', color: '#F3E5E9' },
    69: { symbol: 'Tm', name: 'Thulium', color: '#F8ECEB' },
    70: { symbol: 'Yb', name: 'Ytterbium', color: '#FDF3ED' },


    // Actiniden - Gedifferentieerde tinten groen
    // De kleuren lopen hier op, beginnend bij de donkerste tint voor Ac
    89: { symbol: 'Ac', name: 'Actinium', color: '#99CC99' },
    90: { symbol: 'Th', name: 'Thorium', color: '#A0D1A0' },
    91: { symbol: 'Pa', name: 'Protactinium', color: '#A7D6A7' },
    92: { symbol: 'U', name: 'Uranium', color: '#AEDBAE' },
    93: { symbol: 'Np', name: 'Neptunium', color: '#B5E0B5' },
    94: { symbol: 'Pu', name: 'Plutonium', color: '#BCE6BC' },
    95: { symbol: 'Am', name: 'Americium', color: '#C3EBC3' },
    96: { symbol: 'Cm', name: 'Curium', color: '#CAF1CA' },
    97: { symbol: 'Bk', name: 'Berkelium', color: '#D1F6D1' },
    98: { symbol: 'Cf', name: 'Californium', color: '#D8FCDC' },
    99: { symbol: 'Es', name: 'Einsteinium', color: '#DFFFE3' },
    100: { symbol: 'Fm', name: 'Fermium', color: '#E6FFE9' },
    101: { symbol: 'Md', name: 'Mendelevium', color: '#EDFFEE' },
    102: { symbol: 'No', name: 'Nobelium', color: '#F4FFF4' },
};

const GRID_SIZE = 4;
const INITIAL_TILES = 2; // Aantal tegels om mee te starten

// Tegel Component
const Tile = ({ atomicNumber }) => {
    const element = ELEMENTS[atomicNumber] || { symbol: '', name: '', color: '#eee' }; // Default for empty
    const isEmpty = atomicNumber === 0;

    return (
        <div
            className={`tile ${isEmpty ? 'empty' : ''}`}
            style={{ backgroundColor: element.color }}
        >
            {/* Altijd de contentstructuur renderen, maar verbergen met visibility: hidden wanneer leeg */}
            <div className="atomic-number" style={{ visibility: isEmpty ? 'hidden' : 'visible' }}>{atomicNumber}</div>
            <div className="symbol" style={{ visibility: isEmpty ? 'hidden' : 'visible' }}>{element.symbol}</div>
            <div className="name" style={{ visibility: isEmpty ? 'hidden' : 'visible' }}>{element.name}</div>
        </div>
    );
};

// Hoofd App Component
function App() {
    // Functie om het lege bord te maken
    const initializeBoard = useCallback(() =>
        Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)), []);

    // Willekeurige lege celcoördinaten ophalen
    const getRandomEmptyCell = useCallback((board) => {
        const emptyCells = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (board[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }
        if (emptyCells.length === 0) return null;
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }, []);

    // Bepalen van het hoogste atoomnummer op het bord.
    const getHighestElementOnBoard = useCallback((board) => {
        let max = 0;
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (board[r][c] > max) {
                    max = board[r][c];
                }
            }
        }
        return max;
    }, []);

    // Controle op game over
    const checkGameOver = useCallback((currentBoard) => {
        // 1. Check voor lege cellen
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (currentBoard[r][c] === 0) {
                    return false; // Lege cel gevonden, geen Game Over
                }
            }
        }

        // 2. Check op samenvoegen
        // Horizontale checks
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE - 1; c++) {
                if (currentBoard[r][c] !== 0 && currentBoard[r][c] === currentBoard[r][c + 1]) {
                    return false; // Horizontaal samenvoegen mogelijk
                }
            }
        }
        // Vertikale checks
        for (let c = 0; c < GRID_SIZE; c++) {
            for (let r = 0; r < GRID_SIZE - 1; r++) {
                if (currentBoard[r][c] !== 0 && currentBoard[r][c] === currentBoard[r + 1][c]) {
                    return false; // Verticaal samenvoegen mogelijk
                }
            }
        }

        return true; // Geen lege cellen, samenvoegen niet mogelijk
    }, []);

    // Nieuw element op bord zetten
    const addNewElement = useCallback((board) => {
        const newBoard = board.map(row => [...row]);
        const emptyCell = getRandomEmptyCell(newBoard);
        if (emptyCell) {
            const highestElement = getHighestElementOnBoard(newBoard);
            let newAtomicNum;

            // Bepaal init element spawn
            let primarySpawn1 = 1; // Waterstof
            let primarySpawn2 = 2; // Helium

            // Bepaal element spawn dynamisch vanaf Neon (10)
            if (highestElement >= 10) {
                // Adjust primary spawns based on highest element for progression
                // Ensure primarySpawn1 is at least 1, and primarySpawn2 is primarySpawn1 + 1
                primarySpawn1 = Math.max(1, highestElement - 8);
                primarySpawn2 = primarySpawn1 + 1;
            }
            // Add more tiers as needed, ensure primarySpawn1/2 don't exceed max element defined

            // Logic to potentially spawn a "stuck" lower-tier element
            const stuckElements = [];
            for (let i = 1; i < primarySpawn1; i++) { // Check for elements below the current primary spawn tier
                if (newBoard.flat().includes(i)) {
                    // Check if there's only one of this element (implies it might be stuck)
                    const count = newBoard.flat().filter(num => num === i).length;
                    if (count === 1) { // Only one of this element, potentially stuck
                        stuckElements.push(i);
                    }
                }
            }

            if (stuckElements.length > 0 && Math.random() < 0.15) { // 15% chance to spawn a stuck element
                newAtomicNum = stuckElements[Math.floor(Math.random() * stuckElements.length)];
            } else {
                // Otherwise, spawn from the primary tier (90% lower, 10% higher)
                newAtomicNum = Math.random() < 0.9 ? primarySpawn1 : primarySpawn2;
            }

            newBoard[emptyCell.r][emptyCell.c] = newAtomicNum;
        }
        return newBoard;
    }, [getRandomEmptyCell, getHighestElementOnBoard]);

    const [board, setBoard] = useState(() => {
        let initialBoard = initializeBoard();
        for (let i = 0; i < INITIAL_TILES; i++) {
            initialBoard = addNewElement(initialBoard);
        }
        return initialBoard;
    });
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);

    // --- Kern Spel Logica ---

    // Schuiven en samenvoegen
    const slideAndMergeLine = useCallback((line, direction) => {
        let tiles = line.filter(num => num !== 0);
        let changed = false;
        let currentScoreIncrease = 0;

        // Bepaal of samenvoegen van rechts naar links (voor rechts/beneden bewegingen)
        // of van links naar rechts (voor links/omhoog bewegingen) moet plaatsvinden
        if (direction === 'right' || direction === 'down') {
            for (let i = tiles.length - 1; i > 0; i--) {
                if (tiles[i] !== 0 && tiles[i] === tiles[i - 1]) {
                    tiles[i] += 1; // N+1 samenvoegen
                    currentScoreIncrease += tiles[i];
                    tiles.splice(i - 1, 1); // Verwijder de samengevoegde tegel
                    changed = true;
                    i--; // Sla de volgende tegel over omdat deze net is samengevoegd
                }
            }
            // Vul aan met nullen aan het begin
            while (tiles.length < GRID_SIZE) {
                tiles.unshift(0);
            }
        } else { // 'left' of 'up'
            for (let i = 0; i < tiles.length - 1; i++) {
                if (tiles[i] !== 0 && tiles[i] === tiles[i + 1]) {
                    tiles[i] += 1; // N+1 samenvoegen
                    currentScoreIncrease += tiles[i];
                    tiles.splice(i + 1, 1); // Verwijder de samengevoegde tegel
                    changed = true;
                }
            }
            // Vul aan met nullen aan het einde
            while (tiles.length < GRID_SIZE) {
                tiles.push(0);
            }
        }

        if (currentScoreIncrease > 0) {
            setScore(prevScore => prevScore + currentScoreIncrease);
        }

        // Controleer of de werkelijke tegelwaarden (exclusief nullen) zijn gewijzigd, nodig voor boardChanged
        // Controleer ook of posities zijn gewijzigd, door de originele lijn (na filteren van nullen)
        // te vergelijken met de nieuwe lijn (na filteren van nullen)
        const originalLineWithoutZeros = line.filter(num => num !== 0);
        const newLineWithoutZeros = tiles.filter(num => num !== 0);

        if (changed || JSON.stringify(originalLineWithoutZeros) !== JSON.stringify(newLineWithoutZeros) || originalLineWithoutZeros.length !== newLineWithoutZeros.length) {
            changed = true;
        }


        return { newLine: tiles, changed: changed };
    }, [setScore]);


    // Past een beweging (omhoog, omlaag, links, rechts) toe op het hele bord
    const applyMove = useCallback((direction) => {
        if (isGameOver) return; // Voorkom bewegingen als het spel voorbij is

        let newBoard = board.map(row => [...row]); // Maak een diepe kopie
        let boardChanged = false;

        if (direction === 'left' || direction === 'right') {
            for (let r = 0; r < GRID_SIZE; r++) {
                const originalRow = [...newBoard[r]]; // Bewaar origineel voor vergelijking
                const { newLine, changed } = slideAndMergeLine(newBoard[r], direction);
                newBoard[r] = newLine;
                // Controleer of de staat van de rij daadwerkelijk is gewijzigd (waarden of posities)
                if (changed || JSON.stringify(originalRow) !== JSON.stringify(newLine)) {
                    boardChanged = true;
                }
            }
        } else if (direction === 'up' || direction === 'down') {
            for (let c = 0; c < GRID_SIZE; c++) {
                let currentColumn = [];
                for (let r = 0; r < GRID_SIZE; r++) {
                    currentColumn.push(newBoard[r][c]);
                }
                const originalColumn = [...currentColumn]; // Bewaar origineel voor vergelijking

                const { newLine, changed } = slideAndMergeLine(currentColumn, direction);

                // Controleer of de staat van de kolom daadwerkelijk is gewijzigd (waarden of posities)
                if (changed || JSON.stringify(originalColumn) !== JSON.stringify(newLine)) {
                    boardChanged = true;
                }

                // Pas de verwerkte kolom toe op het nieuwe bord
                for (let r = 0; r < GRID_SIZE; r++) {
                    newBoard[r][c] = newLine[r];
                }
            }
        }

        if (boardChanged) {
            const finalBoard = addNewElement(newBoard);
            setBoard(finalBoard);
            // Na het toevoegen van een nieuw element, controleer of het spel voorbij is
            if (checkGameOver(finalBoard)) {
                setIsGameOver(true);
            }
        }
    }, [board, slideAndMergeLine, addNewElement, checkGameOver, isGameOver]);

    // Nieuw spel starten
    const handleNewGame = useCallback(() => {
        let initialBoard = initializeBoard();
        for (let i = 0; i < INITIAL_TILES; i++) {
            initialBoard = addNewElement(initialBoard);
        }
        setBoard(initialBoard);
        setScore(0);
        setIsGameOver(false);
    }, [initializeBoard, addNewElement]);

    // --- Input Handlers ---

    // Toetsenbord Input Handler
    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    event.preventDefault(); // Voorkom paginarollen
                    applyMove('up');
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    applyMove('down');
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    applyMove('left');
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    applyMove('right');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [applyMove]);

    // Touch/Swipe Input Handler voor mobiel
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchStartY, setTouchStartY] = useState(null);

    const handleTouchStart = (event) => {
        setTouchStartX(event.touches[0].clientX);
        setTouchStartY(event.touches[0].clientY);
    };

    const handleTouchEnd = (event) => {
        if (touchStartX === null || touchStartY === null) return;

        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;

        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY - 20; // Lichte verticale offset toegevoegd om onbedoeld verticaal scrollen te voorkomen

        // Bepaal of het een horizontale of verticale veeg is, en of deze significant genoeg is
        const minSwipeDistance = 30; // Minimale pixelafstand voor een veeg om te registreren
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipeDistance) { // Horizontale veeg
            if (dx > 0) { // Naar rechts geveegd
                event.preventDefault(); // Voorkom paginarollen
                applyMove('right');
            } else { // Naar links geveegd
                event.preventDefault(); // Voorkom paginarollen
                applyMove('left');
            }
        } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > minSwipeDistance) { // Verticale veeg
            if (dy > 0) { // Naar beneden geveegd
                event.preventDefault(); // Voorkom paginarollen
                applyMove('down');
            } else { // Naar boven geveegd
                event.preventDefault(); // Voorkom paginarollen
                applyMove('up');
            }
        }

        // Reset touchcoördinaten
        setTouchStartX(null);
        setTouchStartY(null);
    };


    return (
        <div className="game-wrapper"
             onTouchStart={handleTouchStart}
             onTouchEnd={handleTouchEnd}>
            {/* Stijlen zijn hier ingebed voor zelfstandigheid van Canvas */}
            <style>{`
                .game-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #f0f0f0;
                    font-family: 'Inter', sans-serif; /* Gebruik van Inter volgens instructies */
                    color: #333;
                    width: 100vw; /* Volledige viewport breedte */
                    box-sizing: border-box; /* Inclusief padding en rand in de totale breedte en hoogte van het element */
                }

                .game-container {
                    position: relative; /* Voor positionering van het game over overlay */
                    background-color: #bbada0;
                    padding: 20px;
                    border-radius: 12px; /* Afgeronde hoeken */
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                    text-align: center;
                    /* Gebruik van flex-eigenschappen om inhoud te centreren */
                    display: flex;
                    flex-direction: column;
                    align-items: center; /* Horizontaal centreren in een kolomindeling */
                    justify-content: center; /* Verticaal centreren in een kolomindeling */
                    width: 90%; /* Responsieve breedte */
                    max-width: 450px; /* Maximale breedte voor grotere schermen */
                    margin: 20px auto; /* Centreren en marge */
                    box-sizing: border-box;
                }

                h1 {
                    color: #776e65;
                    margin-bottom: 15px;
                    font-size: 2em;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
                }

                .score {
                    font-size: 1.8em;
                    font-weight: bold;
                    margin-bottom: 25px;
                    color: #6a5e55;
                    background-color: #eee4da;
                    padding: 10px 20px;
                    border-radius: 8px;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
                }

                .game-board {
                    display: grid;
                    grid-template-columns: repeat(${GRID_SIZE}, 1fr);
                    grid-template-rows: repeat(${GRID_SIZE}, 1fr);
                    gap: 12px; /* Vergrote afstand */
                    background-color: #cdc1b4;
                    padding: 15px; /* Vergrote padding */
                    border-radius: 10px; /* Afgeronde hoeken */
                    width: clamp(300px, 80vw, 400px); /* Responsief breedtebereik */
                    height: clamp(300px, 80vw, 400px); /* Vierkant houden, overeenkomend met breedte */
                    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.2);
                    /* Geen margin: auto hier, ouder flexbox beheert centreren */
                }

                .board-row {
                    display: contents; /* Zorgt ervoor dat tegels directe kinderen van de grid zijn */
                }

                .tile {
                    width: 100%;
                    height: 100%;
                    background-color: #eee4da;
                    border-radius: 8px; /* Meer afgeronde hoeken */
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-weight: bold;
                    font-size: clamp(0.8em, 4vw, 2em); /* Responsieve lettergrootte */
                    color: #776e65;
                    box-sizing: border-box;
                    padding: 5px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    transition: transform 0.1s ease-out, background-color 0.1s ease; /* Basisovergang voor feedback */
                }

                .tile:active {
                    transform: scale(0.95); /* Klein drukeffect bij tikken/klikken */
                }

                .tile.empty {
                    background-color: rgba(238, 228, 218, 0.35);
                }

                .tile .atomic-number,
                .tile .symbol,
                .tile .name {
                    margin: 0; /* Zorgt ervoor dat er geen standaardmarges zijn die inhoud verschuiven */
                    padding: 0; /* Zorgt ervoor dat er geen standaardpadding is die inhoud verschuiven */
                    line-height: 1.2; /* Iets genereuzere lijnhoogte voor leesbaarheid */
                    min-height: 1.2em; /* Zorg voor een minimale hoogte voor elke tekstregel */
                    transition: opacity 0.1s ease-in-out; /* Vloeiende overgang voor transparantie */
                }
                .tile .atomic-number {
                    font-size: 0.6em;
                }

                .tile .symbol {
                    font-size: 1.2em;
                }

                .tile .name {
                    font-size: 0.4em;
                    color: #8d8376;
                }

                p {
                    margin-top: 25px;
                    font-size: 1em;
                    color: #776e65;
                }

                strong {
                    color: #6a5e55;
                }

                .game-over-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(238, 228, 218, 0.7); /* Semi-transparante overlay */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10;
                    border-radius: 12px; /* Overeenkomen met container */
                }

                .game-over-message {
                    background-color: #fcf6e6; /* Lichtere achtergrond voor berichtvak */
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
                    text-align: center;
                    color: #776e65;
                    max-width: 80%; /* Responsieve breedte */
                }

                .game-over-message h2 {
                    font-size: 2.5em;
                    margin-bottom: 15px;
                    color: #776e65;
                }

                .game-over-message p {
                    font-size: 1.2em;
                    margin-bottom: 20px;
                }

                .game-over-message button, .new-game-button {
                    background-color: #8f7a66;
                    color: #f9f6f2;
                    padding: 12px 25px;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.1em;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.2s ease, transform 0.1s ease;
                    box-shadow: 0 3px 5px rgba(0,0,0,0.2);
                    margin-top: 20px; /* Voor de nieuwe spelknop onder het bord */
                }

                .game-over-message button:hover, .new-game-button:hover {
                    background-color: #6d5848;
                    transform: translateY(-2px);
                }

                .game-over-message button:active, .new-game-button:active {
                    transform: translateY(0);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }

                .new-game-button {
                    display: block; /* Zorgt ervoor dat het de volledige breedte onder het bord inneemt indien nodig */
                    margin: 25px auto 0 auto; /* Centreer het onder het bord */
                    width: fit-content;
                }

                /* Responsieve aanpassingen voor kleinere schermen */
                @media (max-width: 600px) {
                    .game-container {
                        padding: 15px;
                        margin: 10px auto;
                    }
                    h1 {
                        font-size: 1.8em;
                    }
                    .score {
                        font-size: 1.3em;
                        padding: 8px 15px;
                    }
                    .game-board {
                        gap: 8px;
                        padding: 10px;
                    }
                    .tile {
                        font-size: clamp(0.7em, 3.5vw, 1.8em);
                    }
                    p {
                        font-size: 0.85em;
                    }
                    .game-over-message h2 {
                        font-size: 2em;
                    }
                    .game-over-message p {
                        font-size: 1em;
                    }
                }
            `}</style>
            <div className="game-container">
                <h1>Elemental Merge</h1> 
                <div className="score">Score: {score}</div> 
                {/* Changed the .game-board's margin to 0 and centered via game-container's align-items */}
                <div className="game-board">
                    {board.map((row, rowIndex) => (
                        <div key={rowIndex} className="board-row">
                            {row.map((atomicNumber, colIndex) => (
                                <Tile key={`${rowIndex}-${colIndex}`} atomicNumber={atomicNumber} />
                            ))}
                        </div>
                    ))}
                </div>
                <p>Gebruik <strong>Pijltjestoetsen</strong> of <strong>Vegen</strong> om te spelen!</p> 
                <button className="new-game-button" onClick={handleNewGame}>Nieuw Spel</button> 
                {isGameOver && (
                    <div className="game-over-overlay">
                        <div className="game-over-message">
                            <h2>Spel Voorbij!</h2> 
                            <p>Je eindscore: {score}</p> 
                            <button onClick={handleNewGame}>Nieuw Spel</button> 
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
