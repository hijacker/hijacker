import { HistoryItem } from "../../hooks/useConfig";

export const mockHistory: HistoryItem[] = [
  {
    requestId: '123',
    hijackerRequest: {
      timestamp: 12232,
      requestId: '123',
      body: {
        hello: 'world'
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Content-Security-Policy': 'default-src \'none\'',
        'X-Content-Type-Options': 'nosniff',
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': '153',
        'Vary': 'Accept-Encoding',
        'Date': 'Wed, 28 Dec 2022 23:57:30 GMT',
        'Connection': 'keep-alive',
        'Keep-Alive': 'timeout=5'
      },
      method: 'DELETE',
      path: '/test'
    },
    hijackerResponse: {
      timestamp: 12320,
      requestId: '123',
      body: {
        foo: 'bar'
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Content-Security-Policy': 'default-src \'none\'',
        'X-Content-Type-Options': 'nosniff',
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': '153',
        'Vary': 'Accept-Encoding',
        'Date': 'Wed, 28 Dec 2022 23:57:30 GMT',
        'Connection': 'keep-alive',
        'Keep-Alive': 'timeout=5'
      },
      statusCode: 400
    }
  }
]