import React from "react";
import { render, screen } from "@testing-library/react";
import Wilder from "./Wilder";
import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter } from "react-router-dom";
import { GetProfileDocument } from "../gql/generated/schema";

const adminProfileMock = {
  request: {
    query: GetProfileDocument,
  },
  result: {
    data: {
      profile: {
        id: "1",
        email: "admin@gmail.com",
        role: "admin",
      },
    },
  },
};

describe("Wilder component", () => {
  it("renders name and skills", () => {
    const view = render(
      <MockedProvider mocks={[adminProfileMock]} addTypename={false}>
        <Wilder
          wilder={{
            id: 1,
            name: "Dave",
            skills: [
              { id: 1, name: "PHP", votes: 3 },
              { id: 2, name: "JS", votes: 5 },
            ],
          }}
        ></Wilder>
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(screen.getByText(/Dave/)).toBeVisible();
    expect(screen.getByText(/PHP/)).toBeVisible();
    expect(screen.getByText(/JS/)).toBeVisible();
    expect(screen.getByText(/3/)).toBeVisible();
    expect(screen.getByText(/5/)).toBeVisible();
    expect(view.baseElement).toMatchInlineSnapshot(`
<body>
  <div>
    <div
      class="flex bg-white p-4 rounded-2xl mb-4 shadow-md"
    >
      <a
        href="/wilders/1"
      >
        <img
          alt="Dave"
          class="h-16 w-16 rounded-full mr-6"
          src="avatar.png"
        />
      </a>
      <div
        class="flex justify-between w-full  min-w-[200px]"
      >
        <div
          class="flex flex-col"
        >
          <a
            href="/wilders/1"
          >
            <h3
              class="font-semibold"
            >
              Dave
            </h3>
          </a>
          <ul
            class="flex flex-wrap"
          >
            <li
              class="transition-all duration-500 flex items-center mr-4 mb-3 bg-black/5 hover:bg-black/10 p-1 pl-2 pr-2 rounded-xl cursor-pointer border hover:border-black/5 "
            >
              JS
              <div
                class="items-center flex bg-black/30 text-white rounded-[9999px] h-[25px] pr-2 pl-2 justify-center ml-2 transition-all duration-1000"
              >
                <div
                  class="transition-all duration-1000"
                >
                  5
                </div>
              </div>
            </li>
            <li
              class="transition-all duration-500 flex items-center mr-4 mb-3 bg-black/5 hover:bg-black/10 p-1 pl-2 pr-2 rounded-xl cursor-pointer border hover:border-black/5 "
            >
              PHP
              <div
                class="items-center flex bg-black/30 text-white rounded-[9999px] h-[25px] pr-2 pl-2 justify-center ml-2 transition-all duration-1000"
              >
                <div
                  class="transition-all duration-1000"
                >
                  3
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div
          class="flex flex-col min-w-[40px]"
        >
          <a
            href="/wilders/1/edit"
          >
            <button
              class="mb-2 w-full"
            >
              ✏️
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
</body>
`);
  });

  it("renders a button to delete the wilder when logged in as admin", async () => {
    render(
      <MockedProvider mocks={[adminProfileMock]} addTypename={false}>
        <Wilder
          wilder={{
            id: 1,
            name: "Dave",
            skills: [],
          }}
        ></Wilder>
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(await screen.findByText(/x/)).toBeVisible();
  });
});
