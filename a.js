var Ywrap = (wrapper_func, f) => (x => x(x))(x => f(wrapper_func(y => x(x)(y))));
var memo_wrapper_generator = function () {
    const memo = {};
    return f => n => {
        if (memo.hasOwnProperty(n)) {
            return memo[n];
        }
        const result = f(n);
        memo[n] = result;
        return result;
    };
};
var Ymemo = f => Ywrap(memo_wrapper_generator(), f);
var factorial_ = f => {
    window.a++;
    return (n => ((n === 0) ? 1 : n * f(n - 1)));
};
var factorial = Ymemo(factorial_);


var tests = [];
tests.push(function () {
    window.a = 0;
    ret = factorial(10) + " " + window.a + "calls";
    document.write("factorial(10) = " + ret + "<br>");
});




var table = function (a) {
    var res = '<table class="table"><tbody><tr><th>n</th><th>p(n)</th></tr>';
    for (var key in a)
        if (a.hasOwnProperty(key))
            res += '<tr><td>' + key + '</td><td>' + a[key] + '</td></tr>';
    return res + '</tbody><table>';
};


var cache = {};
var p2 = function (n, val) {
    if (n === 0)
        return 1;
    var key = n + "_" + val;
    if (key in cache)
        return cache[key];
    var r = 0;
    for (var i = val; i <= n; ++i)
        r += p3(n - i, i);
    cache[key] = r;
    return r;
};
var p3 = function (n, val) {
    if (n === 0)
        return 1;
    var key = n + "_" + val;
    if (key in cache)
        return cache[key];
    var r = 0;
    for (var i = val; i <= n; ++i)
        r += p3(n - i, i);
    cache[key] = r;
    return r;
};
var p4 = function(N) {
  for (var n, p = [n = 1], k, i; n <= N; ++n)
    for (p[k = n] = 0; k >= -n; --k)
      0 < (i = k * (3 * k - 1) / 2) &&
      i <= n &&
      (p[n] += ((k & 1) * 2 - 1) * p[n-i])
  return p[N];
};

tests.push(function(){
    return p3(299,1);
});

tests.push(function(){
    return p4(299,1);
});

var ascending_partition = function (n, k) {
    var P = [], val = 1;
    while (n > 0) {
        that: for (var i = val; i <= n; ++i) {
            var count = p3(n - i, i);
            if (k >= count)
                k -= count;
            else if (count != 0) {
                P.push(i);
                n -= i;
                val = i;
                break that;//what
            }
        }
    }
    return P;
};

tests.push(function () {
    var n = 100, k = p3(n, 1) - 10;
    document.write("p(" + n + ", " + k + ") = " + ascending_partition(n, k));
    var n = 5, s = "", r = p3(n, 1);
    for (var i = 0; i < r; ++i) {
        s += i + " " + ascending_partition(n, i) + "\n";
    }
    return s;
});

tests.push(function () {
    document.write(table(
        (function () {
            for (var n, p = [n = 1], k, i; n < 302; n++)
                for (p[k = n] = 0; k >= -n; --k)
                    0 < (i = k * (3 * k - 1) / 2) &&
                        i <= n &&
                        (p[n] += ((k & 1) * 2 - 1) * p[n - i]);
            return p;
        })()));
});

var test = function() {
    for (var i in tests) {
        if (!tests.hasOwnProperty(i) || typeof tests[i] != "function")
            continue;
        var t = new Date();
        var ret = tests[i]();
        console.log("[test " + i + "]\n" + (ret != undefined ? ret + "\n" : "")+"[time: " + ((new Date()) - t) + "ms]");
    } 
};
