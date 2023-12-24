import readPuzzle from "../../read.mjs";

// function that checks, given lower is a brick 1 position lower than higher, if `higher` is directly above `lower`
const isAbove = (lower, higher) => {
    return (
        (
            (higher.x1 >= lower.x1 && higher.x1 <= lower.x2) || 
            (higher.x2 >= lower.x1 && higher.x2 <= lower.x2) || 
            (higher.x1 < lower.x1 && higher.x2 > lower.x2)
        ) && (
            (higher.y1 >= lower.y1 && higher.y1 <= lower.y2) ||
            (higher.y2 >= lower.y1 && higher.y2 <= lower.y2) ||
            (higher.y1 < lower.y1 && higher.y2 > lower.y2)
        )
    );
};

// function that returns the list of bricks supporting `brick`
const getSupport = (bricks, index) => {
    const brick = bricks[index], support = [];
    let i = index-1;
    while (i >= 0) {
        const other = bricks[i];
        if (other.z2 === brick.z1-1 && isAbove(other, brick)) {
            support.push({brick: other, index: i});
        }
        i--;
    }
    return support;
};

// function that determines if a given brick has support
const hasSupport = (bricks, index) => {
    // base case: brick is lying on the grounds
    const {z1} = bricks[index];
    if (z1 === 1) return true;

    // general case: brick is above the ground. if at least 1 path to ground exists, return true. otherwise, false
    let supported = false;
    getSupport(bricks, index).forEach(b => {
        if (hasSupport(bricks, b.index) && !supported) supported = true;
    });
    return supported;
};

const part1 = bricks => {
    // find all bricks which are unsupported
    const unsupported = [];
    for (let i = 0; i < bricks.length; i++) {
        if (!hasSupport(bricks, i)) {
            unsupported.push({brick: bricks[i], index: i});
        }
    }
    
    // while there are still unsupported bricks, simulate a "fall"
    while (unsupported.length > 0) {
        for (let i = 0; i < unsupported.length; i++) {
            let {brick, index} = unsupported[i];
            const support = getSupport(bricks, index);
            if (support.length > 0 || brick.z1 === 1) {
                unsupported.splice(i, 1);
                i--;
            } else {
                brick.z1--;
                brick.z2--;
                while (index > 0 && bricks[index-1].z1 > brick.z1) {
                    [bricks[index-1], bricks[index]] = [bricks[index], bricks[index-1]];
                    index--;
                }
                unsupported[i].index = index;
            }
        }
    }

    // next, map each brick to it's supporting bricks
    const supportMap = {};
    for (let i = 0; i < bricks.length; i++) {
        const current = JSON.stringify(bricks[i]);
        supportMap[current] = [];
        const support = getSupport(bricks, i);
        support.forEach(b => {
            let {brick} = b;
            brick = JSON.stringify(brick);
            supportMap[current].push(brick);
        });
    }
    
    // finally, count up the bricks who, when removed, would affect the structure
    const critical = [];
    bricks.forEach(brick => {
        brick = JSON.stringify(brick);
        let isCritical = false;
        Object.values(supportMap).forEach(supports => {
            if (supports.includes(brick) && supports.length === 1) {
                isCritical = true;
            }
        });
        if (isCritical) critical.push(brick);
    });
    
    return {supportMap, critical, p1: bricks.length-critical.length};
};

const part2 = (supportMap, critical) => {
    let total = 0;
    critical.forEach(c => {
        // first, find all bricks above critical brick
        const queue = [], fallen = new Set([c]);
        Object.keys(supportMap).forEach(brick => {
            const support = supportMap[brick];
            if (support.includes(c)) queue.push(brick); 
        });

        // next, we will walk up the bricks, and find which fall based on which have already fallen
        while (queue.length > 0) {
            const b = queue.shift();

            const support = supportMap[b];
            let willFall = true;
            support.forEach(s => {
                if (!fallen.has(s)) willFall = false;
            });
            if (willFall) {
                Object.keys(supportMap).forEach(brick => {
                    const support = supportMap[brick];
                    if (support.includes(b) && !queue.includes(b)) queue.push(brick);
                });
                fallen.add(b);
            }
        }
        
        // finally, increment total by # of fallen
        total += fallen.size-1
    });
    return total;
};

const main = async () => {
    let data = await readPuzzle();
    data = data.split("\n");
    
    // parse input
    const bricks = data.map(row => {
        const [p1, p2] = row.split("~");
        const [x1, y1, z1] = p1.split(",").map(i => parseInt(i));
        const [x2, y2, z2] = p2.split(",").map(i => parseInt(i));
        return { x1, y1, z1, x2, y2, z2 };
    });
    bricks.sort((a, b) => a.z1 < b.z1 ? -1 : 1);
    
    // print results
    const { supportMap, critical, p1 } = part1(bricks);
    console.log(p1, part2(supportMap, critical));
}

main();