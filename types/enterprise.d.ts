interface Enterprise {
value: any
  id?: string,
  nib?: string,
  userId?: string,
  name?: string,
  uid?: string,
  categories?: string | "",
  keywords?: string,
  description?: string,
  shortDescription?: string,
  logoUrl?: string,
  storeUrl?: string,
  status?: string,
  type?: string,
  inactiveReason?: string,
  updatedAt?: string,
  createdAt?: string,
  user?: {
    id: string,
    name: string,
    email: string,
    phoneNumber: string
  }
}