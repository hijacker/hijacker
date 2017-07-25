# Hijacker
Hijacker can be used as an API relay to assist with front end development. It can intercept requests and responses between the client and the API server.  

## Getting Started
Hijacker is designed to be used alongside of an existing API so setting up a project is as simple as letting Hijacker know your API url and a list of rules you would like to intercept and then pointing your client to the Hijacker server instead of your API server.  If no rule is provided for a given route, it will return the response from the API server, so Hijacker can be used with out any rules, and your application should function as if Hijacker is not there.

### Installing
To install Hijacker, you can either install it to a specific project:

```
npm install hijacker
```

Or you can install it globally to allow use of the `hijacker` command in your terminal:

```
npm install -g hijacker
```

### Setup
To set up a project for use with Hijacker a hijacker.conf.json file should be added to your project root. The file should be structured similar to below:

```
{
  "base_url": "http://api.base.com", // Base URL for API to intercept (without trailing backslash) requests for
  "port": 3000,  // Port to run the hijacker server on
  "rules": []    // List of rule objects for intercepting requests
}
```

#### Example:
Here is an basic config file that defines a rule for the route `/cars`. Every other route will make a request to https://jsonplaceholder.typicode.com[route] and return the given response.
```
{
  "base_url": "https://jsonplaceholder.typicode.com",
  "port": 3000,
  "rules": [
    {
      "path": "/cars",
      "skipApi": true,
      "body": {
        "Hello": "World"
      }
    }
  ]
}
```

### Route Rule Object
Below are parameters that can be used in a route rule.

| Parameter         | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| body              | Body object to send back to client in response               |
| disabled          | Flag to allow disabling a rule without deleting from list    |
| interceptRequest  | Ability to intercept request from client before sent to api  |
| interceptResponse | Ability to intercept response from api before sent to client |
| path              | Apply rule to requests to paths that match                   |
| skipApi           | Skip call to api server and send predefined response         |
| statusCode        | Status code to send back to the client                       |


## Future Work
Hijacker is currently under development with the following features planned:
- Dashboard to configure Hijacker rules
- Request/Response Breakpoints (Editing requests before they are sent to the API server and responses before they are sent back to the client) (Implemented but needs dashboard)
- More advanced route rules
- Support for multiple API's for a project
- Better CLI
- Allow use without an existing API server
