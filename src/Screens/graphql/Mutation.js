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
      medical_staff
      patient{
        name
        _id
      }
      temperature
      blood_pressure
      complain
      pulse
      status
      createdAt
      photo_material
    }
    recordId
  }
}

`
export const CREATE_PRESCRIPTION = gql`
mutation  prescriptionCreateOne($record: CreateOnePrescriptionInput!) {
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
mutation patientCreateOne($record: CreateOnePatientInput!) {
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
      email
      gender
      clinic{
        _id
        name
      }
      status
      phone
    }
    recordId
  }
}
`
export const REMOVE_CONSULTATION = gql`
mutation ConsultationRemoveById($id: MongoID!) {
  consultationRemoveById(_id: $id) {
    recordId
    error {
      message
      ... on ValidationError {
        message
      }
      ... on MongoError {
        message
      }
    }
  }
}
`
export const UPDATE_CONSULTATION = gql`
mutation ConsultationUpdateById($id: MongoID!, $record: UpdateByIdConsultationInput!) {
  consultationUpdateById(_id: $id, record: $record) {
    recordId
    error {
      message
      ... on ValidationError {
        message
      }
    }
    record {
      medical_staff
      call_center_feedback
      doctor_feedback
      patient {
        name
        age
        gender
        clinic {
          name
          region
          city
          street_location
          phoneNumber
          email
          website
          _id
          createdAt
          updatedAt
        }
        phone
        status
        email
        insurance_number
        _id
        createdAt
        updatedAt
      }
      temperature
      complain
      Contraindications
      pulse
      blood_pressure
      status
      surgical_history
      emergency
      pregnancy
      lastEditBy
      closedBy
      photo_material
      labResults
      vaccinations
      allergies
      visits
      medications
      prescriptions
      _id
      createdAt
      updatedAt
      allergy {
        _id
      }
      prescription {
        _id
      }
      medication {
        _id
      }
      vaccination {
        vaccine
        patient
        medical_staff
        nurse
        date
        _id
        createdAt
        updatedAt
      }
      visit {
        patient
        nurse
        visit_date
        symptoms
        diagnosis
        treatment
        notes
        _id
        createdAt
        updatedAt
      }
    }
  }
}
`