// cypress/e2e/createOrder.cy.js

describe('Create Order Page Functionalities', () => {

  beforeEach(() => {
    cy.visit('https://inventorymanagement-frontend-qa.onrender.com/');
    cy.get('input[type="email"]').type('admin@example.com');
    cy.get('input[type="password"]').type('admin');
    cy.get('button').contains(`Let's Go`).click();
    cy.wait(5000); // Wait for the login to complete
    cy.url().should('include', '/dashboard');
    cy.contains('New Order').click();
  });

  const waitForOrdersPage = () => {
    cy.url({ timeout: 10000 }).should('include', '/orders');
  };
  it('Create Purchase Order - All Fields Filled', () => {
    cy.get('input[value="purchase"]').click();
    cy.contains('Add Product').click();
    cy.get('input[placeholder="product name"]').first().type('New Product');
    cy.get('input[placeholder="company"]').first().type('New Company');
    cy.get('input[placeholder="quantity"]').first().type('10');
    cy.get('input[placeholder="actual price"]').first().type('50');
    cy.get('input[placeholder="selling price"]').first().type('60');
    cy.get('input[list="categories-list"]').first().type('Electronics');
    cy.get('input[placeholder="time for delivery"]').first().type('2');
    cy.get('input[value="online"]').click();
    cy.contains('Create Transaction').click();
    waitForOrdersPage();
  });
  it('Create Sale Order - All Fields Filled', () => {
    cy.get('input[value="sale"]').click();
    cy.contains('Add Product').click();
    cy.get('input[placeholder="Search Product"]').first().type('lap');
    cy.wait(1000);
    cy.get('.list-group-item-action').first().click();
    cy.get('input[placeholder="Quantity"]').first().type('2');
    cy.contains('Add Product').click();
    cy.get('input[placeholder="Search Product"]').last().type('phone');
    cy.wait(1000);
    cy.get('.list-group-item-action').first().click();
    cy.get('input[placeholder="Quantity"]').last().type('1');
    cy.get('input[value="cash"]').click();
    cy.contains('Create Transaction').click();
    waitForOrdersPage();
  });

  it('Create Sale Order - Missing Fields', () => {
    cy.get('input[value="sale"]').click();
    cy.get('input[value="cash"]').click();
    cy.contains('Create Transaction').click();
    cy.on('window:alert', (str) => {
      expect(str).to.include('Select product and quantity');
    });
  });



  it('Create Purchase Order - Missing Fields', () => {
    cy.get('input[value="purchase"]').click();
    cy.contains('Add Product').click();
    cy.get('input[placeholder="product name"]').first().type('New Product');
    cy.get('input[value="online"]').click();
    cy.contains('Create Transaction').click();
    cy.on('window:alert', (str) => {
      expect(str).to.include('Fill all product details');
    });
  });

  it('Create Personal Order - All Fields Filled', () => {
    cy.get('input[value="personal"]').click();
    cy.get('input[value="online"]').click();
    cy.get('input[type="number"]').type('500');
    cy.contains('Create Transaction').click();
    waitForOrdersPage();
  });

  it('Create Personal Order - Missing Fields', () => {
    cy.get('input[value="personal"]').click();
    cy.get('input[value="online"]').click();
    cy.contains('Create Transaction').click();
    cy.on('window:alert', (str) => {
      expect(str).to.include('Enter amount for personal transaction');
    });
  });

  it('Delete Newly Created Order', () => {
    cy.contains('Orders').click();
    cy.wait(3000);
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').contains('Delete').click();
    });
    cy.on('window:confirm', () => true);
    cy.wait(500);
  });
      it.only('Make Payment disables Delete Button', () => {
        cy.contains('Orders').click();
        cy.wait(3000);

        // Assuming you have a test order at the top
        cy.contains('Done').first().click();
        cy.wait(1000); // wait for backend processing

        // Check if the Delete button is disabled after payment
        cy.get('button').contains('Delete').first().should('be.disabled');
    });
});
