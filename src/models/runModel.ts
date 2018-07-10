import {RunnerModel} from "./runnerModel";
import {WaypointModel} from "./waypointModel";
/**
 * Created by Xavier on 17.06.18.
 */

export class RunModel {

  public id: number
  private title: string
  private pax: number
  public status: string
  private planned_at: string // begin_at field
  private started_at: string // start_at field
  private ended_at: string // end_at field
  private runners: RunnerModel[]
  private waypoints: WaypointModel[]

  constructor(id: number, title: string, pax: number, status: string, planned_at: string, started_at: string, ended_at: string) {
    this.id = id
    this.title = title
    this.pax = pax
    this.status = status
    this.planned_at = planned_at
    this.started_at = started_at
    this.ended_at = ended_at
    this.runners = []
    this.waypoints = []
  }

  addRunner(r: RunnerModel) {
    this.runners.push(r)
  }

  addWaypoint(w: WaypointModel) {
    this.waypoints.push(w)
  }

  belongsTo (uid:number) {
    let res: boolean = false
    this.runners.forEach(runner => {
      if (runner.driverId == uid) {
        res = true
      }
    })
    return res
  }

}
