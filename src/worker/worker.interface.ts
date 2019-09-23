
export class WorkerInterface {
  readonly workerId: number;
  readonly name: string;
  readonly mobile: string;
  readonly email: string;
  readonly payrollId: string;
  readonly supervisor: number;
  readonly mobileNotifications: boolean;
  readonly emailNotifications: boolean;
  readonly isEnabled: boolean;
  readonly isWorker: boolean;
  readonly isSupervisor: boolean;
  readonly isAdministrator: boolean;
  readonly deviceID: string;
  readonly companyId: number;
  readonly authId: string;
  readonly base64Image: string;
  readonly isSuperAdministrator: boolean;
}
  