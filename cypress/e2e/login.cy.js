describe('Login Test', () => {
  it('Should successfully login', () => {
    cy.visit('https://inventorymanagement-frontend.onrender.com');

    cy.get('input[type="email"]').type('admin@example.com');
    cy.get('input[type="password"]').type('admin');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('exist');
  });
});
