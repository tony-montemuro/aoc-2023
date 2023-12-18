import readPuzzle from "../../read.mjs";
import { PriorityQueue } from "@datastructures-js/priority-queue";

const minimizeHeatLoss = (grid, { min, max }) => {
    // first, create our priority queue and seen set
    const width = grid[0].length, height = grid.length;
    const queue = new PriorityQueue((a, b) => {
        if (a.heat < b.heat) return -1;
        if (b.heat < a.heat) return 1;
    });
    queue.enqueue({ heat: 0, x: 0, y: 0, dx: 0, dy: 0, n: 0 });
    const seen = new Set();

    // next, search over grid until we find the end
    while (true) {
        const { heat, x, y, dx, dy, n } = queue.dequeue();

        if (seen.has(JSON.stringify({x, y, dx, dy, n}))) {
            continue;
        }

        if (x === width-1 && y === height-1) {
            return heat;
        }
        
        seen.add(JSON.stringify({x, y, dx, dy, n}));
        [[1, 0], [0, 1], [-1, 0], [0, -1]].forEach(d => {
            const ndx = d[0], ndy = d[1];
            const nx = ndx+x, ny = ndy+y;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height && (ndx !== -dx || ndy !== -dy)) {
                const nHeat = heat+grid[ny][nx];
                if (ndx === dx && ndy === dy && n < max) {
                    queue.enqueue({ heat: nHeat, x: nx, y: ny, dx: ndx, dy: ndy, n: n+1 });
                } 
                else if ((n >= min || (dx === 0 && dy === 0)) && (ndx !== dx || ndy !== dy)) {
                    queue.enqueue({ heat: nHeat, x: nx, y: ny, dx: ndx, dy: ndy, n: 1 });
                }
            }
        });
    }
};

const main = async () => {
    const data = await readPuzzle();
    const grid = data.split("\n").map(row => row.split("").map(c => parseInt(c)));
    const p1 = { min: 1, max: 3 }, p2 = { min: 4, max: 10 };
    console.log(minimizeHeatLoss(grid, p1), minimizeHeatLoss(grid, p2));
};

main();