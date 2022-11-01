try {

    function setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    }
    
    setupWebViewJavascriptBridge(function(bridge) {
        bridge.registerHandler('fetch', function(_data, _responseCallback) { });
        bridge.registerHandler('invoke', function(_data, _responseCallback) { });
    });

    // global settings

    var func_count = 0;
    var max_limit = 100;
    var is_android = /(Android)/i.test(navigator.userAgent);
    bridge.ext = {};

    // ios fix

    //if (!is_android) {
        //window.webstock = window.webkit.messageHandlers;
    //}

    if (is_android && !window.webstock) {
        throw new Error("webstock is not ready");
    }

    // if (typeof webstock.invoke !== 'function') {
        // throw new Error("invoke method is not available");
    // }

    // if (typeof webstock.fetch !== 'function') {
        // throw new Error("fetch method is not available");
    // }

    // define something

    function mangle(call) {
        var id = func_count + 1;

        if (id > max_limit) {
            id = 1;
            func_count = 0;
        }

        var func_name = '__call_' + id;

        func_count += 1;
        window.bridge.ext[func_name] = function(data_key) {
            if (!is_android) {
                WebViewJavascriptBridge.callHandler('fetch', data_key, function(response) {
                    console.log('fetch return:' + response);
                    call(JSON.parse(response));
                });
            } else {
                try {
                    call(JSON.parse(webstock.fetch(data_key)));
                } catch(e) {
                    console.log(e);
                    call();
                }
            }
        };

        return 'bridge.ext.' + func_name;
    }

    function init_call(config) {
        if (typeof config === 'function') {
            return mangle(config);
        }

        var result = {};
        var temp = null;

        for (var item in config) {
            temp = config[item];
            if (typeof temp === 'function') {
                result[item] = mangle(temp);
            } else {
                result[item] = temp;
            }
        }

        return JSON.stringify(result);
    }

    function bridge() {
        var method_name = null;
        var param_array = [];
        var param_str = "";

        for (var i = 0; i < arguments.length; i++) {
            var item = arguments[i];
            if (i == 0) {
                method_name = item;
            } else {
                var result = init_call(item);
                param_array.push(result);
            }
        }

        for (var j = 0; j < param_array.length; j++) {
            var param = param_array[j];
            if (j + 1 == param_array.length) {
                param_str += param;
            } else {
                param_str += param + ",";
            }
        }

        // fix ios

        if (!is_android) {
            WebViewJavascriptBridge.callHandler('invoke', {
                method: method_name,
                param: param_array.toString() || "{}"
            }, function(_response) {});
            /*webstock.invoke.postMessage({
                method: method_name,
                param: param_array.toString() || "{}"
            });*/
        } else {
            webstock.invoke(method_name, param_array.toString() || "{}");
        }
    }

} catch(e) {
    // alert(e.message);
    var bridge = function() {
        throw new Error("webstock is not available");
    };
}