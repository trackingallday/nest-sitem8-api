
export class LocationTimestampInterface {
  readonly deviceId: string;
  readonly workerId: number;
  readonly creationDateTime: Date;
  readonly latitude: number;
  readonly longitude: number;
  readonly battery: number;
  readonly closestSiteId: number;
  readonly closestSiteDistance: number;
  readonly locationDateTime: Date;
  readonly rawData: string;
  readonly charging: boolean;
  readonly sosButton: boolean;
  readonly altitude: number;
  readonly companyId: number;
  readonly geom: any;
}
