import { BeforeUpdate, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import BaseModel from "./BaseModel";
import { TABLE_NAMES } from "../constants";
import Customer from "./Customer";
import Style from "./OrderStyle";
import OrderPayments from "./OrderPayments";

export enum OrderType {
  Store = "Store",
  Online = "Online",
  Retail = "Retail",
  Customer = "Customer",
}

// export enum OrderStatus {
//   PatternKhaka = "Pattern/Khaka",
//   Beading = "Beading",
//   Stitching = "Stitching",
//   Ready_To_Delivery = "Ready To Delivery",
//   Shipped = "Shipped",
// }


export enum OrderStatus {
  PatternKhaka = "Pattern/Khaka",
  Beading = "Beading",
  Stitching = "Stitching",
  Balance_Pending = "Balance Pending",
  Ready_To_Delivery = "Ready To Delivery",
  Shipped = "Shipped",
}



export enum ShippingStatus {
  NotShipped = "Not Shipped",
  Shipped = "Shipped",
  // Move_Delivery = "Move To Delivery",
}

@Entity(TABLE_NAMES.ORDERS)
export default class Order extends BaseModel {
  @Column("varchar", { length: 225, nullable: false })
  purchaeOrderNo: string;

  @Column("varchar", { length: 225, nullable: false })
  manufacturingEmailAddress: string;

  // order Type one of thse (Store, Online, Retail)
  @Column("enum", { enum: OrderType, default: OrderType.Store })
  orderType: OrderType;

  // orderReceivedDate
  @Column("datetime", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
  orderReceivedDate: Date;

  // orderCancellationDate (this means, this is like deadline)
  @Column("datetime", { nullable: true })
  orderCancellationDate: Date;
  @Column("datetime", {
    nullable: true, // Allow NULL values
    default: () => "CURRENT_TIMESTAMP",
  })
  pattern: Date | null;

  @Column("datetime", { nullable: true })
  beading: Date;

  @Column("datetime", { nullable: true })
  stitching: Date;

  @Column("datetime", { nullable: true })
  ready_to_delivery: Date;

  // address
  @Column("text", { nullable: true })
  address: string;

  // orderStatus (Pattern/Khaka, Beading, Stitching)
  @Column("enum", { enum: OrderStatus, default: OrderStatus.PatternKhaka })
  orderStatus: OrderStatus;

  // shippingStatus (Not Shipped, Shipped)
  @Column("enum", { enum: ShippingStatus, default: ShippingStatus.NotShipped })
  shippingStatus: ShippingStatus;

  @Column("datetime", { nullable: true })
  shippingDate: Date | null;

  // @BeforeUpdate()
  // updateShippingDate() {
  //   if (this.shippingStatus === ShippingStatus.Shipped) {
  //     this.shippingDate = new Date();
  //   } else if (this.shippingStatus === ShippingStatus.NotShipped) {
  //     this.shippingDate = null;
  //   }
  // }


   @BeforeUpdate()
  updateShippingDate() {
    if (this.orderStatus === OrderStatus.Shipped) {
      this.shippingDate = new Date();
    } else if (this.orderStatus === OrderStatus.Ready_To_Delivery) {
      this.shippingDate = null;
    }
  }


  // tracking no
  @Column("varchar", { length: 225, nullable: true })
  trackingNo: string;

  @Column("int", { default: 0 })
  status: number;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  customer: Customer;

  @OneToMany(() => Style, (style) => style.order, {
    cascade: true,
  })
  styles: Style[];

  @OneToMany(() => OrderPayments, (orderPayments) => orderPayments.order, {
    cascade: true,
  })
  orderPayments: OrderPayments[];
}
