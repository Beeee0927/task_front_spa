export function getInitialState(name: string, defaultValue: object) {
  try {
    return {
      ...defaultValue,
      ...JSON.parse(localStorage.getItem(name)!).state
    }
  } catch {
    return defaultValue
  }
}

// export function createPersistStore
