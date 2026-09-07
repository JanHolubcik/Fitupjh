/// <reference types="cypress" />

describe("User Authentication Lifecycle", () => {
  beforeEach(() => {
    // Ensure test always begins with clean storage and cookies
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
  });

  it("registers a new user, logs in, deletes the account, and verifies deletion", () => {
    const timestamp = Date.now();
    const testUser = {
      username: `User${timestamp}`,
      email: `test_${timestamp}@example.com`,
      password: "TestPassword123!",
      height: "180",
      weight: "75",
      yearOfBirth: "1998",
    };

    // ==========================================
    // 1. REGISTER NEW USER THROUGH THE DOM
    // ==========================================
    cy.visit("/en/signup");

    // Wait for the form to be hydrated and stable
    cy.get("form").should("be.visible");
    cy.wait(500);

    cy.get('input[name="username"]').should("be.visible").type(testUser.username);
    cy.get('input[name="userEmail"]').should("be.visible").type(testUser.email);
    cy.get('input[name="password"]').should("be.visible").type(testUser.password);
    cy.get('input[name="height"]').should("be.visible").type(testUser.height);
    cy.get('input[name="weight"]').should("be.visible").type(testUser.weight);
    cy.get('input[name="yearOfBirth"]').should("be.visible").type(testUser.yearOfBirth);

    // Accept terms and conditions checkbox
    cy.get('input[type="checkbox"]').check({ force: true });

    // Submit registration form
    cy.get('button[type="submit"]')
      .should("be.enabled")
      .click();

    // Verify redirected to dashboard after signup
    cy.url({ timeout: 15000 }).should("include", "/dashboard");

    // ==========================================
    // 2. LOG OUT & LOG IN THROUGH THE DOM
    // ==========================================
    // Clear session cookies to simulate signing out
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();

    cy.visit("/en/login");
    cy.get("form").should("be.visible");
    cy.wait(500);

    // Enter the newly created credentials
    cy.get('input[name="email"]').should("be.visible").type(testUser.email);
    cy.get('input[name="password"]').should("be.visible").type(testUser.password);

    // Submit login form
    cy.get('button[type="submit"]').click();

    // Verify redirected back to dashboard
    cy.url({ timeout: 15000 }).should("include", "/dashboard");

    // ==========================================
    // 3. DELETE USER THROUGH THE DOM
    // ==========================================
    cy.visit("/en/profile");
    cy.wait(500);

    // Scroll down to the Danger Zone and click Delete Account
    cy.contains("button", "Delete Account")
      .scrollIntoView()
      .should("be.visible")
      .click();

    // Confirm account deletion in the confirmation modal
    cy.get('[role="dialog"]').should("be.visible");
    cy.get('[role="dialog"]')
      .contains("button", "Delete Account")
      .click();

    // Wait for account deletion and redirect away from profile
    cy.url({ timeout: 15000 }).should("not.include", "/profile");

    // ==========================================
    // 4. VERIFY USER CANNOT LOG IN ANYMORE
    // ==========================================
    cy.clearAllCookies();
    cy.clearAllLocalStorage();

    cy.visit("/en/login");
    cy.get("form").should("be.visible");
    cy.wait(500);

    cy.get('input[name="email"]').should("be.visible").type(testUser.email);
    cy.get('input[name="password"]').should("be.visible").type(testUser.password);
    cy.get('button[type="submit"]').click();

    // Verify the invalid credentials error message appears
    cy.get(".text-red-400", { timeout: 10000 }).should("be.visible");
    cy.url().should("include", "/login");
  });
});
