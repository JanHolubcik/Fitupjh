// Import Cypress commands and global configuration
import "./commands";

Cypress.on("uncaught:exception", (err: Error) => {
  // Ignore Next.js / React dev hydration mismatch errors so tests aren't failed by dev-only hydration
  if (
    err.message.includes("Hydration failed") ||
    err.message.includes("hydration mismatch") ||
    err.message.includes("Minified React error #418") ||
    err.message.includes("Minified React error #423") ||
    err.message.includes("Minified React error #425")
  ) {
    return false;
  }
  return true;
});
