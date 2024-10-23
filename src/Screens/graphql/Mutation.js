import { gql } from "@apollo/client";

export const USER_LOGIN = gql`
mutation Mutation($email: String!, $password: String!) {
  userLogin(email: $email, password: $password) {
    message
    success
    token
    user
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
mutation consultationCreateOne ($record: CreateOneConsultationInput!) {
  consultationCreateOne(record: $record) {
    record {
      _id
      doctor
      patient
      temperature
      blood_pressure
      complain
      pulse
      medications
      dosage
      start_date
      end_date
    }
  }
}

`
export const CREATE_PRESCRIPTION = gql`
mutation Mutation($record: CreateOnePrescriptionInput!) {
  prescriptionCreateOne(record: $record) {
    record {
      Contraindications
      start_date
      medication
      end_date
      dosage
      createdAt
      _id
    }
    error {
      message
      ... on ValidationError {
        message
      }
      ... on MongoError {
        message
      }
      ... on RuntimeError {
        message
      }
    }
    recordId
  }
}
`
export const CREATE_PATIENT = gql`
mutation Mutation($record: CreateOnePatientInput!) {
  patientCreateOne(record: $record) {
    error {
      message
      ... on ValidationError {
        errors {
          message
        }
      }
    }
    record {
      _id
      name
      age
      gender
      location
      status
    }
  }
}
`