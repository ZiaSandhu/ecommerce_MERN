const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './assets')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${Math.random().toString(16).substring(2)}-${file.fieldname}.${file.mimetype.split('/')[1]}`)
      // cb(null, `${Date.now()}-${file.fieldname}`)
    }
  })
  const upload = multer({ storage })

  module.exports = {upload}