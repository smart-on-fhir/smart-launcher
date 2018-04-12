_.mixin({
  get: function (obj, key) {
    var type = typeof key;

    if(typeof obj === 'undefined' || type === 'undefined')
      return undefined;

    if (type == 'string' || type == "number") {
      key = ("" + key).replace(/\[(.*?)\]/,/\[(.*?)\]/, function (m, key) { //handle case where [1] may occur
        return '.' + key.replace(/["']/g,/["']/g, ""); //strip quotes
      }).split('.');
    }
    for (var i = 0, l = key.length; i < l; i++) {
      if (typeof obj !== 'undefined' && _.has(obj, key[i])) obj = obj[key[i]];
      else return undefined;
    }
    return obj;
  }
});