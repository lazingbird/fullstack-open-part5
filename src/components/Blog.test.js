import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

const getUserMock = () => {
  return "username";
};

describe("<Blog />", () => {
  let container;
  beforeEach(() => {
    const blog = {
      title: "just a test for jest",
      author: "not a real person",
      url: "whatever",
      user: "username",
    };

    container = render(<Blog blog={blog} getUser={getUserMock} />).container;
  });
  test("check that extra details (url, likes and author) doesn't render by  default", () => {
    const div = container.querySelector(".moreDetails");

    expect(div).toHaveStyle("display: none");
  });

  test("check if extra details are shown if button to show is clicked", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("show");
    await user.click(button);

    const div = container.querySelector(".moreDetails");

    expect(div).not.toHaveStyle("display: none");
  });
});

test("if the like button is clicked twice, event handler is called twice", async () => {
  const handleLikes = jest.fn();

  render(<button onClick={() => handleLikes()}>like</button>);

  const user = userEvent.setup();
  const button = screen.getByText("like");
  await user.click(button);
  await user.click(button);

  expect(handleLikes.mock.calls).toHaveLength(2);
});
