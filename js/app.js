$(document).ready(function() {


	$('#top').append('<h1 class="text-center">Twitch Streamers</h1>');
	$('#top').addClass('bounce animated slideInDown');

	

	var twitchers = [
		'ESL_SC2', 'OgamingSC2', 'cretetion', 'freecodecamp',
		'storbeck', 'habathcx', 'RobotCaleb', 'noobs2ninjas',
		'comster404', 'brunofin'
	];

	for (var i = 0; i < twitchers.length; i++) {
		var t_url = 'https://api.twitch.tv/kraken/streams/';
		getJSON(t_url+=twitchers[i]);
	}

	function getJSON(url) {
		var jqxhr = $.getJSON(url, function() {
		})
		.always(function(data) {                     
			if (data.status == 422) {
				closed(data);
			}
			else if (data.stream === null) {
				var offUrl = data._links.channel;
				getJSON(offUrl);
			}
			else if (data.stream !== null && data.delay !== null) {
				online(data);
			}
			else {
				offline(data);
			}
		})
		.fail (function(jqxhr, textStatus, error) {
			var err = textStatus + ': ' + error;
			console.log(err);
			if (error == 'status code 422') {
				console.log('account closed');
			}
		});
	}

	function closed(data) {
		var message = data.responseJSON.message;
		var name = message.split(' ')[1].replace(/'+/g,'');

		$('#main').append('<div class="well closed"><span class="closedName">'+name+'</span><span class="closedStat">Account Closed</span></div>');
		$('.closed').addClass('animated slideInUp');
		$('div:gt(1)').not(':has(img)').prepend('<img src=images/closed.png>');
	}

	function offline(data) {
		var name = data.name;
		var logo = data.logo;
		var channelURL = data.url;
		$('#main').append('<a href='+channelURL+' target="_blank"><div class="well offline"><span class="name">'+name+'</span></div>');		
		$('.offline').addClass('animated slideInUp');
		$('div:gt(1)').not(':has(img)').prepend('<img src='+logo+'>');
	}

	function online(data) {
		console.log(data);
		var name = data.stream.channel.display_name;
		var game = data.stream.channel.game;
		var stats = data.stream.channel.status;
		var logo = data.stream.channel.logo;
		var channelURL = data.stream.channel.url;
		$('#main').append('<a href='+channelURL+' target="_blank"><div class="well online"><span class="name">'+name+'</span><span class="game">'+game+':</span><span class="stats">'+stats+'</span></div></a>');
		
		$('.online').addClass('animated slideInUp');
		$('div:gt(1)').not(':has(img)').prepend('<img src='+logo+'>');
	}	


	//Controls functionality of dropdown
	$('#dropDown').change(setOptions);
	function setOptions() {
		switch ($('#dropDown').val()) {
			case 'all' :
				$('.online').show();
				$('.offline').show();
				$('.closed').show();
				break;								
			case 'online' :
				$('.offline').hide();
				$('.closed').hide();
				$('.online').show();
				break;
			case 'offline' :
				$('.online').hide();
				$('.closed').hide();
				$('.offline').show();
				break;
		}
	}
});

