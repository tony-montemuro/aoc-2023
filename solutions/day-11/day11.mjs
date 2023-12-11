import readPuzzle from "../../read.mjs";

// simple function that checks if x is in range of a,b, where we do not know which is greater: a or b
const inRange = (a, b, x) => {
    const smaller = a < b ? a : b;
    const larger = a === smaller ? b : a;
    return x > smaller && x < larger;
};

const sumDistances = (universe, empty, expansion) => {
    // first, find location of each galaxy
    expansion = expansion-1;
    const coordinates = [];
    universe.forEach((row, y) => {
        row.split("").forEach((space, x) => {
            if (space === "#") coordinates.push([x, y]);
        });
    });

    // now, find paths between each galaxy, taking into effect the expansion of the universe
    let total = 0;
    while (coordinates.length > 0) {
        const current = coordinates[0];
        const x1 = current[0], y1 = current[1];
        for (let i = 1; i < coordinates.length; i++) {
            const target = coordinates[i];
            const x2 = target[0], y2 = target[1];
            let expandedRows = 0, expandedCols = 0;
            for (let j = 0; j < empty.rows.length; j++) {
                if (inRange(y1, y2, empty.rows[j])) expandedRows++;
            }
            for (let j = 0; j < empty.cols.length; j++) {
                if (inRange(x1, x2, empty.cols[j])) expandedCols++;
            }
            const manhattan = Math.abs(x2-x1) + Math.abs(y2-y1) + (expandedCols*expansion) + (expandedRows*expansion);
            total += manhattan;
        }
        coordinates.shift();
    }

    return total;
};

const main = async () => {
    // read in input
    const data = await readPuzzle();
    const universe = data.split("\n");
    const p1 = 2, p2 = 1000000;

    // find rows and columns where galaxy expanded
    const empty = { rows: [], cols: [] };
    universe.forEach((row, y) => {
        let hasGalaxy = false;
        row.split("").forEach(space => {
            if (space === "#") hasGalaxy = true;
        });
        if (!hasGalaxy) empty.rows.push(y);
    });
    for (let x = 0; x < universe[0].length; x++) {
        let hasGalaxy = false;
        for (let y = 0; y < universe.length; y++) {
            if (universe[y][x] === "#") hasGalaxy = true;
        }
        if (!hasGalaxy) empty.cols.push(x);
    }
    
    // solve parts
    console.log(sumDistances(universe, empty, p1), sumDistances(universe, empty, p2));
};

main();