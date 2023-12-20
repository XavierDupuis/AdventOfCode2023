# Advent of Code 2023 - TypeScript Solutions

This repository contains TypeScript solutions for Advent of Code 2023. 
Each day's solution is organized in its respective directory under the "days" folder, following the pattern "01" to "25".

## Directory Structure

```
.
├── utils/
└── days/
    ├── 01/
    │   ├── input.txt
    │   ├── solution.ts
    │   └── solution.spec.ts
    ...
    ├── xx/
    │   ├── input.txt
    │   ├── solution.ts
    │   └── solution.spec.ts
    ...
    └── 25/
        ├── input.txt
        ├── solution.ts
        └── solution.spec.ts
```

## Running Solutions

To run a specific day's solution against its "input.txt," use the following command:

```
npm run day xx
```

Replace `xx` with the day number.

The output will display:

```
-> 🎄 Day xx <-
⚡ Part 1 : XXXXXXXX
⚡ Part 2 : XXXXXXXX
```

## Running Tests

Tests for each day's solution can be run using:

```
npx jest /days/xx/solution.spec.ts
```

Replace `xx` with the day number.

---

Feel free to explore the solutions and adapt them to your needs. Happy coding and enjoy Advent of Code 2023! 🎄⭐️
