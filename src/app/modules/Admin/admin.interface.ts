/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose'

export type TGender = 'male' | 'female' | 'other'
export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-'

export type TUserName = {
  firstName: string
  middleName: string
  lastName: string
}
// main
export type IAdmin = {
  id: string
  user: Types.ObjectId
  designation: string
  name: TUserName
  gender: TGender
  dateOfBirth?: Date
  email: string
  contactNo: string
  emergencyContactNo: string
  bloogGroup?: TBloodGroup
  presentAddress: string
  permanentAddress: string
  profileImg?: string
  isDeleted: boolean
}

export interface IAdminModel extends Model<IAdmin> {
  isUserExists(id: string): Promise<IAdmin | null>
}
