import { defineConfig } from '@hijacker/core';
import { GraphQLPlugin } from '@hijacker/plugin-graphql';

export default defineConfig({
  port: 3000,
  baseRule: {
    baseUrl: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
    type: 'graphql'
  },
  rules: [
    {
      disabled: false,
      operationName: 'ReplaceQuery',
      body: {
        data: {
          allFilms: {
            films: [
              {
                title: 'A New Hope',
                director: 'George Lucas',
                releaseDate: '1977-05-25'
              }
            ]
          }
        }
      }
    }
  ],
  plugins: [
    new GraphQLPlugin({})
  ]
})