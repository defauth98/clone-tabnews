import {
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  ValidationError,
} from "./errors";

function onNoMatchHandler(request, response) {
  const publicMethodNotAllowedErrorObject = new MethodNotAllowedError();

  response.status(405).json(publicMethodNotAllowedErrorObject);
}

function onErrorHandler(error, request, response) {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return response.status(error.statusCode).json(error);
  }

  const publicInternalErrorObject = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });

  return response.status(500).json(publicInternalErrorObject);
}

const controller = {
  onErrorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
