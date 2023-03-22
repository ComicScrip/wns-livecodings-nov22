// import { gql } from "@apollo/client/core";
// import Wilder from "../../server/src/entity/Wilder";
// import client from "./apolloClient";
// import db from "../../server/src/db";

/*
const createWilderMutation = gql`
  mutation CreateWilder($data: WilderInput!) {
    createWilder(data: $data) {
      id
      name
    }
  }
`;

const readWildersQuery = gql`
  query Wilders {
    wilders {
      id
      name
    }
  }
`;
*/

describe("Wilder resolver", () => {
  describe("create wilder", () => {
    xit("should create a wilder given valid attributes", async () => {});

    xit("should not create wilder given invalid attributes and return an error", async () => {});
  });

  describe("read wilders", () => {
    xit("should return an array", async () => {});
  });
});
