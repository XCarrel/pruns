/**
 * Created by Xavier on 17.06.18.
 */

export class RunnerModel {
  public driverId: number
  private driverName: string
  private vehicleType: string
  private vehicleName: string


  constructor(driverId: number, driverName: string, vehicleType: string, vehicleName: string) {
    this.driverId = driverId;
    this.driverName = driverName;
    this.vehicleType = vehicleType;
    this.vehicleName = vehicleName;
  }

}
