import { Dish } from "./dish"
import { WorkingTime } from "./workingTime"

export class Restaurant {
    name: string = ""
    address: string = ""
    type: string = ""
    waiters: string[] = []
    waitersNamesString: string = ""
    phone: string = ""
    averageRating: number = 0.0
    numOfRatings: number = 0
    comments: string[] = []
    map: string = ""
    canvas: any[] = []
    workingTime: WorkingTime[] = []
    menu: Dish[] = []
    description: string = ""
}
  