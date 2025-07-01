// cypress/support/e2e.js

// Import commands.js using ES2015 syntax:
import './commands'

// Optionally you can handle uncaught exceptions here
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  return false
})
