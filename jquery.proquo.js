(function() {

  $.fn.extend({
    proQuo: function(options) {
      var $tweets, createTwitterLinks, ops, shortUrlLength, shortUrlLengthHttps,
        _this = this;
      shortUrlLength = 20;
      shortUrlLengthHttps = 21;
      $tweets = $(this);
      ops = $.extend({
        tweetLabel: "Tweet&nbsp;this",
        addCurlyQuotes: false,
        updateUrlLengthFromTwitter: false,
        useTwitterButton: false,
        getTweetSourceUrl: function(callback) {
          return callback(window.location.href);
        },
        getTweetText: function() {
          return $.trim($(this).text());
        },
        getTwitterStatus: function(text, url) {
          var availableTextChars, extraTrim, urllen;
          urllen = shortUrlLength;
          if (url.indexOf('https') > -1) urllen = shortUrlLengthHttps;
          availableTextChars = 140 - (urllen + 1);
          if (text.length > availableTextChars) {
            extraTrim = 1;
            if (ops.addCurlyQuotes) extraTrim += 2;
            text = text.substring(0, availableTextChars - extraTrim);
            text = "" + text + "&#8230";
          }
          if (ops.addCurlyQuotes) text = "&#8220" + text + "&#8221";
          return text;
        },
        getTweetUrl: function(status, url) {
          var baseUrl, href, text;
          text = encodeURI(status);
          url = encodeURI($.trim(url));
          baseUrl = "https://twitter.com/intent/tweet";
          if (ops.useTwitterButton) baseUrl = "https://twitter.com/share";
          href = "" + baseUrl + "?text=" + text + "&url=" + url;
          return href;
        },
        createTweetLink: function(twitterUrl, linkLabel) {
          var $link;
          $link = $("<a href='" + twitterUrl + "'>" + linkLabel + "</a>");
          if (ops.useTwitterButton) $link.addClass("twitter-share-button");
          return $link;
        },
        placeTweetLink: function($link) {
          return $(this).append("&nbsp;").append($link);
        }
      }, options);
      createTwitterLinks = function() {
        $tweets.each(function(i, el) {
          var $el;
          $el = $(el);
          return $.proxy(ops.getTweetSourceUrl, $el)(function(url) {
            var $link, linkUrl, status, text;
            text = $.trim($.proxy(ops.getTweetText, $el)(url));
            status = $.proxy(ops.getTwitterStatus, $el)(text, url);
            linkUrl = $.proxy(ops.getTweetUrl, $el)(status, url);
            $link = $.proxy(ops.createTweetLink, $el)(linkUrl, ops.tweetLabel);
            if ($link != null ? $link.length : void 0) {
              return $.proxy(ops.placeTweetLink, $el)($link);
            }
          });
        });
        if (typeof twttr !== "undefined" && twttr !== null) {
          twttr.widgets.load();
        } else {
          $.getScript('https://platform.twitter.com/widgets.js', function() {});
        }
        return $tweets;
      };
      if (ops.updateUrlLengthFromTwitter) {
        return $.getJSON("https://api.twitter.com/1/help/configuration.json?callback=?", function(data) {
          shortUrlLength = data.short_url_length;
          shortUrlLengthHttps = data.short_url_length_https;
          return createTwitterLinks();
        });
      } else {
        return createTwitterLinks();
      }
    }
  });

}).call(this);
