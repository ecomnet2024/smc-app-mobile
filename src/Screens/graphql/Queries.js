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
export const GET_CONSULTATION = gql`
query consultationMany {
  consultationMany {
    patient
    complain
    medications
    dosage
    
  }
}`
;
