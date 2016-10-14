// Telegram settings

var TelegramBot = require('node-telegram-bot-api');
var token = 'TOKEN';
var bot = new TelegramBot(token, { polling: true });

// Require some plugins...

var request = require('request');
var fs = require('fs');
var path = require('path');
var http = require('http');
var xml2js = require('xml2js');

var config = require('./config');

// Fuck the date

var date = new Date();
var today = (date.getMonth() + 1) + "." + date.getDate() + "." + date.getFullYear();

// Time in ms

var oneMinute = 60000;
var oneHour = oneMinute * 60;
var halfDay = oneHour * 12
var oneDay = halfDay * 2;

// Parsing xml

setInterval(function downloadXML () {
  var file = fs.createWriteStream("xml/file.xml");
  var request = http.get("http://www.cbr.ru/scripts/XML_daily.asp", function(response) {
    response.pipe(file);
  });

  if (file)
    console.log('Парсинг XML-файла прошел успешно')
  else
    console.log('Ошибка парсинга')
}, halfDay);

// Commands

bot.on('message', function (msg) {
  if (msg.text === "/start") { // /start
    var settings = {
      parse_mode: 'markdown',
      reply_markup: JSON.stringify({
        keyboard: [
          [config.course, config.converter],
          [config.author]
        ]
      })
    }

    bot.sendMessage(msg.from.id, "*Привет, " + msg.from.username + "*! С помощью бота Вы можете посмотреть курсы валют в реальном времени, а также сделать конверт из одной валюты в другую.", settings);
  } else if (msg.text === config.course) { // /course
    var settings = {
      reply_markup: JSON.stringify({
        keyboard: [
          [config.courseUSD, config.courseEUR],
          [config.courseBYN, config.courseUAH],
          [config.cancel]
        ]
      })
    }

    bot.sendMessage(msg.from.id, "Выберите валюту:", settings);
  } else if (msg.text === config.converter) { // /convert
    var settings = {
      reply_markup: JSON.stringify({
        keyboard: [
          [config.convertUSDRUB, config.convertEURRUB],
          [config.convertBYNRUB, config.convertUAHRUB]
        ]
      })
    }

    bot.sendMessage(msg.from.id, "Выберите валюту:", settings);
  } else if (msg.text === config.author) { // /author
    var settings = {
      parse_mode: 'markdown',
      reply_markup: JSON.stringify({
        force_reply: true
      })
    };

    bot.sendMessage(msg.from.id, "Напишите ваше сообщение:", settings)
      .then(function (send) {
        bot.onReplyToMessage(send.chat.id, send.message_id, function(message) {
          var settings = {
            parse_mode: 'markdown',
            reply_markup: JSON.stringify({
              keyboard: [
                [config.course, config.converter],
                [config.author]
              ]
            })
          };

          // Send message to admin
          bot.sendMessage(91990226, "*Письмо от @EconomicallysBot:*\n\n" + "От: @" + msg.chat.username + "\n\n" + message.text, settings);
          // Sended
          bot.sendMessage(msg.from.id, "Сообщение отправлено.");
        });
    });
  } else if (msg.text === config.cancel) {
    var settings = {
      parse_mode: 'markdown',
      reply_markup: JSON.stringify({
        keyboard: [
          [config.course, config.converter],
          [config.author]
        ]
      })
    };

    bot.sendMessage(msg.from.id, "Отмена текущего действия. Выберите что-нибдь другое.", settings);
  }

  // Courses
  else if (msg.text === config.courseUSD)
    convertSomething('usd'); // Доллары
  else if (msg.text === config.courseEUR)
    convertSomething('euro'); // Евро
  else if (msg.text === config.courseBYN)
    convertSomething('byn'); // Бел. руб
  else if (msg.text === config.courseUAH)
    convertSomething('uah'); // Гривны
  
  // Converting
  else if (msg.text === config.convertUSDRUB) {
    var settings = {
      reply_markup: JSON.stringify({
        force_reply: true
      })
    };

    bot.sendMessage(msg.from.id, "Сколько долларов вы хотите перевести в рубли?", settings)
      .then(function(send) {
        bot.onReplyToMessage(send.chat.id, send.message_id, function(message) {
          if (/^\d+$/.test(message.text))
            convertSomething('usd', 'convert', message.text); // Конверт из долларов в рубли
          else
            bot.sendMessage(msg.from.id, config.errorNoNumber);
        });
      })
  } else if (msg.text === config.convertEURRUB) {
    var settings = {
      reply_markup: JSON.stringify({
        force_reply: true
      })
    };

    bot.sendMessage(msg.from.id, "Сколько евро вы хотите перевести в рубли?", settings)
      .then(function(send) {
        bot.onReplyToMessage(send.chat.id, send.message_id, function(message) {
          if (/^\d+$/.test(message.text))
            convertSomething('euro', 'convert', message.text); // Конверт из долларов в рубли
          else
            bot.sendMessage(msg.from.id, config.errorNoNumber);
        });
      })
  } else if (msg.text === config.convertBYNRUB) {
    var settings = {
      reply_markup: JSON.stringify({
        force_reply: true
      })
    };

    bot.sendMessage(msg.from.id, "Сколько белорусских рублей вы хотите перевести в рубли?", settings)
      .then(function(send) {
        bot.onReplyToMessage(send.chat.id, send.message_id, function(message) {
          if (/^\d+$/.test(message.text))
            convertSomething('byn', 'convert', message.text); // Конверт из долларов в рубли
          else
            bot.sendMessage(msg.from.id, config.errorNoNumber);
        });
      })
  } else if (msg.text === config.convertUAHRUB) {
    var settings = {
      reply_markup: JSON.stringify({
        force_reply: true
      })
    };

    bot.sendMessage(msg.from.id, "Сколько гривен вы хотите перевести в рубли?", settings)
      .then(function(send) {
        bot.onReplyToMessage(send.chat.id, send.message_id, function(message) {
          if (/^\d+$/.test(message.text))
            convertSomething('uah', 'convert', message.text); // Конверт из долларов в рубли
          else
            bot.sendMessage(msg.from.id, config.errorNoNumber);
        });
      })
  }

  // Converting function
  function convertSomething (currency, toDo, value) {
    var parser = new xml2js.Parser();

    fs.readFile(__dirname + '/xml/file.xml', function(err, data) {
      parser.parseString(data, function(err, result) {
        // Keyboard for courses
        var settingsForResultsOfCourses = {
          parse_mode: 'markdown',
          reply_markup: JSON.stringify({
            keyboard: [
              [config.courseUSD, config.courseEUR],
              [config.courseBYN, config.courseUAH],
              [config.cancel]
            ]
          })
        };

        // Keyboard for convert
        var settingsForResultsOfConvert = {
          parse_mode: 'markdown',
          reply_markup: JSON.stringify({
            keyboard: [
              [config.convertUSDRUB, config.convertEURRUB],
              [config.convertBYNRUB, config.convertUAHRUB],
              [config.cancel]
            ]
          })
        };

        if (currency == 'usd') {
          var usd = (parseFloat(result.ValCurs.Valute[9].Value[0].replace(',', '.'))).toFixed(2); // formating course
          var summa = (usd * value).toFixed(2);
          
          // What we must do? Convert or no?

          if (toDo == 'convert')
            bot.sendMessage(msg.from.id, "🇱🇷 *" + value + " USD:* " + summa + " руб.", settingsForResultsOfConvert) // Converting
          else
            bot.sendMessage(msg.from.id,  "*Официальный курс ЦБ на " + today + "*\n\n"
                                          + "🇱🇷 *USD* - " + usd + " руб.", settingsForResultsOfCourses); // Only course
        } else if (currency == 'euro') {
          var euro = (parseFloat(result.ValCurs.Valute[10].Value[0].replace(',', '.'))).toFixed(2); // formating course
          var summa = (euro * value).toFixed(2);

          // What we must do? Convert or no?

         if (toDo == 'convert')
            bot.sendMessage(msg.from.id, "🇫🇲 *" + value + " EURO:* " + summa + " руб.", settingsForResultsOfConvert) // Converting
          else
            bot.sendMessage(msg.from.id,  "*Официальный курс ЦБ на " + today + "*\n\n"
                                          + "🇫🇲 *EUR* - " + euro + " руб.", settingsForResultsOfCourses); // Only course
        } else if (currency == 'byn') {
          var byn = (parseFloat(result.ValCurs.Valute[4].Value[0].replace(',', '.'))).toFixed(2); // formating course
          var summa = (byn * value).toFixed(2);

          // What we must do? Convert or no?

          if (toDo == 'convert')
            bot.sendMessage(msg.from.id, "🇧🇾 *" + value + " BYN:* " + summa + " руб.", settingsForResultsOfConvert) // Converting
          else
            bot.sendMessage(msg.from.id,  "*Официальный курс ЦБ на " + today + "*\n\n"
                                          + "🇧🇾 *BYN* - " + byn + " руб.", settingsForResultsOfCourses); // Only course
        } else if (currency == 'uah') {
          var uah = (parseFloat((result.ValCurs.Valute[26].Value[0].replace(',', '.')) * 0.1)).toFixed(2); // formating course
          var summa = (uah * value).toFixed(2);

          // What we must do? Convert or no?

          if (toDo == 'convert')
            bot.sendMessage(msg.from.id, "🇺🇦 *" + value + " UAH:* " + summa + " руб.", settingsForResultsOfConvert) // Converting
          else
            bot.sendMessage(msg.from.id,  "*Официальный курс ЦБ на " + today + "*\n\n"
                                          + "🇺🇦 *UAH* - " + uah + " руб.", settingsForResultsOfCourses); // Only course
        }
      });
    });
  }
});