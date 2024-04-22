export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export type Status = ResponseStatus.SUCCESS | ResponseStatus.ERROR;

export interface ResponseData<Data> {
  status: Status;
  data: Data;
  error: {
    message: string;
  };
}

export interface UserCustomClaims {
  admin: boolean;
  standard_request_count: number;
  pro_request_count: number;
}
