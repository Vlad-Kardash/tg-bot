const TelegramBot = require("node-telegram-bot-api");
const token = "7755955456:AAFI_f4bxjZcBUnTQYwfLWpgtbbypANrb6A";
const bot = new TelegramBot(token, { polling: true });

let gameBoard = [
  ["-", "-", "-"],
  ["-", "-", "-"],
  ["-", "-", "-"],
];
let currentPlayer = "X";

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    'Добро пожаловать в игру "крестики-нолики"! Чтобы сделать ход, отправьте номер строки (1-3) и номер столбца (1-3), например "2 3".'
  );
  drawBoard(chatId);
});

bot.onText(/^\d\s\d$/, (msg) => {
  const chatId = msg.chat.id;
  const [row, col] = msg.text.split(" ").map((x) => parseInt(x) - 1);
  if (gameBoard[row][col] === "-") {
    gameBoard[row][col] = currentPlayer;
    drawBoard(chatId);
    if (checkWin(currentPlayer)) {
      bot.sendMessage(chatId, `Игрок ${currentPlayer} победил!`);
      resetGame(chatId);
    } else if (isBoardFull()) {
      bot.sendMessage(chatId, "Ничья!");
      resetGame(chatId);
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      bot.sendMessage(chatId, `Ход игрока ${currentPlayer}`);
    }
  } else {
    bot.sendMessage(chatId, "Эта ячейка уже занята, попробуйте другую.");
  }
});

function drawBoard(chatId) {
  let boardStr = gameBoard.map((row) => row.join("")).join("\n");
  bot.sendMessage(chatId, boardStr);
}

function checkWin(player) {
  for (let i = 0; i < 3; i++) {
    if (
      gameBoard[i][0] === player &&
      gameBoard[i][1] === player &&
      gameBoard[i][2] === player
    ) {
      return true;
    }
    if (
      gameBoard[0][i] === player &&
      gameBoard[1][i] === player &&
      gameBoard[2][i] === player
    ) {
      return true;
    }
  }
  if (
    gameBoard[0][0] === player &&
    gameBoard[1][1] === player &&
    gameBoard[2][2] === player
  ) {
    return true;
  }
  if (
    gameBoard[0][2] === player &&
    gameBoard[1][1] === player &&
    gameBoard[2][0] === player
  ) {
    return true;
  }
  return false;
}

function isBoardFull() {
  return gameBoard.every((row) => row.every((cell) => cell !== "-"));
}

function resetGame(chatId) {
  gameBoard = [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ];
  currentPlayer = "X";
  drawBoard(chatId);
}
