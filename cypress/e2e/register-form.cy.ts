const register = ({
  email,
  password,
  confirmPassword,
}: {
  email?: string;
  password?: string;
  confirmPassword?: string;
}) => {
  cy.visit("/register");
  email && cy.get("[data-test-id=register-email]").type(email);
  password && cy.get("[data-test-id=register-password]").type(password);
  confirmPassword &&
    cy.get("[data-test-id=register-confirm-password]").type(confirmPassword);
  cy.get("[data-test-id=register-submit]").click();
};

describe("Register form tests", () => {
  it("Try registering with an existing email", () => {
    register({
      email: "test@test.com",
      password: "password123",
      confirmPassword: "password123",
    });
    cy.get('[data-test-id="register-form"]').should(
      "contain.text",
      "An account with that email already exists",
    );
  });

  it("Try registering with an invalid email", () => {
    register({
      email: "keke",
      password: "password123",
      confirmPassword: "password123",
    });
    cy.get('[data-test-id="register-form"]').should(
      "contain.text",
      "Please enter a valid email address",
    );
  });

  it("Try registering with an empty email", () => {
    register({
      password: "password123",
      confirmPassword: "password123",
    });
    cy.get('[data-test-id="register-form"]').should(
      "contain.text",
      "Please enter a valid email address",
    );
  });

  it("Try registering with an empty password", () => {
    register({
      email: "test@test.com",
    });
    cy.get('[data-test-id="register-form"]').should(
      "contain.text",
      "Please enter a password",
    );
  });

  it("Try registering with an empty confirm password", () => {
    register({
      email: "test@test.com",
      password: "password123",
    });
    cy.get('[data-test-id="register-form"]').should(
      "contain.text",
      "Please confirm your password",
    );
  });

  it("Try registering with a password that doesn't match with confirm-password", () => {
    register({
      email: "test@test.com",
      password: "password123",
      confirmPassword: "password1234",
    });
    cy.get('[data-test-id="register-form"]').should(
      "contain.text",
      "Passwords don't match",
    );
  });
});

describe("Test register new user, login and remove account", () => {
  it("passes", () => {
    cy.visit("/register");
    cy.get("[data-test-id=register-email]").type(
      "cypresstestuser@cypresstest.com",
    );
    cy.get("[data-test-id=register-password]").type("cypresstestpassword");
    cy.get("[data-test-id=register-confirm-password]").type(
      "cypresstestpassword",
    );
    cy.get("[data-test-id=register-submit]").click();

    cy.url().should("eq", "http://localhost:3000/login");

    cy.wait(1000);

    cy.get("[data-test-id=login-email]").type(
      "cypresstestuser@cypresstest.com",
    );

    cy.get("[data-test-id=login-password]").type("cypresstestpassword");
    cy.get("[data-test-id=login-submit]").click();
    cy.url().should("eq", "http://localhost:3000/");

    cy.get("[data-test-id=user-menu]").click();
    cy.get("[data-test-id=delete-user-trigger]").click();
    cy.wait(1000);
    cy.get("[data-test-id=delete-user-confirm]").type("Delete");
    cy.get("[data-test-id=delete-user-button]").click();
  });
});
