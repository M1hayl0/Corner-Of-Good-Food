export class Reservation {
    restaurantName: string = ""
    restaurantAddress: string = ""
    table: any
    date: Date = new Date()
    dateStr: string = ""
    seats: number = 1
    description: string = ""
    guest: string = ""
    comment: string = ""
    rating: number = 0
    comment2: string = ""
    rating2: number = 1
    waiter: string = ""
    status: string = "" //can be waiting, accepted, rejected
    reasonForRejection: string = ""
    guestAppeared: boolean | undefined
    hours: number = 3
}
