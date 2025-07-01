describe('Dashboard Page - Role Based Visibility', () => {
    const verifyDashboardStats = () => {
        // These cards should be visible for both Admin and Staff
        cy.contains('Today\'s Revenue').should('be.visible');
        cy.contains('Today\'s Profit').should('be.visible');
        cy.contains('Last Month Revenue').should('be.visible');
        cy.contains('Last Month Orders').should('be.visible');
        cy.contains('Estimated Profit').should('be.visible');
        cy.contains('Cost of Stock').should('be.visible');
    };

    const loginAndGoToDashboard = (email, password) => {
        cy.visit('https://inventorymanagement-frontend-qa.onrender.com/');
        cy.get('input[type="email"]').type(email);
        cy.get('input[type="password"]').type(password);
        cy.get('button').contains(`Let's Go`).click();
        cy.contains('Dashboard').click();
    };

    it('Admin should see all key stats on Dashboard', () => {
        loginAndGoToDashboard('admin@example.com', 'admin');
        cy.url().should('include', '/dashboard');
        verifyDashboardStats();
    });

    it('Staff should see all key stats on Dashboard', () => {
        loginAndGoToDashboard('staff@example.com', 'staff');
        cy.url().should('include', '/dashboard');
        cy.contains('Today\'s Revenue').should('not.exist')
        cy.contains('Today\'s Profit').should('not.exist');
        cy.contains('Last Month Revenue').should('not.exist');
        cy.contains('Last Month Orders').should('not.exist');
        cy.contains('Estimated Profit').should('not.exist');
        cy.contains('Cost of Stock').should('not.exist');
    });
});
