import readPuzzle from "../../read.mjs";

const getNextMoves = (x, y, maze, visited) => {
    const moves = [];
    if (maze[y][x-1] !== "#" && !visited.includes(JSON.stringify([x-1, y]))) moves.push([-1, 0]);
    if (maze[y-1][x] !== "#" && !visited.includes(JSON.stringify([x, y-1]))) moves.push([0, -1]);
    if (maze[y][x+1] !== "#" && !visited.includes(JSON.stringify([x+1, y]))) moves.push([1, 0]);
    if (maze[y+1][x] !== "#" && !visited.includes(JSON.stringify([x, y+1]))) moves.push([0, 1]);
    return moves;
};

const part1 = (x, y, maze, visited) => {
    const coordinate = JSON.stringify([x, y]);
    visited.push(coordinate);

    // base case: we reached the end of the maze
    if (y === maze.length-2) return visited;

    // general case: we need to traverse the maze
    const paths = [], tile = maze[y][x];
    switch (tile) {
        case "^":
            const above = JSON.stringify([x, y-1]);
            if (!visited.includes(above)) {
                paths.push(part1(x, y-1, maze, visited));
            } else {
                return visited;
            }
            break;
        case "v":
            const below = JSON.stringify([x, y+1]);
            if (!visited.includes(below)) {
                paths.push(part1(x, y+1, maze, visited));
            } else {
                return visited;
            }
            break;
        case "<":
            const left = JSON.stringify([x-1, y]);
            if (!visited.includes(left)) {
                paths.push(part1(x-1, y, maze, visited));
            } else {
                return visited;
            }
            break;
        case ">":
            const right = JSON.stringify([x+1, y]);
            if (!visited.includes(right)) {
                paths.push(part1(x+1, y, maze, visited));
            } else {
                return visited;
            }
            break;
        default:
            const next = getNextMoves(x, y, maze, visited);
            next.forEach(m => {
                paths.push(part1(x+m[0], y+m[1], maze, next.length > 1 ? [...visited] : visited));
            });
    }

    // return path with longest length that reaches the goal
    let max = [];
    paths.forEach(path => {
        if (path.length > max && path.some(element => JSON.parse(element)[1] === maze.length-2)) max = path;
    });
    return max;
};

const main = async () => {
    const data = await readPuzzle();
    const maze = data.split("\n").map(row => row.split(""));
    const padding = maze[0].map(i => "#");
    maze.unshift(padding);
    maze.push(padding);
    let x0, y0 = 1;
    maze[y0].forEach((tile, x) => {
        if (tile === ".") x0 = x;
    });
    
    let visited = [];
    const result = part1(x0, y0, maze, visited);
    console.log(result, result.length);
};

main();