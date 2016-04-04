## hyperdrive binary search

Find files by name in a [hyperdrive](https://github.com/mafintosh/hyperdrive), using binary search.

This implementation has no dependencies, and is a tiny port of the [binary-search](https://www.npmjs.com/package/binary-search) package to work with hyperdrive archives.

### Usage

```js
var hypersearch = require('hyperdrive-binary-search')


hypersearch(archive, 'myfile.txt', (err, entry) => {
  if (err) raise err
  console.log(entry)
})
```

The second argument to the callback (here called `entry`) is a hyperdrive metadata entry, e.g.:

```json
{
  "type": "file",
  "name": "myfile.txt",
  "mode": 33188,
  "size": 5028864,
  "uid": 0,
  "gid": 0,
  "mtime": 0,
  "ctime": 0
}
```

you can download the corresponding file from the archive, e.g:

```js
hypersearch(archive, 'myfile.txt', (err, entry) => {
  if (err) raise err
  var progress = archive.download(entry)
})
```
