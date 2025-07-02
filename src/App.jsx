import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

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

            // Bepaal element spawn dynamisch vanaf een bepaald punt
            // Nu gebaseerd op een meer algemene formule om progressie te behouden
            // Zorgt ervoor dat primaire spawns niet onder 1 komen
            primarySpawn1 = Math.max(1, highestElement - 8);
            primarySpawn2 = primarySpawn1 + 1;
            
            // Logic to potentially spawn a "stuck" lower-tier element
            const stuckElements = [];
            // Iterate from Hydrogen (1) up to the element just before the current primary spawn tier
            for (let i = 1; i < primarySpawn1; i++) {
                const count = newBoard.flat().filter(num => num === i).length;
                if (count === 1) { // If there's only one instance of this lower element, it might be stuck
                    stuckElements.push(i);
                }
            }

            if (stuckElements.length > 0 && Math.random() < 0.15) { // 15% kans om een vastzittend element te spawnen
                newAtomicNum = stuckElements[Math.floor(Math.random() * stuckElements.length)];
            } else {
                // Anders, spawn vanuit de primaire tier (90% lager, 10% hoger)
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
    const [showHelp, setShowHelp] = useState(false); // Nieuwe state voor helpscherm
    const [showHighscores, setShowHighscores] = useState(false); // State voor highscore overlay
    const [highscores, setHighscores] = useState([]); // State voor de highscore data
    const [playerName, setPlayerName] = useState(''); // State voor spelersnaam input
    const [showScoreSubmission, setShowScoreSubmission] = useState(false); // State voor score indiening modal

    const playerNameInputRef = useRef(null); // Ref voor het invoerveld

    // Effect om focus te zetten op het invoerveld wanneer de modal verschijnt
    useEffect(() => {
        if (showScoreSubmission && playerNameInputRef.current) {
            playerNameInputRef.current.focus();
        }
    }, [showScoreSubmission]);

    // --- Highscore Functies ---

    // Functie om score in te dienen
    const submitScore = useCallback(async (name, finalScore) => {
        console.log('Poging tot indienen score met naam:', name, 'en score:', finalScore); // Toegevoegd voor debugging
        try {
            // Belangrijk: Voor Vercel deployment, zullen deze relatieve paden werken.
            // In sommige lokale ontwikkelomgevingen of Canvas previews kan dit een 'Failed to parse URL' fout geven.
            // Zorg ervoor dat uw Vercel project de serverless functies correct deployt.
            const response = await fetch('/api/submit-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playerName: name, score: finalScore }),
            });
            const data = await response.json();
            console.log('Response van submit-score API:', data);
            if (!response.ok) {
                throw new Error(data.message || `Fout bij indienen score: ${response.status} ${response.statusText}`);
            }
            console.log('Score succesvol ingediend:', data);
            fetchHighscores(); // Refresh highscores na indiening
        } catch (error) {
            console.error('Fout bij indienen score:', error);
            // Optioneel: toon een foutmelding aan de gebruiker
        } finally {
            setShowScoreSubmission(false); // Sluit de indiening modal
        }
    }, []);

    // Functie om highscores op te halen
    const fetchHighscores = useCallback(async () => {
        console.log('Poging tot ophalen highscores...');
        try {
            // Belangrijk: Voor Vercel deployment, zullen deze relatieve paden werken.
            // In sommige lokale ontwikkelomgevingen of Canvas previews kan dit een 'Failed to parse URL' fout geven.
            const response = await fetch('/api/get-highscores');
            const data = await response.json();
            console.log('Response van get-highscores API:', data);
            if (!response.ok) {
                throw new Error(data.message || `Fout bij ophalen highscores: ${response.status} ${response.statusText}`);
            }
            setHighscores(data.highscores);
            console.log('Highscores succesvol opgehaald:', data.highscores);
        } catch (error) {
            console.error('Fout bij ophalen highscores:', error);
            setHighscores([]); // Reset highscores bij fout
        }
    }, []);

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
        if (isGameOver || showHelp || showHighscores || showScoreSubmission) return; // Voorkom bewegingen als spel voorbij is, help open is, highscores open is of score indiening open is

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
                setShowScoreSubmission(true); // Toon score indiening modal
            }
        }
    }, [board, slideAndMergeLine, addNewElement, checkGameOver, isGameOver, showHelp, showHighscores, showScoreSubmission]);

    // Nieuw spel starten
    const handleNewGame = useCallback(() => {
        let initialBoard = initializeBoard();
        for (let i = 0; i < INITIAL_TILES; i++) {
            initialBoard = addNewElement(initialBoard);
        }
        setBoard(initialBoard);
        setScore(0);
        setIsGameOver(false);
        setShowHelp(false);
        setShowHighscores(false); // Sluit highscores bij nieuw spel
        setShowScoreSubmission(false); // Sluit score indiening bij nieuw spel
        setPlayerName(''); // Reset spelersnaam
    }, [initializeBoard, addNewElement]);

    // Functie om helpscherm te tonen/verbergen
    const toggleHelp = useCallback(() => {
        setShowHelp(prev => !prev);
        setShowHighscores(false); // Sluit highscores als help wordt geopend
        setShowScoreSubmission(false); // Sluit score indiening als help wordt geopend
    }, []);

    // Functie om highscores te tonen/verbergen
    const toggleHighscores = useCallback(() => {
        setShowHighscores(prev => !prev);
        setShowHelp(false); // Sluit help als highscores worden geopend
        setShowScoreSubmission(false); // Sluit score indiening als highscores worden geopend
        if (!showHighscores) { // Als we highscores gaan tonen, haal ze dan op
            fetchHighscores();
        }
    }, [showHighscores, fetchHighscores]);

    // --- Input Handlers ---

    // Toetsenbord Input Handler
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Laat arrow keys werken, tenzij een overlay open is
            if (showHelp || showHighscores || showScoreSubmission) {
                if (event.key === 'Escape') { // Sta ESC toe om overlays te sluiten
                    setShowHelp(false);
                    setShowHighscores(false);
                    setShowScoreSubmission(false);
                }
                return; // Geen andere toetsen verwerken als een overlay open is
            }

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
                case 'h': // 'h' voor help
                case 'H':
                    toggleHelp();
                    break;
                case 'n': // 'n' voor nieuw spel
                case 'N':
                    handleNewGame();
                    break;
                case 'l': // 'l' voor highscores (leaderboard)
                case 'L':
                    toggleHighscores();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [applyMove, showHelp, toggleHelp, handleNewGame, showHighscores, toggleHighscores, showScoreSubmission]);

    // Touch/Swipe Input Handler voor mobiel
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchStartY, setTouchStartY] = useState(null);
    // Voeg een state toe om te volgen of een veeg is begonnen en we preventDefault moeten doen
    const [isSwiping, setIsSwiping] = useState(false);
    const minSwipeDistance = 30; // Minimale pixelafstand voor een veeg om te registreren
    const swipeThreshold = 10; // Extra kleine drempel om preventDefault eerder te activeren

    const handleTouchStart = (event) => {
        if (showHelp || showHighscores || showScoreSubmission) return; // Geen vegen als een overlay open is
        setTouchStartX(event.touches[0].clientX);
        setTouchStartY(event.touches[0].clientY);
        setIsSwiping(false); // Reset bij start van nieuwe aanraking
    };

    const handleTouchMove = (event) => {
        if (showHelp || showHighscores || showScoreSubmission || touchStartX === null || touchStartY === null) return;

        const touchCurrentX = event.touches[0].clientX;
        const touchCurrentY = event.touches[0].clientY;

        const dx = touchCurrentX - touchStartX;
        const dy = touchCurrentY - touchStartY;

        // Als de beweging significant genoeg is om als veeg te worden beschouwd
        // en de veeg nog niet als 'swiping' is gemarkeerd, voorkom dan standaardgedrag
        if ((Math.abs(dx) > swipeThreshold || Math.abs(dy) > swipeThreshold) && !isSwiping) {
            setIsSwiping(true);
        }
        
        // Voorkom standaard scrollgedrag zodra een veegbeweging duidelijk wordt
        if (isSwiping) {
            event.preventDefault();
        }
    };


    const handleTouchEnd = (event) => {
        if (showHelp || showHighscores || showScoreSubmission || touchStartX === null || touchStartY === null) return;

        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;

        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY; // Geen offset meer hier, omdat preventDefault eerder gebeurt

        // Bepaal of het een horizontale of verticale veeg is, en of deze significant genoeg is
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipeDistance) { // Horizontale veeg
            if (dx > 0) { // Naar rechts geveegd
                applyMove('right');
            } else { // Naar links geveegd
                applyMove('left');
            }
        } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > minSwipeDistance) { // Verticale veeg
            if (dy > 0) { // Naar beneden geveegd
                applyMove('down');
            } else { // Naar boven geveegd
                applyMove('up');
            }
        }

        // Reset touchcoördinaten en swiping state
        setTouchStartX(null);
        setTouchStartY(null);
        setIsSwiping(false);
    };

    return(
        <div className="game-wrapper"
             onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}>
            <div className="game-container">
                <h1>Elemental Merge</h1> 
                <div className="score">Score: {score}</div> 
                <div className="game-board">
                    {board.map((row, rowIndex) => (
                        <div key={rowIndex} className="board-row">
                            {row.map((atomicNumber, colIndex) => (
                                <Tile
                                    key={`${rowIndex}-${colIndex}`}
                                    atomicNumber={atomicNumber}
                                    rowIndex={rowIndex}
                                    colIndex={colIndex}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <p>Gebruik <strong>Pijltjestoetsen</strong> of <strong>Vegen</strong> om te spelen!</p> 
                <div className="button-container">
                    <button className="new-game-button" onClick={handleNewGame}>Nieuw Spel</button> 
                    <button className="help-button" onClick={toggleHelp}>Help</button>
                    <button className="highscore-button" onClick={toggleHighscores}>Highscores</button>
                </div>

                {isGameOver && !showScoreSubmission && (
                    <div className="game-over-overlay">
                        <div className="game-over-message">
                            <h2>Spel Voorbij!</h2> 
                            <p>Je eindscore: {score}</p> 
                            <button onClick={handleNewGame}>Nieuw Spel</button> 
                        </div>
                    </div>
                )}

                {showHelp && (
                    <div className="help-overlay">
                        <div className="help-content">
                            <h2>Hoe te Spelen</h2>
                            <p>
                                Welkom bij Elementen Samenvoegen! Dit is een 2048-achtig spel
                                waarbij je elementen combineert om zwaardere elementen te vormen.
                            </p>
                            <h3>Spelregels:</h3>
                            <ul>
                                <li>Gebruik de <strong>Pijltjestoetsen</strong> (omhoog, omlaag, links, rechts) op je toetsenbord, of <strong>Vegen</strong> op mobiel, om alle tegels in die richting te verplaatsen.</li>
                                <li>Wanneer twee tegels met hetzelfde atoomnummer elkaar raken tijdens een beweging, voegen ze samen tot één tegel van het <strong>volgende atoomnummer (N+1)</strong>. Bijvoorbeeld, twee Waterstof (H, 1) tegels worden één Helium (He, 2) tegel.</li>
                                <li>Na elke zet verschijnt er een nieuwe tegel op een willekeurige lege plek op het bord.</li>
                                <li>De begintegels zijn Waterstof (H) en Helium (He). Naarmate je zwaardere elementen maakt (bijv. Neon, Natrium), zullen de soorten elementen die verschijnen dynamisch veranderen om je te helpen verder te komen. Er is een kleine kans dat een "vastzittend" lager element verschijnt.</li>
                                <li>Je scoort punten door elementen samen te voegen. De score is gebaseerd op het atoomnummer van het nieuw gevormde element.</li>
                                <li>Het spel is voorbij wanneer het bord vol is en er geen mogelijke zetten meer zijn (geen lege plekken en geen aangrenzende tegels die kunnen samensmelten).</li>
                            </ul>
                            <p>Veel plezier met spelen!</p>
                            <button onClick={() => setShowHelp(false)}>Sluiten</button>
                        </div>
                    </div>
                )}

                {showHighscores && (
                    <div className="highscore-overlay">
                        <div className="highscore-content">
                            <h2>Top 10 Highscores</h2>
                            {highscores.length > 0 ? (
                                <ol>
                                    {highscores.map((entry, index) => (
                                        <li key={index}>
                                            {entry.player_name}: <span>{entry.score}</span>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p>Laden highscores of geen scores beschikbaar...</p>
                            )}
                            <button onClick={() => setShowHighscores(false)}>Sluiten</button>
                        </div>
                    </div>
                )}

                {showScoreSubmission && (
                    <div className="score-submission-overlay">
                        <div className="score-submission-content">
                            <h2>Je hebt een nieuwe highscore!</h2>
                            <p>Je score: {score}</p>
                            <input
                                type="text"
                                placeholder="Voer je naam in"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                maxLength="15" // Beperk de lengte van de naam
                            />
                            <button
                                onClick={() => submitScore(playerName, score)}
                                disabled={playerName.trim() === ''}
                            >
                                Score Indienen
                            </button>
                            <button onClick={() => setShowScoreSubmission(false)}>Annuleren</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
