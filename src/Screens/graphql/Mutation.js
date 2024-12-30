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
      medical_staff {
        _id
      }
      patient {
        _id
      }
      temperature
      blood_pressure
      complain
      surgical_history
      pulse
      status
      createdAt
      photo_material
    }
    error {
      message
      ... on ValidationError {
        errors {
          message
        }
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
      clinic
      status
      phone
      sn
    }
    recordId
  }
}
`
export const REMOVE_CONSULTATION = gql`
mutation ConsultationRemoveById($id: MongoID!) {
  consultationRemoveById(_id: $id) {
    recordId
  }
}
`
export const REMOVE_MEDICATION = gql`
mutation MedicationRemoveById($id: MongoID!) {
  medicationRemoveById(_id: $id) {
    recordId
    error {
      message
    }
  }
}`
export const REMOVE_ALLERGY = gql`
mutation AllergyRemoveById($id: MongoID!) {
  allergyRemoveById(_id: $id) {
    recordId
    error {
      message
    }
  }
}`
export const REMOVE_PRESCRIPTION = gql`
mutation PrescriptionRemoveById($id: MongoID!) {
  prescriptionRemoveById(_id: $id) {
    recordId
    error {
      message
    }
  }
}`
//-------------------------------------------------------------------------------------------------------------------
export const CREATE_VACCINATION = gql`
mutation VaccinationCreateOne($record: CreateOneVaccinationInput!) {
  vaccinationCreateOne(record: $record) {
    record {
      _id
      vaccine
      date
      patient
      consultation
      createdBy
      medical_staff
    }
    recordId
    error {
      message
      ... on ValidationError {
        message
      }
    }
  }
}`

export const CREATE_ALLERGY = gql`
mutation AllergyCreateOne($record: CreateOneAllergyInput!) {
  allergyCreateOne(record: $record) {
    record {
      _id
      patient
      consultation
      createdBy
      medical_staff
      substance
      description
      createdAt
    }
    error {
      message
      ... on ValidationError {
        message
      }
    }
    recordId
  }
}`

export const CREATE_MEDICATION = gql`
mutation MedicationCreateOne($record: CreateOneMedicationInput!) {
  medicationCreateOne(record: $record) {
    record {
      _id
      consultation
      description
      dosage
      start_date
      end_date
      patient
      name
      createdAt
      createdBy
    }
    recordId
    error {
      message
      ... on ValidationError {
        message
      }
    }
  }
}`
export const ADD_FEEDBACK = gql`
mutation ConsultationUpdateById($id: MongoID!, $record: UpdateByIdConsultationInput!) {
  consultationUpdateById(_id: $id, record: $record) {
    record {
      doctor_feedback {
        comment
        createdAt
        user{
          _id
        }
      }
    }
    recordId
    error {
      message
      ... on ValidationError {
        message
      }
    }
  }
}`

export const USER_UPDATE_PICTURE = gql`
mutation UserUpdateById($id: MongoID!, $record: UpdateByIdUserInput!) {
  userUpdateById(_id: $id, record: $record) {
    record {
      image
    }
    recordId
    error {
      message
      ... on ValidationError {
        message
      }
    }
  }
}`
export const CREATE_PRESCRIPTION = gql`
mutation PrescriptionCreateOne($record: CreateOnePrescriptionInput!) {
  prescriptionCreateOne(record: $record) {
    record {
      _id
      consultation
      contraindications
      medication
      start_date
      end_date
      patient
      createdBy
      createdAt
    }
    recordId
    error {
      message
      ... on ValidationError {
        message
      }
    }
  }
}`