describe('customer-management', () => {
  it('should add a customer', () => {
    cy.start();

    cy.cget('add-new-customer').click();

    cy.cget('new-customer-name').type('test customer');
    cy.cget('add-new-customer-confirm').click();

    cy.get('app-add-new-customer-dialog').should('not.exist');

    cy.cget('customer-link').contains('test customer').should('exist').parent().cget('customer-more-button').click();

    cy.cget('customer-more-delete-button').click();

    cy.cget('confirm-delete-button').click();

    cy.cget('customer-link').contains('test customer').should('not.exist');

    cy.url().should('equal', Cypress.config().baseUrl + '/');
  });
});
