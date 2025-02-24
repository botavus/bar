const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://github.io/botavus/bar/tonconnect-manifest.json' // Замените на ваш URL
});

// Подключение кошелька
document.getElementById('connectBtn').addEventListener('click', async () => {
    try {
        await tonConnectUI.connectWallet();
        alert('Кошелек успешно подключен!');
        updateGameBalanceFromWallet(); // Синхронизация баланса после подключения кошелька
    } catch (error) {
        console.error('Ошибка при подключении кошелька:', error);
        alert('Не удалось подключить кошелек. Пожалуйста, попробуйте снова.');
    }
});

// Депозит
document.getElementById('depositBtn').addEventListener('click', async () => {
    const amount = parseFloat(document.getElementById('tonAmount').value);
    if (isNaN(amount) || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму для депозита.');
        return;
    }

    try {
        const transaction = {
            to: 'UQBxN9-JS58kiksh-FhCGcIyFb0mqNZe2Ds4q0A1tKeWVS1N', // Замените на ваш адрес
            value: amount * 1e9, // Конвертация в нанокрипто
            message: 'Deposit to Crypto Slots'
        };

        const result = await tonConnectUI.sendTransaction(transaction);
        if (result) {
            alert('Депозит успешно выполнен!');
            updateGameBalanceFromWallet(); // Синхронизация баланса после депозита
        } else {
            alert('Не удалось выполнить депозит. Пожалуйста, попробуйте снова.');
        }
    } catch (error) {
        console.error('Ошибка при выполнении депозита:', error);
        alert('Ошибка при выполнении депозита. Пожалуйста, проверьте баланс и попробуйте снова.');
    }
});

// Вывод
document.getElementById('withdrawBtn').addEventListener('click', async () => {
    const amount = parseFloat(document.getElementById('tonAmount').value);
    if (isNaN(amount) || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму для вывода.');
        return;
    }

    try {
        const wallet = tonConnectUI.wallet;
        if (!wallet) {
            alert('Кошелек не подключен. Пожалуйста, подключите кошелек.');
            return;
        }

        const transaction = {
            to: wallet.account.address,
            value: amount * 1e9, // Конвертация в нанокрипто
            message: 'Withdraw from Crypto Slots'
        };

        const result = await tonConnectUI.sendTransaction(transaction);
        if (result) {
            alert('Вывод успешно выполнен!');
            updateGameBalanceFromWallet(); // Синхронизация баланса после вывода
        } else {
            alert('Не удалось выполнить вывод. Пожалуйста, попробуйте снова.');
        }
    } catch (error) {
        console.error('Ошибка при выполнении вывода:', error);
        alert('Ошибка при выполнении вывода. Пожалуйста, проверьте баланс и попробуйте снова.');
    }
});

// Функция для синхронизации баланса игры с балансом кошелька
async function updateGameBalanceFromWallet() {
    try {
        const wallet = tonConnectUI.wallet;
        if (wallet) {
            const balance = await tonConnectUI.getBalance(); // Получение баланса кошелька
            const gameBalance = balance / 1e9; // Конвертация из нанокрипто в TON

            // Обновление баланса в игре
            document.getElementById('balance').textContent = gameBalance.toFixed(2);
            localStorage.setItem('gameBalance', gameBalance.toFixed(2)); // Сохранение баланса в localStorage
        }
    } catch (error) {
        console.error('Ошибка при синхронизации баланса:', error);
        alert('Не удалось синхронизировать баланс. Пожалуйста, попробуйте снова.');
    }
}

// Сохранение состояния игры
window.cryptoFunctions = {
    saveGameState: (balance, bet) => {
        const wallet = tonConnectUI.wallet;
        if (wallet) {
            localStorage.setItem(`slots_${wallet.account.address}`, JSON.stringify({ balance, bet }));
        }
    },
    loadGameState: () => {
        const wallet = tonConnectUI.wallet;
        if (wallet) {
            return JSON.parse(localStorage.getItem(`slots_${wallet.account.address}`));
        }
        return null;
    }
};

// Инициализация синхронизации баланса при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateGameBalanceFromWallet();
});
