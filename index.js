const fs = require('fs'); // czytanie i zapisywanie plików
const http = require('http'); // tworzenie serwera
const url = require('url'); // odczytywanie adresu url
const replaceTemplate = require('./modules/replaceTemplate'); // wlasna funkcja

const OverviewPage = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const CardComponent = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const ProductPage = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(CardComponent, el))
      .join('');
    const output = OverviewPage.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(ProductPage, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end(`
    <div style='display: grid; place-content: center; height: 100vh;'>
      <h1>Page not found!</h1>
    </div>`);
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening on port 8000');
});
