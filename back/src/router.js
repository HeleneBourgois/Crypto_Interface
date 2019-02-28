import request from 'request'
import { app } from './../'

const extractLogo = (id) => new Promise(async (resolve, reject) => {
    request({
        url: `https://s2.coinmarketcap.com/static/img/coins/16x16/${id}.png`,
        method: 'get',
        headers: {
            'X-CMC_PRO_API_KEY': 'key',
            'Accept': 'application/json',
        }
    },  (err, resp, body) => {
        if (err) {
            return reject(err)
        } 
        return resolve(resp)

    })
})

app.get('/', async (req, res) => {
    const currency = req.query && req.query.currency ? req.query.currency : 'USD'
    const limit = req.query && req.query.limit ? req.query.limit : 100

    request({
        url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        method: 'get',
        qs: {
            start: 1,
            limit: Number(limit),
            convert: currency
        },
        encoding: null,
        headers: {
            'X-CMC_PRO_API_KEY': 'key',
            'Accept': 'application/json',
            }
    }, async (err, resp, b) => {
        const body = JSON.parse(b)
        if (err) {
            res.status(500)
            return res.send(err)
        } 
        const results = []
        for (let data of body.data) {
            const logo = await extractLogo(data.id)
            const obj = {
                id: data.id,
                name: data.name,
                marketCap: data.quote[currency].market_cap,
                price: data.quote[currency].price,
                volume: data.quote[currency].volume_24h,
                changes: [
                    {
                        key: -7,
                        value: data.quote[currency].percent_change_7d
                    },
                    {
                        key: -1,
                        value: data.quote[currency].percent_change_24h
                    },
                    {
                        key: 0,
                        value: data.quote[currency].percent_change_1h
                    },
                ],
                circulating_supply: data.circulating_supply,
                change: data.quote[currency].percent_change_24h,
                symbole: data.symbol,
                logo: logo
            }
            results.push(obj)
        }
        return res.send(results)
    })
})