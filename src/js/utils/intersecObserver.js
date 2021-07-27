const getObserverSettings = (settings) => ({
  root: settings.container === document ? null : settings.container,
  rootMargin: settings.thresholds || settings.threshold + "px",
})

const isIntersecting = (entry, settings) =>
  entry.isIntersecting || entry.intersectionRatio > settings.ratio

const intersectionHandler = (entries, settings, instance) => {
  const { onEnter, onExit } = settings
  entries.forEach((entry) =>
    isIntersecting(entry, settings)
      ? onEnter(entry.target, entry, settings, instance)
      : onExit(entry.target, entry, settings, instance)
  )
}

export const observeElements = (observer, elements) => {
  elements.forEach((element) => {
    observer.observe(element)
  })
}

export const updateObserver = (observer, elementsToObserve) => {
  resetObserver(observer)
  observeElements(observer, elementsToObserve)
}

export const setObserver = (settings, instance) => {
  instance._observer = new IntersectionObserver((entries) => {
    intersectionHandler(entries, settings, instance)
  }, getObserverSettings(settings))
}

export const unobserve = (element, instance) => {
  if (!instance) return
  const observer = instance._observer
  if (!observer) return
  observer.unobserve(element)
}

const resetObserver = (observer) => {
  observer.disconnect()
}
