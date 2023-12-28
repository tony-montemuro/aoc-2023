import readPuzzle from "../../read.mjs";

const part1 = (x, y, seen, grid, end) => {
    while (true) {
        const coordinate = JSON.stringify([x, y]);
        seen.push(coordinate);
        const slopes = {
            ">": [1, 0],
            "<": [-1, 0],
            "v": [0, 1],
            "^": [0, -1]
        };
        const tile = grid[y][x];
        if (x === end.x && y === end.y) {
            return seen;
        }
        
        if (Object.keys(slopes).includes(tile)) {
            const x1 = x+slopes[tile][0];
            const y1 = y+slopes[tile][1];
            if (!seen.includes(JSON.stringify([x1, y1]))) {
                x = x1, y = y1;
            } else {
                return seen;
            }
        } 
        
        else {
            let surrounding = [], prev = seen.at(-2);
            if (grid[y][x+1] !== "#" && prev !== JSON.stringify([x+1, y])) surrounding.push([x+1, y]);
            if (grid[y][x-1] !== "#" && prev !== JSON.stringify([x-1, y])) surrounding.push([x-1, y]);
            if (grid[y+1][x] !== "#" && prev !== JSON.stringify([x, y+1])) surrounding.push([x, y+1]);
            if (grid[y-1][x] !== "#" && prev !== JSON.stringify([x, y-1])) surrounding.push([x, y-1]);
            if (surrounding.length === 1) {
                const [x1, y1] = surrounding[0];
                if (!seen.includes(JSON.stringify([x1, y1]))) {
                    x = x1, y = y1;
                } else {
                    return seen;
                }
            } else {
                const paths = surrounding.map(next => {
                    const [x1, y1] = next;
                    return part1(x1, y1, [...seen], grid, end);
                });
                let max = [];
                paths.forEach(path => {
                    if (path.length > max.length && path.some(element => element === JSON.stringify([end.x, end.y]))) max = path;
                });
                return max;
            }
        }
    }
};

const part2 = (x, y, seen, grid, end) => {
    while (true) {
        const coordinate = JSON.stringify([x, y]);
        seen.push(coordinate);
        if (x === end.x && y === end.y) {
            return seen;
        }
        
        let surrounding = [], prev = seen.at(-2);
        if (grid[y][x+1] !== "#" && prev !== JSON.stringify([x+1, y])) surrounding.push([x+1, y]);
        if (grid[y][x-1] !== "#" && prev !== JSON.stringify([x-1, y])) surrounding.push([x-1, y]);
        if (grid[y+1][x] !== "#" && prev !== JSON.stringify([x, y+1])) surrounding.push([x, y+1]);
        if (grid[y-1][x] !== "#" && prev !== JSON.stringify([x, y-1])) surrounding.push([x, y-1]);
        if (surrounding.length === 1) {
            const [x1, y1] = surrounding[0];
            if (!seen.includes(JSON.stringify([x1, y1]))) {
                x = x1, y = y1;
            } else {
                return seen;
            }
        } else {
            const paths = surrounding.map(next => {
                const [x1, y1] = next;
                return part2(x1, y1, [...seen], grid, end);
            });
            let max = [];
            paths.forEach(path => {
                if (path.length > max.length && path.some(element => element === JSON.stringify([end.x, end.y]))) max = path;
            });
            return max;
        }
    }
};

const main = async () => {
    const data = await readPuzzle();
    const grid = data.split("\n").map(s => s.split(""));
    const padding = grid[0].map(i => "#");
    grid.unshift(padding);
    grid.push(padding);
    let y0 = 1, x0;
    grid[y0].forEach((tile, x) => {
        if (tile === ".") x0 = x;
    });
    let y1 = grid.length-2, x1;
    grid[y1].forEach((tile, x) => {
        if (tile === ".") x1 = x;
    });
    const p1 = part1(x0, y0, [], grid, {x: x1, y: y1});
    console.log(p1.length-1);
    const p2 = part2(x0, y0, [], grid, {x: x1, y: y1});
    console.log(p2.length-1);
}

main();