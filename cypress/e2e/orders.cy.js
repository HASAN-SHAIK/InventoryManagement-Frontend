// cypress/e2e/orders.cy.js

describe('End-to-End Orders Flow', () => {
  const baseUrl = 'https://inventorymanagement-frontend-qa.onrender.com';

  beforeEach(() => {
    cy.visit(baseUrl);
    cy.get('input[type="email"]').type('admin@example.com');
    cy.get('input[type="password"]').type('admin');
    cy.get('button').contains(`Let's Go`).click();
    cy.contains('Orders').click();
    cy.url().should('include', '/orders');
  });

  function fillCommonFields(type) {
    cy.contains(type).click();
    if (type !== 'personal') {
      cy.contains('cash').click();
    }
  }

  function addProductRow(type) {
    cy.contains('Add Product').click();
    if (type === 'Sale') {
      cy.get('input[placeholder="Search Product"]').last().type('Laptop');
      cy.contains('Laptop').click();
      cy.get('input[placeholder="Quantity"]').last().type('1');
    } else {
      cy.get('input[placeholder="product name"]').last().type('Test Item');
      cy.get('input[placeholder="company"]').last().type('Test Co');
      cy.get('input[placeholder="quantity"]').last().type('5');
      cy.get('input[placeholder="actual price"]').last().type('100');
      cy.get('input[placeholder="selling price"]').last().type('150');
      cy.get('input[list="categories-list"]').last().type('Electronics');
      cy.get('input[placeholder="time for delivery"]').last().type('3');
    }
  }

  function submitAndCheckRedirect() {
    cy.contains('Create Transaction').click();
    cy.url({ timeout: 10000 }).should('include', '/orders');
  }

  it('Place a valid Sale order → then mark Payment → Delete disabled', () => {
    fillCommonFields('Sale');
    addProductRow('Sale');
    submitAndCheckRedirect();

    cy.contains('Mark as Paid').click();
    cy.contains('Done').should('exist');
    cy.contains('Delete').should('be.disabled');
  });

  it('Attempt Sale order without selecting product → should fail', () => {
    fillCommonFields('Sale');
    cy.contains('Create Transaction').click();
    cy.on('window:alert', (msg) => {
      expect(msg).to.contain('Select product');
    });
  });

  it('Place a valid Purchase order', () => {
    fillCommonFields('purchase');
    addProductRow('purchase');
    submitAndCheckRedirect();
    cy.contains('Invoice').should('exist');
  });

  it('Attempt Purchase order with missing fields → should fail', () => {
    fillCommonFields('purchase');
    cy.contains('Add Product').click();
    cy.contains('Create Transaction').click();
    cy.on('window:alert', (msg) => {
      expect(msg).to.contain('Fill all product details');
    });
  });

  it('Place a valid Personal order', () => {
    fillCommonFields('personal');
    cy.get('input[placeholder="Total Amount"]').type('500');
    submitAndCheckRedirect();
    cy.contains('Personal').should('exist');
  });

  it('Attempt Personal order without amount → should fail', () => {
    fillCommonFields('personal');
    cy.contains('Create Transaction').click();
    cy.on('window:alert', (msg) => {
      expect(msg).to.contain('Enter amount');
    });
  });
});
