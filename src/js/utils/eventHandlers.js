import stats from "./browser-status.class"
import Emitter from "emitter-js/dist/emitter"
import _ from "lodash"

// 汎用イベント処理用
function _event() {
  this.emitter = new Emitter()
}

_event.prototype.on = function (eventName, func) {
  if (typeof func === "function") {
    this.emitter.on(eventName, func)
  }
  return this
}

_event.prototype.off = function (eventName, func) {
  if (typeof func === "function") {
    this.emitter.off(eventName, func)
  } else {
    this.emitter.off(eventName)
  }
  return this
}

_event.prototype.trigger = function (eventName, args) {
  this.emitter.emit(eventName, args)
  return this
}

export const event = new _event()

// 画面サイズ検知

function _r() {
  const self = this

  self.targets = []

  // スマホ 100%画面Height 対応
  event.on("window.resize", ({ winSize }) => {
    let vh = winSize.h * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
  })

  self._findObj = (elem) => {
    return _.findIndex(self.targets, (target) => elem === target.element)
  }

  self._update = () => {
    let { winSize } = stats.get()
    winSize = winSize || { w: 0, h: 0 }

    if (window.innerWidth !== winSize.w || window.innerHeight !== winSize.h) {
      winSize.w = window.innerWidth
      winSize.h = window.innerHeight
      stats.set({ winSize })
      event.trigger("window.resize", { winSize })
    }
  }

  self._update()

  let { winSize } = stats.get()
  winSize = winSize || { w: 0, h: 0 }

  window.addEventListener("resize", this._update.bind(this))
}

function _mq() {
  const self = this

  event.on("window.resize", () => {
    const prevMobile = self.mobile
    self.mobile = window.matchMedia("(max-width: 375px)")

    const prevTablet = self.tablet

    self.tablet = window.matchMedia(
      "(max-width: 1119px) and (min-width: 376px)"
    )

    const prevPc = self.pc
    self.pc = window.matchMedia("(min-width: 1200px)")

    if (
      prevTablet !== self.tablet ||
      prevMobile !== self.mobile ||
      prevPc !== self.pc
    ) {
      event.trigger("media.change", self)
    }
  })
}

_mq.prototype.isMobile = function () {
  return this.mobile?.matches
}

_mq.prototype.isPc = function () {
  return this.pc?.matches || this.isTablet()
}

_mq.prototype.isTablet = function () {
  return this.tablet?.matches
}

export const mediaQuery = new _mq()

export const resizeHandler = new _r()
