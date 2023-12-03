import readPuzzle from "../../read.mjs";

const isDigit = c => {
    return c >= "0" && c <= "9";
}

const isSpecial = c => {
    return !isDigit(c) && c !== ".";
};

const padSchematic = schematic => {
    for (let y = 0; y < schematic.length; y++) {
        schematic[y] = "." + schematic[y] + ".";
    }
    let dots = "";
    for (let i = 0; i < schematic[0].length; i++) {
        dots += ".";
    }
    schematic.unshift(dots);
    schematic.push(dots);
    return schematic;
};

const part1 = schematic => {
    let total = 0;
    schematic = padSchematic(schematic);

    for (let y = 1; y < schematic.length-1; y++) {
        for (let x = 1; x < schematic[y].length-1; x++) {
            const char = schematic[y][x];
            if (isDigit(char)) {
                let digit = "", isPart = false;
                while (isDigit(schematic[y][x])) {
                    digit += schematic[y][x];
                    for (let y1 = y-1; y1 <= y+1; y1++) {
                        for (let x1 = x-1; x1 <= x+1; x1++) {
                            if (!isPart) {
                                isPart = isSpecial(schematic[y1][x1]);
                            }
                        }
                    }
                    x += 1;
                }
                if (isPart) total += parseInt(digit);
            }
        }
    }

    return total;
};

const part2 = schematic => {
    const gear = "*";
    let total = 0;
    schematic = padSchematic(schematic);

    for (let y = 1; y < schematic.length-1; y++) {
        for (let x = 1; x < schematic[y].length-1; x++) {
            const char = schematic[y][x];
            if (char == gear) {
                const adjacentDigits = new Set();
                for (let y1 = y-1; y1 <= y+1; y1++) {
                    for (let x1 = x-1; x1 <= x+1; x1++) {
                        if (isDigit(schematic[y1][x1])) {
                            let i = x1, digit = "";
                            while (isDigit(schematic[y1][i])) {
                                digit = schematic[y1][i] + digit;
                                i--;
                            }
                            i = x1+1;
                            while (isDigit(schematic[y1][i])) {
                                digit += schematic[y1][i];
                                i++;
                            }
                            adjacentDigits.add(digit);
                        }
                    }
                }
                if (adjacentDigits.size == 2) {
                    const itr = adjacentDigits.values();
                    total += (itr.next().value * itr.next().value);
                }
            }
        }
    }

    return total;
};

const main = async () => {
    const data = await readPuzzle();
    const schematic = data.split("\n");
    console.log(part1(schematic), part2(schematic));
};

main();