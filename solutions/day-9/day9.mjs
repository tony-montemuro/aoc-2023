import readPuzzle from "../../read.mjs";

const p1 = differences => {
    let total = 0;
    for (let i = differences.length-1; i >= 0; i--) {
        total += differences[i].at(-1);
    }
    return total;
};

const p2 = differences => {
    let digit = differences.at(-1)[0];
    for (let i = differences.length-2; i >= 0; i--) {
        digit = differences[i][0]-digit;
    }
    return digit;
};

const extrapolationSum = (sequences, extrapolator) => {
    let total = 0;
    sequences.forEach(sequence => {
        sequence = sequence.split(" ").map(digit => parseInt(digit));
        const differences = [sequence];
        while (sequence.some(number => number !== 0)) {
            const list = [];
            for (let i = 1; i < sequence.length; i++) {
                list.push(sequence[i]-sequence[i-1]);
            }
            sequence = list;
            differences.push(list);
        }
        total += extrapolator(differences);
    });

    return total;
};

const main = async () => {
    const data = await readPuzzle();
    const sequences = data.split("\n");
    console.log(extrapolationSum(sequences, p1), extrapolationSum(sequences, p2));
};

main();