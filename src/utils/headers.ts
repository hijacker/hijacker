export const filterResponseHeaders = (headers: Record<string, string>) => {
  const headerKeys = Object.keys(headers);
  const connectionHeaders = (headers.connection || '').split(',').map(x => x.trim());
  const hopbyhop = [
    'te',
    'transfer-encoding',
    'connection',
    'content-encoding',
    'keep-alive',
    'proxy-authorization',
    'proxy-authentication',
    'trailer',
    'upgrade',
    ...connectionHeaders
  ];

  // Filter out hop by hop headers
  const acceptedHeaders = headerKeys.filter(x => hopbyhop.indexOf(x) === -1);

  // Add keys and values to new object now that we have filtered keys that belong
  const filtered: Record<string, string> = {};

  for (let i = 0; i < acceptedHeaders.length; i += 1) {
    filtered[acceptedHeaders[i]] = headers[acceptedHeaders[i]];
  }

  return filtered;
}