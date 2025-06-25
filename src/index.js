import './style.css'; // Import styles
import { knightsTravails } from './knightstravails.js'; // Import knight's pathfinding logic

// Game state object to track current selections and mode
let gameState = {
  knightPosition: null, // [row, col] of the knight's position
  endPosition: null, // [row, col] of the end target
  isPlacingKnight: false, // Whether player is currently placing the knight
  isSelectingEnd: false, // Whether player is selecting the end target
};

// DOM element references
const placeKnightBtn = document.getElementById('placeKnight');
const selectEndBtn = document.getElementById('selectEnd');
const travailBtn = document.getElementById('travail');
const resetBtn = document.getElementById('reset');
const cells = document.querySelectorAll('.cell');

// Initialize the game and event listeners
function init() {
  updateButtonStates();

  // Button: Place knight mode
  placeKnightBtn.addEventListener('click', () => {
    resetSelectionStyles();
    gameState.isPlacingKnight = true;
    gameState.isSelectingEnd = false;
    updateButtonStates();
  });

  // Button: Select end target mode
  selectEndBtn.addEventListener('click', () => {
    // Keep knight, clear previous end
    document
      .querySelectorAll('.end')
      .forEach((el) => el.classList.remove('end'));
    gameState.isSelectingEnd = true;
    gameState.isPlacingKnight = false;
    gameState.endPosition = null;
    updateButtonStates();
  });

  // Button: Trigger knight's path calculation and animation
  travailBtn.addEventListener('click', () => {
    if (gameState.knightPosition && gameState.endPosition) {
      const path = knightsTravails(
        gameState.knightPosition,
        gameState.endPosition
      );
      animateKnightPath(path);
    }
  });

  // Button: Reset entire game state
  resetBtn.addEventListener('click', resetGame);

  // Listen for clicks on all board cells
  cells.forEach((cell) => {
    cell.addEventListener('click', handleCellClick);
  });
}

// Handle clicks on board cells for placing knight or end
function handleCellClick(e) {
  const cell = e.currentTarget;
  const row = parseInt(cell.getAttribute('data-row'));
  const col = Array.from(cell.parentNode.children).indexOf(cell);
  const position = [row, col];

  if (gameState.isPlacingKnight) {
    placeKnight(position, cell);
  } else if (gameState.isSelectingEnd) {
    placeEnd(position, cell);
  }
}

// Place knight on selected cell
function placeKnight(position, cell) {
  resetSelectionStyles(); // Clear board

  cell.classList.add('knight'); // Visual marker for knight
  gameState.knightPosition = position;
  gameState.isPlacingKnight = false;
  gameState.endPosition = null; // Require re-selection of end
  updateButtonStates();
}

// Place end target marker
function placeEnd(position, cell) {
  // Prevent placing end on same cell as knight
  if (JSON.stringify(position) === JSON.stringify(gameState.knightPosition)) {
    return;
  }

  document.querySelectorAll('.end').forEach((el) => el.classList.remove('end'));

  cell.classList.add('end'); // Visual marker for end
  gameState.endPosition = position;
  gameState.isSelectingEnd = false;
  updateButtonStates();
}

// Animate knight moving along the calculated path
function animateKnightPath(path) {
  // Disable buttons during animation
  placeKnightBtn.disabled = true;
  selectEndBtn.disabled = true;
  travailBtn.disabled = true;

  // Clear previous path highlights and moving knight
  document
    .querySelectorAll('.path')
    .forEach((el) => el.classList.remove('path'));
  document
    .querySelectorAll('.active-knight')
    .forEach((el) => el.classList.remove('active-knight'));

  // Highlight path cells (excluding start and end)
  path.slice(1, -1).forEach(([row, col]) => {
    const cell = document.querySelector(
      `.row:nth-child(${row + 1}) .cell:nth-child(${col + 1})`
    );
    cell.classList.add('path');
  });

  let step = 0;

  // Step-by-step animation function
  const animateStep = () => {
    document
      .querySelectorAll('.active-knight')
      .forEach((el) => el.classList.remove('active-knight'));

    if (step >= path.length) {
      // Final step: move knight to end position
      const [row, col] = path[path.length - 1];
      const finalCell = document.querySelector(
        `.row:nth-child(${row + 1}) .cell:nth-child(${col + 1})`
      );

      // Clear path and end markers
      document
        .querySelectorAll('.path')
        .forEach((el) => el.classList.remove('path'));
      document
        .querySelectorAll('.end')
        .forEach((el) => el.classList.remove('end'));

      // Place knight at final position
      document
        .querySelectorAll('.knight')
        .forEach((el) => el.classList.remove('knight'));
      finalCell.classList.add('knight');

      // Update game state and re-enable buttons
      gameState.knightPosition = path[path.length - 1];
      gameState.endPosition = null;
      updateButtonStates();
      return;
    }

    const [row, col] = path[step];
    const cell = document.querySelector(
      `.row:nth-child(${row + 1}) .cell:nth-child(${col + 1})`
    );
    cell.classList.add('active-knight');

    step++;
    setTimeout(animateStep, 400); // Adjust speed (ms) as desired
  };

  animateStep();
}

// Clear all knight, end, path, and animation styles from board
function resetSelectionStyles() {
  document
    .querySelectorAll('.knight')
    .forEach((el) => el.classList.remove('knight'));
  document.querySelectorAll('.end').forEach((el) => el.classList.remove('end'));
  document
    .querySelectorAll('.path')
    .forEach((el) => el.classList.remove('path'));
  document
    .querySelectorAll('.active-knight')
    .forEach((el) => el.classList.remove('active-knight'));
}

// Update button enabled states and visual active mode
function updateButtonStates() {
  placeKnightBtn.disabled = gameState.isPlacingKnight;
  selectEndBtn.disabled = gameState.isSelectingEnd || !gameState.knightPosition;
  travailBtn.disabled = !gameState.knightPosition || !gameState.endPosition;

  placeKnightBtn.classList.toggle('active-mode', gameState.isPlacingKnight);
  selectEndBtn.classList.toggle('active-mode', gameState.isSelectingEnd);
}

// Reset board, game state, and UI
function resetGame() {
  resetSelectionStyles();
  gameState = {
    knightPosition: null,
    endPosition: null,
    isPlacingKnight: false,
    isSelectingEnd: false,
  };
  updateButtonStates();
}

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', init);
