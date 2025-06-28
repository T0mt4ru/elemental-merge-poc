import React, { useState, useEffect, useCallback } from 'react';

// Define ELEMENTS directly within the component for self-containment in the immersive
const ELEMENTS = {
    1: { symbol: 'H', name: 'Waterstof', color: '#B3E0FF' },
    2: { symbol: 'He', name: 'Helium', color: '#C6FCFF' },
    3: { symbol: 'Li', name: 'Lithium', color: '#FFB8C2' },
    4: { symbol: 'Be', name: 'Beryllium', color: '#FFF3B3' },
    5: { symbol: 'B', name: 'Boor', color: '#D9D9D9' },
    6: { symbol: 'C', name: 'Koolstof', color: '#A9A9A9' },
    7: { symbol: 'N', name: 'Stikstof', color: '#87CEFA' },
    8: { symbol: 'O', name: 'Zuurstof', color: '#FFBABA' },
    9: { symbol: 'F', name: 'Fluor', color: '#ACE7EE' },
    10: { symbol: 'Ne', name: 'Neon', color: '#FFD700' },
    11: { symbol: 'Na', name: 'Natrium', color: '#FFB6C1' }, // Corrected 'Nqtrium' to 'Natrium'
    12: { symbol: 'Mg', name: 'Magnesium', color: '#C0C0C0' },
    13: { symbol: 'Al', name: 'Aluminium', color: '#B0C4DE' },
    14: { symbol: 'Si', name: 'Silicium', color: '#BDB76B' },
    15: { symbol: 'P', name: 'Fosfor', color: '#FFA07A' }, // Corrected 'Fosfpr' to 'Fosfor'
    16: { symbol: 'S', name: 'Zwavel', color: '#DAA520' },
    17: { symbol: 'Cl', name: 'Chloor', color: '#8FBC8F' },
    18: { symbol: 'Ar', name: 'Argon', color: '#ADD8E6' },
    19: { symbol: 'K', name: 'Kalium', color: '#EE82EE' },
    20: { symbol: 'Ca', name: 'Calcium', color: '#F0E68C' },
    // You can add more elements as needed for higher atomic numbers
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

            // Hier van boven naar beneden de spawn elementen bepalen.
            // Tier 2: Neon (10) reached -> Spawn He(2), Li(3)
            if (highestElement >= 10) {
                primarySpawn1 = 2;
                primarySpawn2 = 3;
            }
            // Tier 3: Sodium (11) reached -> Spawn Li(3), Be(4)
            if (highestElement >= 11) {
                primarySpawn1 = 3;
                primarySpawn2 = 4;
            }
            // Tier 4: Magnesium (12) reached -> Spawn Be(4), B(5)
            if (highestElement >= 12) {
                primarySpawn1 = 4;
                primarySpawn2 = 5;
            }
            // Voeg hier meer lagen toe voor nog hogere elementen, bijv:
            // if (highestElement >= 15) { primarySpawn1 = 7; primarySpawn2 = 8; } // Stikstof, Zuurstof

            // Bepalen of een oud element nog moet spawnen zodat je niet met 1 tegel overblijft.
            if (Math.random() < 0.10) { // 10% kans voor een lagere tier element
                if (highestElement >= 11 && newBoard.flat().includes(1)) { // If H is on board & Li/Be are primary spawns
                    newAtomicNum = 1; // Spawn H
                } else if (highestElement >= 12 && newBoard.flat().includes(2)) { // If He is on board & Be/B are primary spawns
                    newAtomicNum = 2; // Spawn He
                }
                // Voeg hier meer checks toe voor oudere elementen die mogelijk vastzitten
                // else if (highestElement >= 13 && newBoard.flat().includes(3)) { newAtomicNum = 3; } // Spawn Li

                else {
                    // Fallback naar gewone logica als geen van bovenstaande van toepassing is
                    newAtomicNum = Math.random() < 0.9 ? primarySpawn1 : primarySpawn2;
                }
            } else {
                // Gewone spawn logica voor de huidige tier
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
                    /* Zorg ervoor dat inhoud onzichtbaar is, maar nog steeds ruimte inneemt */
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
                <h1>Elementen Samenvoegen</h1> 
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
