import readPuzzle from "../../read.mjs";

const customSort1 = (a, b) => {
    // define objects used to count cards
    const count = {"A": 0, "K": 0, "Q": 0, "J": 0, "T": 0, "9": 0, "8": 0, "7": 0, "6": 0, "5": 0, "4": 0, "3": 0, "2": 0}
    const strengthOrder = {"A": 1, "K": 2, "Q": 3, "J": 4, "T":5, "9": 6, "8": 7, "7": 8, "6": 9, "5": 10, "4": 11, "3": 12, "2": 13};

    // first, compare types of hands
    let aCount = {...count}, bCount = {...count};
    for (let c of a) aCount[c]++;
    for (let c of b) bCount[c]++;
    aCount = Object.values(aCount).sort((a, b) => b - a);
    bCount = Object.values(bCount).sort((a, b) => b - a);
    for (let i = 0; i < aCount.length; i++) {
        if (aCount[i] > bCount[i]) {
            return -1;
        }
        if (bCount[i] > aCount[i]) {
            return 1;
        }
    }

    // if the types are equal, sort by character strength
    for (let i = 0; i < a.length; i++) {
        if (strengthOrder[a[i]] > strengthOrder[b[i]]) {
            return 1;
        }
        if (strengthOrder[a[i]] < strengthOrder[b[i]]) {
            return -1;
        }
    }
    return 0;
};

const customSort2 = (a, b) => {
    // define objects used to count cards
    const count = {"A": 0, "K": 0, "Q": 0, "J": 0, "T": 0, "9": 0, "8": 0, "7": 0, "6": 0, "5": 0, "4": 0, "3": 0, "2": 0}
    const strengthOrder = {"A": 1, "K": 2, "Q": 3, "T":4, "9": 5, "8": 6, "7": 7, "6": 8, "5": 9, "4": 10, "3": 11, "2": 12, "J": 13};

    // count characters in a and b
    let aCount = {...count}, bCount = {...count};
    for (let c of a) aCount[c]++;
    for (let c of b) bCount[c]++;

    // treat joker card as "wild" card
    const highestA = Object.keys(aCount).reduce((a, b) => (aCount[a] > aCount[b]) ? (a !== "J" ? a : b) : (b !== "J" ? b : a));
    const highestB = Object.keys(bCount).reduce((a, b) => (bCount[a] > bCount[b]) ? (a !== "J" ? a : b) : (b !== "J" ? b : a));
    aCount[highestA] += aCount["J"], bCount[highestB] += bCount["J"];
    aCount["J"] = 0, bCount["J"] = 0;

    // now, compare by hand type
    aCount = Object.values(aCount).sort((a, b) => b - a);
    bCount = Object.values(bCount).sort((a, b) => b - a);
    for (let i = 0; i < aCount.length; i++) {
        if (aCount[i] > bCount[i]) {
            return -1;
        }
        if (bCount[i] > aCount[i]) {
            return 1;
        }
    }

    // then, go character by character
    for (let i = 0; i < a.length; i++) {
        if (strengthOrder[a[i]] > strengthOrder[b[i]]) {
            return 1;
        }
        if (strengthOrder[a[i]] < strengthOrder[b[i]]) {
            return -1;
        }
    }
    return 0;
};

const sortAndTotalize = (hands, sorter) => {
    hands.sort((a, b) => sorter(a.hand, b.hand));
    let i = hands.length, total = 0;
    hands.forEach(hand => {
        total += (hand.bid * i);
        i--;
    });
    return total;
};

const main = async () => {
    // first, organize hands
    const data = await readPuzzle();
    const cards = data.split("\n");
    const hands = [];
    cards.forEach(card => {
        const components = card.split(" ");
        hands.push({ hand: components[0], bid: parseInt(components[1]) });
    });

    // print solution
    console.log(sortAndTotalize(hands, customSort1), sortAndTotalize(hands, customSort2));
};

main();