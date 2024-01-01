// import express, { NextFunction, Request, Response } from 'express'
// import { AnyZodObject } from 'zod'
import express from 'express'
import { UserControllers } from './user.controller'
import { createStudentZodValidationSchema } from '../student/student.zod.validation'
import validateRequest from '../../middlewares/validateRequest'
import { createFacultyValidationSchema } from '../Faculty/faculty.validation'
import { createAdminValidationSchema } from '../Admin/admin.validation'

const router = express.Router()

// const validateRequest = (schema: AnyZodObject) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // console.log(`I am army and searching ${name}`)
//       // validation
//       await schema.parseAsync({
//         body: req.body,
//       })
//       next()
//     } catch (error) {
//       next(error)
//     }
//   }
// };

router.post(
  '/create-student',
  validateRequest(createStudentZodValidationSchema),
  UserControllers.createStudent,
)

router.post(
  '/create-faculty',
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty,
)

router.post(
  '/create-admin',
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
)

export const UserRoutes = router
