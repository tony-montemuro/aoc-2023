import readPuzzle from "../../read.mjs";

const part1 = (instructions, maps) => {
    const nodes = {};
    maps.forEach(map => {
        const components = map.split(" = ");
        const begin = components[0];
        const endComps = components[1].replace(")", "").replace("(", "").split(", ");
        const left = endComps[0], right = endComps[1];
        nodes[begin] = { "L": left, "R": right };
    });

    let current = "AAA", i = 0, steps = 0, found = false;
    while (!found) {
        const direction = instructions[i];
        current = nodes[current][direction];
        if (current === "ZZZ") {
            found = true;
        }
        i = (i+1) % instructions.length;
        steps++;
    }

    return steps;
};

const gcd = (a, b) => { 
    // base case
    if (b == 0) return a;
    
    // general case
    return gcd(b, a % b); 
} 
 
const lcmOfList = list => {
    let ans = list[0]; 
    for (let i = 1; i < list.length; i++) {
        ans = (((list[i] * ans)) / (gcd(list[i], ans))); 
    }
    return ans; 
}

const part2 = (instructions, maps) => {
    const nodes = {};
    maps.forEach(map => {
        const components = map.split(" = ");
        const begin = components[0];
        const endComps = components[1].replace(")", "").replace("(", "").split(", ");
        const left = endComps[0], right = endComps[1];
        nodes[begin] = { "L": left, "R": right };
    });
    let currentNodes = maps.filter(map => {
        return map.split(" ")[0][2] === "A";
    });
    currentNodes = currentNodes.map(node => node.split(" ")[0]);

    const endSteps = [];
    currentNodes.forEach(node => {
        let current = node, i = 0, steps = 0, found = false;
        while (!found) {
            const direction = instructions[i];
            current = nodes[current][direction];
            i = (i+1) % instructions.length;
            steps++;
            if (current[2] === "Z") {
                endSteps.push(steps);
                found = true;
            }
        }
    });

    return lcmOfList(endSteps);
};

const main = async () => {
    let data = await readPuzzle();
    data = data.split("\n");
    const instructions = data[0], maps = data.splice(2);
    console.log(part1(instructions, maps), part2(instructions, maps));
};

main();