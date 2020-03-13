ESLS.ROUTER = function() {
    var routes = [];


    function getRouteInfo(url) {
        var params = {};
        var functions;
        var urlArr = url.split('/').filter(el => el !== '');
        routes.some((route, i) => {
            if (urlArr.length !== route.length) return false;
            return urlArr.every((el, j) => {
                if (j > route.identifier.length - 1) { // 여기서부터 params
                    params[route.paramNames[j-route.identifier.length]] = el;
                    return true;
                }
                var isSame = el === route.identifier[j];
                if(isSame && j === route.identifier.length -1) functions = route.functions;
                return isSame;
            });
        });
        return {functions,params};
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
    this.navigate = function(url,data,title) {
        var routeInfo = getRouteInfo(url);
        var params = routeInfo.params;
        routeInfo.functions.every(el=>{
            var isNext = false;
            el(params,function(){
                isNext = true;
            });
            return isNext;
        });
        history.pushState(data,title,url);
    };
};
