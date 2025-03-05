const http = require('http');
const fs = require('fs/promises');

const server = http.createServer(async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    try {
        const data = await fs.readFile('./student.json', 'utf-8');
        let students = JSON.parse(data);

        // Get all students
        if (req.method === 'GET' && req.url === '/students') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(students));
        }
        
        // Add a new student
        else if (req.method === 'POST' && req.url === '/students') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                const newStudent = JSON.parse(body);
                students.push(newStudent);
                await fs.writeFile('./student.json', JSON.stringify(students, null, 2));
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(newStudent));
            });
        }
        
        // Update an existing student by roll number
        else if (req.method === 'PUT' && req.url.startsWith('/students/')) {
            const rollno = parseInt(req.url.split('/')[2]);
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                const updatedStudent = JSON.parse(body);
                const index = students.findIndex(s => s.rollno === rollno);
                if (index !== -1) {
                    students[index] = updatedStudent;
                    await fs.writeFile('./student.json', JSON.stringify(students, null, 2));
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(updatedStudent));
                } else {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ error: "Student not found" }));
                }
            });
        }
        
        // Delete a student by roll number
        else if (req.method === 'DELETE' && req.url.startsWith('/students/')) {
            const rollno = parseInt(req.url.split('/')[2]);
            const newStudents = students.filter(s => s.rollno !== rollno);
            await fs.writeFile('./student.json', JSON.stringify(newStudents, null, 2));
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "Student deleted" }));
        }
        
        // Handle unknown routes
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Route not found' }));
        }
    } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error', message: error.message }));
    }
});

server.listen(9000, (err) => {
    if (err) {
        console.error("Error: " + err);
    } else {
        console.log('Server is running at http://localhost:9000/');
    }
});
