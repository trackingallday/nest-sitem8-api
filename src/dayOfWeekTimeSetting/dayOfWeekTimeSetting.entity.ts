
import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { SiteAssignment } from '../siteAssignment/siteAssignment.entity';

@Table({ tableName: 'dayofweektimesetting', modelName: 'dayofweektimesetting', underscored: true })
export class DayOfWeekTimeSetting extends Model<DayOfWeekTimeSetting> {

  @Column(DataType.INTEGER)
  dayOfWeekTimeSettingId: number;

  @ForeignKey(() => SiteAssignment)
  @Column(DataType.INTEGER)
  siteAssignmentId: number;

  @Column(DataType.INTEGER)
  dayInWeek: number;

  @Column(DataType.STRING)
  workingDayEarliestStart: string;

  @Column(DataType.STRING)
  workingDayDefaultStart: string;

  @Column(DataType.STRING)
  workingDayLatestFinish: string;

  @Column(DataType.STRING)
  workingDayDefaultFinish: string;

  @Column(DataType.STRING)
  minimumLunchStart: string;

  @Column(DataType.STRING)
  defaultLunchStart: string;

  @Column(DataType.STRING)
  defaultLunchEnd: string;

  @Column(DataType.STRING)
  maximumLunchEnd: string;

  @BelongsTo(() => SiteAssignment, 'siteAssignmentId')
  siteAssignment: SiteAssignment;

}

