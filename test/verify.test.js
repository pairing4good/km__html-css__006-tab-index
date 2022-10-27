const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe("the form", () => {
  it("should tab to the age input first", async () => {
    const tabindex = await page.$$eval('form > input[id="age"]', (inputs) => {
      return inputs[0].getAttribute("tabindex");
    });
    expect(tabindex).toBe("1");
  });

  it("should tab to the name input second", async () => {
    const tabindex = await page.$$eval('form > input[id="name"]', (inputs) => {
      return inputs[0].getAttribute("tabindex");
    });
    expect(tabindex).toBe("2");
  });

  it("should tab to the city input first", async () => {
    const tabindex = await page.$$eval('form > input[id="city"]', (inputs) => {
      return inputs[0].getAttribute("tabindex");
    });
    expect(tabindex).toBe("3");
  });
});
