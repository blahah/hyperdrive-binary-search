// this file originated as a clone of the hyperdrive tests:
// https://github.com/mafintosh/hyperdrive/blob/master/test/selection.js

var tape = require('tape')
var memdb = require('memdb')
var os = require('os')
var path = require('path')
var fs = require('fs')
var hyperdrive = require('hyperdrive')
var glob = require('glob')
var search = require('../')

tape('search for a file', function (t) {
  var drive = hyperdrive(memdb())
  var driveClone = hyperdrive(memdb())

  var archive = drive.add('.')

  function searchAll(files) {
    archive.finalize(function (err) {
      if (err) throw err

      var tmp = path.join(os.tmpdir(), 'hyperdrive-binary-search-' +
        process.pid + '-' + Date.now())

      var clone = driveClone.get(archive.id, tmp)

      clone.ready(function (err) {
        if (err) throw err

        // real files should be correctly found
        files.forEach((file) => {
          search(clone, file, (err, entry) => {

            t.error(err, 'no error')
            t.same(entry.name, file)

          })

        })

        // non-existent files shouldn't be found
        notfiles = ['nonsense.12345', 'i.do.not.exist']
        notfiles.forEach((file) => {
          search(clone, file, (err, entry) => {

            t.error(err, 'no error')
            t.same(entry, null)

          })

        })

      })
    })
  }

  glob('*.*', (err, files) => {

    if (err) throw err

    ndone = 0

    files.forEach((file) => {
      archive.appendFile(file, function (err) {

        if (err) throw err

        ndone += 1

        if (ndone == files.length) searchAll(files)

      })
    })

    console.log(files)
  })

  var p1 = drive.createPeerStream()
  var p2 = driveClone.createPeerStream()

  p1.pipe(p2).pipe(p1)

})
