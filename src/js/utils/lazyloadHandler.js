import LazyLoad from "vanilla-lazyload"
function executeLazyFunction(element) {
  var lazyFunctionName = element.getAttribute("data-lazy-function")
  var lazyFunction = window.lazyFunctions[lazyFunctionName]
  if (!lazyFunction) return
  lazyFunction(element)
}

export default new LazyLoad({
  unobserve_entered: true,
  callback_enter: executeLazyFunction,
})
