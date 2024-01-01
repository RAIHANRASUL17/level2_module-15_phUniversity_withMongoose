import { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { TErrorSources } from '../interface/error'
import config from '../config'
import { handleZodError } from '../errors/handleZodError'
import handleValidationError from '../errors/handleValidationError'
import handleCastError from '../errors/handleCastError'
import handleDuplicateError from '../errors/handleDuplicateError'
import { AppError } from '../errors/appError'

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  //setting default values
  let statusCode = 500
  let message = 'something wrong'

  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'something went wrong',
    },
  ]
  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (error?.name === 'ValidationError') {
    // console.log('mongoose validation Error')
    const simplifiedError = handleValidationError(error)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (error?.name === 'CastError') {
    // console.log('vai ami CastError!!!')
    const simplifiedError = handleCastError(error)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (error?.code === 11000) {
    // console.log('this is duplicate Erroor')
    const simplifiedError = handleDuplicateError(error)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode
    message = error?.message
    errorSources = [
      {
        path: '',
        message: error?.message,
      },
    ]
  } else if (error instanceof Error) {
    message = error?.message
    errorSources = [
      {
        path: '',
        message: error?.message,
      },
    ]
  }

  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? error?.stack : null,
    error,
  })
}

export default globalErrorHandler

// pattern
/*
success
message
errorSources:[{
  path:'',
  message: '',
}
]
stack
*/
