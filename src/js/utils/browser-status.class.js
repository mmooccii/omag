import _ from "lodash"
import { detect } from "detect-browser"

class browserStatus {
  constructor(stats) {
    this.browser = detect()
    this.stats = stats
  }
  get() {
    return this.stats
  }
  set(stats) {
    this.stats = _.assign(this.stats, stats)
  }
}

const _browserStatus = new browserStatus({})

export default _browserStatus
