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
