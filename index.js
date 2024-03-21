import { Telegraf } from 'telegraf';
import moment from 'moment';

const bot = new Telegraf('7077150557:AAGTUqCN7DSMps9w7tCOBaxpLNiX16QO7Mc');
const ironovRenewalTime = 1711065599;

const calculateStringTime = () => {
    const diffTime = ironovRenewalTime - moment().utc(true).unix();
    if (diffTime <= 0) return '✨ Новая версия Иронова доступна! 🎉 👏';
    const duration = moment.duration(diffTime * 1000, 'milliseconds');
    const time = moment.utc(duration.as('milliseconds')).format('HH ч. mm мин. ss сек.');
    return `🕑 До новой версии Иронова, осталось: ${time}`;
};

let ironovTimer = null;

bot.on('message', async (ctx, next) => {
    const command = ctx.update.message.text;
    if (command === '/ironov-timer') {
        const { message_id } = await ctx.reply(calculateStringTime());

        if (ironovTimer) {
            clearInterval(ironovTimer);
            ironovTimer = null;
        }

        ironovTimer = setInterval(async () => {
            await ctx.telegram.editMessageText(ctx.chat.id, message_id, 0, calculateStringTime());
        }, 3000);
    }
    return next()
});
bot.launch();