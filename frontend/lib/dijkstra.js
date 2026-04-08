// lib/dijkstra.js
// Dijkstra's shortest path algorithm

/**
 * Find the shortest path between two nodes in a weighted graph.
 * @param {Object} graph - Adjacency list: { nodeId: { neighborId: weight, ... }, ... }
 * @param {string} start - Starting node ID
 * @param {string} end - Destination node ID
 * @returns {{ path: string[], distance: number }}
 */
export function dijkstra(graph, start, end) {
  if (start === end) return { path: [start], distance: 0 };

  const distances = {};
  const prev = {};
  const unvisited = new Set(Object.keys(graph));

  // Initialize distances
  for (const node of unvisited) {
    distances[node] = Infinity;
    prev[node] = null;
  }
  distances[start] = 0;

  while (unvisited.size > 0) {
    // Pick unvisited node with smallest known distance
    let current = null;
    for (const node of unvisited) {
      if (current === null || distances[node] < distances[current]) {
        current = node;
      }
    }

    // No reachable nodes left, or we reached the destination
    if (distances[current] === Infinity || current === end) break;

    unvisited.delete(current);

    // Update distances to neighbors
    const neighbors = graph[current] || {};
    for (const [neighbor, weight] of Object.entries(neighbors)) {
      if (!unvisited.has(neighbor)) continue;
      const newDist = distances[current] + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        prev[neighbor] = current;
      }
    }
  }

  // Reconstruct path by backtracking from end
  const path = [];
  let current = end;
  while (current !== null) {
    path.unshift(current);
    current = prev[current];
  }

  // If path doesn't start at 'start', no route exists
  if (path[0] !== start) {
    return { path: [], distance: Infinity };
  }

  return { path, distance: distances[end] };
}

/**
 * Convert distance in meters to a readable string.
 * @param {number} meters
 * @returns {string}
 */
export function formatDistance(meters) {
  if (meters === Infinity) return "No route";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

/**
 * Estimate walking time (average 1.4 m/s walking speed).
 * @param {number} meters
 * @returns {string}
 */
export function formatWalkTime(meters) {
  if (meters === Infinity) return "—";
  const seconds = meters / 1.4;
  if (seconds < 60) return `~${Math.round(seconds)}s`;
  return `~${Math.ceil(seconds / 60)} min`;
}
