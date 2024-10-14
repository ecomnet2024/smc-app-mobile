import { gql } from "@apollo/client";

export const USER_LOGIN = gql`
mutation Mutation($email: String!, $password: String!) {
    userLogin(email: $email, password: $password) {
      message
      success
    }
  }
  `
export const CREATE_USERS = gql`
mutation Mutation($record: CreateOneUserInput!) {
    userCreateOne(record: $record) {
      error {
        ... on ValidationError {
          errors {
            message
          }
          message
        }
      }
      record {
        email
        password
      }
    }
  }
`
export const CREATE_CONSULTATION = gql`
mutation Mutation($record: CreateOneConsultationInput!) {
  consultationCreateOne(record: $record) {
    recordId
    error {
      ... on ValidationError {
        message
      }
    }
    record {
      _id
      allergies
      createdAt
      doctor
      labResults
      medications
      note
      patient
      vaccinations
    }
  }
}

`