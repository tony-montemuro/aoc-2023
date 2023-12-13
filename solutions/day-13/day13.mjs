import readPuzzle from "../../read.mjs";

const sumNotes = (patterns, numSmudges) => {
    let total = 0;

    patterns.forEach(pattern => {
        // first, try to find a horizontal reflection point
        let found = false, y = 0;
        while (y < pattern.length-1 && !found) {
            let j = y, k = y+1, off = 0;
            while (j >= 0 && k < pattern.length) {
                for (let x = 0; x < pattern[0].length; x++) {
                    if (pattern[j][x] !== pattern[k][x]) off++;
                }
                j--, k++;
            }
            if (off === numSmudges) {
                found = true;
                total += 100*(y+1);
            }
            y++;
        }

        // next, find vertical reflection point, if horizontal reflection point is missing
        if (!found) {
            let x = 0;
            while (x < pattern[0].length-1 && !found) {
                let j = x, k = x+1, off = 0;
                while (j >= 0 && k < pattern[0].length) {
                    for (let y = 0; y < pattern.length; y++) {
                        if (pattern[y][j] !== pattern[y][k]) off++;
                    }
                    j--, k++;
                }
                if (off === numSmudges) {
                    total += x+1;
                    found = true;
                }
                x++;
            }
        }
    });

    return total;
};

const main = async () => {
    const data = await readPuzzle();
    const patterns = data.split("\n\n").map(pattern => pattern.split("\n"));
    const p1 = 0, p2 = 1;
    console.log(sumNotes(patterns, p1), sumNotes(patterns, p2));  
};

main();