import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Item extends Model<Item> {
  @Column(DataType.GEOMETRY('POINT'))
  geometry: any;

  @Column(DataType.TEXT)
  name: string;

  @Column(DataType.INTEGER)
  price: number;

  companyId: number;

}
