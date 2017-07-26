# Hijacker
Hijacker can be used as an API relay to assist with front end development. It can intercept requests and responses between the client and the API server.  

### NPM
Hijacker can be found on npm [here](https://www.npmjs.com/package/hijacker)

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
  "base_url": "http://api.base.com", // (REQUIRED) Base URL for API to intercept (without trailing backslash) requests for
  "port": 3000,  // Port to run the hijacker server on (Default: 3005)
  "rules": []    // List of rule objects for intercepting requests (Default: [])
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

### Running
Once you have have your config file set up in your project you can start the Hijacker server in the following ways:

#### Global Install
If you installed Hijacker globally, to start the server, all you need to do is run the following command in a directory that contains a configuration file:

```
hijacker
```

#### Local Install
If you installed Hijacker to a specific npm project you can run the following command in a directory with a configuration file:

```
./node_modules/.bin/hijacker
```

#### package.json Setup
In either installation case, you can add a command similar to the following to the scripts section of the package.json file of a project.

```
"scripts": {
  "hijacker": "hijacker"
}
```

And then you can run the following command in your node project to start the server:
```
npm run hijacker
```

### Route Rule Object
Below are parameters that can be used in a route rule. Optional parameters will default to values from the original request/response.

| Parameter         | Default    | Description                                                  |
| ----------------- | ---------- | ------------------------------------------------------------ |
| body              | (optional) | Body object to send back to client in response               |
| disabled          | false      | Flag to allow disabling a rule without deleting from list    |
| interceptRequest  | false      | Ability to intercept request from client before sent to api  |
| interceptResponse | false      | Ability to intercept response from api before sent to client |
| path              | (required) | Apply rule to requests to paths that match                   |
| skipApi           | false      | Skip call to api server and send predefined response         |
| method            | All        | HTTP method to apply the rule to                             |
| statusCode        | (optional) | Status code to send back to the client                       |


## Future Work
Hijacker is currently under development with the following features planned:
- Dashboard to configure Hijacker rules
- Request/Response Breakpoints (Editing requests before they are sent to the API server and responses before they are sent back to the client) (Implemented but needs dashboard)
- More advanced route rules
  - Match paths with regex
  - Modify responses/requests w/ functions rather than replacing with object
- Support for multiple API's for a project
- Better CLI
- Allow use without an existing API server
