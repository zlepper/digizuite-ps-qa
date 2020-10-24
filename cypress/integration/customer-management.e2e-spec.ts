describe('customer-management', () => {
  it('should add a customer', () => {
    cy.start();

    cy.cget('add-new-customer').click();

    cy.cget('new-customer-name').type('test customer');
    cy.cget('add-new-customer-confirm').click();

    cy.get('app-add-new-customer-dialog').should('not.exist');

    cy.cget('customer-link').contains('test customer').should('exist');

    cy.cget('edit-customer-link').click();

    cy.cget('customer-name-input').type('{selectall}edited customer');

    cy.cget('add-new-environment-button').click();

    cy.cget('environment-name-input').type('Test env');

    cy.cget('add-product-button').click();

    cy.cget('product-id-select').click();

    cy.cget('product-id-option').contains('Dam Center').click();

    cy.cget('product-version-select').click();

    cy.cget('product-version-option').contains('1.0.1').click();

    cy.cget('save-edited-customer-button').should('not.be.disabled').click();

    cy.cget('customer-link').contains('edited customer').should('exist').parent().cget('customer-more-button').click();

    cy.cget('customer-more-delete-button').click();

    cy.cget('confirm-delete-button').click();

    cy.cget('customer-link').contains('test customer').should('not.exist');

    cy.url().should('equal', Cypress.config().baseUrl + '/');
  });
});
