// DEVELOPED WITH LOVE, BIFOT.RU

// settings

var TelegramBot = require('node-telegram-bot-api');
var request = require('request');
var token = 'WRITE_TOKEN';
var bot = new TelegramBot(token, {polling: true});
var config = require('./config.json');
var urlJSON = 'https://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+%22USDRUB,EURRUB,USDEUR,EURUSD%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';

// course

bot.on('message', function (msg, match, reply) {
	if (msg.text === "/start") {
		var settings = {
			parse_mode: 'markdown',
			reply_markup: JSON.stringify({
				keyboard: [
					[config.courseUSDRUB, config.convertUSDRUB],
					[config.courseUSDEUR, config.convertRUBUSD],
					[config.courseEURRUB, config.convertUSDEUR],
					[config.courseEURUSD, config.convertEURUSD]
				]
			})			
		}

		bot.sendMessage(msg.from.id, "*Привет, " + msg.from.username + "*! С помощью бота вы можете посмотреть курсы валют в реальном времени, а также сделать конверт из одной валюты в другую.", settings);
	}

	else if (msg.text === config.courseUSDRUB || msg.text === "/usd") {
		var settings = { parse_mode: 'markdown'};
		request(urlJSON, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				bot.sendMessage(msg.from.id, "*Покупка:* " + json.query.results.rate[0].Bid + " руб.\n*Продажа:* " + json.query.results.rate[0].Ask + " руб.", settings);
			}

			else {
		  		bot.sendMessage(msg.from.id, config.courseError)
		  	}
		})
	}

	else if (msg.text === config.courseEURRUB || msg.text === "/euro") {
		var settings = { parse_mode: 'markdown' };
		request(urlJSON, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
		   	bot.sendMessage(msg.from.id, "*Покупка:* " + json.query.results.rate[1].Bid + " руб.\n*Продажа:* " + json.query.results.rate[1].Ask + " руб.", settings);
		  }

		 	else {
				bot.sendMessage(msg.from.id, config.courseError)
			}
		})
	}

	else if (msg.text === config.courseUSDEUR || msg.text === "/usdtoeuro") {
		var settings = { parse_mode: 'markdown' };
		request(urlJSON, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
		   	bot.sendMessage(msg.from.id, "*Покупка:* " + json.query.results.rate[2].Bid + " евро.\n*Продажа:* " + json.query.results.rate[2].Ask + " евро.", settings);
		  }

			else {
		  		bot.sendMessage(msg.from.id, config.courseError)
		 	}
		})
	}

	else if (msg.text === config.courseEURUSD || msg.text === "/eurotousd") {
		var settings = { parse_mode: 'markdown' };
		request(urlJSON, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				bot.sendMessage(msg.from.id, "*Покупка:* " + json.query.results.rate[3].Bid + " доллара.\n*Продажа:* " + json.query.results.rate[3].Ask + " доллара.", settings);
		  	}

		  	else {
		  		bot.sendMessage(msg.from.id, config.courseError + reply.text)
		  	}
		})
	}

	else if (msg.text === config.convertUSDRUB || msg.text === "/usdtorub") {
		var opts = {
	  		reply_markup: JSON.stringify({
	      	force_reply: true
	    	})
	  	};
		
		bot.sendMessage(msg.from.id, 'Сколько долларов ты хочешь перевести в рубли?', opts)
			.then(function (sended) {
				var chatid = sended.chat.id;
				var messageid = sended.message_id;
		    	bot.onReplyToMessage(chatid, messageid, function (message) {
		    		if (/[0-9]/.test(message.text)) {
				    	request(urlJSON, function (error, response, body) {
				    		if (!error && response.statusCode == 200) {
								var json = JSON.parse(body);
								var coefficient = json.query.results.rate[0].Bid;
								var whatConvert = message.text;
								var result = Math.round((coefficient * whatConvert) * 100) / 100;   				
						    				
						    	bot.sendMessage(msg.from.id, '*' + message.text + ' долларов:* ' + result + ' руб.', settingsForConverter);
					    	}

					    	else {
					    		bot.sendMessage(msg.from.id, config.courseError, settingsForConverter);
					    	}
				    	});
				   }

				   else {
				   	bot.sendMessage(msg.from.id, config.errorNoNumber, settingsForConverter);
				   }
			   });
		   }
		);
	}

	else if (msg.text === config.convertRUBUSD || msg.text === "/rubtousd") {
		var opts = {
	  		reply_markup: JSON.stringify({
	      	force_reply: true
	    	})
	  	};
		
		bot.sendMessage(msg.from.id, 'Сколько рублей ты хочешь перевести в доллары?', opts)
			.then(function (sended) {
				var chatid = sended.chat.id;
				var messageid = sended.message_id;
		    	bot.onReplyToMessage(chatid, messageid, function (message) {
		    		if (/[0-9]/.test(message.text)) {
				    	request(urlJSON, function (error, response, body) {
				    		if (!error && response.statusCode == 200) {
								var json = JSON.parse(body);
								var coefficient = json.query.results.rate[0].Bid;
								var whatConvert = message.text;
								var result = Math.round((whatConvert / coefficient) * 100) / 100;   				
						    				
						    	bot.sendMessage(msg.from.id, '*' + message.text + ' рублей:* ' + result + ' долларов.', settingsForConverter);
					    	}

					    	else {
					    		bot.sendMessage(msg.from.id, config.courseError, settingsForConverter);
					    	}
				    	});
				   }

				   else {
				   	bot.sendMessage(msg.from.id, config.errorNoNumber, settingsForConverter);
				   }
			   });
		   }
		);
	}

	else if (msg.text === config.convertUSDEUR || msg.text === "/usdtoeuro") {
		var opts = {
	  		reply_markup: JSON.stringify({
	      	force_reply: true
	    	})
	  	};
		
		bot.sendMessage(msg.from.id, 'Сколько долларов ты хочешь перевести в евро?', opts)
			.then(function (sended) {
				var chatid = sended.chat.id;
				var messageid = sended.message_id;
		    	bot.onReplyToMessage(chatid, messageid, function (message) {
		    		if (/[0-9]/.test(message.text)) {
				    	request(urlJSON, function (error, response, body) {
				    		if (!error && response.statusCode == 200) {
								var json = JSON.parse(body);
								var coefficient = json.query.results.rate[2].Bid;
								var whatConvert = message.text;
								var result = Math.round((coefficient * whatConvert) * 100) / 100;	    				
						    				
						    	bot.sendMessage(msg.from.id, '*' + message.text + ' долларов:* ' + result + ' евро.', settingsForConverter);
					    	}

					    	else {
					    		bot.sendMessage(msg.from.id, config.courseError, settingsForConverter);
					    	}
				    	});
				   }

				   else {
				   	bot.sendMessage(msg.from.id, config.errorNoNumber, settingsForConverter);
				   }
			   });
		   }
		);
	}
	else if (msg.text === config.convertEURUSD || msg.text === "/eurotousd") {
		var opts = {
	  		reply_markup: JSON.stringify({
	      	force_reply: true
	    	})
	  	};
		
		bot.sendMessage(msg.from.id, 'Сколько евро ты хочешь перевести в доллары?', opts)
			.then(function (sended) {
				var chatid = sended.chat.id;
				var messageid = sended.message_id;
		    	bot.onReplyToMessage(chatid, messageid, function (message) {
		    		if (/[0-9]/.test(message.text)) {
				    	request(urlJSON, function (error, response, body) {
				    		if (!error && response.statusCode == 200) {
								var json = JSON.parse(body);
								var coefficient = json.query.results.rate[3].Bid;
								var whatConvert = message.text;
								var result = Math.round((coefficient * whatConvert) * 100) / 100;	    				
						    				
						    	bot.sendMessage(msg.from.id, '*' + message.text + ' евро:* ' + result + ' долларов.', settingsForConverter);
					    	}

					    	else {
					    		bot.sendMessage(msg.from.id, config.courseError, settingsForConverter);
					    	}
				    	});
				   }

				   else {
				   	bot.sendMessage(msg.from.id, config.errorNoNumber, settingsForConverter);
				   }
			   });
		   }
		);
	}
});

var settingsForConverter = {
	parse_mode: 'markdown',
	reply_markup: JSON.stringify({
		keyboard: [
			[config.courseUSDRUB, config.convertUSDRUB],
			[config.courseUSDEUR, config.convertRUBUSD],
			[config.courseEURRUB, config.convertUSDEUR],
			[config.courseEURUSD, config.convertEURUSD]
		]
	})	
}	