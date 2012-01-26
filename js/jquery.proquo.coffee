$.fn.extend
	
	proQuo: (options)->
		shortUrlLength = 20
		shortUrlLengthHttps = 21
		$tweets = $(this)
		ops = $.extend(
			tweetLabel: "Tweet&nbsp;this"
			addCurlyQuotes: no
			updateUrlLengthFromTwitter: no
			useTwitterButton: no
			getTweetSourceUrl: (callback)->
				callback(window.location.href)
			getTweetText: ->
				return $.trim($(this).text())
			getTwitterStatus: (text, url)->
				urllen = shortUrlLength
				if url.indexOf('https') > -1
					urllen = shortUrlLengthHttps
				availableTextChars = 140 - (urllen + 1)

				if text.length > availableTextChars
					extraTrim = 1 # ellipses
					if ops.addCurlyQuotes then extraTrim += 2
					text = text.substring(0, availableTextChars - extraTrim)
					text = "#{text}&#8230"
				
				if ops.addCurlyQuotes
					text = "&#8220#{text}&#8221"
				return text
			getTweetUrl: (status, url)->
				text = encodeURI(status)
				url = encodeURI($.trim(url))
				baseUrl = "https://twitter.com/intent/tweet"
				if ops.useTwitterButton
					baseUrl = "https://twitter.com/share"
				href = "#{baseUrl}?text=#{text}&url=#{url}"
				return href
			createTweetLink: (twitterUrl, linkLabel)->
				$link = $("<a href='#{twitterUrl}'>#{linkLabel}</a>")
				if ops.useTwitterButton then $link.addClass("twitter-share-button")
				return $link
			placeTweetLink: ($link)->
				$(this).append("&nbsp;").append($link)
		, options)
		
		createTwitterLinks = ->
			$tweets.each (i, el)->
				$el = $(el)
				$.proxy(ops.getTweetSourceUrl, $el) (url)->
					text = $.trim($.proxy(ops.getTweetText, $el)(url))
					status = $.proxy(ops.getTwitterStatus, $el)(text, url)
					linkUrl = $.proxy(ops.getTweetUrl, $el)(status, url)
					$link = $.proxy(ops.createTweetLink, $el)(linkUrl, ops.tweetLabel)
					if $link?.length
						$.proxy(ops.placeTweetLink, $el)($link)
			
			if twttr?
				twttr.widgets.load()
			else
				$.getScript 'https://platform.twitter.com/widgets.js', ->

			return $tweets
		
		if ops.updateUrlLengthFromTwitter
			$.getJSON "https://api.twitter.com/1/help/configuration.json?callback=?", (data)=>
				shortUrlLength = data.short_url_length
				shortUrlLengthHttps = data.short_url_length_https
				createTwitterLinks()
		else
			createTwitterLinks()

		


