import readPuzzle from "../../read.mjs";

const tiltNorth = rocks => {
    const rowLength = rocks[0].length;
    for (let y = 0; y < rocks.length; y++) {
        for (let x = 0; x < rowLength; x++) {
            let y0 = y;
            while (y0 > 0 && rocks[y0][x] === "O") {
                if (rocks[y0-1][x] === ".") {
                    rocks[y0][x] = ".";
                    rocks[y0-1][x] = "O";
                }
                y0--;
            }
        }
    };
};

const tiltWest = rocks => {
    const rowLength = rocks[0].length;
    for (let x = 0; x < rowLength; x++) {
        for (let y = 0; y < rocks.length; y++) {
            let x0 = x;
            while (x0 > 0 && rocks[y][x0] === "O") {
                if (rocks[y][x0-1] === ".") {
                    rocks[y][x0] = ".";
                    rocks[y][x0-1] = "O";
                }
                x0--;
            }
        }
    };
};

const tiltSouth = rocks => {
    const rowLength = rocks[0].length;
    for (let y = rocks.length-1; y >= 0; y--) {
        for (let x = 0; x < rowLength; x++) {
            let y0 = y;
            while (y0 < rocks.length-1 && rocks[y0][x] === "O") {
                if (rocks[y0+1][x] === ".") {
                    rocks[y0][x] = ".";
                    rocks[y0+1][x] = "O";
                }
                y0++;
            }
        }
    };
};

const tiltEast = rocks => {
    const rowLength = rocks[0].length;
    for (let x = rowLength-1; x >= 0; x--) {
        for (let y = 0; y < rocks.length; y++) {
            let x0 = x;
            while (x0 < rowLength-1 && rocks[y][x0] === "O") {
                if (rocks[y][x0+1] === ".") {
                    rocks[y][x0] = ".";
                    rocks[y][x0+1] = "O";
                }
                x0++;
            }
        }
    };
};

const computeLoad = (config, width, height) => {
    let total = 0;
    for (let i = 0; i < height; i++) {
        for (let j = i*width; j < (i+1)*width; j++) {
            if (config[j] === "O") total += (height-i);
        }
    }
    return total;
};

const part1 = rocks => {
    tiltNorth(rocks);
    return computeLoad(rocks.join().replaceAll(",", ""), rocks.length, rocks[0].length);
};

const part2 = (rocks, numCycles) => {
    const results = [];
    let first = undefined, current = "", found = false, index = 0;
    
    // perform a "spin cylce" until a pattern is discovered
    while (!found) {
        tiltNorth(rocks);
        tiltWest(rocks);
        tiltSouth(rocks);
        tiltEast(rocks);
        current = rocks.join().replaceAll(",", "");
        first = results.indexOf(current);
        if (first !== -1) {
            found = true;
        } else {
            results.push(current);
            index++;
        }
    }
    
    // determine config based on `numCycles` variable, and return load
    const difference = index-first;
    for (let i = 0; i < first; i++) {
        results.shift();
    }
    const config = results[((numCycles-first) % difference)-1];
    return computeLoad(config, rocks.length, rocks[0].length);
};

const main = async () => {
    const data = await readPuzzle();
    const rocks = data.split("\n").map(row => row.split(""));
    console.log(part1(rocks), part2(rocks, 1000000000));
};

main();