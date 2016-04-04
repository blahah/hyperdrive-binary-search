// binary search for an entry by filename
// in a hyperdrive archive
module.exports = function(archive, filename, cb) {

  var low = 0
  var high = archive.entries - 1

  var bisect = function() {

    // Note that "(low + high) >>> 1" may overflow, and results in a
    // typecast to double (which gives the wrong results).
    var mid = low + (high - low >> 1)
    archive.entry(mid, function(err, midentry) {

      if (err) cb(err)

      // Too low.
      if (filename > midentry.name) {
        low = mid + 1
        bisect()
      }

      // Too high.
      else if (filename < midentry.name) {
        high = mid - 1
        bisect()
      }

      // File found!
      else if (filename === midentry.name){
        cb(null, midentry)
      }

      // File not found :(
      else {
        cb()
      }

    })

  }

  bisect(low, high)

}
