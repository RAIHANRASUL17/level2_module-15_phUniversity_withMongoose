/*==========-----------Solve Bug and correct st-----========*/
// year semesterCode 4digit number
import { IAcademicSemester } from '../academicSemester/academicSemester.interface'
import { UserModel } from './user.model'

// 203002 0001
const findLastStudentId = async () => {
  const lastStudent = await UserModel.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean()
  return lastStudent?.id ? lastStudent.id : undefined
}

//generated auto userData id(year, semesterCode, 4 digit number)
export const generatedStudentId = async (payLoad: IAcademicSemester) => {
  // first time => 0000
  // 0001 => 1

  // console.log(await lastStudentId())

  let currentId = (0).toString() //0000 default
  // 2030 01 0001
  const lastStudentId = await findLastStudentId()

  const lastStudentSemesterCode = lastStudentId?.substring(4, 6) //01
  const lastStudentYear = lastStudentId?.substring(0, 4) //2030
  const currentSemesterCode = payLoad.code
  const currentYear = payLoad.year
  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    currentId = lastStudentId.substring(6) // 0001
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')
  incrementId = `${payLoad.year}${payLoad.code}${incrementId}`
  return incrementId
}
/*==========-----------Solve Bug and correct st-----========*/
// Faculty ID
export const findLastFacultyId = async () => {
  const lastFaculty = await UserModel.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean()

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined
}

export const generateFacultyId = async () => {
  let currentId = (0).toString()
  const lastFacultyId = await findLastFacultyId()

  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2)
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')

  incrementId = `F-${incrementId}`

  return incrementId
}

// Admin ID
export const findLastAdminId = async () => {
  const lastAdmin = await UserModel.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean()

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined
}

export const generateAdminId = async () => {
  let currentId = (0).toString()
  const lastAdminId = await findLastAdminId()

  if (lastAdminId) {
    currentId = lastAdminId.substring(2)
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')

  incrementId = `A-${incrementId}`
  return incrementId
}
