import React, { useState, useEffect, useCallback } from 'react';

// Define ELEMENTS directly within the component for self-containment in the immersive
const ELEMENTS = {
    1: { symbol: 'H', name: 'Hydrogen', color: '#B3E0FF' },
    2: { symbol: 'He', name: 'Helium', color: '#C6FCFF' },
    3: { symbol: 'Li', name: 'Lithium', color: '#FFB8C2' },
    4: { symbol: 'Be', name: 'Beryllium', color: '#FFF3B3' },
    5: { symbol: 'B', name: 'Boron', color: '#D9D9D9' },
    6: { symbol: 'C', name: 'Carbon', color: '#A9A9A9' },
    7: { symbol: 'N', name: 'Nitrogen', color: '#87CEFA' },
    8: { symbol: 'O', name: 'Oxygen', color: '#FFBABA' },
    9: { symbol: 'F', name: 'Fluorine', color: '#ACE7EE' },
    10: { symbol: 'Ne', name: 'Neon', color: '#FFD700' },
    11: { symbol: 'Na', name: 'Sodium', color: '#FFB6C1' },
    12: { symbol: 'Mg', name: 'Magnesium', color: '#C0C0C0' },
    13: { symbol: 'Al', name: 'Aluminum', color: '#B0C4DE' },
    14: { symbol: 'Si', name: 'Silicon', color: '#BDB76B' },
    15: { symbol: 'P', name: 'Phosphorus', color: '#FFA07A' },
    16: { symbol: 'S', name: 'Sulfur', color: '#DAA520' },
    17: { symbol: 'Cl', name: 'Chlorine', color: '#8FBC8F' },
    18: { symbol: 'Ar', name: 'Argon', color: '#ADD8E6' },
    19: { symbol: 'K', name: 'Potassium', color: '#EE82EE' },
    20: { symbol: 'Ca', name: 'Calcium', color: '#F0E68C' },
    // You can add more elements as needed for higher atomic numbers
};

const GRID_SIZE = 4;
const INITIAL_TILES = 2; // Number of tiles to start with

// Tile Component
const Tile = ({ atomicNumber }) => {
    const element = ELEMENTS[atomicNumber] || { symbol: '', name: '', color: '#eee' }; // Default for empty
    const isEmpty = atomicNumber === 0;

    return (
        <div
            className={`tile ${isEmpty ? 'empty' : ''}`}
            style={{ backgroundColor: element.color }}
        >
            {/* Always render the content structure, but hide with visibility: hidden when empty */}
            {/* The inner elements now have `line-height` and `margin: 0` to control their exact height */}
            <div className="atomic-number" style={{ visibility: isEmpty ? 'hidden' : 'visible' }}>{atomicNumber}</div>
            <div className="symbol" style={{ visibility: isEmpty ? 'hidden' : 'visible' }}>{element.symbol}</div>
            <div className="name" style={{ visibility: isEmpty ? 'hidden' : 'visible' }}>{element.name}</div>
        </div>
    );
};

