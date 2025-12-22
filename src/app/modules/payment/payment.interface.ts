import { Types } from "mongoose";
export enum PAYMENT_STATUS {
    UNPAID = "UNPAID",
    PAID = "PAID",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED"
}
export interface IPayment {
    booking : Types.ObjectId;
    transactionId: string;
    amount : number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paymentGatewayData?: any;
    invoiceUrl?: string;
    status: PAYMENT_STATUS;
}