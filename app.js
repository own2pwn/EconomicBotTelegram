// settings

var TelegramBot = require('node-telegram-bot-api');
var request = require('request');
var token = 'TOKEN';
var bot = new TelegramBot(token, {polling: true});
var config = require('./config.json');
var urlJSON = 'https://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+%22USDRUB,EURRUB,USDEUR,EURUSD,BYNRUB%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';

// course

bot.on('message', function (msg, match, reply) {
	if (msg.text === "/start") {
		var settings = {
			parse_mode: 'markdown',
			reply_markup: JSON.stringify({
				keyboard: [
					[config.course, config.converter],
					[config.author]
				]
			})			
		}

		bot.sendMessage(msg.from.id, "*Привет, " + msg.from.username + "*! С помощью бота ты можешь посмотреть курсы валют в реальном времени, а также сделать конверт из одной валюты в другую.", settings);
	}

	else if (msg.text === config.author || msg.text === "/author") {
		var settings = {
			parse_mode: 'markdown'
		}

		bot.sendMessage(msg.from.id, "Разработчик бота — *Семин Михил*.\n\n*Контакты для связи:*\n— bifot@bifot.ru\n— @bifot\n— [ВКонтакте](https://vk.com/bifot)\n— [Личный сайт](http://bifot.ru)", settings);
	}

	else if (msg.text === config.cancel || msg.text === "/cancel") {
		var settings = {
			reply_markup: JSON.stringify({
				keyboard: [
					[config.course, config.converter],
					[config.author]
				]
			})			
		}

		bot.sendMessage(msg.from.id, "Ты отменил текущее действие. Выбери что-нибудь.", settings)
	}

	else if (msg.text === config.course || msg.text === "/course") {
		var settings = {
			parse_mode: 'markdown',
			reply_markup: JSON.stringify({
				keyboard: [
					[config.courseUSDRUB, config.courseUSDEUR],
					[config.courseEURRUB, config.courseEURUSD],
					[config.courseBYNRUB, config.courseRUBBYN],
					[config.cancel]
				]
			})	
		}

		bot.sendMessage(msg.from.id, "Ты выбрал *просмотр курсов*. Выбери нужные валюты.", settings);
	}

	else if (msg.text === config.converter || msg.text === "/convert") {
		var settings = {
			parse_mode: 'markdown',
			reply_markup: JSON.stringify({
				keyboard: [
					[config.convertUSDRUB, config.convertRUBUSD],
					[config.convertUSDEUR, config.convertEURUSD],
					[config.convertBYNRUB, config.convertRUBBYN],
					[config.cancel]
				]
			})
		}

		bot.sendMessage(msg.from.id, "Ты выбрал *конвертацию курсов*. Выбери нужные валюты.", settings);
	}

	else if (msg.text === config.courseUSDRUB || msg.text === "/usd") {
		var settings = { parse_mode: 'markdown'};
		
		request(urlJSON, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				bot.sendMessage(msg.from.id, "*1 доллар США (USD)*\n\n" + "*Покупка:* " + json.query.results.rate[0].Bid + " руб.\n*Продажа:* " + json.query.results.rate[0].Ask + " руб.", settings);
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
		   	bot.sendMessage(msg.from.id, "*1 евро (EUR)*\n\n" + "*Покупка:* " + json.query.results.rate[1].Bid + " руб.\n*Продажа:* " + json.query.results.rate[1].Ask + " руб.", settings);
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
		   	bot.sendMessage(msg.from.id, "*1 доллар США (USD)*\n\n" + "*Покупка:* " + json.query.results.rate[2].Bid + " евро.\n*Продажа:* " + json.query.results.rate[2].Ask + " евро.", settings);
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
				bot.sendMessage(msg.from.id, "*1 евро (EUR)*\n\n" + "*Покупка:* " + json.query.results.rate[3].Bid + " доллара.\n*Продажа:* " + json.query.results.rate[3].Ask + " доллара.", settings);
		  	}

		  	else {
		  		bot.sendMessage(msg.from.id, config.courseError + reply.text)
		  	}
		})
	}

	else if (msg.text === config.courseBYNRUB || msg.text === "/bynrub") {
		var settings = { parse_mode: 'markdown' };
		
		request(urlJSON, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				bot.sendMessage(msg.from.id, "*1 белорусский рубль (BYN)*\n\n" + "*Покупка:* " + json.query.results.rate[4].Bid + " руб.\n*Продажа:* " + json.query.results.rate[4].Ask + " руб.", settings);
		  	}

		  	else {
		  		bot.sendMessage(msg.from.id, config.courseError + reply.text)
		  	}
		})
	}

	else if (msg.text === config.courseRUBBYN || msg.text === "/rubbyn") {
		var settings = { parse_mode: 'markdown' };
		
		request(urlJSON, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				bot.sendMessage(msg.from.id, "*1 российский рубль (RUB)*\n\n" + "*Покупка:* " + Math.round((1 / json.query.results.rate[4].Bid) * 100) / 100 + " бел. руб.\n*Продажа:* " + Math.round((1 / json.query.results.rate[4].Ask) * 100) / 100 + " бел. руб.", settings);
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

	else if (msg.text === config.convertBYNRUB || msg.text === "/byntorub") {
		var opts = {
	  		reply_markup: JSON.stringify({
	      	force_reply: true
	    	})
	  	};
		
		bot.sendMessage(msg.from.id, 'Сколько белорусских рублей ты хочешь перевести в российские рубли?', opts)
			.then(function (sended) {
				var chatid = sended.chat.id;
				var messageid = sended.message_id;
		    	
		    	bot.onReplyToMessage(chatid, messageid, function (message) {
		    		if (/[0-9]/.test(message.text)) {
				    	request(urlJSON, function (error, response, body) {
				    		if (!error && response.statusCode == 200) {
								var json = JSON.parse(body);
								var coefficient = json.query.results.rate[4].Bid;
								var whatConvert = message.text;
								var result = Math.round((coefficient * whatConvert) * 100) / 100;	    				
						    				
						    	bot.sendMessage(msg.from.id, '*' + message.text + ' бел. руб:* ' + result + ' руб.', settingsForConverter);
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

	else if (msg.text === config.convertRUBBYN || msg.text === "/rubtobyn") {
		var opts = {
	  		reply_markup: JSON.stringify({
	      	force_reply: true
	    	})
	  	};
		
		bot.sendMessage(msg.from.id, 'Сколько белорусских рублей ты хочешь перевести в российские рубли?', opts)
			.then(function (sended) {
				var chatid = sended.chat.id;
				var messageid = sended.message_id;
		    	bot.onReplyToMessage(chatid, messageid, function (message) {
		    		if (/[0-9]/.test(message.text)) {
				    	request(urlJSON, function (error, response, body) {
				    		if (!error && response.statusCode == 200) {
								var json = JSON.parse(body);
								var coefficient = json.query.results.rate[4].Bid;
								var whatConvert = message.text;
								var result = Math.round((whatConvert / coefficient) * 100) / 100;	    				
						    				
						    	bot.sendMessage(msg.from.id, '*' + message.text + ' руб:* ' + result + ' бел. руб.', settingsForConverter);
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
			[config.convertUSDRUB, config.convertRUBUSD],
			[config.convertUSDEUR, config.convertEURUSD],
			[config.convertBYNRUB, config.convertRUBBYN],
			[config.cancel]
		]
	})	
}	