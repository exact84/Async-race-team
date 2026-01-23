# Async race

Async Race is a single-page application for managing a collection of cars and running drag races between them via an API. The app allows users to create, edit, delete, start races, and track winners with detailed statistics.

## Technical Stack

- TypeScript
- ESLint
- Prettier
- Stylelint
- Vite
- Vitest
- Zod
- MSW
- Husky

## Available Scripts

```bash
npm run build          # Compile TypeScript and build the project with Vite
npm run dev            # Start Vite development server
npm run format         # Check code formatting with Prettier
npm run format:write   # Format code with Prettier and overwrite files
npm run lint           # Run ESLint to check TypeScript files
npm run lint:fix       # Run ESLint and automatically fix issues
npm run prepare        # Setup Husky Git hooks
npm run preview        # Preview production build locally with Vite
npm run stylelint      # Check CSS files with Stylelint
npm run stylelint:fix  # Fix CSS issues automatically with Stylelint
npm run test           # Run Vitest tests in watch mode
npm run test:coverage  # Run Vitest tests and generate coverage report
npm run typecheck      # Check TypeScript types without emitting output
```

## Local Setup

To run **Async Race** locally, first clone API repository, install dependencies and run server:

```bash
git clone https://github.com/mikhama/async-race-api.git
cd async-race-api
npm install
npm run start
```

Clone this repository, install dependencies and run dev server:

```bash
git clone https://github.com/exact84/async-race-team.git
cd async-race-team
npm install
npm run dev
```

## Style Guide

The style guide is available [here](./STYLE_GUIDE.md)

### Team members

**Team Lead**

- [Alexey Trukhlyayev](https://github.com/exact84)

**Developer**

- [Grim Molbertovich](https://github.com/ripetchor)
