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

describe('form', () => {
  it('should contain two radio buttons', async () => {
    let radioButtons = await page.$$('form > input[type="radio"]');
    expect(radioButtons.length).toBe(2);
  });
  
  it('should contain three checkboxes', async () => {
    let checkboxes = await page.$$('form > input[type="checkbox"]');
    expect(checkboxes.length).toBe(3);
  });
  
  it('should contain one text input', async () => {
    let textBoxes = await page.$$('form > input[type="text"]');
    expect(textBoxes.length).toBe(1);
  });
  
  it('should contain one submit button', async () => {
    let submitButtons = await page.$$('form > button[type="submit"]');
    expect(submitButtons.length).toBe(1);
  });
});

describe('radio buttons', () => {
  
  it('should have matching labels', async () => {
    const ids = await page.$$eval(`form > input[type="radio"]`, (radioButtons) => {
      let ids = [];
      for(let i = 0; i < radioButtons.length; i++){
        let radioButton = radioButtons[i];
        const id = radioButton.getAttribute("id");
        ids.push(id);
      }
      return ids;
    });

    expect(ids.length).toBe(2);

    for(let i = 0; i < ids.length; i++){
      const labels = await page.$$(`form > label[for='${ids[i]}']`);
      expect(labels.length).toBe(1);
    }
  });

  it('should have at least one selected by default', async () => {
    const selected = await page.$$eval(`form > input[type="radio"]`, (radioButtons) => {
      let selected = 0;
      for(let i = 0; i < radioButtons.length; i++){
        let radioButton = radioButtons[i];
        
        if(radioButton.hasAttribute("checked")) selected++;
      }
      return selected;
    });
    
    expect(selected).toBeGreaterThan(0);
  });
});

describe('checkboxes', () => {  
  it('should have matching labels', async () => {
    const ids = await page.$$eval('form > input[type="checkbox"]', (checkboxes) => {
      let ids = [];
      for(let i = 0; i < checkboxes.length; i++){
        let checkbox = checkboxes[i];
        const id = checkbox.getAttribute("id");
        ids.push(id);
      }
      return ids;
    });
     
    expect(ids.length).toBe(3);

    for(let i = 0; i < ids.length; i++){
      let label = await page.$$(`form > label[for='${ids[i]}']`); 
      expect(label.length).toBe(1);
    }
  });
  
  it('should have at least one checked by default', async () => {
    const selected = await page.$$eval(`form > input[type="checkbox"]`, (checkboxes) => {
      let selected = 0;
      for(let i = 0; i < checkboxes.length; i++){
        let checkbox = checkboxes[i];
        
        if(checkbox.hasAttribute("checked")) selected++;
      }
      return selected;
    });
    expect(selected).toBeGreaterThan(0);
  });
});

describe('text input', () => {
  it('should have a placholder', async () => {
    const answer = await page.$$eval('form > input[type="text"]', (textInputs) => {
      return textInputs[0].hasAttribute('placeholder');
    });
    expect(answer).toBe(true);
  })
  
  it('should be required', async () => {
    const answer = await page.$$eval('form > input[type="text"]', (textInputs) => {
      return textInputs[0].hasAttribute('required');
    });
    expect(answer).toBe(true);
  })
})