class RarityObject {
  constructor () {
    this.ancients = []
    this.legendaries = []
    this.epics = []
  }

  get ancient () {
    return (this.ancients)
  }

  set ancient (ancientData) {
    this.ancients = ancientData
  }

  get legendary () {
    return (this.legendaries)
  }

  set legendary (legendariesData) {
    this.legendaries = legendariesData
  }

  get epic () {
    return (this.epics)
  }

  set epic (epicsData) {
    this.epics = epicsData
  }
}

module.exports = {
  RarityObject
}
