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
export const GET_ROLES = gql`
query RoleMany {
  roleMany {
    _id
    name
    description
  }
}`

export const GET_CONSULTATION = gql`
query consultationMany {
  consultationMany {
    patient{
      _id
      name
      createdAt
      age
      gender
      sn
      
    }
    _id
    complain
    medications
    temperature
      blood_pressure
      pulse
      status
      createdAt
      photo_material
    
  }
}`

export const GET_CONSULTATION_MENU = gql`
query consultationMany ($limit: Int!){
  consultationMany(limit: $limit) {
    patient{
      _id
      name
      createdAt
      age
      gender
      sn
      
    }
    _id
    complain
    medications
    temperature
      blood_pressure
      medical_history
      surgical_history
      pulse
      status
      createdAt
      photo_material
    
  }
}`

export const GET_CONSULTATION_BY_PATIENT = gql`
query GET_CONSULTATIONS_BY_PATIENT($patientId: MongoID!) {
  consultationMany(filter: { patient: $patientId  }) {
    _id
    complain
    medications
    temperature
    blood_pressure
    medical_history
    surgical_history
    pulse
    status
    photo_material
    createdAt
    patient{
      _id
      name
      createdAt
      age
      gender
      sn
      
    }
  }
}
`
export const GET_CLINIC = gql`
query ClinicMany {
  clinicMany {
    _id
    city
    name
    phoneNumber
    region
    street_location
  }
}
 `
  export const GET_PATIENT = gql`
  query PatientMany {
    patientMany {
      _id
      name
      age
      gender
      status
      sn
    }
  }
`
export const GET_VACCINATION = gql`
query VaccinationMany($filter: FilterFindManyVaccinationInput) {
  vaccinationMany(filter: $filter) {
    date
    vaccine
    createdAt
  }
}`

export const GET_LAB_RESULT = gql`
query LabResultMany($filter: FilterFindManyLabResultInput) {
  labResultMany(filter: $filter) {
    date
    result
  }
}`

export const GET_ALLERGY = gql`
query AllergyMany($filter: FilterFindManyAllergyInput) {
  allergyMany(filter: $filter) {
    _id
    createdAt
    description
    substance
  }
}`

export const GET_MEDICATION = gql`
query MedicationMany($filter: FilterFindManyMedicationInput) {
  medicationMany(filter: $filter) {
    _id
    createdAt
    description
    dosage
    end_date
    start_date
    name
  }
}
`;

export const GET_FEDDBACK = gql`
query Doctor_feedback($id: MongoID!) {
  consultationById(_id: $id) {
    doctor_feedback {
      user {
        _id
        first_name
        image
      }
      comment
      createdAt
    }
    call_center_feedback {
      comment
      createdAt
      user {
        _id
      first_name
      image
      }
    }
    _id
  }
}`

export const GET_PRESCRIPTION = gql`
query PrescriptionMany($filter: FilterFindManyPrescriptionInput) {
  prescriptionMany(filter: $filter) {
    _id
    contraindications
    dosage
    start_date
    end_date
    medication
    dosage
    
  }
}`
export const GET_USER = gql`
query UserById($id: MongoID!) {
  userById(_id: $id) {
    image
  }
}`
export const GET_EMERGENCY = gql`
query EmergencyMany($filter: FilterFindManyEmergencyInput) {
  emergencyMany(filter: $filter) {
    _id
    complain
    createdAt
    createdBy {
      _id
    }
    name
  }
}`
;
