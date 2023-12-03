import * as fs from "fs";
import { Day } from "./days";

export function get(day: Day) {
    return fs.readFileSync(`./days/${day}/input.txt`, "utf8");
}

export function getLines(day: Day) {
   return get(day).split("\r\n");;
}