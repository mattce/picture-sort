#!/usr/bin/env node

const http = require('http')
const fs = require('fs')
const path = require('path')
const open = require('open')

const host = 'localhost'
const port = 8000
const cwd = process.cwd()
const fileEndpoint = 'image'
let files = []

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    files = []
    let images = []
    fs.readdirSync(cwd, { encoding: 'utf8' })
      .filter((file) => {
        return file.endsWith('.png')
      })
      .forEach((file) => {
        images = [...images, file]
      })
    images.forEach((file, index) => {
      const newNormalisedName = normaliseFileName(file, index)
      const oldName = path.resolve(cwd, file)
      const newName = path.resolve(cwd, newNormalisedName)
      fs.renameSync(oldName, newName)
      files = [...files, newNormalisedName]
    })

    const data = JSON.stringify({
      imagePath: fileEndpoint,
      files: files,
    })
    res.writeHead(200)
    res.end(`
            <!doctype html>
            <html lang="de">
                <head>
                    <title>⚠️</title>
                </head>
                <body>
                    <div id="root"></div>
                    <script type="text/javascript">var data = ${data}</script>
                    <script type="text/javascript" src="/public/main.js"></script>
                </body>
            </html>
        `)
  }

  if (req.method === 'GET' && req.url === '/public/main.js') {
    fs.readFile(__dirname + req.url, (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end(`Error getting the file: ${err}.`)
      } else {
        res.setHeader('Content-type', 'text/javascript')
        res.end(data)
      }
    })
  }

  if (req.method === 'GET' && req.url.startsWith(`/${fileEndpoint}`)) {
    const pathFragments = req.url.split('/')
    const fileName = pathFragments[pathFragments.length - 1]
    fs.readFile([cwd, fileName].join('/'), (err, content) => {
      if (err) {
        res.writeHead(400, { 'Content-type': 'text/html' })
        console.log(err)
        res.end('No such image')
      } else {
        //specify the content type in the response will be an image
        res.writeHead(200, { 'Content-type': 'image/png' })
        res.end(content)
      }
    })
  }

  if (req.method === 'POST' && req.url === '/save') {
    let body = ''

    req.on('data', (data) => {
      body += data
    })

    req.on('end', () => {
      const changedFiles = JSON.parse(body)
      files.forEach((file) => {
        const newIndex = changedFiles.indexOf(file)
        const oldName = path.resolve(cwd, file)
        const newName = path.resolve(cwd, normaliseFileName(file, newIndex))
        oldName !== newName && fs.renameSync(oldName, newName)
      })
      files = changedFiles
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end()
    })
  }
})

server.listen(port, host, () => {
  open(`http://${host}:${port}`)
})

const normaliseIndex = (n) => {
  return n < 10 ? `00${n}` : n < 100 ? `0${n}` : n
}

const normaliseFileName = (name, index) => {
  const cleansedName = name.replace(/-|\s/g, '_')
  const prefixRegex = /^\d{2}(\d)__/
  const match = cleansedName.match(prefixRegex)
  if (match && match[1] === index.toString()) return name // if same index -> do nothing
  const blankName = cleansedName.replace(prefixRegex, '')
  return `${normaliseIndex(index)}__${blankName}`
}
