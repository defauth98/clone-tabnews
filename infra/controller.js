import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
} from "./errors";

function onNoMatchHandler(request, response) {
  const publicMethodNotAllowedErrorObject = new MethodNotAllowedError();

  response.status(405).json(publicMethodNotAllowedErrorObject);
}

function onErrorHandler(error, request, response) {
  if (error instanceof ValidationError) {
    response.status(error.status_code).json(error);
  }

  const publicInternalErrorObject = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });

  response.status(500).json(publicInternalErrorObject);
}

const controller = {
  onErrorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
