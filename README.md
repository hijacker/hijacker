# middleman

### Route Rule Object (implemented only)
| Parameter         | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| body              | Body object to send back to client in response               |
| path              | Apply rule to requests to paths that match                   |
| interceptResponse | Ability to intercept response from api before sent to client |
| interceptRequest  | Ability to intercept request from client before sent to api  |
| skipApi           | Skip call to api server and send predefined response         |
| statusCode        | Status code to send back to the client                       |
