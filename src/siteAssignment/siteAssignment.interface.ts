
export class SiteAssignmentInterface {
  readonly siteAssignmentId: number;
  readonly siteId: number;
  readonly supervisingWorkerId: number;
  readonly createdAt: Date;
  readonly archived: boolean;
  readonly canAddWorkerFromLocationTimestamp: boolean;
}
  