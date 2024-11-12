const { Telegraf } = require("telegraf");

const bot = new Telegraf("7755955456:AAFI_f4bxjZcBUnTQYwfLWpgtbbypANrb6A");

const adminChatId = "710244620";

let isForwarding = false;
let userChatId = "";

bot.start((ctx) => {
  userChatId = ctx.chat.id;
  ctx.reply(
    "Привет! Отправь мне сообщение, которое хочешь передать администратору."
  );
});

bot.command("admin", (ctx) => {
  if (ctx.chat.id == adminChatId) {
    isForwarding = true;
    ctx.reply(
      "Вы перешли в режим администратора. Теперь вы можете отправить сообщение пользователю."
    );
  } else {
    ctx.reply("Вы не администратор");
  }
});

bot.on("text", (ctx) => {
  if (isForwarding && ctx.chat.id == adminChatId) {
    bot.telegram.sendMessage(
      userChatId,
      `Администратор написал: ${ctx.message.text}`
    );
    isForwarding = false;
  } else {
    bot.telegram.sendMessage(
      adminChatId,
      `Пользователь написал: ${ctx.message.text}`
    );
    ctx.reply("Ваше сообщение отправлено администратору");
  }
});

bot.launch();
