import readPuzzle from "../../read.mjs";

let visitedStates = [];

const getNextPosition = (position, direction) => {
    switch (direction) {
        case "right": return { ...position, x: position.x+1 };
        case "left": return { ...position, x: position.x-1 };
        case "down": return { ...position, y: position.y+1 };
        case "up": return { ...position, y: position.y-1 };
    }
};

const outOfRange = (beam, grid) => {
    const gridWidth = grid[0].length-1, gridHeight = grid.length-1;
    const direction = beam.direction;
    const x = beam.position.x, y = beam.position.y;
    if (direction === "right" && x == gridWidth) return true;
    if (direction === "left" && x === 0) return true;
    if (direction === "down" && y === gridHeight) return true;
    if (direction === "up" && y === 0) return true;
    return false;
};

const energize = (grid, beam, energized) => {
    energized.add(JSON.stringify(beam.position));

    // base case: beam has reached end
    if (outOfRange(beam, grid) || visitedStates.includes(JSON.stringify({position: beam.position, direction: beam.direction}))) {
        return;
    }

    // general case: beam must move to next position
    visitedStates.push(JSON.stringify({position: beam.position, direction: beam.direction}));
    const direction = beam.direction;
    const nextPosition = getNextPosition(beam.position, beam.direction);
    const nextTile = grid[nextPosition.y][nextPosition.x];
    if (nextTile === "/") {
        if (direction === "right") beam.direction = "up";
        if (direction === "left") beam.direction = "down";
        if (direction === "up") beam.direction = "right";
        if (direction === "down") beam.direction = "left";
        energize(grid, { ...beam, position: nextPosition}, energized);
    } 
    else if (nextTile === "\\") {
        if (direction === "right") beam.direction = "down";
        if (direction === "left") beam.direction = "up";
        if (direction === "up") beam.direction = "left";
        if (direction === "down") beam.direction = "right";
        energize(grid, { ...beam, position: nextPosition}, energized);
    } 
    else if (nextTile === "-" && ["up", "down"].includes(direction)) {
        energize(grid, {position: nextPosition, direction: "left"}, energized);
        energize(grid, {position: nextPosition, direction: "right"}, energized);
    }
    else if (nextTile === "|" && ["left", "right"].includes(direction)) {
        energize(grid, {position: nextPosition, direction: "up"}, energized);
        energize(grid, {position: nextPosition, direction: "down"}, energized);
    }
    else {
        energize(grid, { ...beam, position: nextPosition}, energized);
    }
};

const part2 = grid => {
    // function that runs after each `energize` call
    const reset = (energized, begin, maxEnergy, length, index, direction) => {
        const numEnergized = energized.size-1;
        visitedStates = [];
        energized.clear();
        begin.direction = direction;
        if (direction === "right") begin.position = {x: -1, y: index};
        if (direction === "left") begin.position = {x: length, y: index};
        if (direction === "up") begin.position = {x: index, y: length};
        if (direction === "down") begin.position = {x: index, y: -1};
        return numEnergized > maxEnergy ? numEnergized : maxEnergy;
    };

    // first, try both the left and right edge
    const gridWidth = grid[0].length;
    let maxEnergy = 0;
    visitedStates = [];
    const energized = new Set();
    const begin = {
        direction: "right",
        position: {x: -1, y: 0}
    };
    for (let y = 0; y < grid.length; y++) {
        energize(grid, begin, energized);
        maxEnergy = reset(energized, begin, maxEnergy, grid[0].length, y, "left");
        energize(grid, begin, energized);
        maxEnergy = reset(energized, begin, maxEnergy, grid[0].length, y, "right");
    }

    // next, try both the top and bottom edge
    begin.direction = "down";
    begin.position = {x: 0, y: -1};
    for (let x = 0; x < gridWidth; x++) {
        energize(grid, begin, energized);
        maxEnergy = reset(energized, begin, maxEnergy, grid.length, x, "up");
        energize(grid, begin, energized);
        maxEnergy = reset(energized, begin, maxEnergy, grid.length, x, "down");
    }

    return maxEnergy;
};

const main = async () => {
    const data = await readPuzzle();
    const grid = data.split("\n").map(row => row.split(""));
    const begin = {
        direction: "right",
        position: {x: -1, y: 0}
    };

    // solution to part 1
    const energized = new Set();
    console.time("part1 took");
    energize(grid, begin, energized);
    console.log(energized.size-1);
    console.timeEnd("part1 took");

    // part 2
    console.time("part2 took");
    console.log(part2(grid));
    console.timeEnd("part2 took");
};

main();