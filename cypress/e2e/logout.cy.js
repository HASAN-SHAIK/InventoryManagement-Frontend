describe('Logout Flow', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Should logout successfully', () => {
    cy.contains('Logout').click();
    cy.url().should('include', '/login');
  });
});
