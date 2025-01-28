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
mutation UserCreateOneMob($record: CreateOneUserInput!) {
  userCreateOneMob(record: $record) {
    record {
      _id
      address
      country
      email
      first_name
      gender
      last_name
      password
      phone
      clinic{
        _id
      }
      role {
        _id
        name
      }
    }
    error {
      message
      ... on ValidationError {
        message
      }
      ... on MongoError {
        message
      }
    }
    recordId
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
      medical_history
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
    error {
      message
      ... on ValidationError {
        errors {
          message
        }
      }
    }
  }
}
`
//-------------------------------------------------------------------------------------------------------------------

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
export const REMOVE_LAB_RESULT = gql`
mutation LabResultRemoveById($id: MongoID!) {
  labResultRemoveById(_id: $id) {
    recordId
    error {
      message
    }
  }
}`
export const REMOVE_VACCINATION = gql`
mutation VaccinationRemoveById($id: MongoID!) {
  vaccinationRemoveById(_id: $id) {
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
export const CONSULTATION_UPDATE = gql`
mutation ConsultationUpdateById($id: MongoID!, $record: UpdateByIdConsultationInput!) {
  consultationUpdateById(_id: $id, record: $record) {
    recordId
    record {
      blood_pressure
      complain
      emergency
      medical_history
      lastEditBy
      updatedAt
      pulse
      surgical_history
      temperature
    }
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
      dosage
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

export const CREATE_LAB_RESULT = gql`
mutation LabResultCreateOne($record: CreateOneLabResultInput!) {
  labResultCreateOne(record: $record) {
    record {
      _id
      consultation
      createdBy
      date
      medical_staff
      patient
      result
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
export const UPDATE_STATUS_PATIENT = gql`
mutation PatientUpdateById($id: MongoID!, $record: UpdateByIdPatientInput!) {
  patientUpdateById(_id: $id, record: $record) {
    record {
      status
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
export const CREATE_EMERGENCY = gql`
mutation EmergencyCreateOne($record: CreateOneEmergencyInput!) {
  emergencyCreateOne(record: $record) {
    record {
      _id
      blood_pressure
      complain
      patient
      pulse
      status
      temperature
      createdBy {
        _id
      }
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
;