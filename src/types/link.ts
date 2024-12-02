export interface Link {
    id?:string,
    url:string,
    name:string,
    icon:string,
    urlImage:string,
    active: boolean;
    createdAt?: FirebaseFirestore.Timestamp;
}
