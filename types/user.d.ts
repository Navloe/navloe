interface User{
  id: string,
  name: string,
  email: string,
  phoneNumber: string,
  role: string,
  emailVerified: number,
  createdAt: string,
  enterprise: {
    name: string,
    countCatalog: number,
    status: string
  }
}