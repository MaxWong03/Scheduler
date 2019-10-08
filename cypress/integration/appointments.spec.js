/* eslint-disable no-undef */
describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "api/debug/reset");
    cy.visit("/");
    cy.contains("Monday");
});

  it("should book an interview", () => {
    cy.get('img[alt="Add"]')
      .first()
      .click();
    cy.get('[data-testid="student-name-input"]')
      .type("Max Wong");
    cy.get('img[alt="Sylvia Palmer"]')
      .click();
    cy.contains("Save")
      .click();
    cy.contains(".appointment__card--show", "Max Wong");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("should edit an interview", () => {
    cy.get(".appointment__card--show")
      .trigger("mouseover");
    cy.get('img[alt="Edit"]')
      .click({force: true});
    cy.get('[data-testid="student-name-input"]')
      .clear()
      .type("Max Wong");
    cy.get('img[alt="Tori Malcolm"]')
      .click();
    cy.contains("Save")
      .click();
    cy.contains(".appointment__card--show", "Max Wong");
    cy.contains(".appointment__card--show", "Tori Malcolm"); 
  });

  it("should cancel an interview", () => {
    cy.get(".appointment__card--show")
      .trigger("mouseover");
    cy.get('img[alt="Delete"]')
      .click({force: true});
    cy.contains("Confirm")
      .click();
    cy.contains(".appointment__card--status", "Deleting")
      .should("not.have.value", "Deleting");
    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  });
});