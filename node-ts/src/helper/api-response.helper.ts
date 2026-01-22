interface ApiResponse<T> {
  statusCode: number;
  data: T | undefined;
  message: string;
}

class ApiResponse<T> {
  public statusCode: number;
  public data: T | undefined;
  public message: string;

  constructor(statusCode: number, data: T | undefined, message: string) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}

function createApiResponse<T>(data: T | undefined, message: string): ApiResponse<T> {
  return new ApiResponse(200, data, message);
}

export { ApiResponse, createApiResponse };
