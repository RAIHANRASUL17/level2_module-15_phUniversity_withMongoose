import express from 'express'
import { StudentControllers } from './student.controller'
import validateRequest from '../../middlewares/validateRequest'
import { updateStudentValidationSchema } from './student.zod.validation'

const router = express.Router()

// get all student
router.get('/', StudentControllers.getAllStudent)
// get single student
router.get('/:id', StudentControllers.getSingleStudent)
// update
router.patch(
  '/:id',
  validateRequest(updateStudentValidationSchema),
  StudentControllers.updateStudent,
)
// delete student
router.delete('/:studentId', StudentControllers.deleteStudent)

export const StudentRoutes = router
