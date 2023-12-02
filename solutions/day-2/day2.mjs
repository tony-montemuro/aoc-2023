import readPuzzle from "../../read.mjs";

const part1 = games => {
    let total = 0;
    const max = { red: 12, green: 13, blue: 14 };
    games.forEach(game => {
        let isPossible = true;
        const components = game.split(":");
        const id = components[0].split(" ")[1];
        let sets = components[1].split(";");
        for (let i = 0; i < sets.length; i++) {
            sets[i] = sets[i].replace(" ", "");
            sets[i].split(", ").forEach(set => {
                const data = set.split(" ");
                const num = data[0], color = data[1];
                if (parseInt(num) > max[color]) isPossible = false;
            });
        }
        if (isPossible) total += parseInt(id);
    });
    return total;
};

const part2 = games => {
    let total = 0;
    games.forEach(game => {
        const minimum = { red: 0, green: 0, blue: 0 };
        let sets = game.split(":")[1].split(";");
        for (let i = 0; i < sets.length; i++) {
            sets[i] = sets[i].replace(" ", "");
            sets[i].split(", ").forEach(set => {
                const data = set.split(" ");
                const num = parseInt(data[0]), color = data[1];
                if (num > minimum[color]) minimum[color] = num;
            });
        }
        total += (minimum.red * minimum.green * minimum.blue);
    });
    return total;
};

const main = async () => {
    const data = await readPuzzle();
    const games = data.split("\n");
    console.log(part1(games), part2(games));
};

main();