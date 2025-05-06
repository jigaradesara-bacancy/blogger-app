
const Page = require('../tests/helper/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
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
    await page.login();

    const text = await page.getContentOf('a[href="/auth/logout"]');

    expect(text).toEqual('Logout');
});

// test.only('ID', ()=>{
//     const session = 'eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjgxNDg4N2JjYzFlNDllNDU3YjA5Mzg4In19'
//     const Buffer = require('safe-buffer').Buffer
//    console.log(Buffer.from(session, 'base64').toString('utf8'));
// });
