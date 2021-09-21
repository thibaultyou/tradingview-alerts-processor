const p2s = require('postman-to-swagger')
const yaml = require('js-yaml')
const fs = require('fs')
const postmanJson = require('./collection.json')
const swaggerJson = p2s(postmanJson, {
  target_spec: "openapi3.0",
})

let output = JSON.stringify(swaggerJson, null, 2)
// let output = yaml.dump(swaggerJson)

// Save to file
fs.writeFileSync(
  './docs/api/swagger.yaml',
  output,
  'utf8'
)