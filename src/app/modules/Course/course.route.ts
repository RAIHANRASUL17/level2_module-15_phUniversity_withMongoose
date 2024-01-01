import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import {
  assignFacultiesWithCourseValidationSchema,
  createCourseValidationSchema,
  updateCourseValidationSchema,
} from './course.validation'
import { CourseControllers } from './course.controller'

const router = express.Router()

router.post(
  '/create-course',
  validateRequest(createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get('/:id', CourseControllers.getSingleCourse);

router.patch(
  '/:facultyId',
  validateRequest(updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.delete('/:id', CourseControllers.deleteCourse);

router.put('/:courseId/assign-faculties',
validateRequest(assignFacultiesWithCourseValidationSchema),
CourseControllers.assignFacultiesWithCourse);

router.delete('/:courseId/remove-faculties',
validateRequest(assignFacultiesWithCourseValidationSchema),
CourseControllers.removeFacultiesFromCourse);

router.get('/', CourseControllers.getAllCourses);

export const CourseRoutes = router
