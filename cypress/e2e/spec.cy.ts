describe("Basic layout test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Check if the app has a header", () => {
    cy.get("header").should("be.visible").should("exist");
    cy.get('[data-test-id="site-title"]').should("have.text", "Bill Splitter");
  });

  it("Check if the app has a main", () => {
    cy.get("main").should("be.visible").should("exist");
    cy.get("main").should("contain.text", "Welcome to Bill Splitter");
  });

  it("Check if the app has a footer", () => {
    cy.get("footer").should("be.visible").should("exist");
    cy.get("footer").should("contain.text", "JM Productions");
  });
});
