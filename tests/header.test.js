const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox']
    })

    page = await browser.newPage();

    // Ensure full URL with protocol (http://)
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await browser.close();
});

test('Launching Web Browser', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster')
});

test('auth flow on click', async()=>{
    await page.click('.right a');

    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);

});

test('When sign in, logout button shows', async() => {
    const id = "6814887bcc1e49e457b09388";
    const Buffer = require('safe-buffer').Buffer;

    const sessioObj = {
        passport:{
            user:id
        }
    };

    const sessionString = Buffer.from(JSON.stringify(sessioObj)).toString('base64');
    
    const Keygrip = require('keygrip');
    const keys = require('../config/keys');
    const keygrip = new Keygrip([keys.cookieKey]);
    const sig = keygrip.sign('session=' + sessionString);

    await page.setCookie({name:'session', value: sessionString});
    await page.setCookie({name: 'session.sig', value: sig });
    await page.goto('http://localhost:3000');
    //await page.waitFor('a[href="/auth/logout"]')

    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(text).toEqual('Logout');
});

// test.only('ID', ()=>{
//     const session = 'eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjgxNDg4N2JjYzFlNDllNDU3YjA5Mzg4In19'
//     const Buffer = require('safe-buffer').Buffer
//    console.log(Buffer.from(session, 'base64').toString('utf8'));
     

// });
