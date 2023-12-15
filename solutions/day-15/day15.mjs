import readPuzzle from "../../read.mjs";

const hashStr = str => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash += str.charCodeAt(i);
        hash *= 17;
        hash %= 256;
    }
    return hash;
};

const part1 = strs => {
    let hashes = [];
    strs.forEach(str => {
        hashes.push(hashStr(str));
    });
    return hashes.reduce((a, b) => a+b, 0);
};

const part2 = strs => {
    // create set of boxes
    const boxes = new Array(256);
    for (let i = 0; i < boxes.length; i++) {
        boxes[i] = [];
    }

    strs.forEach(str => {
        // first, figure out label and length
        let label, length;
        const subtract = str.includes("-");
        if (subtract) {
            label = str.slice(0, -1);
        } else {
            const components = str.split("=");
            label = components[0], length = components[1];
        }

        // next, let's handle the instruction
        const hash = hashStr(label);
        if (subtract) {
            boxes[hash] = boxes[hash].filter(lens => lens.label !== label);
        } else {
            const index = boxes[hash].findIndex(lens => lens.label === label);
            if (index !== -1) {
                boxes[hash][index].length = length;
            } else {
                boxes[hash].push({ label, length });
            }
        }
    });

    // finally, let's compute the focusing power
    let focusPower = 0;
    boxes.forEach((box, boxNum) => {
        box.forEach((lens, slotNum) => {
            focusPower += (boxNum+1) * (slotNum+1) * (lens.length);
        });
    });
    return focusPower;
};

const main = async () => {
    const data = await readPuzzle();
    const strs = data.split(",");
    console.log(part1(strs), part2(strs));
};

main();