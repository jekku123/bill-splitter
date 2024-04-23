const login = ({ email, password }: { email?: string; password?: string }) => {
  // cy.session(id, () => {
  cy.visit("/login");
  email && cy.get("[data-test-id=login-email]").type(email);
  password && cy.get("[data-test-id=login-password]").type(password);
  cy.get("[data-test-id=login-submit]").click();
  // cy.url().should("eq", "http://localhost:3000/");
  // cy.contains("Logged in as").should("exist");
  // });
};

describe("Login form tests", () => {
  it("Test with wrong credentials", () => {
    login({ email: "test@test.com", password: "nottherightpassword" });
    cy.get("[data-test-id=login-error]").should(
      "contain.text",
      "Invalid email or password",
    );
  });

  it("Test with empty credentials", () => {
    login({});
    cy.get('[data-test-id="login-form"]').should(
      "contain.text",
      "Please enter a valid email address",
    );
    cy.get('[data-test-id="login-form"]').should(
      "contain.text",
      "Please enter a password",
    );
  });

  it("Test with empty password", () => {
    login({ email: "test@test.com" });
    cy.get('[data-test-id="login-form"]').should(
      "contain.text",
      "Please enter a password",
    );
    cy.get('[data-test-id="login-form"]').should(
      "not.include.text",
      "Please enter a valid email address",
    );
  });

  it("Test with empty email", () => {
    login({ password: "password123" });
    cy.get('[data-test-id="login-form"]').should(
      "contain.text",
      "Please enter a valid email address",
    );
    cy.get('[data-test-id="login-form"]').should(
      "not.include.text",
      "Please enter a password",
    );
  });

  it("Test with invalid email", () => {
    login({ email: "test", password: "password123" });
    cy.get('[data-test-id="login-form"]').should(
      "contain.text",
      "Please enter a valid email address",
    );
    cy.get('[data-test-id="login-form"]').should(
      "not.include.text",
      "Please enter a password",
    );
  });

  it("Test with correct credentials", () => {
    login({
      email: "test@test.com",
      password: "password123",
    });
    cy.url().should("eq", "http://localhost:3000/");
  });
});
