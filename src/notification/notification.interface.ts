
export class NotificationInterface {
  readonly notificationID: number;
  readonly workerId: number;
  readonly creationDateTime: Date;
  readonly smsSentDateTime: Date;
  readonly emailSentDateTime: Date;
  readonly category: string;
  readonly description: string;
  readonly smsStatus: number;
  readonly emailStatus: number;
  readonly mobileNumber: string;
  readonly emailAddress: string;
}
  