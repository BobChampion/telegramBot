require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');
const commandsObj = require('./commands');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(`Hello ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Unknown'}!`),
);
bot.help((ctx) => ctx.reply(commandsObj.commands));
bot.launch();

bot.command('courses', async (ctx) => {
  try {
    await ctx.replyWithHTML(
      '<b>Courses</b>',
      Markup.inlineKeyboard([
        [Markup.button.callback('YOUTUBE', 'btn_1'), Markup.button.callback('FACEBOOK', 'btn_2')],
        [Markup.button.callback('INSTAGRAM', 'btn_3')],
      ]),
    );
  } catch (e) {
    console.log(e);
  }
});

function addActionBot(name, src, text) {
  bot.action(name, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      if (src !== false) {
        await ctx.replyWithPhoto({
          source: src,
        });
      }
      await ctx.replyWithHTML(text, {
        disable_web_page_preview: true,
      });
    } catch (e) {
      console.log(e);
    }
  });
}

addActionBot('btn_1', './img/1.jpg', commandsObj.labels.text1);
addActionBot('btn_2', './img/2.jpg', commandsObj.labels.text2);
addActionBot('btn_3', false, commandsObj.labels.text3);
console.log(commandsObj);

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
