export class User {
  username: string = "" //for all users
  password: string = "" //for all users
  firstName: string = "" //for all users
  lastName: string = "" //for all users
  type: string = ""  //for all users //guest/waiter/admin

  securityQuestion: string = "" //for guest and waiter
  securityAnswer: string = "" //for guest and waiter
  gender: string = "M"  //for guest and waiter //M/F
  address: string = "" //for guest and waiter
  phone: string = "" //for guest and waiter
  email: string = "" //for guest and waiter
  profileImageName: string = "" //for guest and waiter
  creditCard: string = "" //for guest and waiter
  status: string = "" //for all users
  didntAppearTimes: number = 0 //for guest
  restaurantName: string = "" //for waiter
  restaurantAddress: string = "" //for waiter
}
