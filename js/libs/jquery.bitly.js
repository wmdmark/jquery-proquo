
jQuery.extend({
    Bitly: function(options) { this.init(options); }
});

jQuery.extend(jQuery.Bitly.prototype, {

    init: function(options) {
        if (!options) options = {
            login: 'bitlyapidemo',
            key: 'R_0da49e0a9118ff35f52f629d2d71bf07'
        }
        if (!options.version) options.version = '2.0.1';
        if (!options.history) options.history = '0';
        if (!options.onError) options.onError = this._default_onError;
        this.default_options = options;
        return this;
    },

    shorten: function(long_url, options) {
    
        if (jQuery.isFunction(options)) options = {onSuccess: options };
        
        var d_o = this.default_options;
        jQuery.each(d_o, function(i) { if (options[i] == undefined) { options[i] = d_o[i]; } });
        
        if (!options.onSuccess) {
            if (console) console.error('onSuccess undefiened');
            return;
        }

        var url = "http://api.bit.ly/shorten?" +"longUrl="+encodeURIComponent(long_url)
            +"&login="+options.login +"&apiKey="+options.key
            +"&history="+options.history +"&version="+options.version
            +"&format=json&callback=?";

        jQuery.getJSON(url, function(data){
            if (data.errorCode != 0) {
                options.onError(data);
            } else {
                var res =  data.results[long_url];
                if (res.errorCode && res.errorCode !=0 ) {
                    options.onError(res);  
                } else {
                    options.onSuccess(res.shortUrl);
                }
            }
        });
    },

    _default_onError: function(data) {
        if (!console) return;
        var msg =  'Bitly error: ' + data.errorCode + '\n' + data.errorMessage
        console.error(msg);
        console.debug(data);
    }

});

