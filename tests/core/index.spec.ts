import { Page } from 'puppeteer'

// set default timeout
jest.setTimeout(1000000)

describe('', () => {
  let page = (global as any).page as Page
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:3000')
  })
  test('test', () => {
    expect(1).toBe(1)
  })
})
