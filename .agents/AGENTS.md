# Project Rules

- **Types Over Interfaces:** Always use `type` declarations instead of `interface` for defining object shapes and typings.
- **Arrow Functions:** Always use arrow function syntax `const name = () => {}` for all functions and React function components.
- **No Any or Unknown:** Never use `any` or `unknown` types.
- **Always Use i18n:** Always use the `i18n` translation system (via `useT` hook or translation JSON files) for any user-facing text in the application. Do not hardcode Slovak or English strings inline.
- **Minimal Database Footprint:** We are trying to use as little database space as possible. Think carefully before adding new properties to database schemas or documents; omit redundant fields (like custom timestamps when `createdAt` exists, or transient UI types) and favor defaults or derived values wherever possible.


