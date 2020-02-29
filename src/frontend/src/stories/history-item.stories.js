import { object } from '@storybook/addon-knobs'

import HistoryItem from '../components/HistoryItem'

export default {
  component: HistoryItem,
  title: 'History Item'
}

export const basic = () => ({
  props: {
    item: {
      type: Object,
      default: () => (object('Item', {
        id: 1,
        intReqDone: false,
        intResDone: false,
        CLIENT_REQUEST: {
          id: 1,
          reqTime: 1582991985982,
          baseUrl: 'https://jsonplaceholder.typicode.com',
          rule: {
            disabled: false,
            interceptRequest: false,
            interceptResponse: false,
            skipApi: true,
            path: '/cars',
            body: {
              Hello: 'World'
            },
            id: '191468cf-58b6-46b7-80f7-e591241ebd80'
          },
          request: {
            headers: {
              'host': 'localhost:3000',
              'connection': 'keep-alive',
              'upgrade-insecure-requests': '1',
              'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
              'sec-fetch-dest': 'document',
              'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
              'sec-fetch-site': 'none',
              'sec-fetch-mode': 'navigate',
              'sec-fetch-user': '?1',
              'accept-encoding': 'gzip, deflate, br',
              'accept-language': 'en-US,en;q=0.9',
              'cookie': 'io=SDxvffEQbkGrjPs_AAAA'
            },
            method: 'GET',
            body: {},
            originalUrl: '/cars'
          }
        },
        CLIENT_RESPONSE: {
          id: 1,
          reqTime: 1582991985982,
          baseUrl: 'https://jsonplaceholder.typicode.com',
          rule: {
            disabled: false,
            interceptRequest: false,
            interceptResponse: false,
            skipApi: true,
            path: '/cars',
            body: {
              Hello: 'World'
            },
            id: '191468cf-58b6-46b7-80f7-e591241ebd80'
          },
          request: {
            headers: {},
            method: 'GET',
            body: {},
            originalUrl: '/cars'
          },
          response: {
            url: 'https://jsonplaceholder.typicode.com/cars',
            method: 'GET',
            headers: {},
            body: {
              Hello: 'World'
            },
            statusCode: 200,
            apiSkipped: true,
            contentType: 'application/json'
          }
        }
      }))
    }
  },
  render () {
    return <HistoryItem item={this.item} />
  }
})
