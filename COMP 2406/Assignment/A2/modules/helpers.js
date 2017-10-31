exports.getId = function(len){
    var rArray = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
    var result = '';
    for (var i = len; i > 0; --i){
        result += rArray[Math.floor(Math.random() * rArray.length)];
    }
    return result;
}

exports.getTime = function(){
    return new Date().toLocaleTimeString();
}
