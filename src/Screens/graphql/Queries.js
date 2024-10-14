import { gql } from "@apollo/client";

export const GET_USERS = gql`

query Query {
    userMany {
      _id
      address
      country
      createdAt
    }
  }
  

`
;
