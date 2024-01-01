import { Types } from 'mongoose'

export type TPreRequisiteCourses = {
  course: Types.ObjectId
  isDeleted: boolean
}

export type ICourse = {
  title: string
  prefix: string
  code: number
  credits: number
  isDeleted?: boolean
  preRequisiteCourses: [TPreRequisiteCourses]
};

// assign Faculties interface
export type ICourseFaculty = {
  course: Types.ObjectId
  faculties: [Types.ObjectId]
}
