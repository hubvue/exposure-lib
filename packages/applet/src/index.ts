const APPLET_EXPOSURE_CLASSNAME = 'applet-exposure'

const genThreshold = (count = 0, unit = 0.1) => {
  let threshold: number[] = []
  while (count <= 1) {
    threshold.push(count)
    count = Number((count + unit).toFixed(2))
  }
  return threshold
}

const createObserver = (component: WechatMiniprogram.IAnyObject) => {
  const observer = wx.createIntersectionObserver(component, {
    thresholds: genThreshold(),
  })
  observer.relativeToViewport().observe(APPLET_EXPOSURE_CLASSNAME, (res) => {
    console.log(res)
  })
}

export const createExposure = (component: WechatMiniprogram.IAnyObject) => {
  const observer = createObserver(component)

  const observe = (el: WechatMiniprogram.NodesRef) => {
    el.node().selectAll
  }
}
