import readPuzzle from "../../read.mjs";

const filterOutSpaces = arr => {
    return arr.filter(item => item != "");
};

const countMatches = card => {
    const split = card.split("|");
    let winning = filterOutSpaces(split[0].split(": ")[1].split(" ")); 
    let numbers = filterOutSpaces(split[1].replace(" ", "").split(" "));
    let matches = 0;
    numbers.forEach(number => {
        if (winning.includes(number)) {
            matches++;
        }
    });
    return matches;
};

const countCards = (cards, current) => {
    const matches = countMatches(cards[current]);

    // base case - no matches found
    if (matches == 0) {
        return 1;
    }

    // general case: there is at least one match
    let sum = 0;
    for (let i = 1; i <= matches; i++) {
        sum += countCards(cards, current+i);
    }
    return sum+1;
};

const part1 = cards => {
    let total = 0;
    cards.forEach(card => {
        const matches = countMatches(card);
        if (matches > 0) total += 2 ** (matches-1);
    });
    return total;
};

const part2 = cards => {
    let total = 0;
    for (let i = 0; i < cards.length; i++) {
        total += countCards(cards, i);
    }
    return total;
};

const main = async () => {
    const data = await readPuzzle();
    const cards = data.split("\n");
    console.log(part1(cards), part2(cards));
};

main();