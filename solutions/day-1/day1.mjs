import readPuzzle from "../../read.mjs";

const main = async () => {
    // read data
    const data = await readPuzzle();
    const lines = data.split("\n");

    // PART 1
    let vals = [];
    lines.forEach(line => {
        // find first value
        let first;
        let found = false, index = 0;
        while (index < line.length && !found) {
            const char = line[index];
            if (char >= "0" && char <= "9") {
                first = parseInt(char);
                found = true;
            }
            index += 1;
        }

        // find last value
        let last;
        index = line.length-1, found = false;
        while (index >= 0 && !found) {
            const char = line[index];
            if (char >= "0" && char <= "9") {
                last = parseInt(char);
                found = true;
            }
            index -= 1;
        }

        // push value to array
        vals.push(first*10 + last);
    });

    // result 1 - sum of all values
    console.log(vals.reduce((a, b) => a + b));

    // PART 2
    vals = [];
    const nums = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };
    lines.forEach(line => {
        // find first value
        let first;
        let found = false, index = 0;
        while (index < line.length && !found) {
            const char = line[index];
            if (char >= "0" && char <= "9") {
                first = parseInt(char);
                found = true;
            } else {
                for (const key in nums) {
                    if (line.indexOf(key) === index) {
                        first = nums[key];
                        found = true;
                        break;
                    }
                }
            }
            index += 1;
        }
        
        // find last value
        let last;
        index = line.length-1;
        found = false;
        while (index >= 0 && !found) {
            const char = line[index];
            if (char >= "0" && char <= "9") {
                last = parseInt(char);
                found = true;
            } else {
                for (const key in nums) {
                    if (line.indexOf(key, index) === index) {
                        last = nums[key];
                        found = true;
                        break;
                    }
                }
            }
            index -= 1;
        }
        index += 1;
        
        // push value to array
        vals.push(first*10 + last);
    });

    // result 2 - sum of all values
    console.log(vals.reduce((a, b) => a + b));
};

main();