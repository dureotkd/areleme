import { Service } from 'typedi';

import puppeteer from 'puppeteer';

import fs from 'fs';
import path from 'path';
import os from 'os';

import ModelService from '../model/model';

@Service()
export default class requestManagerService {
  constructor(private readonly debug: false, private readonly modelService: ModelService) {}

  public async getRandomProxy() {
    const proxies = await this.getProxies();

    const randomIndex = Math.floor(Math.random() * proxies.length);
    const proxy = proxies[randomIndex];

    console.log(`proxy server ::: ${proxy}`);

    return proxy;
  }

  public async makeProxy() {
    if (process.env.NODE_ENV !== 'development') {
      console.log('로컬 환경에서만 작동합니다');
      return;
    }

    try {
      await this.modelService.execute({
        debug: this.debug,
        database: 'areleme',
        sql: 'TRUNCATE areleme.proxy',
        type: 'exec',
      });

      // 1. 프록시 파일 경로 지정
      const downloadsPath = path.join(os.homedir(), 'Downloads');
      const filePath = path.join(downloadsPath, 'ips.txt');

      // 2. 파일 읽기
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const proxies = fileContent
        .split('\n') // 줄 단위로 나누기
        .map((line) => line.trim()) // 앞뒤 공백 및 \r 제거
        .filter((line) => line); // 빈 줄 제거

      console.log(proxies);
      for await (const proxy of proxies) {
        await this.modelService.execute({
          debug: this.debug,
          database: 'areleme',
          sql: this.modelService.getInsertQuery({
            table: 'areleme.proxy',
            data: {
              ip: proxy,
            },
          }),
          type: 'exec',
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  public async waitRandom() {
    // 0~10000 밀리초 (0~10초)
    const randomDelay = Math.floor(Math.random() * 10000);

    console.log(`random Delay :: ${randomDelay}`);

    return new Promise((resolve) => setTimeout(resolve, randomDelay));
  }

  public getHeadersNaver() {
    return {
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlJFQUxFU1RBVEUiLCJpYXQiOjE3MzM5OTE0MTgsImV4cCI6MTczNDAwMjIxOH0.OecLbUoVZtwQ-NAwfY0Jjz5DNxJg1Ai-76l1EVXe6BE',
      // referer: 'https://new.land.naver.com/complexes/25256',
      referer: 'https://new.land.naver.com',
      'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    };
  }

  public async setCookieDabang() {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    );

    await page.goto('https://www.dabangapp.com/map/apt?m_lat=36.3821731&m_lng=127.3334185&m_zoom=11');

    return page;
  }

  private async getProxies() {
    const proxies = await this.modelService.execute({
      database: 'areleme',
      sql: `SELECT * FROM areleme.proxy`,
      type: 'all',
    });
    return proxies.map(({ ip }: any) => `http://${ip}`);
  }
}
