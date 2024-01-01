import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { CourseSearchAbleFields } from './course.constant'
import { ICourse, ICourseFaculty } from './course.interface'
import { CourseModel, courseFacultyModel } from './course.model'
import { AppError } from '../../errors/appError'
import httpStatus from 'http-status'

const createCourseIntoDB = async (payload: ICourse) => {
  const result = await CourseModel.create(payload)
  return result
}
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await courseQuery.modelQuery
  return result
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await CourseModel.findById(id).populate(
    'preRequisiteCourses.course',
  )
  return result
};

const updateCourseIntoDB = async (id: string, payload: Partial<ICourse>) => {
  const { preRequisiteCourses, ...remainingCourseData } = payload

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    // step-1: basic course info update
    const updatedBasicCourseInfo = await CourseModel.updateOne(
      { id },
      remainingCourseData,
      {
        new: true,
        runValidators: true,
        session,
      },
    )

    if (!updatedBasicCourseInfo) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Fail to UpdateBasicCourseInfo',
      )
    }

    //check if there is any pre requisite course to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      //filter out the deleted fields
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course)
      // console.log(deletedPreRequisites)
      const deletedPreRequisitesCourses = await CourseModel.updateOne(
        { id },
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      )
      // console.log(deletedPreRequisitesCourses)

      if (!deletedPreRequisitesCourses) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Fail to deletedPreRequisitesCourses',
        )
      }

      // filter out the new course fields
      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      )
      console.log({ newPreRequisites })

      const newPreRequisitesCourses = await CourseModel.updateOne(
        { id },
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      )
      if (!newPreRequisitesCourses) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Fail to newPreRequisitesCourses',
        )
      }
    }

    await session.commitTransaction()
    await session.endSession()
    // -------
    const result = await CourseModel.findOne({ id }).populate(
      'preRequisiteCourses.course',
    )
    // return updatedBasicCourseInfo
    // return {
    //   updatedBasicCourseInfo,
    //   deletedPreRequisitesCourses,
    //   newPreRequisitesCourses
    // }
    return result
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Fail to Update Course')
  }
};

const deleteCourseIntoDB = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  )
  return result
};

const assignFacultiesWithCourseIntoDB = async(id: string, payload: Partial<ICourseFaculty>) =>{
// console.log(id, payload)
const result = await courseFacultyModel.findByIdAndUpdate(
  id,
  {
    course: id,
    $addToSet: {faculties: {$each: payload}}
  },{
    upsert: true,
    new: true
  }
)
return result
};

const removeFacultiesFromCourseFromDB = async(id: string, payload: Partial<ICourseFaculty>) =>{
  // console.log(id, payload)
  const result = await courseFacultyModel.findByIdAndUpdate(
    id,
    {
      $pull: {faculties: {$in: payload}}
    },{
      upsert: true,
      new: true
    }
  )
  return result
  };

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseIntoDB,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesFromCourseFromDB
}
