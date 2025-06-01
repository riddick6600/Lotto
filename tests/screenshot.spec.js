// @ts-check
const { test, expect } = require('@playwright/test');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Hardhat private key
// const PRIVATE_KEY = '0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0';
const PRIVATE_KEY = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
// Wallet from the private key
const wallet = new ethers.Wallet(PRIVATE_KEY);
const address = wallet.address;

// Создаем директорию для скриншотов, если она не существует
const screenshotsDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Функция для сохранения скриншота
async function takeScreenshot(page, name) {
  console.log(`📸 Taking screenshot: ${name}`);
  await page.screenshot({ path: path.join(screenshotsDir, `${name}.png`), fullPage: true });
}

// Получаем параметр для headless/headed режима
const showBrowser = process.env.SHOW_BROWSER === '1' || process.env.SHOW_BROWSER === 'true';

test('Full Lotto App test with MetaMask simulation', async ({ page, browserName, context }) => {
  console.log('Test started');
  console.log(`Using wallet address: ${address}`);

  // ВАЖНО: эмулируем MetaMask ДО загрузки страницы, чтобы React увидел window.ethereum сразу
  await page.addInitScript((walletAddress) => {
    // @ts-ignore
    const handlers = {};
    // @ts-ignore
    window.ethereum = {
      isMetaMask: true,
      chainId: '0x7A69',
      networkVersion: '31337',
      selectedAddress: walletAddress,
      handlers,
      request: async ({ method, params }) => {
        if (method === 'eth_requestAccounts' || method === 'eth_accounts') {
          return [walletAddress];
        }
        if (method === 'eth_getBalance') {
          return '0x56BC75E2D63100000';
        }
        if (method === 'eth_sendTransaction') {
          return '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234';
        }
        if (method === 'eth_call') {
          return '0x';
        }
        if (method === 'eth_estimateGas') {
          return '0x5208';
        }
        if (method === 'eth_getTransactionReceipt') {
          return { status: '0x1', blockNumber: '0x1', logs: [] };
        }
        return null;
      },
      on: (eventName, listener) => {
        if (!handlers[eventName]) handlers[eventName] = [];
        handlers[eventName].push(listener);
      },
      emit: (eventName, ...args) => {
        if (handlers[eventName]) {
          handlers[eventName].forEach(fn => fn(...args));
        }
      },
      isConnected: () => true
    };
  }, address);

  // Навигация к странице приложения
  await page.goto('http://localhost:8080');
  console.log('Page loaded');
  await takeScreenshot(page, '01-initial-page');

  // Ожидаем загрузки страницы
  await page.waitForLoadState('networkidle');

  console.log('MetaMask mock injected');

  // Нажимаем на кнопку подключения MetaMask
  // Пробуем найти кнопку Connect MetaMask и кликнуть, если она есть
  const connectButton = page.locator('button:has-text("Connect MetaMask")').first();
  if (await connectButton.count() > 0) {
    console.log('Clicking Connect MetaMask button');
    await connectButton.click();
  } else {
    console.log('Connect MetaMask button not found, аккаунт уже инициализирован');
  }

  // Отладка: логируем состояние window.ethereum и account в браузере
  await page.evaluate(() => {
    // @ts-ignore
    console.log('DEBUG ethereum.selectedAddress:', window.ethereum && window.ethereum.selectedAddress);
    // @ts-ignore
    window.ethereum && window.ethereum.request({ method: 'eth_accounts' }).then(accs => console.log('DEBUG eth_accounts:', accs));
  });

  // Триггерим accountsChanged для корректной инициализации аккаунта в React
  await page.evaluate((walletAddress) => {
    // @ts-ignore
    if (window.ethereum && window.ethereum.emit) {
      // @ts-ignore
      window.ethereum.selectedAddress = walletAddress;
      // @ts-ignore
      window.ethereum.emit('accountsChanged', [walletAddress]);
      // @ts-ignore
      console.log('DEBUG emit accountsChanged:', walletAddress);
    }
  }, address);

  // Отладка: логируем состояние после accountsChanged
  await page.evaluate(() => {
    // @ts-ignore
    console.log('DEBUG POST-emit ethereum.selectedAddress:', window.ethereum && window.ethereum.selectedAddress);
    // @ts-ignore
    window.ethereum && window.ethereum.request({ method: 'eth_accounts' }).then(accs => console.log('DEBUG POST-emit eth_accounts:', accs));
  });

  // После клика Connect MetaMask пробуем вручную вызвать getAccount и getBalance через evaluate
  await page.evaluate(async () => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window['ethereum']) {
      // Пробуем вызвать accountsChanged ещё раз
      if (window['ethereum'].emit && window['ethereum'].selectedAddress) {
        window['ethereum'].emit('accountsChanged', [window['ethereum'].selectedAddress]);
      }
      // Пробуем вызвать eth_requestAccounts
      const accs = await window['ethereum'].request({ method: 'eth_requestAccounts' });
      console.log('DEBUG manual eth_requestAccounts:', accs);
      // Пробуем вызвать eth_accounts
      const accs2 = await window['ethereum'].request({ method: 'eth_accounts' });
      console.log('DEBUG manual eth_accounts:', accs2);
    }
  });

  // Явно ждем появления кнопки "Deploy New Casino"
  try {
    await page.waitForSelector('button:has-text("Deploy New Casino")', { timeout: 15000 });
  } catch (e) {
    // Отладка: делаем скриншот и логируем DOM
    await takeScreenshot(page, 'debug-no-deploy-casino');
    const html = await page.content();
    console.log('DEBUG PAGE HTML:', html);
    throw e;
  }

  console.log('Connected to MetaMask');
  await takeScreenshot(page, '02-connected-metamask');

  // Сбор ошибок консоли браузера
  const browserConsoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      browserConsoleErrors.push(msg.text());
    }
  });

  // Развертываем новое казино
  const deployCasinoButton = page.locator('button:has-text("Deploy New Casino")');
  console.log('Deploying Casino');
  await deployCasinoButton.click();
  await page.waitForTimeout(3000);

  // Ожидание появления текста Casino: (адрес контракта)
  try {
    await page.waitForSelector('text=Casino:', { timeout: 10000 });
    console.log('Casino contract address appeared in DOM');
  } catch (e) {
    console.log('Casino contract address did NOT appear!');
    await takeScreenshot(page, '03a-no-casino-address');
    const dom = await page.content();
    fs.writeFileSync(path.join(screenshotsDir, '03a-no-casino-address.html'), dom);
    throw e;
  }

  // Отладка после деплоя казино
  await takeScreenshot(page, '03-casino-deployed');
  const casinoDom = await page.content();
  fs.writeFileSync(path.join(screenshotsDir, '03-casino-deployed.html'), casinoDom);
  const casinoButtons = await page.$$eval('button', btns => btns.map(b => b.textContent));
  console.log('Buttons after deploy:', casinoButtons);
  console.log('Browser errors after deploy:', browserConsoleErrors);

  // Явно ждем появления кнопки "Create new Machine" с отладкой
  try {
    await page.waitForSelector('button:has-text("Create new Machine")', { timeout: 10000 });
    console.log('Create new Machine button appeared');
  } catch (e) {
    console.log('Create new Machine button did NOT appear!');
    await takeScreenshot(page, '03b-no-create-machine');
    const dom = await page.content();
    fs.writeFileSync(path.join(screenshotsDir, '03b-no-create-machine.html'), dom);
    const allButtons = await page.$$eval('button', btns => btns.map(b => b.textContent));
    console.log('All buttons on page:', allButtons);
    throw e;
  }

  // Создаем новую машину
  const createMachineButton = page.locator('button:has-text("Create new Machine")');
  console.log('Creating new Machine');
  await createMachineButton.click();
  await page.waitForTimeout(3000);
  console.log('Machine created');
  await takeScreenshot(page, '04-machine-created');

  // Создаем билет на 2 игрока
  await page.locator('input[placeholder="Price ETH"]').fill('0.1');
  await page.locator('input[placeholder="Limit players"]').fill('2');
  console.log('Creating ticket: 0.1 ETH, 2 players');
  await page.locator('button:has-text("Create ticket")').click();
  await page.waitForTimeout(3000);

  console.log('Ticket created');
  await takeScreenshot(page, '05-ticket-created');

  // Покупаем первый билет
  const buyTicketButton = page.locator('button:has-text("WIN")').first();
  console.log('Buying first ticket');
  await buyTicketButton.click();
  await page.waitForTimeout(2000);

  console.log('First ticket purchased');
  await takeScreenshot(page, '06-first-ticket-purchased');

  // Создаем второй адрес для покупки второго билета
  await page.evaluate(async () => {
    const secondAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Второй аккаунт Hardhat
    // @ts-ignore
    window.ethereum.selectedAddress = secondAddress;
    console.log('Second wallet created:', secondAddress);
  });

  // Покупаем второй билет
  console.log('Buying second ticket');
  await buyTicketButton.click();
  await page.waitForTimeout(5000); // Дольше ожидаем, так как происходит розыгрыш

  console.log('Second ticket purchased, lottery should complete');
  await takeScreenshot(page, '07-lottery-completed');

  // Проверяем результаты лотереи - переход на страницу My Tickets
  await page.locator('a:has-text("My Tickets")').click();
  await page.waitForTimeout(2000);

  console.log('My Tickets page loaded');
  await takeScreenshot(page, '08-my-tickets-page');

  // Проверка наличия билетов на странице
  const ticketCards = page.locator('.ticket-card');
  const count = await ticketCards.count();
  console.log(`Found ${count} ticket cards`);

  // Последний скриншот - итоговый результат
  await takeScreenshot(page, '09-final-result');

  // === Новый цикл: создаём новую лотерею ===
  // Возвращаемся на главную
  await page.locator('a:has-text("ETHERIUM LOTTERY")').click();
  await page.waitForTimeout(1000);

  // Создаём новую машину
  await createMachineButton.click();
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '10-machine-created-2');

  // Создаём новый билет (0.2 ETH, 2 игрока)
  await page.locator('input[placeholder="Price ETH"]').fill('0.2');
  await page.locator('input[placeholder="Limit players"]').fill('2');
  await page.locator('button:has-text("Create ticket")').click();
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '11-ticket-created-2');

  // Покупаем первый билет
  await buyTicketButton.click();
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '12-first-ticket-2');

  // Снова меняем адрес (второй аккаунт)
  await page.evaluate(() => {
    const secondAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
    // @ts-ignore
    window.ethereum.selectedAddress = secondAddress;
  });

  // Покупаем второй билет
  await buyTicketButton.click();
  await page.waitForTimeout(5000);
  await takeScreenshot(page, '13-lottery-completed-2');

  // Проверяем результат второй лотереи
  await page.locator('a:has-text("My Tickets")').click();
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '14-my-tickets-2');

  console.log('Second lottery cycle completed!');
  console.log('Test completed successfully!');

  // Явно завершаем процесс после теста (чтобы не висел)
  process.exit(0);
});

// Переопределяем конфиг Playwright для headless/headed режима, если нужно
if (showBrowser) {
  const { devices, defineConfig } = require('@playwright/test');
  module.exports = defineConfig({
    use: {
      headless: false,
      ...module.exports.use,
    },
  });
}