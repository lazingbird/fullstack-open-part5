import { func } from "prop-types";

describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    const user = {
      name: "root",
      username: "root",
      password: "secretPassword",
    };

    const user2 = {
      name: "notroot",
      username: "notroot",
      password: "secretPassword",
    };
    cy.request("POST", "http://localhost:3001/api/users/", user);
    cy.request("POST", "http://localhost:3001/api/users/", user2);
    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", function () {
    cy.contains("Username");
    cy.contains("Password");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("root");
      cy.get("#password").type("secretPassword");

      cy.get("#login-button").click();

      cy.contains("root logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("rot");
      cy.get("#password").type("secretPassword");

      cy.get("#login-button").click();

      cy.contains("Wrong credentials");
    });
  });

  describe.only("When logged in", function () {
    beforeEach(function () {
      cy.request("POST", "http://localhost:3001/api/login", {
        username: "root",
        password: "secretPassword",
      }).then((response) => {
        localStorage.setItem(
          "loggedBlogappUser",
          JSON.stringify(response.body)
        );
        cy.visit("http://localhost:5173");
      });
    });

    it("A blog can be created", function () {
      cy.contains("Create New Blog");
      cy.get("#create-button").click();

      cy.get("#title").type("Note for test");
      cy.get("#author").type("John Smith");
      cy.get("#url").type("google.com.br");

      cy.get("#save-button").click();

      cy.contains("Blog added");
    });

    describe("When logged in and with a blog created", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "the title with the most likes",
          author: "Joanna Smith",
          url: "google.com",
        });

        cy.createBlog({
          title: "the title with the second most likes",
          author: "Joanna Smith",
          url: "google.com",
        });
      });

      it("Can be liked", function () {
        cy.contains("show").click();
        cy.contains("like").click();
      });

      it("Can be deleted", function () {
        cy.contains("show").click();
        cy.contains("remove").click();
      });

      it("can't be deleted by another user", function () {
        cy.contains("logout").click();

        cy.get("#username").type("notroot");
        cy.get("#password").type("secretPassword");

        cy.get("#login-button").click();

        cy.contains("notroot logged in");

        cy.contains("show").click();
        cy.contains("remove").should("not.exist");
      });

      it("is ordered by likes", function () {
        cy.contains("show").click();
        cy.contains("like").click();

        cy.get(".blog")
          .eq(0)
          .should("contain", "the title with the most likes");
        cy.get(".blog")
          .eq(1)
          .should("contain", "the title with the second most likes");
      });
    });
  });
});
