// NOTE: part 1 requires a callstack size of at least 3723 KB

import readPuzzle from "../../read.mjs";

const digInterior = (x, y, trench) => {
    // base case: we have already visited location, in this case, simply return
    const str = JSON.stringify([x, y]);
    if (trench[str]) {
        return;
    }
    
    // general case: we are at an unvisited spot, and need to continue traversing
    trench[str] = true;
    digInterior(x+1, y, trench);
    digInterior(x-1, y, trench);
    digInterior(x, y+1, trench);
    digInterior(x, y-1, trench);
};

// my solution
const part1 = plan => {
    // first, get exterior
    const trench = {};    
    let x = 0, y = 0;
    plan.forEach(dig => {
        const { direction, number } = dig;
        for (let i = 0; i < number; i++) {
            if (direction === "R") x++;
            if (direction === "L") x--;
            if (direction === "D") y++;
            if (direction === "U") y--;
            trench[JSON.stringify([x, y])] = true;
        }
    });

    // next, get interior
    digInterior(1, 1, trench);
    
    // finally, return number of positions dug at
    return Object.keys(trench).length;
};

// got help on this part
const part2 = plan => {
    // first, get coordinates, and outside
    const coordinates = [];
    let outside = 0;
    let x = 0, y = 0;
    plan.forEach(dig => {
        const { color } = dig;
        const map = { "0": "R", "1": "D", "2": "L", "3": "U" };
        const number = parseInt(color.slice(0, -1), 16), direction = map[color.slice(-1)];
        if (direction === "R") x+=number;
        if (direction === "L") x-=number;
        if (direction === "D") y+=number;
        if (direction === "U") y-=number;
        outside += number;
        coordinates.push([x, y]);
    });

    // next, use combination of pick's theorem and shoelace theorem to get answer
    let total = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
        total += coordinates[i][0] * coordinates[i + 1][1] - coordinates[i + 1][0] * coordinates[i][1];
    }
    total += outside;
    return Math.floor(total/2) +1;
};

const main = async () => {
    const data = await readPuzzle();
    const plan = data.split("\n").map(row => {
        const components = row.split(" ");
        return {
            direction: components[0],
            number: parseInt(components[1]),
            color: components[2].slice(2, -1)
        }
    });
    console.log(part1(plan), part2(plan));
};

main();