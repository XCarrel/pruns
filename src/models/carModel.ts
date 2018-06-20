/**
 * Created by Xavier on 19.06.18.
 */
export class CarModel {
  public id: number
  public name: string
  public type: string


  constructor(id: number, name: string, type: string) {
    this.id = id;
    this.name = name;
    this.type = type;
  }
}
