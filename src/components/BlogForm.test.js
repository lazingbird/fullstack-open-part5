import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

const getUserMock = () => {
  return "username";
};

describe("<BlogForm />", () => {
  test("check that the form calls the event handler it received as props with the right details when a new blog is created", async () => {
    const createBlogMock = jest.fn();
    const user = userEvent.setup();

    render(<BlogForm createBlog={createBlogMock}></BlogForm>);

    const input = screen.getAllByRole("textbox");
    const sendButton = screen.getByText("Create");

    await user.type(input[0], "testing a form...");

    await user.click(sendButton);

    expect(createBlogMock.mock.calls[0][0]["title"]).toBe("testing a form...");
  });
});
