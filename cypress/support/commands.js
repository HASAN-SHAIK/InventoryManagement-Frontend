Cypress.Commands.add('login', () => {
  cy.visit('https://inventorymanagement-frontend-qa.onrender.com');
  cy.get('input[type="email"]').type('admin@example.com');
  cy.get('input[type="password"]').type('admin');
  cy.get('button[type="submit"]').click();
});
