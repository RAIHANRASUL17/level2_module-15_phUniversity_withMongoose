// modal
import { Schema, model } from 'mongoose'
import { ICourse, ICourseFaculty, TPreRequisiteCourses } from './course.interface'

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
    // timestamps: true
  },
)

// main Schema
const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    prefix: {
      type: String,
      trim: true,
      required: true,
    },
    code: {
      type: Number,
      trim: true,
      required: true,
    },
    credits: {
      type: Number,
      trim: true,
      required: true,
    },
    preRequisiteCourses: [preRequisiteCoursesSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export const CourseModel = model<ICourse>('Course', courseSchema);

// main Schema
const courseFacultySchema = new Schema<ICourseFaculty>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      unique: true
    },
    faculties: [{
      type: Schema.Types.ObjectId,
      ref: 'Faculty'
    }]
  }
)

export const courseFacultyModel = model<ICourseFaculty>('CourseFaculty', courseFacultySchema);