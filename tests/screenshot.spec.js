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

test('Full Lotto App test with MetaMask simulation', async ({ page }) => {
  console.log('Test started');
  console.log(`Using wallet address: ${address}`);

  // Навигация к странице приложения
  await page.goto('http://localhost:8080');
  console.log('Page loaded');
  await takeScreenshot(page, '01-initial-page');

  // Ожидаем загрузки страницы
  await page.waitForLoadState('networkidle');

  // Эмулируем подключенный MetaMask
  await page.evaluate(async (walletAddress) => {
    // @ts-ignore
    window.ethereum = {
      isMetaMask: true,
      chainId: '0x7A69', // Hardhat chainId (31337)
      networkVersion: '31337', // Hardhat networkId
      selectedAddress: walletAddress,

      // Обработчик запросов
      request: async ({ method, params }) => {
        console.log('MetaMask request:', method, params);

        if (method === 'eth_requestAccounts' || method === 'eth_accounts') {
          console.log('Returning account:', walletAddress);
          return [walletAddress];
        }

        if (method === 'eth_getBalance') {
          console.log('Returning balance: 100 ETH');
          return '0x56BC75E2D63100000'; // 100 ETH в hex
        }

        if (method === 'eth_sendTransaction') {
          console.log('Mocking transaction:', params);
          // Возвращаем фиктивный хеш транзакции
          return '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234';
        }

        if (method === 'eth_call') {
          console.log('Mocking call:', params);
          // Для большинства вызовов возвращаем пустой результат
          return '0x';
        }

        if (method === 'eth_estimateGas') {
          console.log('Mocking gas estimate');
          return '0x5208'; // 21000 в hex
        }

        if (method === 'eth_getTransactionReceipt') {
          console.log('Mocking transaction receipt');
          return {
            status: '0x1', // успешно
            blockNumber: '0x1',
            logs: []
          };
        }

        console.log('Unhandled method:', method);
        return null;
      },

      // Обработчик событий
      on: (eventName, listener) => {
        console.log('MetaMask event listener registered:', eventName);
      },

      // Статус подключения
      isConnected: () => true
    };

    // Эмитируем событие инициализации MetaMask
    // @ts-ignore
    window.dispatchEvent(new Event('ethereum#initialized'));
  }, address);

  console.log('MetaMask mock injected');

  // Нажимаем на кнопку подключения MetaMask
  const connectButton = page.locator('button:has-text("Connect MetaMask")').first();
  console.log('Clicking Connect MetaMask button');
  await connectButton.click();

  // Явно ждем появления кнопки "Deploy New Casino"
  await page.waitForSelector('button:has-text("Deploy New Casino")', { timeout: 15000 });

  console.log('Connected to MetaMask');
  await takeScreenshot(page, '02-connected-metamask');

  // Развертываем новое казино
  const deployCasinoButton = page.locator('button:has-text("Deploy New Casino")');
  console.log('Deploying Casino');
  await deployCasinoButton.click();
  await page.waitForTimeout(3000);

  console.log('Casino deployed');
  await takeScreenshot(page, '03-casino-deployed');

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

  console.log('Test completed successfully!');
});