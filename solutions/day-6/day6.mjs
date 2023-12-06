import readPuzzle from "../../read.mjs";

const part1 = race => {
    let times = race[0].split(" ").filter(item => item != "").map(e => parseInt(e));
    let distances = race[1].split(" ").filter(item => item != "").map(e => parseInt(e));
    const ways = [];
    for (let i = 1; i < times.length; i++) {
        let hold = 0, ctr = 0;
        while (hold < times[i]) {
            const timeMoving = times[i] - hold;
            if (timeMoving * hold > distances[i]) {
                ctr++;
            }
            hold++; 
        }
        ways.push(ctr);
    }
    return ways.reduce((a, b) => a * b);
};

const part2 = race => {
    let time = race[0].split(" ").filter(item => item !== "" && item !== "Time:").join("");
    let distance = race[1].split(" ").filter(item => item !== "" && item !== "Distance:").join("");
    const x1 = Math.floor(((-1*time) + Math.sqrt((time**2)-(4*distance))) / (2*(-1)));
    const x2 = Math.floor(((-1*time) - Math.sqrt((time**2)-(4*distance))) / (2*(-1)));
    return Math.abs(x2-x1);
};

const main = async () => {
    const data = await readPuzzle();
    const race = data.split("\n");
    console.log(part1(race), part2(race));
};

main();