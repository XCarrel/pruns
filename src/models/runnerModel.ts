/**
 * Created by Xavier on 17.06.18.
 */

export class RunnerModel {
  public id:number
  public driverId: number
  private driverName: string
  private vehicleType: string
  private vehicleName: string


  constructor(id: number, driverId: number, driverName: string, vehicleType: string, vehicleName: string) {
    this.id = id;
    this.driverId = driverId;
    this.driverName = driverName;
    this.vehicleType = vehicleType;
    this.vehicleName = vehicleName;
  }

  public selectableBy(uid: number) {
    return (this.driverId == uid && this.vehicleType != null && this.vehicleName == null)
  }

}
