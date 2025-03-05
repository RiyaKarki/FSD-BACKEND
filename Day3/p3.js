const http = require('http')
const fs=require('fs/promises')

const server=http.createServer(async (req, res) => {
    const data = await fs.readFile('./student.json')
    res.statusCode=200
    res.setHeader('Content-Type', 'text/html')
    
    const newdata = JSON.parse(data).map((item)=>{ return item})
    res.end(JSON.stringify(newdata))
})
server.listen(9000,(err) => {
    if(err)
        console.log("Err: "+err )
    console.log('Server is running at http://localhost:9000/')
})