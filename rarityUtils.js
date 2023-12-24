class RarityObject {
  /*
  RarityObject class, stores an instance of this object to ensure the correct data is
  being sorted inside the correct scope.

  has 3 get and set methods for each rarity needed, for ease of testing
  and calling the correct rarity for statistic calculation.
  */
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
