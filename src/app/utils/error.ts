import { AxiosError } from 'axios';

export interface IApiErrorData {
  code: string;
  href: string;
  id: number;
  kind: string;
  reason: string;
}

const isServiceApiError = (error: Error): error is AxiosError<IApiErrorData> => {
  return (error as AxiosError<IApiErrorData>).response?.data.code !== undefined;
};

enum ErrorCodes {
  USER_ALREADY_HAVE_TRIAL_INSTANCE = 'SRS-MGMT-13',
  INSUFFICIENT_QUOTA = 'SRS-MGMT-14',
  INSUFFICIENT_STANDARD_QUOTA='SRS-MGMT-7',
  FAILED_TO_CHECK_QUOTA = 'SRS-MGMT-11',
}

export { isServiceApiError, ErrorCodes };
