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
  USER_ALREADY_HAVE_TRIAL_INSTANCE = 'KAFKAS-MGMT-24',
  INSUFFICIENT_QUOTA ='SRSMGT-ERROR-7',// 'SRS-MGMT-7',
  FAILED_TO_CHECK_QUOTA = 'KAFKAS-MGMT-121',
}

export { isServiceApiError, ErrorCodes };
