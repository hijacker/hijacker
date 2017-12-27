const mapModels = (map) => {
  return Object.keys(map).reduce((cp, key) => {
    const [storePath, action] = map[key]
    cp[key] = {
      get() { return _deepFind(this.$store.state, storePath) },
      set(payload) { this.$store.commit(action, payload) }
    }

    return cp
  }, {})
}

const _deepFind = (obj, path) => {
  let currentObj = obj
  let parts = path.split('.')

  for (let i = 0; i < parts.length; i++) {
    if (!currentObj.hasOwnProperty(parts[i])) {
      return undefined
    } else {
      currentObj = currentObj[parts[i]]
    }
  }

  return currentObj
}

export {
  mapModels
}