// Main App Component
function App() {
    // Helper function to create an empty board
    const initializeBoard = useCallback(() =>
        Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)), []);

    // Helper to get random empty cell coordinates
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

    // Helper to find the highest atomic number currently on the board
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

    // Helper to check for game over condition
    const checkGameOver = useCallback((currentBoard) => {
        // 1. Check for any empty cells
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (currentBoard[r][c] === 0) {
                    return false; // Found an empty cell, not game over
                }
            }
        }

        // 2. Check for any possible merges (horizontal and vertical)
        // Horizontal checks
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE - 1; c++) {
                if (currentBoard[r][c] !== 0 && currentBoard[r][c] === currentBoard[r][c + 1]) {
                    return false; // Possible horizontal merge
                }
            }
        }
        // Vertical checks
        for (let c = 0; c < GRID_SIZE; c++) {
            for (let r = 0; r < GRID_SIZE - 1; r++) {
                if (currentBoard[r][c] !== 0 && currentBoard[r][c] === currentBoard[r + 1][c]) {
                    return false; // Possible vertical merge
                }
            }
        }

        return true; // No empty cells and no possible merges left
    }, []);

    // Helper to add a new element based on the highest element on board
    const addNewElement = useCallback((board) => {
        const newBoard = board.map(row => [...row]); // Deep copy
        const emptyCell = getRandomEmptyCell(newBoard);
        if (emptyCell) {
            const highestElement = getHighestElementOnBoard(newBoard);
            let newAtomicNum;

            // Define the primary spawn elements based on the highest achieved element
            let primarySpawn1 = 1; // Hydrogen
            let primarySpawn2 = 2; // Helium

            if (highestElement >= 11) { // If Sodium (11) or higher
                primarySpawn1 = 3; // Lithium
                primarySpawn2 = 4; // Beryllium
            } else if (highestElement >= 10) { // If Neon (10) or higher
                primarySpawn1 = 2; // Helium
                primarySpawn2 = 3; // Lithium
            }
            // You can add more tiers here for even higher elements.

            // Determine if a "retired" element should spawn (low chance)
            // This is to clear potentially stuck low-level tiles
            if (highestElement >= 10 && Math.random() < 0.05) { // 5% chance for a lower tier element if Neon+ achieved
                // Check if Hydrogen (1) exists on board and is not primary spawn
                if (highestElement >= 10 && newBoard.flat().includes(1) && primarySpawn1 !== 1) {
                    newAtomicNum = 1;
                }
                // Check if Helium (2) exists on board and is not primary spawn (e.g., when Li is primary)
                else if (highestElement >= 11 && newBoard.flat().includes(2) && primarySpawn1 !== 2) {
                    newAtomicNum = 2;
                }
                // If neither, or if it picked a spot where a higher element is more useful,
                // fall back to current primary spawn logic.
                else {
                    newAtomicNum = Math.random() < 0.9 ? primarySpawn1 : primarySpawn2;
                }
            } else {
                // Regular spawning for the current tier
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

    // --- Core Game Logic ---

    // Handles sliding and merging for a single line (row or column)
    const slideAndMergeLine = useCallback((line, direction) => {
        let tiles = line.filter(num => num !== 0); // Remove all empty cells first
        let changed = false;
        let currentScoreIncrease = 0;

        // Determine if merging should happen from right-to-left (for right/down moves)
        // or left-to-right (for left/up moves)
        if (direction === 'right' || direction === 'down') {
            for (let i = tiles.length - 1; i > 0; i--) {
                if (tiles[i] !== 0 && tiles[i] === tiles[i - 1]) {
                    tiles[i] += 1; // N+1 merge
                    currentScoreIncrease += tiles[i];
                    tiles.splice(i - 1, 1); // Remove the merged tile
                    changed = true;
                    i--; // Skip the next tile as it was just merged into
                }
            }
            // Pad with zeros at the beginning
            while (tiles.length < GRID_SIZE) {
                tiles.unshift(0);
            }
        } else { // 'left' or 'up'
            for (let i = 0; i < tiles.length - 1; i++) {
                if (tiles[i] !== 0 && tiles[i] === tiles[i + 1]) {
                    tiles[i] += 1; // N+1 merge
                    currentScoreIncrease += tiles[i];
                    tiles.splice(i + 1, 1); // Remove the merged tile
                    changed = true;
                }
            }
            // Pad with zeros at the end
            while (tiles.length < GRID_SIZE) {
                tiles.push(0);
            }
        }

        if (currentScoreIncrease > 0) {
            setScore(prevScore => prevScore + currentScoreIncrease);
        }

        // Check if the actual tile values (excluding zeros) changed, needed for boardChanged
        // Also check if positions changed, by comparing the original line (after filtering zeros)
        // with the new line (after filtering zeros)
        const originalLineWithoutZeros = line.filter(num => num !== 0);
        const newLineWithoutZeros = tiles.filter(num => num !== 0);

        if (changed || JSON.stringify(originalLineWithoutZeros) !== JSON.stringify(newLineWithoutZeros) || originalLineWithoutZeros.length !== newLineWithoutZeros.length) {
            changed = true;
        }


        return { newLine: tiles, changed: changed };
    }, [setScore]);


    // Applies a move (up, down, left, right) to the entire board
    const applyMove = useCallback((direction) => {
        if (isGameOver) return; // Prevent moves if game is over

        let newBoard = board.map(row => [...row]); // Deep copy
        let boardChanged = false;

        if (direction === 'left' || direction === 'right') {
            for (let r = 0; r < GRID_SIZE; r++) {
                const originalRow = [...newBoard[r]]; // Save original for comparison
                const { newLine, changed } = slideAndMergeLine(newBoard[r], direction);
                newBoard[r] = newLine;
                // Check if the row's state actually changed (values or positions)
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
                const originalColumn = [...currentColumn]; // Save original for comparison

                const { newLine, changed } = slideAndMergeLine(currentColumn, direction);

                // Check if the column's state actually changed (values or positions)
                if (changed || JSON.stringify(originalColumn) !== JSON.stringify(newLine)) {
                    boardChanged = true;
                }

                // Apply the processed column back to the new board
                for (let r = 0; r < GRID_SIZE; r++) {
                    newBoard[r][c] = newLine[r];
                }
            }
        }

        if (boardChanged) {
            const finalBoard = addNewElement(newBoard);
            setBoard(finalBoard);
            // After adding a new element, check if the game is now over
            if (checkGameOver(finalBoard)) {
                setIsGameOver(true);
            }
        }
    }, [board, slideAndMergeLine, addNewElement, checkGameOver, isGameOver]);

    // Handles starting a new game
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

    // Keyboard Input Handler
    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    event.preventDefault(); // Prevent page scrolling
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

    // Touch/Swipe Input Handler for mobile
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
        const dy = touchEndY - touchStartY - 20; // Added a slight vertical offset to avoid accidental vertical scroll

        // Determine if it's a horizontal or vertical swipe, and if it's significant enough
        const minSwipeDistance = 30; // Minimum pixel distance for a swipe to register
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipeDistance) { // Horizontal swipe
            if (dx > 0) { // Swiped right
                applyMove('right');
            } else { // Swiped left
                applyMove('left');
            }
        } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > minSwipeDistance) { // Vertical swipe
            if (dy > 0) { // Swiped down
                applyMove('down');
            } else { // Swiped up
                applyMove('up');
            }
        }

        // Reset touch coordinates
        setTouchStartX(null);
        setTouchStartY(null);
    };


    return (
        <div className="game-wrapper"
             onTouchStart={handleTouchStart}
             onTouchEnd={handleTouchEnd}>
            {/* Styles are embedded here for Canvas self-containment */}
            <style>{`
                .game-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #f0f0f0;
                    font-family: 'Inter', sans-serif; /* Using Inter as per instructions */
                    color: #333;
                    width: 100vw; /* Full viewport width */
                    box-sizing: border-box; /* Include padding and border in the element's total width and height */
                }

                .game-container {
                    position: relative; /* For game over overlay positioning */
                    background-color: #bbada0;
                    padding: 20px;
                    border-radius: 12px; /* Rounded corners */
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                    text-align: center;
                    /* Using flex properties to center content */
                    display: flex;
                    flex-direction: column;
                    align-items: center; /* Centers horizontally in a column layout */
                    justify-content: center; /* Centers vertically in a column layout */
                    width: 90%; /* Responsive width */
                    max-width: 450px; /* Max width for larger screens */
                    margin: 20px auto; /* Centering and margin */
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
                    gap: 12px; /* Increased gap */
                    background-color: #cdc1b4;
                    padding: 15px; /* Increased padding */
                    border-radius: 10px; /* Rounded corners */
                    width: clamp(300px, 80vw, 400px); /* Responsive width range */
                    height: clamp(300px, 80vw, 400px); /* Keep it square, matching width */
                    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.2);
                    /* No margin: auto here, parent flexbox handles centering */
                }

                .board-row {
                    display: contents; /* Allows tiles to be direct children of the grid */
                }

                .tile {
                    width: 100%;
                    height: 100%;
                    background-color: #eee4da;
                    border-radius: 8px; /* More rounded corners */
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-weight: bold;
                    font-size: clamp(0.8em, 4vw, 2em); /* Responsive font size */
                    color: #776e65;
                    box-sizing: border-box;
                    padding: 5px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    transition: transform 0.1s ease-out, background-color 0.1s ease; /* Basic transition for feedback */
                }

                .tile:active {
                    transform: scale(0.95); /* Little press effect on tap/click */
                }

                .tile.empty {
                    background-color: rgba(238, 228, 218, 0.35);
                }

                .tile .atomic-number,
                .tile .symbol,
                .tile .name {
                    margin: 0; /* Ensures no default margins push content around */
                    padding: 0; /* Ensures no default padding pushes content around */
                    line-height: 1.2; /* Slightly more generous line-height for readability */
                    min-height: 1.2em; /* Ensure a minimum height for each line of text */
                    transition: opacity 0.1s ease-in-out; /* Smooth transition for opacity */
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
                    background-color: rgba(238, 228, 218, 0.7); /* Semi-transparent overlay */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10;
                    border-radius: 12px; /* Match container */
                }

                .game-over-message {
                    background-color: #fcf6e6; /* Lighter background for message box */
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
                    text-align: center;
                    color: #776e65;
                    max-width: 80%; /* Responsive width */
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
                    margin-top: 20px; /* For the new game button below the board */
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
                    display: block; /* Ensures it takes full width below board if needed */
                    margin: 25px auto 0 auto; /* Center it below the board */
                    width: fit-content;
                }

                /* Responsive adjustments for smaller screens */
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
                <p>Use <strong>Arrow Keys</strong> or <strong>Swipe</strong> to play!</p>
                <button className="new-game-button" onClick={handleNewGame}>New Game</button>
                {isGameOver && (
                    <div className="game-over-overlay">
                        <div className="game-over-message">
                            <h2>Game Over!</h2>
                            <p>Your final score: {score}</p>
                            <button onClick={handleNewGame}>New Game</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
