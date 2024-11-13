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
    patient{
      _id
      name
      createdAt
      age
    }
    _id
    complain
    medications
    temperature
      blood_pressure
      pulse
      status
    
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
    pulse
    patient{
      _id
      name
      createdAt
      age
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
;
