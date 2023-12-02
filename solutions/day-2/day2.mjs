import readPuzzle from "../../read.mjs";

const main = async () => {
    const data = await readPuzzle();
    const games = data.split("\n");

    let p1 = 0, p2 = 0;
    games.forEach(game => {
        const max = { red: 12, green: 13, blue: 14 }, minimum = { red: 0, green: 0, blue: 0 };
        const components = game.split(":");
        const id = components[0].split(" ")[1];
        let sets = components[1].split(";");
        let isPossible = true;
        sets.forEach(set => {
            set.replace(" ", "").split(", ").forEach(grab => {
                const data = grab.split(" ");
                const num = parseInt(data[0]), color = data[1];
                if (num > max[color]) isPossible = false;
                if (num > minimum[color]) minimum[color] = num;
            });
        });
        if (isPossible) p1 += parseInt(id);
        p2 += (minimum.red * minimum.green * minimum.blue);
    });

    console.log(p1, p2);
};

main();