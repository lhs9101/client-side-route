ESLS.ROUTER = function() {
    var routes = [];
    var self = this;
    window.onpopstate = function() {
        self.changeRoute(location.pathname);
    };

    function getRouteInfo(url) {
        var params = {};
        var functions;
        var urlArr = url.split('/').filter(el => el !== '');
        routes.some((route, i) => {
            if (urlArr.length !== route.length) return false;
            return urlArr.every((el, j) => {
                if (j > route.identifier.length - 1) { // 여기서부터 params
                    params[route.paramNames[j - route.identifier.length]] = el;
                    return true;
                }
                var isSame = el === route.identifier[j];
                if (isSame && j === route.identifier.length - 1) functions = route.functions;
                return isSame;
            });
        });
        return { functions, params };
    }


    this.setRoute = function(...args) {
        var url = args.shift();
        var urlArr = url.split('/').filter(el => el !== '');
        var identifier = urlArr.filter(el => el.indexOf(':') === -1);
        var paramNames = urlArr.filter(el => el.indexOf(':') !== -1).map(el => el.substr(1));
        var functions = args;
        var length = identifier.length + paramNames.length;
        routes.push({ identifier, paramNames, functions, length });
    };
    this.changeRoute = function(url) {
        var routeInfo = getRouteInfo(url);
        var params = routeInfo.params;
        var isEnd = false;
        routeInfo.functions.every((el, i) => {
            var isNext = false;
            el(params, function() {
                isNext = true;
            });
            if (i === routeInfo.functions.length - 1) isEnd = true;
            return isNext;
        });
        return isEnd;
    };
    this.navigate = function(url, data, title) {
        var isEnd = self.changeRoute(url);
        if (isEnd) history.pushState(data, title, url);
    };
};
