import readPuzzle from "../../read.mjs";

const map = (data, seeds) => {
    // first, generate list of ranges from data
    const ranges = data.map(line => {
        const start = parseInt(line[1]);
        return {
            destination: parseInt(line[0]),
            start, 
            end: start+parseInt(line[2])
        };
    });

    // then, for each seed, map to destination, if applicable
    seeds.forEach((seed, index) => {
        const seedVal = parseInt(seed);
        const range = ranges.find(range => (seedVal >= range.start && seedVal <= range.end));
        if (range) {
            seeds[index] = seedVal + (range.destination-range.start);
        }
    });

    return [];
};

const part1 = almanac => {
    // first, get seeds
    const seeds = almanac[0].split(": ")[1].split(" ");

    // next, convert seeds array to locations array
    let i = 2, data = [];
    while (i < almanac.length) {
        const line = almanac[i];
        if (line.endsWith(":")) {
            if (data.length > 0) {
                data = map(data, seeds);
            }
        } else {
            const nums = line.split(" ");
            data.push(nums);
        }
        i++;
    }
    map(data, seeds);

    // finally, return lowest location number
    return seeds.sort((a, b) => a - b)[0];
};

const convertRanges = (ranges, transformer) => {
    let newRanges = [];

    // iterate through each range, and translate to a new set of ranges
    for (let index = 0; index < ranges.length; index++) {
        let range = ranges[index];
        transformer.forEach(transform => {
            if (range) {
                // CASE 1: range is within the transform range
                if (range.start >= transform.start && range.end <= transform.end) {
                    newRanges.push({
                        start: range.start + transform.shift,
                        end: range.end + transform.shift
                    });
                    range = null;
                }

                // CASE 2: range starts within the transform range, and ends outside the transform range
                else if ((range.start >= transform.start && range.start <= transform.end) && range.end > transform.end) {
                    newRanges.push({
                        start: range.start + transform.shift,
                        end: transform.end + transform.shift
                    });
                    range.start = transform.end+1;
                }

                // CASE 3: range starts outside the transform range, and ends within the transform range
                else if (range.start < transform.start && (range.end >= transform.start && range.end <= transform.end)) {
                    newRanges.push({
                        start: transform.start + transform.shift,
                        end: range.end + transform.shift
                    });
                    range.end = transform.start-1;
                }

                // CASE 4: range starts before the transform range, and ends after the transform range
                else if (range.start < transform.start && range.end > transform.end) {
                    newRanges.push({
                        start: transform.start + transform.shift,
                        end: transform.end + transform.shift
                    });
                    const second = { start: transform.end+1, end: range.end };
                    range.end = transform.start-1;
                    ranges.push(second);
                }

            }
        });
        if (range) newRanges.push(range);
    }

    return newRanges;
};

const part2 = almanac => {
    // first, convert the set of seeds to ranges
    let seedRanges = [];
    const data = almanac[0].split(": ")[1].split(" ");
    for (let i = 0; i < data.length; i+=2) {
        const start = parseInt(data[i]);
        seedRanges.push({start, end: start+parseInt(data[i+1])-1});
    }

    // next, iterate through each transform step, and convert ranges
    let i = 2, transformer = [];
    while (i < almanac.length) {
        const line = almanac[i];
        if (line.endsWith(":")) {
            if (transformer.length > 0) {
                console.log(transformer);
                seedRanges = convertRanges(seedRanges, transformer);
                transformer = [];
            }
        } else {
            const nums = line.split(" ");
            const start = parseInt(nums[1]);
            transformer.push({
                shift: parseInt(nums[0])-start,
                start,
                end: start+parseInt(nums[2])-1
            });
        }
        i++;
    }
    seedRanges = convertRanges(seedRanges, transformer);

    // finally, return the start of the first range with the earliest start
    return seedRanges.sort((a, b) => a.start - b.start)[0].start;
}

const main = async () => {
    const data = await readPuzzle();
    const almanac = data.split("\n").filter(line => line != "");
    console.log(part1(almanac), part2(almanac));
};

main();