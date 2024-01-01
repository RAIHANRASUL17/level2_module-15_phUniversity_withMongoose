/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from './../../errors/appError'
import mongoose from 'mongoose'
import config from '../../config'
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model'
import { Student } from '../student/student.interface'
import { StudentModel } from '../student/student.model'
import { IUser } from './user.interface'
import { UserModel } from './user.model'
import {
  generateAdminId,
  generateFacultyId,
  generatedStudentId,
} from './user.utils'
import httpStatus from 'http-status'
import { FacultyModel } from '../Faculty/faculty.model'
import { IFaculty } from '../Faculty/faculty.interface'
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model'
import { AdminModel } from '../Admin/admin.model'

const createStudentIntoDB = async (password: string, payLoad: Student) => {
  const userData: Partial<IUser> = {}

  // if password given, use default password
  userData.password = password || (config.default_pass as string)

  //set student role
  userData.role = 'student'

  // find academic semester info
  const admissionSemester = await AcademicSemesterModel.findById(
    payLoad.admissionSemester,
  )

  // Isolated environment
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    if (!admissionSemester) {
      throw new AppError(httpStatus.BAD_REQUEST, 'dfjdjdkdk')
    }
    //auto generate userData id
    userData.id = await generatedStudentId(admissionSemester)

    //create a user(transaction-1)
    const result = await UserModel.create([userData], { session }) //array

    //  create a student
    if (!result.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'fail to create user')
    }
    // set id, _id as user
    payLoad.id = result[0].id //embedding id
    payLoad.user = result[0]._id //reference _id

    // create a new student(transaction-2)
    const newStudent = await StudentModel.create([payLoad], { session })
    if (!newStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to create new student')
    }

    await session.commitTransaction()
    await session.endSession()
    return newStudent
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error('create a new user/student')
  }
}

const createFacultyIntoDB = async (password: string, payload: IFaculty) => {
  // create a user object
  const userData: Partial<IUser> = {}

  //if password is not given , use default password
  userData.password = password || (config.default_pass as string)

  //set student role
  userData.role = 'faculty'

  // find academic department info
  const academicDepartment = await AcademicDepartmentModel.findById(
    payload.academicDepartment,
  )

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found')
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    //set  generated id
    userData.id = await generateFacultyId()

    // create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session }) // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }
    // set id , _id as user
    payload.id = newUser[0].id
    payload.user = newUser[0]._id //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await FacultyModel.create([payload], { session })

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty')
    }

    await session.commitTransaction()
    await session.endSession()

    return newFaculty
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

const createAdminIntoDB = async (password: string, payload: IFaculty) => {
  // create a user object
  const userData: Partial<IUser> = {}

  //if password is not given , use deafult password
  userData.password = password || (config.default_pass as string)

  //set student role
  userData.role = 'admin'

  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    //set  generated id
    userData.id = await generateAdminId()

    // create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session })

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin')
    }
    // set id , _id as user
    payload.id = newUser[0].id
    payload.user = newUser[0]._id //reference _id

    // create a admin (transaction-2)
    const newAdmin = await AdminModel.create([payload], { session })

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin')
    }

    await session.commitTransaction()
    await session.endSession()

    return newAdmin
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
    // throw err
  }
}

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
}
