export interface Profile {
    id?: string;
    uuid: string;
    status: boolean;
    createAt?: Date;
    createdBy?:string
    userName:string,
    isPremium?:boolean,
    datePremiumUser:Date,
    username?:string,
  }
