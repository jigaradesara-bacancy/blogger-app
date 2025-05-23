const puppeteer = require('puppeteer')
const useSessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {

    static async build() {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox']
        })

        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        // return new Proxy(customPage, {
        //     get: function (target, property) {
        //         return customPage[property] || browser[property] || page[property]
        //     }
        // })

        return new Proxy(customPage, {
            get: (target, property, receiver) => {
                if (target[property]) {
                    return target[property];
                }

                let value = browser[property];
                if (value instanceof Function) {
                    return function (...args) {
                        return value.apply(this === receiver ? browser : this, args);
                    };
                }

                value = page[property];
                if (value instanceof Function) {
                    return function (...args) {
                        return value.apply(this === receiver ? page : this, args);
                    };
                }
                return value;
            },
        })

        // return new Proxy(customPage, {
        //     get: function(target, property){
        //         //return customPage[property] || browser[property] || page[property]
        //         if (property in customPage) return customPage[property];
        //         if (property in target.page) return target.page[property];
        //         if (property in target.browser) return target.browser[property];
        //     }
        // })
    }

    constructor(page) {
        this.page = page;
    }

    async login() {
        const user = await userFactory();
        const { session, sig } = useSessionFactory(user);

        await this.page.setCookie({ name: 'session', value: session });
        await this.page.setCookie({ name: 'session.sig', value: sig });
        await this.page.goto('http://localhost:3000/blogs');
        await this.page.waitForSelector('a[href="/auth/logout"]')
    }

    async getContentOf(selector){
        return  this.page.$eval(selector, el => el.innerHTML)
    }

    get(path) {
        return this.page.evaluate(_path => {
          return fetch(_path, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(res => res.json());
        }, path);
      }
    
      post(path, data) {
        return this.page.evaluate(
          (_path, _data) => {
            return fetch(_path, {
              method: 'POST',
              credentials: 'same-origin',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(_data)
            }).then(res => res.json());
          },
          path,
          data
        );
      }
    
      execRequests(actions) {
        return Promise.all(
          actions.map(({ method, path, data }) => {
            return this[method](path, data);
          })
        );
      }

}

module.exports = CustomPage;