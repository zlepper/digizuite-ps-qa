import Timeoutable = Cypress.Timeoutable;
import Loggable = Cypress.Loggable;

Cypress.Commands.add('cget', { prevSubject: ['optional', 'element'] }, (subject, name, options?: Partial<Loggable & Timeoutable>) => {
  const selector = `[data-cy="${name}"]`;

  if (subject) {
    return cy.wrap(subject).find(selector, options);
  } else {
    return cy.get(selector, options);
  }
});

Cypress.Commands.add('start', () => {
  cy.visit('/');

  cy.window({ log: false })
    .its('login')
    .then(login => login('test@digizuite.com', 'House123'));
});

// tslint:disable-next-line:no-namespace
declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Gets an element using the data-cy property
     * @param name - The name of the data element to find
     * @param options - Any options to pass along
     */
    cget(name: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<Subject>;

    start(): void;
  }
}
