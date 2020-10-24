describe('Product management', () => {
  it('should create, update and delete a product', () => {
    cy.start();

    cy.cget('product-settings-link').click();

    cy.cget('add-product-button').click();

    cy.cget('product-name-input').type('test product');

    cy.cget('finish-add-product-button').click();

    cy.get('app-add-product-dialog').should('not.exist');

    cy.cget('product-card-title').contains('test product').should('exist').parent().cget('edit-product-button').click();

    cy.cget('product-name-input').type('{selectall}edited product');

    cy.cget('add-version-button').click();

    cy.cget('version-name-input').type('1.0.2');

    cy.cget('add-version-button').click();

    cy.cget('version-name-input').eq(1).type('1.0.3');

    cy.cget('remove-version-button').eq(1).click();

    cy.cget('product-version-group').should('have.length', 1);

    cy.cget('save-product-button').click();

    cy.cget('product-title').should('contain', 'edited product');

    cy.go('back');

    cy.cget('product-card-title').contains('edited product').should('exist').parent().as('productCard');

    cy.get('@productCard').cget('version-list').should('contain', '1.0.2');

    cy.get('@productCard').cget('delete-product-button').click();

    cy.cget('product-card-title').contains('edited product').should('not.exist');
  });
});
