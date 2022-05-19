import { Page } from 'puppeteer'

// set default timeout
jest.setTimeout(1000000)

const getCount = async (page: Page) => {
  return page.$$eval('.count', (els) => {
    return els[0].textContent
  })
}

describe('vue#base', () => {
  let page = (global as any).page as Page
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:3000/#/vue-base')
  })

  test('should be an element trigger at the beginning', async () => {
    const count = await getCount(page)
    expect(count).toBe('1')
  })

  test('when scrolling to middle appears, count should be added by 1', async () => {
    await page.evaluate(() => {
      window.scrollTo(0, 700)
    })
    await page.waitForTimeout(1000)
    const count = await getCount(page)

    expect(count).toBe('2')
  })

  test('when the middle element leaves the visible area, count should be added by 1', async () => {
    await page.evaluate(() => {
      window.scrollTo(0, 1500)
    })
    await page.waitForTimeout(1000)
    const count = await getCount(page)
    expect(count).toBe('3')
  })

  test('when the bottom element leaves the visible area, count should be added by 1', async () => {
    await page.evaluate(() => {
      window.scrollTo(0, 2500)
    })
    await page.waitForTimeout(1000)
    const count = await getCount(page)
    expect(count).toBe('4')
  })
})

describe('vue#threshold', () => {
  let page = (global as any).page as Page
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:3000/#/vue-threshold')
  })

  test('when the middle element is exposed to half of the visible area, count should be added by 1', async () => {
    await page.evaluate(() => {
      window.scrollTo(0, 595)
    })

    await page.waitForTimeout(1000)
    const count = await getCount(page)
    expect(count).toBe('2')
  })
})

describe('vue#reset', () => {
  let page = (global as any).page as Page
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:3000/#/vue-reset')
  })

  test('The node state should be reset after resetExposure is triggered', async () => {
    await page.evaluate(() => {
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(1000)
    // 1 滚动到中间触发middle
    await page.evaluate(() => {
      window.scrollTo(0, 800)
    })
    await page.waitForTimeout(1000)

    // 滚动到底部触发bottom
    await page.evaluate(() => {
      window.scrollTo(0, 2500)
    })
    await page.waitForTimeout(1000)

    // 再次滚动到中间触发middle
    await page.evaluate(() => {
      window.scrollTo(0, 800)
    })
    await page.waitForTimeout(1000)

    // 再次滚动到顶部触发top
    await page.evaluate(() => {
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(1000)

    // // 再次滚动到中间触发middle
    await page.evaluate(() => {
      window.scrollTo(0, 800)
    })
    await page.waitForTimeout(1000)

    const count = await getCount(page)
    expect(count).toBe('6')
  })
})
