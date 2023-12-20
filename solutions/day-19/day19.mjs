import readPuzzle from "../../read.mjs";

const parse = data => {
    const s = data.split("\n\n");
    const d1 = s[0].split("\n"), d2 = s[1].split("\n");
    
    // first, parse workflows
    const workflows = {};
    d1.forEach(wf => {
        const s = wf.split("{");
        const name = s[0];
        const instructions = s[1].replace("}", "").split(",");
        workflows[name] = instructions;
    });
    
    // next, parse parts
    const parts = d2.map(p => {
        const pairs = p.slice(1, -1).split(",");
        const map = {};
        pairs.forEach(pair => {
            const s = pair.split("=");
            map[s[0]] = parseInt(s[1]);
        });
        return map;
    });
    
    return { workflows, parts };
};

const execute = (wf, part, c) => {
    if (wf.includes(":")) {
        const s = wf.split(":");
        const cat = part[wf[0]], op = wf[1], target = parseInt(s[0].slice(2)), res = s[1];
        const condition = op === ">" ? cat > target : cat < target;
        return condition ? res : c;
    } else {
        return wf;
    }
};

const part1 = (workflows, parts) => {
    let c = "in", total = 0;
    parts.forEach(part => {
        let found = false;
        while (!found) {
            const wf = workflows[c];
            let i = 0, cNew = c;
            while (i < wf.length && c === cNew) {
                cNew = execute(wf[i], part, c);
                i++;
            }
            c = cNew;
            
            if (c === "A" || c === "R") {
                if (c === "A") total += Object.values(part).reduce((a, b) => a+b, 0);
                found = true;
                c = "in";
            }
        }
    });

    return total;
};

const countCombinations = (workflows, name, i) => {
    // loop until we react the entry (in) workflow
    const comparisons = [];
    while (name !== "in" || i >= 0) {

        // loop until we reach the first instruction, and fetch all comparisons
        const start = i;
        while (i >= 0) {
            const comparison = workflows[name][i].split(":")[0];
            if (comparison !== workflows[name][i]) {
                let op = comparison.includes(">") ? ">" : "<";
                let [cat, number] = comparison.split(op);
                number = parseInt(number);
                if (i !== start) {
                    number = op === ">" ? number+1 : number-1;
                    op = op === ">" ? "<" : ">";
                }
                comparisons.push({cat, op, number});
            }
            i--;
        }

        // find the previous instruction that leads to current, if we are not already at the first instruction
        if (name !== "in") {
            const names = Object.keys(workflows);
            let index = 0, found = false;
            while (!found) {
                const n = names[index];
                const instructions = workflows[n];
                for (let j = 0; j < instructions.length; j++) {
                    const instr = instructions[j];
                    const target = instr.split(":").at(-1);
                    if (target === name) {
                        name = n;
                        i = j;
                        found = true;
                    }
                }
                index++;
            }
        }
    }

    // finally, determine number of combinations based on combinations
    const categories = { 
        "x": { min: 1, max: 4000 },
        "m": { min: 1, max: 4000 },
        "a": { min: 1, max: 4000 },
        "s": { min: 1, max: 4000 }, 
    };
    Object.keys(categories).forEach(category => {
        comparisons.forEach(comparison => {
            const { cat, op, number } = comparison;
            if (cat === category) {
                if (op === ">") {
                    categories[category].min = Math.max(number+1, categories[category].min);
                } else {
                    categories[category].max = Math.min(number-1, categories[category].max);
                }
            }
        });
    });
    return Object.values(categories).reduce((product, c) => product * Math.max((c.max-c.min)+1, 0), 1);
};

const part2 = workflows => {
    let total = 0;
    for (let [name, instructions] of Object.entries(workflows)) {
        for (let i = 0; i < instructions.length; i++) {
            if (instructions[i].includes("A")) {
                total += countCombinations(workflows, name, i);
            }
        }
    }
    return total;
};

const main = async () => {
    const data = await readPuzzle();
    const { workflows, parts } = parse(data);
    console.log(part1(workflows, parts), part2(workflows));
}

main();