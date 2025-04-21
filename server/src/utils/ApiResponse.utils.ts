export class ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  constructor(success = true, message = "Operation successful", data: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
