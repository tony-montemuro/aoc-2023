import { promises as fs } from "fs";

export default async function readPuzzle() {
    try {
        const data = await fs.readFile("puzzle.txt", "utf-8");
        return data.replaceAll("\r", "");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};