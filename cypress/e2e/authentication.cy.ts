// const login = (name: string, password: string) => {
//   cy.session(name, () => {
//     cy.visit("/login");
//     cy.get("[data-cy=login-email]").type(name);
//     cy.get("[data-cy=login-password]").type(password);
//     cy.get("[data-cy=login-submit]").click();
//     cy.url().should("eq", "http://localhost:3000/");
//     cy.contains("Logged in as").should("exist");
//   });
// };

describe("Login form tests", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("Test with wrong credentials", () => {
    cy.get("[data-test-id=login-email]").type("test@test.com");
    cy.get("[data-test-id=login-password]").type("nottherightpassword");
    cy.get("[data-test-id=login-submit]").click();
    cy.get("[data-test-id=login-error]").should(
      "contain.text",
      "Invalid email or password",
    );
  });

  it("Test with empty credentials", () => {
    cy.get("[data-test-id=login-submit]").click();
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
    cy.get("[data-test-id=login-email]").type("test@test.com");
    cy.get("[data-test-id=login-submit]").click();
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
    cy.get("[data-test-id=login-password]").type("password123");
    cy.get("[data-test-id=login-submit]").click();
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
    cy.get("[data-test-id=login-email]").type("test");
    cy.get("[data-test-id=login-password]").type("password123");
    cy.get("[data-test-id=login-submit]").click();
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
    cy.get("[data-test-id=login-email]").type("test@test.com");
    cy.get("[data-test-id=login-password]").type("password123");
    cy.get("[data-test-id=login-submit]").click();
    cy.url().should("eq", "http://localhost:3000/");
  });
});

describe("Register form tests", () => {
  beforeEach(() => {
    cy.visit("/register");
  });
  it("Try registering with an existing email", () => {
    cy.get("[data-test-id=register-email]").type("test@test.com");
    cy.get("[data-test-id=register-password]").type("password123");
    cy.get("[data-test-id=register-confirm-password]").type("password123");
    cy.get("[data-test-id=register-submit]").click();
    cy.get('[data-test-id="register-form"]').should(
      "contain.text",
      "An account with that email already exists",
    );
  });

  it("Try registering with an invalid email", () => {
    cy.get("[data-test-id=register-email]").type("keke");
    cy.get("[data-test-id=register-password]").type("password123");
    cy.get("[data-test-id=register-confirm-password]").type("password123");
    cy.get("[data-test-id=register-submit]").click();
    cy.get('[data-test-id="register-form"]').should(
      "contain.text",
      "Please enter a valid email address",
    );
  });

  it("Try registering with an empty email", () => {
    cy.get("[data-test-id=register-password]").type("password123");
    cy.get("[data-test-id=register-confirm-password]").type("password123");
    cy.get("[data-test-id=register-submit]").click();
    cy.get('[data-test-id="register-form"]').should(
      "contain.text",
      "Please enter a valid email address",
    );
  });

  it("Try registering with an empty password", () => {
    cy.get("[data-test-id=register-email]").type("test@test.com");
    cy.get("[data-test-id=register-submit]").click();
    cy.get('[data-test-id="register-form"]').should(
      "contain.text",
      "Please enter a password",
    );
  });

  it("Try registering with an empty confirm password", () => {
    cy.get("[data-test-id=register-email]").type("test@test.com");
    cy.get("[data-test-id=register-password]").type("password123");
    cy.get("[data-test-id=register-submit]").click();
    cy.get('[data-test-id="register-form"]').should(
      "contain.text",
      "Please confirm your password",
    );
  });

  it("Try registering with a password that doesn't match with confirm-password", () => {
    cy.get("[data-test-id=register-email]").type("test@test.com");
    cy.get("[data-test-id=register-password]").type("password123");
    cy.get("[data-test-id=register-confirm-password]").type("password1234");
    cy.get("[data-test-id=register-submit]").click();
    cy.get('[data-test-id="register-form"]').should(
      "contain.text",
      "Passwords don't match",
    );
  });
});

// describe("Test register new user, login and remove account", () => {
//   it("Register new user", () => {
//     cy.visit("/register");
//     cy.get("[data-test-id=register-email]").type(
//       "cypresstestuser@cypresstest.com",
//     );
//     cy.get("[data-test-id=register-password]").type("cypresstestpassword");
//     cy.get("[data-test-id=register-confirm-password]").type(
//       "cypresstestpassword",
//     );
//     cy.get("[data-test-id=register-submit]").click();
//     cy.url().should("eq", "http://localhost:3000/");
//   });
// });
