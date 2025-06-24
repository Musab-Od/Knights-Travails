function knightsTravails(start, end) {
  // All 8 possible moves a knight can make on a chessboard
  const knightMoves = [
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
  ];

  // Helper function to check if a position is within the chessboard boundaries
  const isOnBoard = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8;

  // Helper function to convert a position to a unique string for easy comparison and tracking
  const posToString = ([x, y]) => `${x},${y}`;

  // Quick check: if start and end are the same, return the start position as the path
  if (posToString(start) === posToString(end)) return [start];

  // Queue will store pairs: [current position, path taken so far]
  const queue = [[start, [start]]];

  // Set to track visited positions to prevent cycles
  const visited = new Set([posToString(start)]);

  // Breadth-First Search loop
  while (queue.length > 0) {
    const [current, path] = queue.shift(); // Dequeue the first element
    const [x, y] = current;

    // Try all possible knight moves from the current position
    for (const [dx, dy] of knightMoves) {
      const newX = x + dx;
      const newY = y + dy;
      const newPos = [newX, newY];

      // If the new position is on the board and hasn't been visited yet
      if (isOnBoard(newX, newY) && !visited.has(posToString(newPos))) {
        // If we've reached the target position, return the full path
        if (newX === end[0] && newY === end[1]) {
          return [...path, newPos];
        }

        // Mark the new position as visited and enqueue it along with the updated path
        visited.add(posToString(newPos));
        queue.push([newPos, [...path, newPos]]);
      }
    }
  }
}

export { knightsTravails };
