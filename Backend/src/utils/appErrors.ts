// | Error               | HTTP Code | Use case                                                     |
// | ------------------- | --------- | ------------------------------------------------------------ |
// | **BadRequestError** | 400       | Validation failure, missing fields, invalid payload          |
// | **ForbiddenError**  | 403       | User is authenticated but not allowed                        |
// | **NotFoundError**   | 404       | Resource doesn’t exist                                       |
// | **ConflictError**   | 409       | Duplicate email, unique constraint violation, state conflict |

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

/* 400 – Client sent invalid data */
export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

/* 403 – Authenticated but not allowed */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

/* 404 – Resource not found */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/* 409 – Resource conflict (duplicate, constraint violation) */
export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}



