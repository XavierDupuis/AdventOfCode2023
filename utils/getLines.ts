import * as fs from "fs";
import { Day } from "./days";
import { exit } from "process";

export function get(day: Day) {
    try {
        return fs.readFileSync(`./days/${day}/input.txt`, "utf8");
    } catch (error) {
        console.error(`> Error reading input file for day ${day}`);
        console.error(`> Verify that the file '/days/${day}/input.txt' exists.`);
        exit(1);
    }
}

export function getLines(day: Day) {
   return get(day).split("\r\n");;
}