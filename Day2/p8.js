const http = require('http');

const server = http.createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    const data = await fetch("https://fakestoreapi.com/products");
    const jsonData = await data.json();

    const generateHTML = (products) => {
        return products.map((product, index) => {
            const isEven = index % 2 === 0;

            const containerClass = isEven ? 'even-container' : 'odd-container';
            return `
                <div class="${containerClass}">
                    <h2>${product.title}</h2>
                    <p>${product.description}</p>
                    <img src="${product.image}" height="25%" width="18%" alt="${product.title}">
                    <p>Price: $${product.price}</p>
                    <hr>
                </div>
            `;
        }).join("");
    };

    const productHTML = generateHTML(jsonData);

    const myhtml = `
        <html>
        <head>
            <title>My Product</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                }
                h1 {
                    text-align: center;
                    color: #333;
                }
                .even-container {
                    margin: 20px 0px 20px 200px;
                    padding: 10px;
                    width: 60%;
                    border: 1px solid #ccc;
                    background-color: #E6E6FA;
                    color: #333;
                    border-radius: 10px;
                    box-shadow: 2px 2px 12px rgba(0,0,0,0.2);
                }
                .odd-container {
                    margin: 20px 200px 20px 400px;
                    padding: 10px;
                    width: 60%;
                    border: 1px solid #ccc;
                    background-color: #D8BFD8;
                    color: #333;
                    border-radius: 10px;
                    box-shadow: 2px 2px 12px rgba(0,0,0,0.2);
                }
                img {
                    border-radius: 8px;
                    display: block;
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <h1>Products</h1>
            ${productHTML}
        </body>
        </html>
    `;

    res.end(myhtml);
});

server.listen(9000, (err) => {
    if (err) {
        throw err;
    }
    console.log('Server is running on port: 9000');
});
