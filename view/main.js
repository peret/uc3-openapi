(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.at.O === region.aO.O)
	{
		return 'on line ' + region.at.O;
	}
	return 'on lines ' + region.at.O + ' through ' + region.aO.O;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.b7,
		impl.cr,
		impl.cj,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		x: func(record.x),
		au: record.au,
		ai: record.ai
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.x;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.au;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.ai) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.b7,
		impl.cr,
		impl.cj,
		function(sendToApp, initialModel) {
			var view = impl.cs;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.b7,
		impl.cr,
		impl.cj,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.al && impl.al(sendToApp)
			var view = impl.cs;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.bZ);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.cl) && (_VirtualDom_doc.title = title = doc.cl);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.ca;
	var onUrlRequest = impl.cb;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		al: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.bs === next.bs
							&& curr.a0 === next.a0
							&& curr.bj.a === next.bj.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		b7: function(flags)
		{
			return A3(impl.b7, flags, _Browser_getUrl(), key);
		},
		cs: impl.cs,
		cr: impl.cr,
		cj: impl.cj
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { b5: 'hidden', b_: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { b5: 'mozHidden', b_: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { b5: 'msHidden', b_: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { b5: 'webkitHidden', b_: 'webkitvisibilitychange' }
		: { b5: 'hidden', b_: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		bB: _Browser_getScene(),
		bP: {
			bT: _Browser_window.pageXOffset,
			bU: _Browser_window.pageYOffset,
			bS: _Browser_doc.documentElement.clientWidth,
			a_: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		bS: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		a_: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			bB: {
				bS: node.scrollWidth,
				a_: node.scrollHeight
			},
			bP: {
				bT: node.scrollLeft,
				bU: node.scrollTop,
				bS: node.clientWidth,
				a_: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			bB: _Browser_getScene(),
			bP: {
				bT: x,
				bU: y,
				bS: _Browser_doc.documentElement.clientWidth,
				a_: _Browser_doc.documentElement.clientHeight
			},
			b1: {
				bT: x + rect.left,
				bU: y + rect.top,
				bS: rect.width,
				a_: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.b2.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.b2.b, xhr)); });
		$elm$core$Maybe$isJust(request.bM) && _Http_track(router, xhr, request.bM.a);

		try {
			xhr.open(request.b9, request.K, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.K));
		}

		_Http_configureRequest(xhr, request);

		request.bZ.a && xhr.setRequestHeader('Content-Type', request.bZ.a);
		xhr.send(request.bZ.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.aZ; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.ck.a || 0;
	xhr.responseType = request.b2.d;
	xhr.withCredentials = request.bX;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		K: xhr.responseURL,
		ch: xhr.status,
		ci: xhr.statusText,
		aZ: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			cg: event.loaded,
			bE: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			cd: event.loaded,
			bE: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}



// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.f) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.h),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.h);
		} else {
			var treeLen = builder.f * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.i) : builder.i;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.f);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.h) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.h);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{i: nodeList, f: (len / $elm$core$Array$branchFactor) | 0, h: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {aV: fragment, a0: host, bh: path, bj: port_, bs: protocol, bt: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $krisajenkins$remotedata$RemoteData$NotAsked = {$: 0};
var $author$project$View$GotTimeZone = function (a) {
	return {$: 2, a: a};
};
var $justinmimbs$timezone_data$TimeZone$NoDataForZoneName = function (a) {
	return {$: 1, a: a};
};
var $justinmimbs$timezone_data$TimeZone$NoZoneName = {$: 0};
var $elm$core$Task$fail = _Scheduler_fail;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$getZoneName = _Time_getZoneName(0);
var $justinmimbs$timezone_data$TimeZone$Specification$Save = function (a) {
	return {$: 0, a: a};
};
var $justinmimbs$timezone_data$TimeZone$Specification$Zone = F2(
	function (history, current) {
		return {Z: current, q: history};
	});
var $justinmimbs$timezone_data$TimeZone$Specification$ZoneState = F2(
	function (standardOffset, zoneRules) {
		return {as: standardOffset, aw: zoneRules};
	});
var $justinmimbs$timezone_data$TimeZone$maxYear = 2037;
var $justinmimbs$timezone_data$TimeZone$minYear = 1970;
var $justinmimbs$timezone_data$TimeZone$Specification$DateTime = F5(
	function (year, month, day, time, clock) {
		return {w: clock, aK: day, bc: month, Y: time, bV: year};
	});
var $elm$time$Time$Jan = 0;
var $justinmimbs$timezone_data$TimeZone$Specification$Universal = 0;
var $justinmimbs$timezone_data$TimeZone$Specification$dropChangesBeforeEpoch = function (_v0) {
	dropChangesBeforeEpoch:
	while (true) {
		var initial = _v0.a;
		var changes = _v0.b;
		if (changes.b) {
			var change = changes.a;
			var rest = changes.b;
			if (change.at <= 0) {
				var $temp$_v0 = _Utils_Tuple2(change.b, rest);
				_v0 = $temp$_v0;
				continue dropChangesBeforeEpoch;
			} else {
				return _Utils_Tuple2(initial, changes);
			}
		} else {
			return _Utils_Tuple2(initial, _List_Nil);
		}
	}
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $justinmimbs$timezone_data$RataDie$weekdayNumber = function (rd) {
	var _v0 = A2($elm$core$Basics$modBy, 7, rd);
	if (!_v0) {
		return 7;
	} else {
		var n = _v0;
		return n;
	}
};
var $justinmimbs$timezone_data$RataDie$weekdayToNumber = function (wd) {
	switch (wd) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 5;
		case 5:
			return 6;
		default:
			return 7;
	}
};
var $justinmimbs$timezone_data$RataDie$floorWeekday = F2(
	function (weekday, rd) {
		var daysSincePreviousWeekday = A2(
			$elm$core$Basics$modBy,
			7,
			($justinmimbs$timezone_data$RataDie$weekdayNumber(rd) + 7) - $justinmimbs$timezone_data$RataDie$weekdayToNumber(weekday));
		return rd - daysSincePreviousWeekday;
	});
var $justinmimbs$timezone_data$RataDie$ceilingWeekday = F2(
	function (weekday, rd) {
		var floored = A2($justinmimbs$timezone_data$RataDie$floorWeekday, weekday, rd);
		return _Utils_eq(rd, floored) ? rd : (floored + 7);
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $justinmimbs$timezone_data$RataDie$isLeapYear = function (y) {
	return ((!A2($elm$core$Basics$modBy, 4, y)) && (!(!A2($elm$core$Basics$modBy, 100, y)))) || (!A2($elm$core$Basics$modBy, 400, y));
};
var $justinmimbs$timezone_data$RataDie$daysBeforeMonth = F2(
	function (y, m) {
		var leapDays = $justinmimbs$timezone_data$RataDie$isLeapYear(y) ? 1 : 0;
		switch (m) {
			case 0:
				return 0;
			case 1:
				return 31;
			case 2:
				return 59 + leapDays;
			case 3:
				return 90 + leapDays;
			case 4:
				return 120 + leapDays;
			case 5:
				return 151 + leapDays;
			case 6:
				return 181 + leapDays;
			case 7:
				return 212 + leapDays;
			case 8:
				return 243 + leapDays;
			case 9:
				return 273 + leapDays;
			case 10:
				return 304 + leapDays;
			default:
				return 334 + leapDays;
		}
	});
var $justinmimbs$timezone_data$RataDie$daysBeforeYear = function (y1) {
	var y = y1 - 1;
	var leapYears = (((y / 4) | 0) - ((y / 100) | 0)) + ((y / 400) | 0);
	return (365 * y) + leapYears;
};
var $justinmimbs$timezone_data$RataDie$dayOfMonth = F3(
	function (y, m, d) {
		return ($justinmimbs$timezone_data$RataDie$daysBeforeYear(y) + A2($justinmimbs$timezone_data$RataDie$daysBeforeMonth, y, m)) + d;
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $justinmimbs$timezone_data$RataDie$daysInMonth = F2(
	function (y, m) {
		switch (m) {
			case 0:
				return 31;
			case 1:
				return $justinmimbs$timezone_data$RataDie$isLeapYear(y) ? 29 : 28;
			case 2:
				return 31;
			case 3:
				return 30;
			case 4:
				return 31;
			case 5:
				return 30;
			case 6:
				return 31;
			case 7:
				return 31;
			case 8:
				return 30;
			case 9:
				return 31;
			case 10:
				return 30;
			default:
				return 31;
		}
	});
var $justinmimbs$timezone_data$RataDie$lastOfMonth = F2(
	function (y, m) {
		return ($justinmimbs$timezone_data$RataDie$daysBeforeYear(y) + A2($justinmimbs$timezone_data$RataDie$daysBeforeMonth, y, m)) + A2($justinmimbs$timezone_data$RataDie$daysInMonth, y, m);
	});
var $justinmimbs$timezone_data$TimeZone$Specification$minutesFromRataDie = function (rd) {
	return (rd - 719163) * 1440;
};
var $elm$core$List$sortBy = _List_sortBy;
var $justinmimbs$timezone_data$TimeZone$Specification$utcAdjustment = F2(
	function (clock, _v0) {
		var save = _v0.m;
		var standard = _v0.z;
		switch (clock) {
			case 0:
				return 0;
			case 1:
				return 0 - standard;
			default:
				return 0 - (standard + save);
		}
	});
var $justinmimbs$timezone_data$TimeZone$Specification$minutesFromDateTime = function (_v0) {
	var time = _v0.Y;
	var day = _v0.aK;
	var month = _v0.bc;
	var year = _v0.bV;
	return $justinmimbs$timezone_data$TimeZone$Specification$minutesFromRataDie(
		A3($justinmimbs$timezone_data$RataDie$dayOfMonth, year, month, day)) + time;
};
var $justinmimbs$timezone_data$TimeZone$Specification$utcMinutesFromDateTime = F2(
	function (offset, datetime) {
		return $justinmimbs$timezone_data$TimeZone$Specification$minutesFromDateTime(datetime) + A2($justinmimbs$timezone_data$TimeZone$Specification$utcAdjustment, datetime.w, offset);
	});
var $justinmimbs$timezone_data$TimeZone$Specification$rulesToOffsetChanges = F5(
	function (previousOffset, start, until, standardOffset, rules) {
		var transitions = A2(
			$elm$core$List$concatMap,
			function (year) {
				return A2(
					$elm$core$List$sortBy,
					function ($) {
						return $.at;
					},
					A2(
						$elm$core$List$map,
						function (rule) {
							return {
								w: rule.w,
								m: rule.m,
								at: $justinmimbs$timezone_data$TimeZone$Specification$minutesFromRataDie(
									function () {
										var _v2 = rule.aK;
										switch (_v2.$) {
											case 0:
												var day = _v2.a;
												return A3($justinmimbs$timezone_data$RataDie$dayOfMonth, year, rule.bc, day);
											case 1:
												var weekday = _v2.a;
												var after = _v2.b;
												return A2(
													$justinmimbs$timezone_data$RataDie$ceilingWeekday,
													weekday,
													A3($justinmimbs$timezone_data$RataDie$dayOfMonth, year, rule.bc, after));
											case 2:
												var weekday = _v2.a;
												var before = _v2.b;
												return A2(
													$justinmimbs$timezone_data$RataDie$floorWeekday,
													weekday,
													A3($justinmimbs$timezone_data$RataDie$dayOfMonth, year, rule.bc, before));
											default:
												var weekday = _v2.a;
												return A2(
													$justinmimbs$timezone_data$RataDie$floorWeekday,
													weekday,
													A2($justinmimbs$timezone_data$RataDie$lastOfMonth, year, rule.bc));
										}
									}()) + rule.Y
							};
						},
						A2(
							$elm$core$List$filter,
							function (rule) {
								return (_Utils_cmp(rule.aW, year) < 1) && (_Utils_cmp(year, rule.bL) < 1);
							},
							rules)));
			},
			A2($elm$core$List$range, start.bV - 1, until.bV));
		var initialOffset = {m: 0, z: standardOffset};
		var initialChange = {
			b: standardOffset,
			at: A2($justinmimbs$timezone_data$TimeZone$Specification$utcMinutesFromDateTime, previousOffset, start)
		};
		var _v0 = A3(
			$elm$core$List$foldl,
			F2(
				function (transition, _v1) {
					var currentOffset = _v1.a;
					var changes = _v1.b;
					var newOffset = {m: transition.m, z: standardOffset};
					if (_Utils_cmp(
						transition.at + A2($justinmimbs$timezone_data$TimeZone$Specification$utcAdjustment, transition.w, previousOffset),
						initialChange.at) < 1) {
						var updatedInitialChange = {b: standardOffset + transition.m, at: initialChange.at};
						return _Utils_Tuple2(
							newOffset,
							_List_fromArray(
								[updatedInitialChange]));
					} else {
						if (_Utils_cmp(
							transition.at + A2($justinmimbs$timezone_data$TimeZone$Specification$utcAdjustment, transition.w, currentOffset),
							A2($justinmimbs$timezone_data$TimeZone$Specification$utcMinutesFromDateTime, currentOffset, until)) < 0) {
							var change = {
								b: standardOffset + transition.m,
								at: transition.at + A2($justinmimbs$timezone_data$TimeZone$Specification$utcAdjustment, transition.w, currentOffset)
							};
							return _Utils_Tuple2(
								newOffset,
								A2($elm$core$List$cons, change, changes));
						} else {
							return _Utils_Tuple2(currentOffset, changes);
						}
					}
				}),
			_Utils_Tuple2(
				initialOffset,
				_List_fromArray(
					[initialChange])),
			transitions);
		var nextOffset = _v0.a;
		var descendingChanges = _v0.b;
		return _Utils_Tuple2(
			$elm$core$List$reverse(descendingChanges),
			nextOffset);
	});
var $justinmimbs$timezone_data$TimeZone$Specification$stateToOffsetChanges = F4(
	function (previousOffset, start, until, _v0) {
		var zoneRules = _v0.aw;
		var standardOffset = _v0.as;
		if (!zoneRules.$) {
			var save = zoneRules.a;
			return _Utils_Tuple2(
				_List_fromArray(
					[
						{
						b: standardOffset + save,
						at: A2($justinmimbs$timezone_data$TimeZone$Specification$utcMinutesFromDateTime, previousOffset, start)
					}
					]),
				{m: save, z: standardOffset});
		} else {
			var rules = zoneRules.a;
			return A5($justinmimbs$timezone_data$TimeZone$Specification$rulesToOffsetChanges, previousOffset, start, until, standardOffset, rules);
		}
	});
var $justinmimbs$timezone_data$TimeZone$Specification$stripDuplicatesByHelp = F4(
	function (f, a, rev, list) {
		stripDuplicatesByHelp:
		while (true) {
			if (!list.b) {
				return $elm$core$List$reverse(rev);
			} else {
				var x = list.a;
				var xs = list.b;
				var b = f(x);
				var rev_ = (!_Utils_eq(a, b)) ? A2($elm$core$List$cons, x, rev) : rev;
				var $temp$f = f,
					$temp$a = b,
					$temp$rev = rev_,
					$temp$list = xs;
				f = $temp$f;
				a = $temp$a;
				rev = $temp$rev;
				list = $temp$list;
				continue stripDuplicatesByHelp;
			}
		}
	});
var $justinmimbs$timezone_data$TimeZone$Specification$zoneToRanges = F3(
	function (zoneStart, zoneUntil, zone) {
		var _v0 = A3(
			$elm$core$List$foldl,
			F2(
				function (_v1, _v2) {
					var state = _v1.a;
					var nextStart = _v1.b;
					var start = _v2.a;
					var ranges = _v2.b;
					return _Utils_Tuple2(
						nextStart,
						A2(
							$elm$core$List$cons,
							_Utils_Tuple3(start, state, nextStart),
							ranges));
				}),
			_Utils_Tuple2(zoneStart, _List_Nil),
			zone.q);
		var currentStart = _v0.a;
		var historyRanges = _v0.b;
		return $elm$core$List$reverse(
			A2(
				$elm$core$List$cons,
				_Utils_Tuple3(currentStart, zone.Z, zoneUntil),
				historyRanges));
	});
var $justinmimbs$timezone_data$TimeZone$Specification$toOffsets = F3(
	function (minYear, maxYear, zone) {
		var initialState = function () {
			var _v5 = zone.q;
			if (_v5.b) {
				var _v6 = _v5.a;
				var earliest = _v6.a;
				return earliest;
			} else {
				return zone.Z;
			}
		}();
		var initialOffset = {
			m: function () {
				var _v4 = initialState.aw;
				if (!_v4.$) {
					var save = _v4.a;
					return save;
				} else {
					return 0;
				}
			}(),
			z: initialState.as
		};
		var ascendingChanges = A4(
			$justinmimbs$timezone_data$TimeZone$Specification$stripDuplicatesByHelp,
			function ($) {
				return $.b;
			},
			initialOffset.z + initialOffset.m,
			_List_Nil,
			A3(
				$elm$core$List$foldl,
				F2(
					function (_v1, _v2) {
						var start = _v1.a;
						var state = _v1.b;
						var until = _v1.c;
						var prevOffset = _v2.a;
						var prevChanges = _v2.b;
						var _v3 = A4($justinmimbs$timezone_data$TimeZone$Specification$stateToOffsetChanges, prevOffset, start, until, state);
						var nextChanges = _v3.a;
						var nextOffset = _v3.b;
						return _Utils_Tuple2(
							nextOffset,
							_Utils_ap(prevChanges, nextChanges));
					}),
				_Utils_Tuple2(initialOffset, _List_Nil),
				A3(
					$justinmimbs$timezone_data$TimeZone$Specification$zoneToRanges,
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, minYear, 0, 1, 0, 0),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, maxYear + 1, 0, 1, 0, 0),
					zone)).b);
		var _v0 = $justinmimbs$timezone_data$TimeZone$Specification$dropChangesBeforeEpoch(
			_Utils_Tuple2(initialOffset.z + initialOffset.m, ascendingChanges));
		var initial = _v0.a;
		var ascending = _v0.b;
		return _Utils_Tuple2(
			$elm$core$List$reverse(ascending),
			initial);
	});
var $justinmimbs$timezone_data$TimeZone$fromSpecification = function (zone) {
	var _v0 = A3($justinmimbs$timezone_data$TimeZone$Specification$toOffsets, $justinmimbs$timezone_data$TimeZone$minYear, $justinmimbs$timezone_data$TimeZone$maxYear, zone);
	var descending = _v0.a;
	var bottom = _v0.b;
	return A2($elm$time$Time$customZone, bottom, descending);
};
var $justinmimbs$timezone_data$TimeZone$africa__abidjan = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				0,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $elm$time$Time$May = 4;
var $elm$time$Time$Oct = 9;
var $justinmimbs$timezone_data$TimeZone$Specification$Rules = function (a) {
	return {$: 1, a: a};
};
var $justinmimbs$timezone_data$TimeZone$Specification$WallClock = 2;
var $elm$time$Time$Apr = 3;
var $justinmimbs$timezone_data$TimeZone$Specification$Day = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Mar = 2;
var $justinmimbs$timezone_data$TimeZone$Specification$Rule = F7(
	function (from, to, month, day, time, clock, save) {
		return {w: clock, aK: day, aW: from, bc: month, m: save, Y: time, bL: to};
	});
var $elm$time$Time$Sep = 8;
var $justinmimbs$timezone_data$TimeZone$Specification$Standard = 1;
var $justinmimbs$timezone_data$TimeZone$rules_Algeria = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1971,
		1971,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		1380,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1971,
		1971,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(26),
		1380,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(24),
		60,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		180,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$africa__algiers = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Algeria)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1977, 9, 21, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Algeria)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1979, 9, 26, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Algeria)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 4, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $justinmimbs$timezone_data$TimeZone$africa__bissau = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1975, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				0,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $elm$time$Time$Aug = 7;
var $elm$time$Time$Fri = 4;
var $elm$time$Time$Jul = 6;
var $elm$time$Time$Jun = 5;
var $justinmimbs$timezone_data$TimeZone$Specification$Last = function (a) {
	return {$: 3, a: a};
};
var $justinmimbs$timezone_data$TimeZone$Specification$Next = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$time$Time$Thu = 3;
var $justinmimbs$timezone_data$TimeZone$rules_Egypt = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1959,
		1981,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		60,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1966,
		1994,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		180,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1982,
		1982,
		6,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		60,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1983,
		6,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(12),
		60,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1984,
		1988,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		60,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1989,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		60,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1994,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		60,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1995,
		2010,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(4),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1995,
		2005,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(3),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2007,
		8,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 3, 1),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2008,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(3),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2009,
		2009,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2010,
		2010,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(10),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2010,
		2010,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(9),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2010,
		2010,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(3),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2014,
		2014,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(15),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2014,
		2014,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(26),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2014,
		2014,
		6,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2014,
		2014,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(3),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2023,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(4),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2023,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(3),
		1440,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$africa__cairo = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Egypt))));
};
var $elm$time$Time$Dec = 11;
var $elm$time$Time$Feb = 1;
var $elm$time$Time$Nov = 10;
var $elm$time$Time$Sun = 6;
var $justinmimbs$timezone_data$TimeZone$rules_Morocco = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(24),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1977,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(4),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2008,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2008,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2009,
		2009,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2009,
		2009,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2010,
		2010,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2010,
		2010,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(8),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2011,
		2011,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2011,
		2011,
		6,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2013,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2012,
		6,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		180,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2012,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2012,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		180,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2013,
		2013,
		6,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(7),
		180,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2013,
		2013,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(10),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2013,
		2018,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		180,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2014,
		2018,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2014,
		2014,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		180,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2014,
		2014,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2015,
		2015,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(14),
		180,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2015,
		2015,
		6,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(19),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2016,
		2016,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(5),
		180,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2016,
		2016,
		6,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(10),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2017,
		2017,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		180,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2017,
		2017,
		6,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2018,
		2018,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(13),
		180,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2018,
		2018,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(17),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2019,
		2019,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(5),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2019,
		2019,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(9),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2020,
		2020,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(19),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2020,
		2020,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2021,
		2021,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(11),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2021,
		2021,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(16),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2022,
		2022,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2022,
		2022,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(8),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2023,
		2023,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(19),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2023,
		2023,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(23),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2024,
		2024,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(10),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2024,
		2024,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(14),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2025,
		2025,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(23),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2025,
		2025,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2026,
		2026,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(15),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2026,
		2026,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2027,
		2027,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(7),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2027,
		2027,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(14),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2028,
		2028,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(23),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2028,
		2028,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(5),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2029,
		2029,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(14),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2029,
		2029,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(18),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2029,
		2029,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2030,
		2030,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(10),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2030,
		2030,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2031,
		2031,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(26),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2031,
		2031,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(14),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2032,
		2032,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(18),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2032,
		2032,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2033,
		2033,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(9),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2033,
		2033,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2033,
		2033,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2034,
		2034,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(5),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2034,
		2034,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(17),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2035,
		2035,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2035,
		2035,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(9),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2036,
		2036,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(19),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2036,
		2036,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(23),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2037,
		2037,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(4),
		180,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2037,
		2037,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(15),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$africa__casablanca = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Morocco)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1984, 2, 16, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1986, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Morocco)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2018, 9, 28, 180, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Morocco))));
};
var $justinmimbs$timezone_data$TimeZone$rules_EU = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1980,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		60,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		60,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1995,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		0,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$rules_SpainAfrica = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(24),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1977,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(4),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$africa__ceuta = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_SpainAfrica)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1984, 2, 16, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1986, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$africa__el_aaiun = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1976, 3, 14, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Morocco)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2018, 9, 28, 180, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Morocco))));
};
var $justinmimbs$timezone_data$TimeZone$africa__johannesburg = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Sudan = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1970,
		1970,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1970,
		1985,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(15),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1971,
		1971,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1985,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$africa__juba = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Sudan)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 0, 15, 720, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2021, 1, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$africa__khartoum = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Sudan)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 0, 15, 720, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2017, 10, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$africa__lagos = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$africa__maputo = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$africa__monrovia = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-45,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1972, 0, 7, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				0,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$africa__nairobi = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$africa__ndjamena = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1979, 9, 14, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1980, 2, 8, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$africa__sao_tome = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2018, 0, 1, 60, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2019, 0, 1, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				0,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Libya = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1982,
		1984,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1982,
		1985,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1985,
		1985,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1986,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(4),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1986,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1989,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1989,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		1997,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(4),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		1997,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(4),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2013,
		2013,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(4),
		60,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2013,
		2013,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(4),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$africa__tripoli = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1982, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Libya)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 4, 4, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 8, 30, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Libya)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1997, 9, 4, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2012, 10, 10, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Libya)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2013, 9, 25, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Tunisia = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(24),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1988,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1990,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1989,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(26),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1990,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		2005,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		2005,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		60,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2008,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2008,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$africa__tunis = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Tunisia))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Namibia = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1994,
		1994,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		0,
		2,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1994,
		2017,
		8,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1995,
		2017,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		-60)
	]);
var $justinmimbs$timezone_data$TimeZone$africa__windhoek = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 2, 21, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Namibia))));
};
var $justinmimbs$timezone_data$TimeZone$rules_US = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1967,
		2006,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1967,
		1973,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1975,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1986,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		2006,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		10,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__adak = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-660,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 9, 30, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-600,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 10, 30, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-600,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__anchorage = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-600,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 9, 30, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-540,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 10, 30, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-540,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Brazil = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1985,
		1985,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1986,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(15),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1986,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1987,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(14),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1987,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1988,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(7),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1988,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(16),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1989,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(29),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1989,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(15),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1990,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(11),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1990,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1991,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(17),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1991,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1992,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(9),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1992,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		1993,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		1995,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 11),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1994,
		1995,
		1,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		1996,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(11),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		1996,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		1997,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(16),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		1997,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1998,
		1998,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1998,
		1998,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(11),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1999,
		1999,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1999,
		1999,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2000,
		2000,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2000,
		2001,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2001,
		2006,
		1,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2002,
		2002,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2003,
		2003,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(19),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2004,
		2004,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		2005,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(16),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(5),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2007,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2007,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2017,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2011,
		1,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2012,
		1,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 22),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2013,
		2014,
		1,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2015,
		2015,
		1,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 22),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2016,
		2019,
		1,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2018,
		2018,
		10,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$america__araguaina = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 8, 17, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1995, 8, 14, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2003, 8, 24, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2012, 9, 21, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2013, 8, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Arg = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1968,
		1969,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(23),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1988,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1993,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1992,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1999,
		1999,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2000,
		2000,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2007,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2009,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2008,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		0,
		2,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$america__argentina__buenos_aires = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 9, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 2, 3, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg))));
};
var $justinmimbs$timezone_data$TimeZone$america__argentina__catamarca = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 9, 20, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 9, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 2, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 5, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 5, 20, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2008, 9, 18, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__argentina__cordoba = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 9, 20, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 9, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 2, 3, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg))));
};
var $justinmimbs$timezone_data$TimeZone$america__argentina__jujuy = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 2, 4, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 9, 28, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 17, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 9, 6, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 9, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 2, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2008, 9, 18, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__argentina__la_rioja = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 4, 7, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 9, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 2, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 5, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 5, 20, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2008, 9, 18, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__argentina__mendoza = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 2, 4, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 9, 15, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 9, 15, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 2, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 9, 18, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 9, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 2, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 4, 23, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 8, 26, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2008, 9, 18, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__argentina__rio_gallegos = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 9, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 2, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 5, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 5, 20, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2008, 9, 18, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__argentina__salta = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 9, 20, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 9, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 2, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2008, 9, 18, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__argentina__san_juan = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 4, 7, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 9, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 2, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 4, 31, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 6, 25, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2008, 9, 18, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_SanLuis = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2009,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2008,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		0,
		2,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$america__argentina__san_luis = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 2, 14, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 9, 15, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 5, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 9, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 2, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 4, 31, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 6, 25, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2008, 0, 21, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_SanLuis)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2009, 9, 11, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__argentina__tucuman = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 9, 20, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 9, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 2, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 5, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 5, 13, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg))));
};
var $justinmimbs$timezone_data$TimeZone$america__argentina__ushuaia = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 9, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 2, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 4, 30, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 5, 20, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2008, 9, 18, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Para = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1988,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1978,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1991,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1989,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1990,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1991,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1992,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1992,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(5),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		1993,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		1995,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1994,
		1995,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		1996,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		2001,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		1997,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1998,
		2001,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2002,
		2004,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2002,
		2003,
		8,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2004,
		2009,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		2009,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2010,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2010,
		2012,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2013,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 22),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__asuncion = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1972, 9, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 3, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Para))));
};
var $justinmimbs$timezone_data$TimeZone$america__bahia = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2003, 8, 24, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 9, 16, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2012, 9, 21, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Mexico = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		2000,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		2000,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2001,
		2001,
		4,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2001,
		2001,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2002,
		2022,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2002,
		2022,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__bahia_banderas = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1970, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2010, 3, 4, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Barb = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(12),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1978,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1980,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__barbados = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Barb))));
};
var $justinmimbs$timezone_data$TimeZone$america__belem = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1988, 8, 12, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Belize = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1973,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(5),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(9),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1982,
		1982,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(18),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1983,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(12),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__belize = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Belize))));
};
var $justinmimbs$timezone_data$TimeZone$america__boa_vista = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1988, 8, 12, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 8, 30, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 9, 15, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_CO = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1992,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		1993,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		1440,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__bogota = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_CO))));
};
var $justinmimbs$timezone_data$TimeZone$america__boise = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 1, 3, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-420,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Canada = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1986,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		2006,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		2006,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		10,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$rules_NT_YK = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1986,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		2006,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		2006,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$america__cambridge_bay = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_NT_YK)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 9, 31, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 9, 29, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 10, 5, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2001, 3, 1, 180, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-420,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada))));
};
var $justinmimbs$timezone_data$TimeZone$america__campo_grande = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil))));
};
var $justinmimbs$timezone_data$TimeZone$america__cancun = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 11, 23, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1998, 7, 2, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2015, 1, 1, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__caracas = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2007, 11, 9, 180, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-270,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2016, 4, 1, 150, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__cayenne = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__chicago = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__chihuahua = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1998, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1998, 3, 5, 180, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2022, 9, 30, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__ciudad_juarez = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1998, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1998, 3, 5, 180, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2010, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2022, 9, 30, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2022, 10, 30, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-420,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $elm$time$Time$Sat = 5;
var $justinmimbs$timezone_data$TimeZone$rules_CR = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1980,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1980,
		5,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1992,
		0,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 5, 15),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1991,
		6,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1992,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(15),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__costa_rica = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_CR))));
};
var $justinmimbs$timezone_data$TimeZone$america__cuiaba = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2003, 8, 24, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 9, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil))));
};
var $justinmimbs$timezone_data$TimeZone$america__danmarkshavn = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1980, 3, 6, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				0,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__dawson = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-540,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1973, 9, 28, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1980, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2020, 10, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-420,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Vanc = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1946,
		1986,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1962,
		2006,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__dawson_creek = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Vanc)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1972, 7, 30, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-420,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__denver = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-420,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__detroit = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1973, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1975, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1975, 3, 27, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Edm = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1986,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		2006,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__edmonton = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Edm)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1987, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-420,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada))));
};
var $justinmimbs$timezone_data$TimeZone$america__eirunepe = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1988, 8, 12, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1993, 8, 28, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1994, 8, 22, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2008, 5, 24, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2013, 10, 10, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Salv = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1988,
		4,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1988,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__el_salvador = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Salv))));
};
var $justinmimbs$timezone_data$TimeZone$america__fort_nelson = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Vanc)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1987, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2015, 2, 8, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-420,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__fortaleza = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 8, 17, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 8, 30, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 9, 22, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2001, 8, 13, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2002, 9, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Halifax = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1962,
		1973,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1962,
		1973,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__glace_bay = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1972, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Halifax)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada))));
};
var $justinmimbs$timezone_data$TimeZone$rules_StJohns = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1951,
		1986,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1960,
		1986,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1987,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		1,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		2006,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		1,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1988,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		1,
		2,
		120),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		2006,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		1,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2011,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		1,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2010,
		10,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		1,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__goose_bay = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_StJohns)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 10, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada))));
};
var $justinmimbs$timezone_data$TimeZone$america__grand_turk = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1979, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2015, 2, 8, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2018, 2, 11, 180, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Guat = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1973,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(24),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1983,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1983,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1991,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(23),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1991,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(7),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__guatemala = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Guat))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Ecuador = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1992,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		1993,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(5),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__guayaquil = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Ecuador))));
};
var $justinmimbs$timezone_data$TimeZone$america__guyana = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-225,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1975, 7, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 2, 29, 60, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__halifax = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Halifax)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Cuba = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1969,
		1977,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1969,
		1971,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1974,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(8),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1977,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(7),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1990,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1980,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1985,
		4,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 5),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1989,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 14),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1997,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1995,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		1996,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		1997,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(12),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1998,
		1999,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1998,
		2003,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2000,
		2003,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2004,
		2004,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2010,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2007,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2008,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2009,
		2010,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2011,
		2011,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2011,
		2011,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(13),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2012,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		10,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2013,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		0,
		1,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$america__havana = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Cuba))));
};
var $justinmimbs$timezone_data$TimeZone$america__hermosillo = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1970, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-420,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__indiana__indianapolis = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1971, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2006, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__indiana__knox = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 9, 27, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2006, 3, 2, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__indiana__marengo = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 0, 6, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 9, 27, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1976, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2006, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__indiana__petersburg = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1977, 9, 30, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2006, 3, 2, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2007, 10, 4, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__indiana__tell_city = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1971, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2006, 3, 2, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__indiana__vevay = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1973, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2006, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__indiana__vincennes = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1971, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2006, 3, 2, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2007, 10, 4, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__indiana__winamac = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1971, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2006, 3, 2, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2007, 2, 11, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__inuvik = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_NT_YK)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1979, 3, 29, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_NT_YK)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1980, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-420,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada))));
};
var $justinmimbs$timezone_data$TimeZone$america__iqaluit = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_NT_YK)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 9, 31, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 9, 29, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada))));
};
var $justinmimbs$timezone_data$TimeZone$america__jamaica = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1984, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__juneau = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1980, 3, 27, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-540,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1980, 9, 26, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 9, 30, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-540,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 10, 30, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-540,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__kentucky__louisville = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 0, 6, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 9, 27, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__kentucky__monticello = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 9, 29, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__la_paz = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Peru = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1987,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1987,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1990,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1990,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1994,
		1994,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1994,
		1994,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__lima = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Peru))));
};
var $justinmimbs$timezone_data$TimeZone$america__los_angeles = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-480,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__maceio = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 8, 17, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1995, 9, 13, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 8, 4, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 8, 30, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 9, 22, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2001, 8, 13, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2002, 9, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $elm$time$Time$Mon = 0;
var $justinmimbs$timezone_data$TimeZone$rules_Nic = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1980,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 16),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1980,
		5,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 0, 23),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		2005,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(10),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		2005,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		60,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__managua = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1973, 4, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1975, 1, 16, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Nic)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 1, 240, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 8, 24, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1993, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1997, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Nic))));
};
var $justinmimbs$timezone_data$TimeZone$america__manaus = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1988, 8, 12, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1993, 8, 28, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1994, 8, 22, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__martinique = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1980, 3, 6, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1980, 8, 28, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__matamoros = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1988, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1989, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2010, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__mazatlan = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1970, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-420,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico))));
};
var $justinmimbs$timezone_data$TimeZone$america__menominee = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1973, 3, 29, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__merida = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 11, 23, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1982, 11, 2, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico))));
};
var $justinmimbs$timezone_data$TimeZone$america__metlakatla = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 9, 30, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2015, 10, 1, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-540,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2018, 10, 4, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2019, 0, 20, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-540,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__mexico_city = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2001, 8, 30, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2002, 1, 20, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico))));
};
var $justinmimbs$timezone_data$TimeZone$america__miquelon = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1980, 4, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1987, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Moncton = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1946,
		1972,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1957,
		1972,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		2006,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		1,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		2006,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		1,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__moncton = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Moncton)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1973, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1993, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Moncton)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2007, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada))));
};
var $justinmimbs$timezone_data$TimeZone$america__monterrey = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1988, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1989, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Uruguay = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1970,
		1970,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1970,
		1970,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(14),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1972,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(23),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1972,
		6,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(16),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(13),
		0,
		2,
		90),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(10),
		0,
		2,
		30),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1975,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(19),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(4),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1979,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(17),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(29),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(16),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1987,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(14),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1988,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1988,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(11),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1989,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(5),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1989,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(29),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1990,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1991,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 21),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1992,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1992,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(18),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		1993,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2004,
		2004,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(19),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		2005,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		2005,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(9),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2015,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2014,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$america__montevideo = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Uruguay)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1970, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Uruguay)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Uruguay)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 2, 10, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Uruguay)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 11, 22, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Uruguay))));
};
var $justinmimbs$timezone_data$TimeZone$america__new_york = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__nome = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-660,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 9, 30, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-540,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 10, 30, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-540,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__noronha = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 8, 17, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 8, 30, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 9, 15, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2001, 8, 13, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2002, 9, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-120,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__north_dakota__beulah = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2010, 10, 7, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__north_dakota__center = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 9, 25, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__north_dakota__new_salem = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2003, 9, 26, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__nuuk = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1980, 3, 6, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2023, 2, 26, 60, 0)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2023, 9, 29, 60, 0))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$america__ojinaga = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1998, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1998, 3, 5, 180, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2010, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2022, 9, 30, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2022, 10, 30, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__panama = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__paramaribo = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-210,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1984, 9, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__phoenix = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-420,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Haiti = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1983,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(8),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1984,
		1987,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1987,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1997,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		60,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1997,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		2006,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		2006,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2015,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2015,
		10,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2017,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2017,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		10,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__port_au_prince = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Haiti))));
};
var $justinmimbs$timezone_data$TimeZone$america__porto_velho = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1988, 8, 12, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__puerto_rico = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Chile = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1969,
		1969,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1969,
		1969,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(23),
		240,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1970,
		1970,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(29),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1971,
		1971,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(14),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1970,
		1972,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 9),
		240,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1986,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 9),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1973,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		240,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1987,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 9),
		240,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1987,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(12),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1990,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 9),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1989,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 9),
		240,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1990,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(16),
		240,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1996,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 9),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1997,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 9),
		240,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		1997,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1998,
		1998,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 9),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1998,
		1998,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		240,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1999,
		1999,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(4),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1999,
		2010,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 9),
		240,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2000,
		2007,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 9),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2008,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2009,
		2009,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 9),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2010,
		2010,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2011,
		2011,
		4,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 2),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2011,
		2011,
		7,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 16),
		240,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2014,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 23),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2014,
		8,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 2),
		240,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2016,
		2018,
		4,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 9),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2016,
		2018,
		7,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 9),
		240,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2019,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 2),
		180,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2019,
		2021,
		8,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 2),
		240,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2022,
		2022,
		8,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 9),
		240,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2023,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		8,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 2),
		240,
		0,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$america__punta_arenas = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Chile)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2016, 11, 4, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__rankin_inlet = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_NT_YK)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 9, 29, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2001, 3, 1, 180, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada))));
};
var $justinmimbs$timezone_data$TimeZone$america__recife = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 8, 17, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 8, 30, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 9, 15, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2001, 8, 13, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2002, 9, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__regina = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__resolute = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_NT_YK)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 9, 29, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2001, 3, 1, 180, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2006, 9, 29, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2007, 2, 11, 180, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada))));
};
var $justinmimbs$timezone_data$TimeZone$america__rio_branco = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1988, 8, 12, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2008, 5, 24, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2013, 10, 10, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__santarem = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1988, 8, 12, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2008, 5, 24, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__santiago = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Chile))));
};
var $justinmimbs$timezone_data$TimeZone$rules_DR = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1969,
		1973,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		30),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1970,
		1970,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1971,
		1971,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1974,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__santo_domingo = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_DR)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 9, 27, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 9, 29, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 11, 3, 60, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$america__sao_paulo = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Brazil))));
};
var $justinmimbs$timezone_data$TimeZone$rules_C_Eur = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1980,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1995,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__scoresbysund = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1980, 3, 6, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_C_Eur)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 2, 29, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2024, 2, 31, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$america__sitka = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 9, 30, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-540,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 10, 30, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-540,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$america__st_johns = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-210,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_StJohns)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 10, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-210,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada))));
};
var $justinmimbs$timezone_data$TimeZone$america__swift_current = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1972, 3, 30, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Hond = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1988,
		4,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1988,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		4,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		7,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 0, 1),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__tegucigalpa = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Hond))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Thule = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1992,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1992,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		2006,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		2006,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		10,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__thule = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Thule))));
};
var $justinmimbs$timezone_data$TimeZone$america__tijuana = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1976, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2001, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2002, 1, 20, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mexico)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2010, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-480,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Toronto = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1946,
		1973,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1957,
		1973,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$america__toronto = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Toronto)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada))));
};
var $justinmimbs$timezone_data$TimeZone$america__vancouver = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Vanc)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1987, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-480,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada))));
};
var $justinmimbs$timezone_data$TimeZone$america__whitehorse = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1980, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2020, 10, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-420,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Winn = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1966,
		1986,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1966,
		2005,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		2005,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$america__winnipeg = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Winn)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2006, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada))));
};
var $justinmimbs$timezone_data$TimeZone$america__yakutat = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-540,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 10, 30, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-540,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$antarctica__casey = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2009, 9, 18, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2010, 2, 5, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 9, 28, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2012, 1, 21, 1020, 0)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2016, 9, 22, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2018, 2, 11, 240, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2018, 9, 7, 240, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2019, 2, 17, 180, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2019, 9, 4, 180, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2020, 2, 8, 180, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2020, 9, 4, 1, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2021, 2, 14, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2021, 9, 3, 1, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2022, 2, 13, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2022, 9, 2, 1, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2023, 2, 9, 180, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				480,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$antarctica__davis = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2009, 9, 18, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2010, 2, 10, 1200, 0)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 9, 28, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2012, 1, 21, 1200, 0))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				420,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_AT = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1968,
		1985,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1969,
		1971,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1972,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1981,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1982,
		1983,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1984,
		1986,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1986,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1990,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1987,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 22),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1990,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1999,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		2005,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2000,
		2000,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2001,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2007,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$antarctica__macquarie = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_AT)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2010, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				600,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_AT))));
};
var $justinmimbs$timezone_data$TimeZone$antarctica__mawson = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2009, 9, 18, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$antarctica__palmer = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Arg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1982, 4, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Chile)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2016, 11, 4, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$antarctica__rothera = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1976, 11, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Troll = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		0,
		120),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2004,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		0,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$antarctica__troll = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2005, 1, 12, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				0,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Troll))));
};
var $justinmimbs$timezone_data$TimeZone$antarctica__vostok = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1994, 1, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1994, 10, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2023, 11, 18, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_RussiaAsia = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1984,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1983,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1984,
		1995,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1985,
		2010,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		2010,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__almaty = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 9, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2024, 2, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Jordan = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1973,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1975,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1977,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1985,
		1985,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1985,
		1985,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1988,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 4, 1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1990,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 4, 1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1989,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(8),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1990,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1991,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(17),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1991,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1992,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(10),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1993,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 4, 1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		1998,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 4, 1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1994,
		1994,
		8,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 4, 15),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1995,
		1998,
		8,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 4, 15),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1999,
		1999,
		6,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1999,
		2002,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(4),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2000,
		2001,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(3),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2002,
		2012,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(3),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2003,
		2003,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(24),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2004,
		2004,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(15),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		2005,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(4),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2011,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(4),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2013,
		2013,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2014,
		2021,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(3),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2014,
		2022,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(4),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2022,
		2022,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(3),
		1440,
		2,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__amman = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Jordan)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2022, 9, 28, 0, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Russia = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1984,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1983,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1984,
		1995,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1985,
		2010,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		2010,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__anadyr = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						780,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1982, 3, 1, 0, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						720,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						720,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2010, 2, 28, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				720,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__aqtau = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 9, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1982, 3, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1994, 8, 25, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 9, 31, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__aqtobe = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 3, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 9, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1982, 3, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 9, 31, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__ashgabat = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__atyrau = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 9, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1982, 3, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 2, 28, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 9, 31, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Iraq = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1982,
		1982,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1982,
		1984,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1983,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1984,
		1985,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1985,
		1990,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1990,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		2007,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		180,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		2007,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		180,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__baghdad = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1982, 4, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				180,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Iraq))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Azer = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		2015,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		240,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		2015,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		300,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$rules_EUAsia = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1995,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		0,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__baku = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 8, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EUAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1997, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				240,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Azer))));
};
var $justinmimbs$timezone_data$TimeZone$asia__bangkok = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				420,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__barnaul = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1995, 4, 28, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2016, 2, 27, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				420,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Lebanon = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1972,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1977,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1977,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1984,
		1987,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1984,
		1991,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(16),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1988,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1989,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(10),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1992,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1992,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(4),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		1998,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1999,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__beirut = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Lebanon))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Kyrgyz = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1996,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 7),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1996,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		2005,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		150,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		2004,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		150,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__bishkek = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 7, 31, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Kyrgyz)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2005, 7, 12, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				360,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__chita = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						540,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						540,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2016, 2, 27, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				540,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Mongol = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1984,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1983,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1985,
		1998,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1984,
		1998,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2001,
		2001,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(5),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2001,
		2006,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(5),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2002,
		2006,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(5),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2015,
		2016,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(5),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2015,
		2016,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(5),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__choibalsan = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1978, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 3, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						540,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mongol)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2008, 2, 31, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				480,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mongol))));
};
var $justinmimbs$timezone_data$TimeZone$asia__colombo = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						330,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 4, 25, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						390,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 9, 26, 30, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2006, 3, 15, 30, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				330,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Syria = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1966,
		1976,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1967,
		1978,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1978,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1984,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(9),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1984,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1986,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(16),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1986,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(9),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1987,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1988,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1988,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(15),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1989,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1989,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1990,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1990,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1991,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1992,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1992,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(8),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		1993,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(26),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		1993,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1994,
		1996,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1994,
		2005,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		1998,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(0),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1999,
		2006,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2007,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(4),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2007,
		10,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 4, 1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2008,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 4, 1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2008,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2009,
		2009,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(4),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2010,
		2011,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 4, 1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2022,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(4),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2009,
		2022,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(4),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__damascus = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Syria)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2022, 9, 28, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Dhaka = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2009,
		2009,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(19),
		1380,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2009,
		2009,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		1440,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__dhaka = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2009, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Dhaka))));
};
var $justinmimbs$timezone_data$TimeZone$asia__dili = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						540,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1976, 4, 3, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 8, 17, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				540,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__dubai = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				240,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__dushanbe = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 8, 9, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Cyprus = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1975,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(13),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1975,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(12),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(15),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(11),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1980,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1997,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1998,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__famagusta = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Cyprus)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1998, 8, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EUAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2016, 8, 8, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2017, 9, 29, 60, 0))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EUAsia))));
};
var $justinmimbs$timezone_data$TimeZone$Specification$Prev = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $justinmimbs$timezone_data$TimeZone$rules_Palestine = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1999,
		2005,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 4, 15),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1999,
		2003,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 4, 15),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2004,
		2004,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		2005,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(4),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2007,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2007,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(13),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2009,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(4),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2008,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2009,
		2009,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(4),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2010,
		2010,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(26),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2010,
		2010,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(11),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2011,
		2011,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		1,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2011,
		2011,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2011,
		2011,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2011,
		2011,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2014,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(3),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2012,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2013,
		2013,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2014,
		2014,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(24),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2015,
		2015,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2015,
		2015,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(23),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2016,
		2018,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Prev, 5, 30),
		60,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2016,
		2018,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Prev, 5, 30),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2019,
		2019,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(29),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2019,
		2019,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Prev, 5, 30),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2020,
		2021,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Prev, 5, 30),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2020,
		2020,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(24),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2021,
		2021,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(29),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2022,
		2022,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2022,
		2035,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Prev, 5, 30),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2023,
		2023,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(29),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2024,
		2024,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2025,
		2025,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(12),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2026,
		2054,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Prev, 5, 30),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2036,
		2036,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(18),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2037,
		2037,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(10),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$rules_Zion = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		6,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(12),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1975,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(19),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1975,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		1440,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(13),
		1440,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1984,
		1984,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(5),
		1440,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1984,
		1984,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		1440,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1985,
		1985,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(13),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1985,
		1985,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1986,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(17),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1986,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1987,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(14),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1987,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(12),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1988,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(9),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1988,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1989,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(29),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1989,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1990,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(24),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1990,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1991,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(23),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1991,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1992,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1992,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(5),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		1993,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		1993,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(5),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1994,
		1994,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1994,
		1994,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1995,
		1995,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1995,
		1995,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		1996,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(14),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		1996,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(15),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		1997,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		1997,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(13),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1998,
		1998,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1998,
		1998,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1999,
		1999,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1999,
		1999,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2000,
		2000,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(14),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2000,
		2000,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2001,
		2001,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(9),
		60,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2001,
		2001,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(24),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2002,
		2002,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(29),
		60,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2002,
		2002,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(7),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2003,
		2003,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		60,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2003,
		2003,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2004,
		2004,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(7),
		60,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2004,
		2004,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		2012,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Prev, 4, 1),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		2005,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(9),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2007,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(16),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2008,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(5),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2009,
		2009,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2010,
		2010,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(12),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2011,
		2011,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2012,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(23),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2013,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 4, 23),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2013,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__gaza = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Zion)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Jordan)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Palestine)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2008, 7, 29, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2008, 8, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Palestine)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2010, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2010, 2, 27, 1, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Palestine)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 7, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2012, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Palestine))));
};
var $justinmimbs$timezone_data$TimeZone$asia__hebron = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Zion)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Jordan)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Palestine))));
};
var $justinmimbs$timezone_data$TimeZone$asia__ho_chi_minh = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1975, 5, 13, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				420,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_HK = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1965,
		1976,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 16),
		210,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1965,
		1976,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 16),
		210,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1973,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		210,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(13),
		210,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		210,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__hong_kong = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				480,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_HK))));
};
var $justinmimbs$timezone_data$TimeZone$asia__hovd = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1978, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				420,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mongol))));
};
var $justinmimbs$timezone_data$TimeZone$asia__irkutsk = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						540,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				480,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__jakarta = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				420,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__jayapura = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				540,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__jerusalem = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Zion))));
};
var $justinmimbs$timezone_data$TimeZone$asia__kabul = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				270,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__kamchatka = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						720,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						720,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2010, 2, 28, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				720,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Pakistan = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2002,
		2002,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 2),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2002,
		2002,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 2),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2008,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2009,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2009,
		2009,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(15),
		0,
		2,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__karachi = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1971, 2, 26, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				300,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Pakistan))));
};
var $justinmimbs$timezone_data$TimeZone$asia__kathmandu = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						330,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1986, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				345,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__khandyga = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						540,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						540,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 8, 13, 0, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				540,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__kolkata = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				330,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__krasnoyarsk = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				420,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__kuching = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				480,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Macau = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1965,
		1973,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 16),
		210,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1967,
		1976,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 16),
		210,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1973,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		210,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1976,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 16),
		210,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(13),
		210,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 16),
		210,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__macau = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				480,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Macau))));
};
var $justinmimbs$timezone_data$TimeZone$asia__magadan = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						720,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2016, 3, 24, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				660,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__makassar = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				480,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Phil = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__manila = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				480,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Phil))));
};
var $justinmimbs$timezone_data$TimeZone$asia__nicosia = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Cyprus)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1998, 8, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EUAsia))));
};
var $justinmimbs$timezone_data$TimeZone$asia__novokuznetsk = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2010, 2, 28, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				420,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__novosibirsk = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1993, 4, 23, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2016, 6, 24, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				420,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__omsk = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				360,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__oral = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 3, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 9, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1982, 3, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1989, 2, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 2, 29, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 9, 31, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__pontianak = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1988, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				420,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__pyongyang = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						540,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2015, 7, 15, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						510,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2018, 4, 4, 1410, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				540,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__qatar = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1972, 5, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__qostanay = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 3, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 9, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1982, 3, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 9, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2024, 2, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__qyzylorda = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 3, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 9, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1982, 3, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 8, 29, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 2, 29, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 9, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2018, 11, 21, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__riyadh = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__sakhalin = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1997, 2, 30, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2016, 2, 27, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				660,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__samarkand = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 3, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 9, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1982, 3, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_ROK = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1988,
		4,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1988,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		180,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__seoul = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				540,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_ROK))));
};
var $justinmimbs$timezone_data$TimeZone$rules_PRC = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1986,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(4),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1991,
		8,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 11),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1991,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 11),
		120,
		2,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__shanghai = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				480,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_PRC))));
};
var $justinmimbs$timezone_data$TimeZone$asia__singapore = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						450,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 11, 31, 960, 0))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				480,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__srednekolymsk = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						720,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				660,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Taiwan = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1975,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1975,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		6,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__taipei = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				480,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Taiwan))));
};
var $justinmimbs$timezone_data$TimeZone$asia__tashkent = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_E_EurAsia = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1995,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__tbilisi = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_E_EurAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1994, 8, 25, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_E_EurAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 9, 27, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1997, 2, 30, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_E_EurAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2004, 5, 27, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2005, 2, 27, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				240,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Iran = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1380,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(24),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(5),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(26),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(18),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1991,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1995,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1995,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		1996,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		1996,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		1999,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		1999,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2000,
		2000,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2000,
		2000,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2001,
		2003,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2001,
		2003,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2004,
		2004,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2004,
		2004,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		2005,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2005,
		2005,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2008,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2008,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2009,
		2011,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2009,
		2011,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2012,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2012,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2013,
		2015,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2013,
		2015,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2016,
		2016,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2016,
		2016,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2017,
		2019,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2017,
		2019,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2020,
		2020,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2020,
		2020,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2021,
		2022,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2021,
		2022,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		1440,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__tehran = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						210,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Iran)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1977, 9, 20, 1440, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Iran)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1979, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				210,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Iran))));
};
var $justinmimbs$timezone_data$TimeZone$asia__thimphu = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						330,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1987, 9, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				360,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__tokyo = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				540,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__tomsk = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2002, 4, 1, 180, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2016, 4, 29, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				420,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__ulaanbaatar = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						420,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1978, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				480,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mongol))));
};
var $justinmimbs$timezone_data$TimeZone$asia__urumqi = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				360,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__ust_nera = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						540,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 3, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						720,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 8, 13, 0, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				600,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__vladivostok = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						540,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				600,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__yakutsk = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						540,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						480,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						540,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				540,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__yangon = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				390,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$asia__yekaterinburg = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						360,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Armenia = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2011,
		2011,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2011,
		2011,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$asia__yerevan = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1995, 8, 24, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1997, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_RussiaAsia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				240,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Armenia))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Port = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(25),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1979,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1982,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1982,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1983,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$rules_W_Eur = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1980,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		60,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		60,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1995,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$atlantic__azores = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Port)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 8, 25, 60, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_W_Eur)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 8, 27, 60, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1993, 2, 28, 60, 0))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$atlantic__bermuda = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 3, 28, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Canada)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1976, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-240,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_US))));
};
var $justinmimbs$timezone_data$TimeZone$atlantic__canary = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1980, 3, 6, 0, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1980, 8, 28, 60, 0))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				0,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$atlantic__cape_verde = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1975, 10, 25, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-60,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$atlantic__faroe = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				0,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$atlantic__madeira = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Port)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 8, 25, 60, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				0,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$atlantic__south_georgia = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-120,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Falk = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1983,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1984,
		1985,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1984,
		1984,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(16),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1985,
		2000,
		8,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 9),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		2000,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 16),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2001,
		2010,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2001,
		2010,
		8,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$atlantic__stanley = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Falk)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 4, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Falk)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1985, 8, 15, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Falk)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2010, 8, 5, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_AS = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1971,
		1985,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1986,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(19),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		2007,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1972,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1985,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1990,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1991,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1992,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		1993,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(7),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1994,
		1994,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1995,
		2005,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2007,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$australia__adelaide = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						570,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1971, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				570,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_AS))));
};
var $justinmimbs$timezone_data$TimeZone$rules_AQ = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1971,
		1971,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1972,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1991,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1992,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$australia__brisbane = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1971, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				600,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_AQ))));
};
var $justinmimbs$timezone_data$TimeZone$rules_AN = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1971,
		1985,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1972,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1981,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1982,
		1982,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1985,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1989,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1986,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(19),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1999,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1995,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		2005,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2000,
		2000,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2001,
		2007,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2007,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$australia__broken_hill = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						570,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1971, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						570,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_AN)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				570,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_AS))));
};
var $justinmimbs$timezone_data$TimeZone$australia__darwin = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				570,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_AW = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1975,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1983,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1984,
		1984,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1991,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(17),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1992,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2009,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2008,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$australia__eucla = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				525,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_AW))));
};
var $justinmimbs$timezone_data$TimeZone$australia__hobart = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				600,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_AT))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Holiday = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1993,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1993,
		1994,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$australia__lindeman = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1971, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_AQ)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 6, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				600,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Holiday))));
};
var $justinmimbs$timezone_data$TimeZone$rules_LH = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1984,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1982,
		1985,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1985,
		1985,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		30),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1989,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1986,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(19),
		120,
		2,
		30),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1987,
		1999,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		30),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1995,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		2005,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2000,
		2000,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		30),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2001,
		2007,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		30),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2007,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		30)
	]);
var $justinmimbs$timezone_data$TimeZone$australia__lord_howe = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 2, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						630,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_LH)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1985, 6, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				630,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_LH))));
};
var $justinmimbs$timezone_data$TimeZone$rules_AV = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1971,
		1985,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1972,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1985,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1990,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1987,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1988,
		1999,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1994,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1995,
		2005,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2000,
		2000,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2001,
		2007,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2006,
		2006,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		2007,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$australia__melbourne = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1971, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				600,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_AV))));
};
var $justinmimbs$timezone_data$TimeZone$australia__perth = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				480,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_AW))));
};
var $justinmimbs$timezone_data$TimeZone$australia__sydney = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1971, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				600,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_AN))));
};
var $justinmimbs$timezone_data$TimeZone$europe__andorra = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1985, 2, 31, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$europe__astrakhan = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1989, 2, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 2, 29, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2016, 2, 27, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				240,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Greece = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1975,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(12),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1975,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(26),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(11),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(10),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1978,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(26),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(24),
		240,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		540,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(29),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$europe__athens = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Greece)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$europe__belgrade = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1982, 10, 27, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$europe__berlin = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1980, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$europe__brussels = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1977, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$rules_E_Eur = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1980,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1995,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$rules_Romania = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(5),
		1380,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1993,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1991,
		1993,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$europe__bucharest = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Romania)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 2, 29, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_C_Eur)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Romania)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1994, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_E_Eur)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1997, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Hungary = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1983,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1983,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$europe__budapest = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Hungary)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1984, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Moldova = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		180,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$europe__chisinau = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 4, 6, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_E_Eur)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1997, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Moldova))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Eire = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1971,
		1971,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		120,
		0,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1980,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 16),
		120,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1980,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 23),
		120,
		0,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1989,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 23),
		60,
		0,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1995,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 22),
		60,
		0,
		-60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		0,
		-60)
	]);
var $justinmimbs$timezone_data$TimeZone$europe__dublin = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Eire))));
};
var $justinmimbs$timezone_data$TimeZone$europe__gibraltar = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1982, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Finland = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1982,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1982,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		180,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$europe__helsinki = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Finland)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Turkey = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1973,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		60,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1976,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 31),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1975,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1978,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1978,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(29),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1983,
		6,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1983,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1985,
		1985,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		60,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1985,
		1985,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		60,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1993,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1986,
		1995,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1994,
		1994,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		60,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1995,
		2006,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		2006,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$europe__istanbul = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Turkey)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1978, 5, 29, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Turkey)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1984, 10, 1, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Turkey)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2007, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 60, 0)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 28, 60, 0)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 2, 30, 60, 0)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 2, 31, 60, 0)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2015, 9, 25, 60, 0)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2015, 10, 8, 60, 0)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2016, 8, 7, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$europe__kaliningrad = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1989, 2, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$europe__kirov = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1989, 2, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 2, 29, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$europe__kyiv = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 6, 1, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 8, 29, 180, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_C_Eur)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 4, 13, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$europe__lisbon = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1976, 8, 26, 60, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Port)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1983, 8, 25, 60, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_W_Eur)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 8, 27, 60, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 2, 31, 60, 0))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				0,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$rules_GB_Eire = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1980,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 16),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1980,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 23),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1995,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1989,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 23),
		60,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		1995,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 22),
		60,
		0,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$europe__london = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1971, 9, 31, 120, 0)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						0,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_GB_Eire)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				0,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Spain = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1975,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 5, 12),
		1380,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1975,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		1380,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1977,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		1380,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		120,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$europe__madrid = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Spain)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1979, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Italy = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1967,
		1969,
		8,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 22),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1969,
		1969,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1970,
		1970,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1970,
		1970,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1971,
		1972,
		4,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 22),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1971,
		1971,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1972,
		1972,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1973,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1974,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(26),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1975,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1977,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1979,
		4,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 22),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		0,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$rules_Malta = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1973,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1973,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(29),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		0,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(16),
		0,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1979,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1980,
		8,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		120,
		2,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$europe__malta = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Italy)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1973, 2, 31, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Malta)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$europe__minsk = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$europe__moscow = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_France = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		60,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(26),
		60,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$europe__paris = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_France)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1977, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$europe__prague = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1979, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Latvia = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1996,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1996,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$europe__riga = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1989, 2, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1989, 8, 24, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Latvia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1997, 0, 21, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 1, 29, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2001, 0, 2, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$europe__rome = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Italy)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1980, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$europe__samara = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1989, 2, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 8, 29, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 9, 20, 180, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2010, 2, 28, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				240,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$europe__saratov = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1988, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 2, 29, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2016, 11, 4, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				240,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$europe__simferopol = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1990, 6, 1, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 2, 20, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_C_Eur)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1994, 4, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_C_Eur)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 2, 31, 0, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 9, 27, 180, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1997, 2, 30, 60, 0)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 2, 30, 120, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Bulg = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		1380,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1982,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 5, 1),
		1380,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(29),
		60,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1981,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$europe__sofia = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1979, 2, 31, 1380, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Bulg)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1982, 8, 26, 180, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_C_Eur)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_E_Eur)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1997, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$europe__tallinn = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1989, 2, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1989, 8, 24, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_C_Eur)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1998, 8, 22, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 9, 31, 240, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2002, 1, 21, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Albania = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(4),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1975,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1975,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(8),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(5),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1979,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(4),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1981,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(26),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1981,
		1981,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1982,
		1982,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1982,
		1982,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(3),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1983,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(18),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1983,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1984,
		1984,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		0,
		2,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$europe__tirane = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Albania)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1984, 6, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$europe__ulyanovsk = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1989, 2, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 0, 19, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2016, 2, 27, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				240,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Austria = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1980,
		1980,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		0,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$europe__vienna = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Austria)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$europe__vilnius = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1989, 2, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 8, 29, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_C_Eur)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1998, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1998, 2, 29, 60, 0)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 9, 31, 60, 0)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						120,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2003, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				120,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$europe__volgograd = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1988, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1991, 2, 31, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1992, 2, 29, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Russia)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 2, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 9, 26, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						180,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2018, 9, 28, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						240,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2020, 11, 27, 120, 1))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				180,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$europe__warsaw = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1977, 0, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_W_Eur)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1988, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $justinmimbs$timezone_data$TimeZone$europe__zurich = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						60,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1981, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				60,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_EU))));
};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $justinmimbs$timezone_data$TimeZone$indian__chagos = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1996, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				360,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$indian__maldives = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				300,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Mauritius = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1982,
		1982,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(10),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1983,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(21),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		2008,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2009,
		2009,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$indian__mauritius = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				240,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Mauritius))));
};
var $justinmimbs$timezone_data$TimeZone$rules_WS = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2010,
		2010,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2011,
		2011,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 5, 1),
		240,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2011,
		2011,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(5),
		180,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2021,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		240,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2020,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		180,
		2,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$pacific__apia = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-660,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_WS)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 11, 29, 1440, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				780,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_WS))));
};
var $justinmimbs$timezone_data$TimeZone$rules_NZ = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		10,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1975,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1988,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1989,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1989,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		2006,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		2007,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$pacific__auckland = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				720,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_NZ))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__bougainville = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2014, 11, 28, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				660,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Chatham = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		10,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		165,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1975,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		165,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1975,
		1988,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		165,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1989,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		165,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1989,
		1989,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		165,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		2006,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		165,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1990,
		2007,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		165,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2007,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		8,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		165,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2008,
		$justinmimbs$timezone_data$TimeZone$maxYear,
		3,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		165,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$pacific__chatham = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				765,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Chatham))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__easter = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-420,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Chile)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1982, 2, 14, 180, 0))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Chile))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Vanuatu = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1973,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		720,
		0,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(30),
		720,
		0,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1983,
		1991,
		8,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 5, 22),
		1440,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1984,
		1991,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 5, 22),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1993,
		0,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 5, 22),
		1440,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1992,
		1992,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 5, 22),
		1440,
		2,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$pacific__efate = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				660,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Vanuatu))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__fakaofo = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-660,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2011, 11, 30, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				780,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Fiji = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1998,
		1999,
		10,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1999,
		2000,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		180,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2009,
		2009,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(29),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2010,
		2010,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		180,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2010,
		2013,
		9,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 21),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2011,
		2011,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		180,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2012,
		2013,
		0,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 18),
		180,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2014,
		2014,
		0,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 18),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2014,
		2018,
		10,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2015,
		2021,
		0,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 12),
		180,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2019,
		2019,
		10,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 8),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2020,
		2020,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(20),
		120,
		2,
		60)
	]);
var $justinmimbs$timezone_data$TimeZone$pacific__fiji = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				720,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Fiji))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__galapagos = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-300,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1986, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-360,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Ecuador))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__gambier = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-540,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__guadalcanal = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				660,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Guam = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1969,
		1969,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(26),
		1,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1969,
		1969,
		5,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1969,
		1969,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(31),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1970,
		1971,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1970,
		1971,
		8,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1973,
		1973,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(16),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1974,
		1974,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(24),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		4,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(26),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1976,
		1976,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(22),
		121,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		3,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(24),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1977,
		7,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(28),
		120,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$pacific__guam = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						600,
						$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Guam)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2000, 11, 23, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				600,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__honolulu = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-600,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__kanton = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-720,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1979, 9, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-660,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1994, 11, 31, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				780,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__kiritimati = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-640,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1979, 9, 1, 0, 2)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-600,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1994, 11, 31, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				840,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__kosrae = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						720,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				660,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__kwajalein = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-720,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1993, 7, 20, 1440, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				720,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__marquesas = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-570,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__nauru = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						690,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1979, 1, 10, 120, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				720,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__niue = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-660,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__norfolk = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						690,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1974, 9, 27, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						690,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(60)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1975, 2, 2, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						690,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2015, 9, 4, 120, 1)),
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						660,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 2019, 6, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				660,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_AN))));
};
var $justinmimbs$timezone_data$TimeZone$rules_NC = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1977,
		1978,
		11,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1979,
		1,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(27),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1996,
		1996,
		11,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(1),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1997,
		1997,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(2),
		120,
		1,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$pacific__noumea = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				660,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_NC))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__pago_pago = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-660,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__palau = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				540,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__pitcairn = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-510,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1998, 3, 27, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-480,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__port_moresby = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				600,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Cook = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1978,
		1978,
		10,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(12),
		0,
		2,
		30),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1991,
		2,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		0,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1979,
		1990,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		0,
		2,
		30)
	]);
var $justinmimbs$timezone_data$TimeZone$pacific__rarotonga = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						-630,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1978, 10, 12, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-600,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Cook))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__tahiti = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				-600,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$pacific__tarawa = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_Nil,
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				720,
				$justinmimbs$timezone_data$TimeZone$Specification$Save(0))));
};
var $justinmimbs$timezone_data$TimeZone$rules_Tonga = _List_fromArray(
	[
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		1999,
		1999,
		9,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(7),
		120,
		1,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2000,
		2000,
		2,
		$justinmimbs$timezone_data$TimeZone$Specification$Day(19),
		120,
		1,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2000,
		2001,
		10,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2001,
		2002,
		0,
		$justinmimbs$timezone_data$TimeZone$Specification$Last(6),
		120,
		2,
		0),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2016,
		2016,
		10,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 1),
		120,
		2,
		60),
		A7(
		$justinmimbs$timezone_data$TimeZone$Specification$Rule,
		2017,
		2017,
		0,
		A2($justinmimbs$timezone_data$TimeZone$Specification$Next, 6, 15),
		180,
		2,
		0)
	]);
var $justinmimbs$timezone_data$TimeZone$pacific__tongatapu = function (_v0) {
	return $justinmimbs$timezone_data$TimeZone$fromSpecification(
		A2(
			$justinmimbs$timezone_data$TimeZone$Specification$Zone,
			_List_fromArray(
				[
					_Utils_Tuple2(
					A2(
						$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
						780,
						$justinmimbs$timezone_data$TimeZone$Specification$Save(0)),
					A5($justinmimbs$timezone_data$TimeZone$Specification$DateTime, 1999, 0, 1, 0, 2))
				]),
			A2(
				$justinmimbs$timezone_data$TimeZone$Specification$ZoneState,
				780,
				$justinmimbs$timezone_data$TimeZone$Specification$Rules($justinmimbs$timezone_data$TimeZone$rules_Tonga))));
};
var $justinmimbs$timezone_data$TimeZone$zones = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('Africa/Abidjan', $justinmimbs$timezone_data$TimeZone$africa__abidjan),
			_Utils_Tuple2('Africa/Algiers', $justinmimbs$timezone_data$TimeZone$africa__algiers),
			_Utils_Tuple2('Africa/Bissau', $justinmimbs$timezone_data$TimeZone$africa__bissau),
			_Utils_Tuple2('Africa/Cairo', $justinmimbs$timezone_data$TimeZone$africa__cairo),
			_Utils_Tuple2('Africa/Casablanca', $justinmimbs$timezone_data$TimeZone$africa__casablanca),
			_Utils_Tuple2('Africa/Ceuta', $justinmimbs$timezone_data$TimeZone$africa__ceuta),
			_Utils_Tuple2('Africa/El_Aaiun', $justinmimbs$timezone_data$TimeZone$africa__el_aaiun),
			_Utils_Tuple2('Africa/Johannesburg', $justinmimbs$timezone_data$TimeZone$africa__johannesburg),
			_Utils_Tuple2('Africa/Juba', $justinmimbs$timezone_data$TimeZone$africa__juba),
			_Utils_Tuple2('Africa/Khartoum', $justinmimbs$timezone_data$TimeZone$africa__khartoum),
			_Utils_Tuple2('Africa/Lagos', $justinmimbs$timezone_data$TimeZone$africa__lagos),
			_Utils_Tuple2('Africa/Maputo', $justinmimbs$timezone_data$TimeZone$africa__maputo),
			_Utils_Tuple2('Africa/Monrovia', $justinmimbs$timezone_data$TimeZone$africa__monrovia),
			_Utils_Tuple2('Africa/Nairobi', $justinmimbs$timezone_data$TimeZone$africa__nairobi),
			_Utils_Tuple2('Africa/Ndjamena', $justinmimbs$timezone_data$TimeZone$africa__ndjamena),
			_Utils_Tuple2('Africa/Sao_Tome', $justinmimbs$timezone_data$TimeZone$africa__sao_tome),
			_Utils_Tuple2('Africa/Tripoli', $justinmimbs$timezone_data$TimeZone$africa__tripoli),
			_Utils_Tuple2('Africa/Tunis', $justinmimbs$timezone_data$TimeZone$africa__tunis),
			_Utils_Tuple2('Africa/Windhoek', $justinmimbs$timezone_data$TimeZone$africa__windhoek),
			_Utils_Tuple2('America/Adak', $justinmimbs$timezone_data$TimeZone$america__adak),
			_Utils_Tuple2('America/Anchorage', $justinmimbs$timezone_data$TimeZone$america__anchorage),
			_Utils_Tuple2('America/Araguaina', $justinmimbs$timezone_data$TimeZone$america__araguaina),
			_Utils_Tuple2('America/Argentina/Buenos_Aires', $justinmimbs$timezone_data$TimeZone$america__argentina__buenos_aires),
			_Utils_Tuple2('America/Argentina/Catamarca', $justinmimbs$timezone_data$TimeZone$america__argentina__catamarca),
			_Utils_Tuple2('America/Argentina/Cordoba', $justinmimbs$timezone_data$TimeZone$america__argentina__cordoba),
			_Utils_Tuple2('America/Argentina/Jujuy', $justinmimbs$timezone_data$TimeZone$america__argentina__jujuy),
			_Utils_Tuple2('America/Argentina/La_Rioja', $justinmimbs$timezone_data$TimeZone$america__argentina__la_rioja),
			_Utils_Tuple2('America/Argentina/Mendoza', $justinmimbs$timezone_data$TimeZone$america__argentina__mendoza),
			_Utils_Tuple2('America/Argentina/Rio_Gallegos', $justinmimbs$timezone_data$TimeZone$america__argentina__rio_gallegos),
			_Utils_Tuple2('America/Argentina/Salta', $justinmimbs$timezone_data$TimeZone$america__argentina__salta),
			_Utils_Tuple2('America/Argentina/San_Juan', $justinmimbs$timezone_data$TimeZone$america__argentina__san_juan),
			_Utils_Tuple2('America/Argentina/San_Luis', $justinmimbs$timezone_data$TimeZone$america__argentina__san_luis),
			_Utils_Tuple2('America/Argentina/Tucuman', $justinmimbs$timezone_data$TimeZone$america__argentina__tucuman),
			_Utils_Tuple2('America/Argentina/Ushuaia', $justinmimbs$timezone_data$TimeZone$america__argentina__ushuaia),
			_Utils_Tuple2('America/Asuncion', $justinmimbs$timezone_data$TimeZone$america__asuncion),
			_Utils_Tuple2('America/Bahia', $justinmimbs$timezone_data$TimeZone$america__bahia),
			_Utils_Tuple2('America/Bahia_Banderas', $justinmimbs$timezone_data$TimeZone$america__bahia_banderas),
			_Utils_Tuple2('America/Barbados', $justinmimbs$timezone_data$TimeZone$america__barbados),
			_Utils_Tuple2('America/Belem', $justinmimbs$timezone_data$TimeZone$america__belem),
			_Utils_Tuple2('America/Belize', $justinmimbs$timezone_data$TimeZone$america__belize),
			_Utils_Tuple2('America/Boa_Vista', $justinmimbs$timezone_data$TimeZone$america__boa_vista),
			_Utils_Tuple2('America/Bogota', $justinmimbs$timezone_data$TimeZone$america__bogota),
			_Utils_Tuple2('America/Boise', $justinmimbs$timezone_data$TimeZone$america__boise),
			_Utils_Tuple2('America/Cambridge_Bay', $justinmimbs$timezone_data$TimeZone$america__cambridge_bay),
			_Utils_Tuple2('America/Campo_Grande', $justinmimbs$timezone_data$TimeZone$america__campo_grande),
			_Utils_Tuple2('America/Cancun', $justinmimbs$timezone_data$TimeZone$america__cancun),
			_Utils_Tuple2('America/Caracas', $justinmimbs$timezone_data$TimeZone$america__caracas),
			_Utils_Tuple2('America/Cayenne', $justinmimbs$timezone_data$TimeZone$america__cayenne),
			_Utils_Tuple2('America/Chicago', $justinmimbs$timezone_data$TimeZone$america__chicago),
			_Utils_Tuple2('America/Chihuahua', $justinmimbs$timezone_data$TimeZone$america__chihuahua),
			_Utils_Tuple2('America/Ciudad_Juarez', $justinmimbs$timezone_data$TimeZone$america__ciudad_juarez),
			_Utils_Tuple2('America/Costa_Rica', $justinmimbs$timezone_data$TimeZone$america__costa_rica),
			_Utils_Tuple2('America/Cuiaba', $justinmimbs$timezone_data$TimeZone$america__cuiaba),
			_Utils_Tuple2('America/Danmarkshavn', $justinmimbs$timezone_data$TimeZone$america__danmarkshavn),
			_Utils_Tuple2('America/Dawson', $justinmimbs$timezone_data$TimeZone$america__dawson),
			_Utils_Tuple2('America/Dawson_Creek', $justinmimbs$timezone_data$TimeZone$america__dawson_creek),
			_Utils_Tuple2('America/Denver', $justinmimbs$timezone_data$TimeZone$america__denver),
			_Utils_Tuple2('America/Detroit', $justinmimbs$timezone_data$TimeZone$america__detroit),
			_Utils_Tuple2('America/Edmonton', $justinmimbs$timezone_data$TimeZone$america__edmonton),
			_Utils_Tuple2('America/Eirunepe', $justinmimbs$timezone_data$TimeZone$america__eirunepe),
			_Utils_Tuple2('America/El_Salvador', $justinmimbs$timezone_data$TimeZone$america__el_salvador),
			_Utils_Tuple2('America/Fort_Nelson', $justinmimbs$timezone_data$TimeZone$america__fort_nelson),
			_Utils_Tuple2('America/Fortaleza', $justinmimbs$timezone_data$TimeZone$america__fortaleza),
			_Utils_Tuple2('America/Glace_Bay', $justinmimbs$timezone_data$TimeZone$america__glace_bay),
			_Utils_Tuple2('America/Goose_Bay', $justinmimbs$timezone_data$TimeZone$america__goose_bay),
			_Utils_Tuple2('America/Grand_Turk', $justinmimbs$timezone_data$TimeZone$america__grand_turk),
			_Utils_Tuple2('America/Guatemala', $justinmimbs$timezone_data$TimeZone$america__guatemala),
			_Utils_Tuple2('America/Guayaquil', $justinmimbs$timezone_data$TimeZone$america__guayaquil),
			_Utils_Tuple2('America/Guyana', $justinmimbs$timezone_data$TimeZone$america__guyana),
			_Utils_Tuple2('America/Halifax', $justinmimbs$timezone_data$TimeZone$america__halifax),
			_Utils_Tuple2('America/Havana', $justinmimbs$timezone_data$TimeZone$america__havana),
			_Utils_Tuple2('America/Hermosillo', $justinmimbs$timezone_data$TimeZone$america__hermosillo),
			_Utils_Tuple2('America/Indiana/Indianapolis', $justinmimbs$timezone_data$TimeZone$america__indiana__indianapolis),
			_Utils_Tuple2('America/Indiana/Knox', $justinmimbs$timezone_data$TimeZone$america__indiana__knox),
			_Utils_Tuple2('America/Indiana/Marengo', $justinmimbs$timezone_data$TimeZone$america__indiana__marengo),
			_Utils_Tuple2('America/Indiana/Petersburg', $justinmimbs$timezone_data$TimeZone$america__indiana__petersburg),
			_Utils_Tuple2('America/Indiana/Tell_City', $justinmimbs$timezone_data$TimeZone$america__indiana__tell_city),
			_Utils_Tuple2('America/Indiana/Vevay', $justinmimbs$timezone_data$TimeZone$america__indiana__vevay),
			_Utils_Tuple2('America/Indiana/Vincennes', $justinmimbs$timezone_data$TimeZone$america__indiana__vincennes),
			_Utils_Tuple2('America/Indiana/Winamac', $justinmimbs$timezone_data$TimeZone$america__indiana__winamac),
			_Utils_Tuple2('America/Inuvik', $justinmimbs$timezone_data$TimeZone$america__inuvik),
			_Utils_Tuple2('America/Iqaluit', $justinmimbs$timezone_data$TimeZone$america__iqaluit),
			_Utils_Tuple2('America/Jamaica', $justinmimbs$timezone_data$TimeZone$america__jamaica),
			_Utils_Tuple2('America/Juneau', $justinmimbs$timezone_data$TimeZone$america__juneau),
			_Utils_Tuple2('America/Kentucky/Louisville', $justinmimbs$timezone_data$TimeZone$america__kentucky__louisville),
			_Utils_Tuple2('America/Kentucky/Monticello', $justinmimbs$timezone_data$TimeZone$america__kentucky__monticello),
			_Utils_Tuple2('America/La_Paz', $justinmimbs$timezone_data$TimeZone$america__la_paz),
			_Utils_Tuple2('America/Lima', $justinmimbs$timezone_data$TimeZone$america__lima),
			_Utils_Tuple2('America/Los_Angeles', $justinmimbs$timezone_data$TimeZone$america__los_angeles),
			_Utils_Tuple2('America/Maceio', $justinmimbs$timezone_data$TimeZone$america__maceio),
			_Utils_Tuple2('America/Managua', $justinmimbs$timezone_data$TimeZone$america__managua),
			_Utils_Tuple2('America/Manaus', $justinmimbs$timezone_data$TimeZone$america__manaus),
			_Utils_Tuple2('America/Martinique', $justinmimbs$timezone_data$TimeZone$america__martinique),
			_Utils_Tuple2('America/Matamoros', $justinmimbs$timezone_data$TimeZone$america__matamoros),
			_Utils_Tuple2('America/Mazatlan', $justinmimbs$timezone_data$TimeZone$america__mazatlan),
			_Utils_Tuple2('America/Menominee', $justinmimbs$timezone_data$TimeZone$america__menominee),
			_Utils_Tuple2('America/Merida', $justinmimbs$timezone_data$TimeZone$america__merida),
			_Utils_Tuple2('America/Metlakatla', $justinmimbs$timezone_data$TimeZone$america__metlakatla),
			_Utils_Tuple2('America/Mexico_City', $justinmimbs$timezone_data$TimeZone$america__mexico_city),
			_Utils_Tuple2('America/Miquelon', $justinmimbs$timezone_data$TimeZone$america__miquelon),
			_Utils_Tuple2('America/Moncton', $justinmimbs$timezone_data$TimeZone$america__moncton),
			_Utils_Tuple2('America/Monterrey', $justinmimbs$timezone_data$TimeZone$america__monterrey),
			_Utils_Tuple2('America/Montevideo', $justinmimbs$timezone_data$TimeZone$america__montevideo),
			_Utils_Tuple2('America/New_York', $justinmimbs$timezone_data$TimeZone$america__new_york),
			_Utils_Tuple2('America/Nome', $justinmimbs$timezone_data$TimeZone$america__nome),
			_Utils_Tuple2('America/Noronha', $justinmimbs$timezone_data$TimeZone$america__noronha),
			_Utils_Tuple2('America/North_Dakota/Beulah', $justinmimbs$timezone_data$TimeZone$america__north_dakota__beulah),
			_Utils_Tuple2('America/North_Dakota/Center', $justinmimbs$timezone_data$TimeZone$america__north_dakota__center),
			_Utils_Tuple2('America/North_Dakota/New_Salem', $justinmimbs$timezone_data$TimeZone$america__north_dakota__new_salem),
			_Utils_Tuple2('America/Nuuk', $justinmimbs$timezone_data$TimeZone$america__nuuk),
			_Utils_Tuple2('America/Ojinaga', $justinmimbs$timezone_data$TimeZone$america__ojinaga),
			_Utils_Tuple2('America/Panama', $justinmimbs$timezone_data$TimeZone$america__panama),
			_Utils_Tuple2('America/Paramaribo', $justinmimbs$timezone_data$TimeZone$america__paramaribo),
			_Utils_Tuple2('America/Phoenix', $justinmimbs$timezone_data$TimeZone$america__phoenix),
			_Utils_Tuple2('America/Port-au-Prince', $justinmimbs$timezone_data$TimeZone$america__port_au_prince),
			_Utils_Tuple2('America/Porto_Velho', $justinmimbs$timezone_data$TimeZone$america__porto_velho),
			_Utils_Tuple2('America/Puerto_Rico', $justinmimbs$timezone_data$TimeZone$america__puerto_rico),
			_Utils_Tuple2('America/Punta_Arenas', $justinmimbs$timezone_data$TimeZone$america__punta_arenas),
			_Utils_Tuple2('America/Rankin_Inlet', $justinmimbs$timezone_data$TimeZone$america__rankin_inlet),
			_Utils_Tuple2('America/Recife', $justinmimbs$timezone_data$TimeZone$america__recife),
			_Utils_Tuple2('America/Regina', $justinmimbs$timezone_data$TimeZone$america__regina),
			_Utils_Tuple2('America/Resolute', $justinmimbs$timezone_data$TimeZone$america__resolute),
			_Utils_Tuple2('America/Rio_Branco', $justinmimbs$timezone_data$TimeZone$america__rio_branco),
			_Utils_Tuple2('America/Santarem', $justinmimbs$timezone_data$TimeZone$america__santarem),
			_Utils_Tuple2('America/Santiago', $justinmimbs$timezone_data$TimeZone$america__santiago),
			_Utils_Tuple2('America/Santo_Domingo', $justinmimbs$timezone_data$TimeZone$america__santo_domingo),
			_Utils_Tuple2('America/Sao_Paulo', $justinmimbs$timezone_data$TimeZone$america__sao_paulo),
			_Utils_Tuple2('America/Scoresbysund', $justinmimbs$timezone_data$TimeZone$america__scoresbysund),
			_Utils_Tuple2('America/Sitka', $justinmimbs$timezone_data$TimeZone$america__sitka),
			_Utils_Tuple2('America/St_Johns', $justinmimbs$timezone_data$TimeZone$america__st_johns),
			_Utils_Tuple2('America/Swift_Current', $justinmimbs$timezone_data$TimeZone$america__swift_current),
			_Utils_Tuple2('America/Tegucigalpa', $justinmimbs$timezone_data$TimeZone$america__tegucigalpa),
			_Utils_Tuple2('America/Thule', $justinmimbs$timezone_data$TimeZone$america__thule),
			_Utils_Tuple2('America/Tijuana', $justinmimbs$timezone_data$TimeZone$america__tijuana),
			_Utils_Tuple2('America/Toronto', $justinmimbs$timezone_data$TimeZone$america__toronto),
			_Utils_Tuple2('America/Vancouver', $justinmimbs$timezone_data$TimeZone$america__vancouver),
			_Utils_Tuple2('America/Whitehorse', $justinmimbs$timezone_data$TimeZone$america__whitehorse),
			_Utils_Tuple2('America/Winnipeg', $justinmimbs$timezone_data$TimeZone$america__winnipeg),
			_Utils_Tuple2('America/Yakutat', $justinmimbs$timezone_data$TimeZone$america__yakutat),
			_Utils_Tuple2('Antarctica/Casey', $justinmimbs$timezone_data$TimeZone$antarctica__casey),
			_Utils_Tuple2('Antarctica/Davis', $justinmimbs$timezone_data$TimeZone$antarctica__davis),
			_Utils_Tuple2('Antarctica/Macquarie', $justinmimbs$timezone_data$TimeZone$antarctica__macquarie),
			_Utils_Tuple2('Antarctica/Mawson', $justinmimbs$timezone_data$TimeZone$antarctica__mawson),
			_Utils_Tuple2('Antarctica/Palmer', $justinmimbs$timezone_data$TimeZone$antarctica__palmer),
			_Utils_Tuple2('Antarctica/Rothera', $justinmimbs$timezone_data$TimeZone$antarctica__rothera),
			_Utils_Tuple2('Antarctica/Troll', $justinmimbs$timezone_data$TimeZone$antarctica__troll),
			_Utils_Tuple2('Antarctica/Vostok', $justinmimbs$timezone_data$TimeZone$antarctica__vostok),
			_Utils_Tuple2('Asia/Almaty', $justinmimbs$timezone_data$TimeZone$asia__almaty),
			_Utils_Tuple2('Asia/Amman', $justinmimbs$timezone_data$TimeZone$asia__amman),
			_Utils_Tuple2('Asia/Anadyr', $justinmimbs$timezone_data$TimeZone$asia__anadyr),
			_Utils_Tuple2('Asia/Aqtau', $justinmimbs$timezone_data$TimeZone$asia__aqtau),
			_Utils_Tuple2('Asia/Aqtobe', $justinmimbs$timezone_data$TimeZone$asia__aqtobe),
			_Utils_Tuple2('Asia/Ashgabat', $justinmimbs$timezone_data$TimeZone$asia__ashgabat),
			_Utils_Tuple2('Asia/Atyrau', $justinmimbs$timezone_data$TimeZone$asia__atyrau),
			_Utils_Tuple2('Asia/Baghdad', $justinmimbs$timezone_data$TimeZone$asia__baghdad),
			_Utils_Tuple2('Asia/Baku', $justinmimbs$timezone_data$TimeZone$asia__baku),
			_Utils_Tuple2('Asia/Bangkok', $justinmimbs$timezone_data$TimeZone$asia__bangkok),
			_Utils_Tuple2('Asia/Barnaul', $justinmimbs$timezone_data$TimeZone$asia__barnaul),
			_Utils_Tuple2('Asia/Beirut', $justinmimbs$timezone_data$TimeZone$asia__beirut),
			_Utils_Tuple2('Asia/Bishkek', $justinmimbs$timezone_data$TimeZone$asia__bishkek),
			_Utils_Tuple2('Asia/Chita', $justinmimbs$timezone_data$TimeZone$asia__chita),
			_Utils_Tuple2('Asia/Choibalsan', $justinmimbs$timezone_data$TimeZone$asia__choibalsan),
			_Utils_Tuple2('Asia/Colombo', $justinmimbs$timezone_data$TimeZone$asia__colombo),
			_Utils_Tuple2('Asia/Damascus', $justinmimbs$timezone_data$TimeZone$asia__damascus),
			_Utils_Tuple2('Asia/Dhaka', $justinmimbs$timezone_data$TimeZone$asia__dhaka),
			_Utils_Tuple2('Asia/Dili', $justinmimbs$timezone_data$TimeZone$asia__dili),
			_Utils_Tuple2('Asia/Dubai', $justinmimbs$timezone_data$TimeZone$asia__dubai),
			_Utils_Tuple2('Asia/Dushanbe', $justinmimbs$timezone_data$TimeZone$asia__dushanbe),
			_Utils_Tuple2('Asia/Famagusta', $justinmimbs$timezone_data$TimeZone$asia__famagusta),
			_Utils_Tuple2('Asia/Gaza', $justinmimbs$timezone_data$TimeZone$asia__gaza),
			_Utils_Tuple2('Asia/Hebron', $justinmimbs$timezone_data$TimeZone$asia__hebron),
			_Utils_Tuple2('Asia/Ho_Chi_Minh', $justinmimbs$timezone_data$TimeZone$asia__ho_chi_minh),
			_Utils_Tuple2('Asia/Hong_Kong', $justinmimbs$timezone_data$TimeZone$asia__hong_kong),
			_Utils_Tuple2('Asia/Hovd', $justinmimbs$timezone_data$TimeZone$asia__hovd),
			_Utils_Tuple2('Asia/Irkutsk', $justinmimbs$timezone_data$TimeZone$asia__irkutsk),
			_Utils_Tuple2('Asia/Jakarta', $justinmimbs$timezone_data$TimeZone$asia__jakarta),
			_Utils_Tuple2('Asia/Jayapura', $justinmimbs$timezone_data$TimeZone$asia__jayapura),
			_Utils_Tuple2('Asia/Jerusalem', $justinmimbs$timezone_data$TimeZone$asia__jerusalem),
			_Utils_Tuple2('Asia/Kabul', $justinmimbs$timezone_data$TimeZone$asia__kabul),
			_Utils_Tuple2('Asia/Kamchatka', $justinmimbs$timezone_data$TimeZone$asia__kamchatka),
			_Utils_Tuple2('Asia/Karachi', $justinmimbs$timezone_data$TimeZone$asia__karachi),
			_Utils_Tuple2('Asia/Kathmandu', $justinmimbs$timezone_data$TimeZone$asia__kathmandu),
			_Utils_Tuple2('Asia/Khandyga', $justinmimbs$timezone_data$TimeZone$asia__khandyga),
			_Utils_Tuple2('Asia/Kolkata', $justinmimbs$timezone_data$TimeZone$asia__kolkata),
			_Utils_Tuple2('Asia/Krasnoyarsk', $justinmimbs$timezone_data$TimeZone$asia__krasnoyarsk),
			_Utils_Tuple2('Asia/Kuching', $justinmimbs$timezone_data$TimeZone$asia__kuching),
			_Utils_Tuple2('Asia/Macau', $justinmimbs$timezone_data$TimeZone$asia__macau),
			_Utils_Tuple2('Asia/Magadan', $justinmimbs$timezone_data$TimeZone$asia__magadan),
			_Utils_Tuple2('Asia/Makassar', $justinmimbs$timezone_data$TimeZone$asia__makassar),
			_Utils_Tuple2('Asia/Manila', $justinmimbs$timezone_data$TimeZone$asia__manila),
			_Utils_Tuple2('Asia/Nicosia', $justinmimbs$timezone_data$TimeZone$asia__nicosia),
			_Utils_Tuple2('Asia/Novokuznetsk', $justinmimbs$timezone_data$TimeZone$asia__novokuznetsk),
			_Utils_Tuple2('Asia/Novosibirsk', $justinmimbs$timezone_data$TimeZone$asia__novosibirsk),
			_Utils_Tuple2('Asia/Omsk', $justinmimbs$timezone_data$TimeZone$asia__omsk),
			_Utils_Tuple2('Asia/Oral', $justinmimbs$timezone_data$TimeZone$asia__oral),
			_Utils_Tuple2('Asia/Pontianak', $justinmimbs$timezone_data$TimeZone$asia__pontianak),
			_Utils_Tuple2('Asia/Pyongyang', $justinmimbs$timezone_data$TimeZone$asia__pyongyang),
			_Utils_Tuple2('Asia/Qatar', $justinmimbs$timezone_data$TimeZone$asia__qatar),
			_Utils_Tuple2('Asia/Qostanay', $justinmimbs$timezone_data$TimeZone$asia__qostanay),
			_Utils_Tuple2('Asia/Qyzylorda', $justinmimbs$timezone_data$TimeZone$asia__qyzylorda),
			_Utils_Tuple2('Asia/Riyadh', $justinmimbs$timezone_data$TimeZone$asia__riyadh),
			_Utils_Tuple2('Asia/Sakhalin', $justinmimbs$timezone_data$TimeZone$asia__sakhalin),
			_Utils_Tuple2('Asia/Samarkand', $justinmimbs$timezone_data$TimeZone$asia__samarkand),
			_Utils_Tuple2('Asia/Seoul', $justinmimbs$timezone_data$TimeZone$asia__seoul),
			_Utils_Tuple2('Asia/Shanghai', $justinmimbs$timezone_data$TimeZone$asia__shanghai),
			_Utils_Tuple2('Asia/Singapore', $justinmimbs$timezone_data$TimeZone$asia__singapore),
			_Utils_Tuple2('Asia/Srednekolymsk', $justinmimbs$timezone_data$TimeZone$asia__srednekolymsk),
			_Utils_Tuple2('Asia/Taipei', $justinmimbs$timezone_data$TimeZone$asia__taipei),
			_Utils_Tuple2('Asia/Tashkent', $justinmimbs$timezone_data$TimeZone$asia__tashkent),
			_Utils_Tuple2('Asia/Tbilisi', $justinmimbs$timezone_data$TimeZone$asia__tbilisi),
			_Utils_Tuple2('Asia/Tehran', $justinmimbs$timezone_data$TimeZone$asia__tehran),
			_Utils_Tuple2('Asia/Thimphu', $justinmimbs$timezone_data$TimeZone$asia__thimphu),
			_Utils_Tuple2('Asia/Tokyo', $justinmimbs$timezone_data$TimeZone$asia__tokyo),
			_Utils_Tuple2('Asia/Tomsk', $justinmimbs$timezone_data$TimeZone$asia__tomsk),
			_Utils_Tuple2('Asia/Ulaanbaatar', $justinmimbs$timezone_data$TimeZone$asia__ulaanbaatar),
			_Utils_Tuple2('Asia/Urumqi', $justinmimbs$timezone_data$TimeZone$asia__urumqi),
			_Utils_Tuple2('Asia/Ust-Nera', $justinmimbs$timezone_data$TimeZone$asia__ust_nera),
			_Utils_Tuple2('Asia/Vladivostok', $justinmimbs$timezone_data$TimeZone$asia__vladivostok),
			_Utils_Tuple2('Asia/Yakutsk', $justinmimbs$timezone_data$TimeZone$asia__yakutsk),
			_Utils_Tuple2('Asia/Yangon', $justinmimbs$timezone_data$TimeZone$asia__yangon),
			_Utils_Tuple2('Asia/Yekaterinburg', $justinmimbs$timezone_data$TimeZone$asia__yekaterinburg),
			_Utils_Tuple2('Asia/Yerevan', $justinmimbs$timezone_data$TimeZone$asia__yerevan),
			_Utils_Tuple2('Atlantic/Azores', $justinmimbs$timezone_data$TimeZone$atlantic__azores),
			_Utils_Tuple2('Atlantic/Bermuda', $justinmimbs$timezone_data$TimeZone$atlantic__bermuda),
			_Utils_Tuple2('Atlantic/Canary', $justinmimbs$timezone_data$TimeZone$atlantic__canary),
			_Utils_Tuple2('Atlantic/Cape_Verde', $justinmimbs$timezone_data$TimeZone$atlantic__cape_verde),
			_Utils_Tuple2('Atlantic/Faroe', $justinmimbs$timezone_data$TimeZone$atlantic__faroe),
			_Utils_Tuple2('Atlantic/Madeira', $justinmimbs$timezone_data$TimeZone$atlantic__madeira),
			_Utils_Tuple2('Atlantic/South_Georgia', $justinmimbs$timezone_data$TimeZone$atlantic__south_georgia),
			_Utils_Tuple2('Atlantic/Stanley', $justinmimbs$timezone_data$TimeZone$atlantic__stanley),
			_Utils_Tuple2('Australia/Adelaide', $justinmimbs$timezone_data$TimeZone$australia__adelaide),
			_Utils_Tuple2('Australia/Brisbane', $justinmimbs$timezone_data$TimeZone$australia__brisbane),
			_Utils_Tuple2('Australia/Broken_Hill', $justinmimbs$timezone_data$TimeZone$australia__broken_hill),
			_Utils_Tuple2('Australia/Darwin', $justinmimbs$timezone_data$TimeZone$australia__darwin),
			_Utils_Tuple2('Australia/Eucla', $justinmimbs$timezone_data$TimeZone$australia__eucla),
			_Utils_Tuple2('Australia/Hobart', $justinmimbs$timezone_data$TimeZone$australia__hobart),
			_Utils_Tuple2('Australia/Lindeman', $justinmimbs$timezone_data$TimeZone$australia__lindeman),
			_Utils_Tuple2('Australia/Lord_Howe', $justinmimbs$timezone_data$TimeZone$australia__lord_howe),
			_Utils_Tuple2('Australia/Melbourne', $justinmimbs$timezone_data$TimeZone$australia__melbourne),
			_Utils_Tuple2('Australia/Perth', $justinmimbs$timezone_data$TimeZone$australia__perth),
			_Utils_Tuple2('Australia/Sydney', $justinmimbs$timezone_data$TimeZone$australia__sydney),
			_Utils_Tuple2('Europe/Andorra', $justinmimbs$timezone_data$TimeZone$europe__andorra),
			_Utils_Tuple2('Europe/Astrakhan', $justinmimbs$timezone_data$TimeZone$europe__astrakhan),
			_Utils_Tuple2('Europe/Athens', $justinmimbs$timezone_data$TimeZone$europe__athens),
			_Utils_Tuple2('Europe/Belgrade', $justinmimbs$timezone_data$TimeZone$europe__belgrade),
			_Utils_Tuple2('Europe/Berlin', $justinmimbs$timezone_data$TimeZone$europe__berlin),
			_Utils_Tuple2('Europe/Brussels', $justinmimbs$timezone_data$TimeZone$europe__brussels),
			_Utils_Tuple2('Europe/Bucharest', $justinmimbs$timezone_data$TimeZone$europe__bucharest),
			_Utils_Tuple2('Europe/Budapest', $justinmimbs$timezone_data$TimeZone$europe__budapest),
			_Utils_Tuple2('Europe/Chisinau', $justinmimbs$timezone_data$TimeZone$europe__chisinau),
			_Utils_Tuple2('Europe/Dublin', $justinmimbs$timezone_data$TimeZone$europe__dublin),
			_Utils_Tuple2('Europe/Gibraltar', $justinmimbs$timezone_data$TimeZone$europe__gibraltar),
			_Utils_Tuple2('Europe/Helsinki', $justinmimbs$timezone_data$TimeZone$europe__helsinki),
			_Utils_Tuple2('Europe/Istanbul', $justinmimbs$timezone_data$TimeZone$europe__istanbul),
			_Utils_Tuple2('Europe/Kaliningrad', $justinmimbs$timezone_data$TimeZone$europe__kaliningrad),
			_Utils_Tuple2('Europe/Kirov', $justinmimbs$timezone_data$TimeZone$europe__kirov),
			_Utils_Tuple2('Europe/Kyiv', $justinmimbs$timezone_data$TimeZone$europe__kyiv),
			_Utils_Tuple2('Europe/Lisbon', $justinmimbs$timezone_data$TimeZone$europe__lisbon),
			_Utils_Tuple2('Europe/London', $justinmimbs$timezone_data$TimeZone$europe__london),
			_Utils_Tuple2('Europe/Madrid', $justinmimbs$timezone_data$TimeZone$europe__madrid),
			_Utils_Tuple2('Europe/Malta', $justinmimbs$timezone_data$TimeZone$europe__malta),
			_Utils_Tuple2('Europe/Minsk', $justinmimbs$timezone_data$TimeZone$europe__minsk),
			_Utils_Tuple2('Europe/Moscow', $justinmimbs$timezone_data$TimeZone$europe__moscow),
			_Utils_Tuple2('Europe/Paris', $justinmimbs$timezone_data$TimeZone$europe__paris),
			_Utils_Tuple2('Europe/Prague', $justinmimbs$timezone_data$TimeZone$europe__prague),
			_Utils_Tuple2('Europe/Riga', $justinmimbs$timezone_data$TimeZone$europe__riga),
			_Utils_Tuple2('Europe/Rome', $justinmimbs$timezone_data$TimeZone$europe__rome),
			_Utils_Tuple2('Europe/Samara', $justinmimbs$timezone_data$TimeZone$europe__samara),
			_Utils_Tuple2('Europe/Saratov', $justinmimbs$timezone_data$TimeZone$europe__saratov),
			_Utils_Tuple2('Europe/Simferopol', $justinmimbs$timezone_data$TimeZone$europe__simferopol),
			_Utils_Tuple2('Europe/Sofia', $justinmimbs$timezone_data$TimeZone$europe__sofia),
			_Utils_Tuple2('Europe/Tallinn', $justinmimbs$timezone_data$TimeZone$europe__tallinn),
			_Utils_Tuple2('Europe/Tirane', $justinmimbs$timezone_data$TimeZone$europe__tirane),
			_Utils_Tuple2('Europe/Ulyanovsk', $justinmimbs$timezone_data$TimeZone$europe__ulyanovsk),
			_Utils_Tuple2('Europe/Vienna', $justinmimbs$timezone_data$TimeZone$europe__vienna),
			_Utils_Tuple2('Europe/Vilnius', $justinmimbs$timezone_data$TimeZone$europe__vilnius),
			_Utils_Tuple2('Europe/Volgograd', $justinmimbs$timezone_data$TimeZone$europe__volgograd),
			_Utils_Tuple2('Europe/Warsaw', $justinmimbs$timezone_data$TimeZone$europe__warsaw),
			_Utils_Tuple2('Europe/Zurich', $justinmimbs$timezone_data$TimeZone$europe__zurich),
			_Utils_Tuple2('Indian/Chagos', $justinmimbs$timezone_data$TimeZone$indian__chagos),
			_Utils_Tuple2('Indian/Maldives', $justinmimbs$timezone_data$TimeZone$indian__maldives),
			_Utils_Tuple2('Indian/Mauritius', $justinmimbs$timezone_data$TimeZone$indian__mauritius),
			_Utils_Tuple2('Pacific/Apia', $justinmimbs$timezone_data$TimeZone$pacific__apia),
			_Utils_Tuple2('Pacific/Auckland', $justinmimbs$timezone_data$TimeZone$pacific__auckland),
			_Utils_Tuple2('Pacific/Bougainville', $justinmimbs$timezone_data$TimeZone$pacific__bougainville),
			_Utils_Tuple2('Pacific/Chatham', $justinmimbs$timezone_data$TimeZone$pacific__chatham),
			_Utils_Tuple2('Pacific/Easter', $justinmimbs$timezone_data$TimeZone$pacific__easter),
			_Utils_Tuple2('Pacific/Efate', $justinmimbs$timezone_data$TimeZone$pacific__efate),
			_Utils_Tuple2('Pacific/Fakaofo', $justinmimbs$timezone_data$TimeZone$pacific__fakaofo),
			_Utils_Tuple2('Pacific/Fiji', $justinmimbs$timezone_data$TimeZone$pacific__fiji),
			_Utils_Tuple2('Pacific/Galapagos', $justinmimbs$timezone_data$TimeZone$pacific__galapagos),
			_Utils_Tuple2('Pacific/Gambier', $justinmimbs$timezone_data$TimeZone$pacific__gambier),
			_Utils_Tuple2('Pacific/Guadalcanal', $justinmimbs$timezone_data$TimeZone$pacific__guadalcanal),
			_Utils_Tuple2('Pacific/Guam', $justinmimbs$timezone_data$TimeZone$pacific__guam),
			_Utils_Tuple2('Pacific/Honolulu', $justinmimbs$timezone_data$TimeZone$pacific__honolulu),
			_Utils_Tuple2('Pacific/Kanton', $justinmimbs$timezone_data$TimeZone$pacific__kanton),
			_Utils_Tuple2('Pacific/Kiritimati', $justinmimbs$timezone_data$TimeZone$pacific__kiritimati),
			_Utils_Tuple2('Pacific/Kosrae', $justinmimbs$timezone_data$TimeZone$pacific__kosrae),
			_Utils_Tuple2('Pacific/Kwajalein', $justinmimbs$timezone_data$TimeZone$pacific__kwajalein),
			_Utils_Tuple2('Pacific/Marquesas', $justinmimbs$timezone_data$TimeZone$pacific__marquesas),
			_Utils_Tuple2('Pacific/Nauru', $justinmimbs$timezone_data$TimeZone$pacific__nauru),
			_Utils_Tuple2('Pacific/Niue', $justinmimbs$timezone_data$TimeZone$pacific__niue),
			_Utils_Tuple2('Pacific/Norfolk', $justinmimbs$timezone_data$TimeZone$pacific__norfolk),
			_Utils_Tuple2('Pacific/Noumea', $justinmimbs$timezone_data$TimeZone$pacific__noumea),
			_Utils_Tuple2('Pacific/Pago_Pago', $justinmimbs$timezone_data$TimeZone$pacific__pago_pago),
			_Utils_Tuple2('Pacific/Palau', $justinmimbs$timezone_data$TimeZone$pacific__palau),
			_Utils_Tuple2('Pacific/Pitcairn', $justinmimbs$timezone_data$TimeZone$pacific__pitcairn),
			_Utils_Tuple2('Pacific/Port_Moresby', $justinmimbs$timezone_data$TimeZone$pacific__port_moresby),
			_Utils_Tuple2('Pacific/Rarotonga', $justinmimbs$timezone_data$TimeZone$pacific__rarotonga),
			_Utils_Tuple2('Pacific/Tahiti', $justinmimbs$timezone_data$TimeZone$pacific__tahiti),
			_Utils_Tuple2('Pacific/Tarawa', $justinmimbs$timezone_data$TimeZone$pacific__tarawa),
			_Utils_Tuple2('Pacific/Tongatapu', $justinmimbs$timezone_data$TimeZone$pacific__tongatapu)
		]));
var $justinmimbs$timezone_data$TimeZone$getZone = A2(
	$elm$core$Task$andThen,
	function (nameOrOffset) {
		if (!nameOrOffset.$) {
			var zoneName = nameOrOffset.a;
			var _v1 = A2($elm$core$Dict$get, zoneName, $justinmimbs$timezone_data$TimeZone$zones);
			if (!_v1.$) {
				var zone = _v1.a;
				return $elm$core$Task$succeed(
					_Utils_Tuple2(
						zoneName,
						zone(0)));
			} else {
				return $elm$core$Task$fail(
					$justinmimbs$timezone_data$TimeZone$NoDataForZoneName(zoneName));
			}
		} else {
			return $elm$core$Task$fail($justinmimbs$timezone_data$TimeZone$NoZoneName);
		}
	},
	$elm$time$Time$getZoneName);
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $author$project$View$getTimeZone = A2(
	$elm$core$Task$perform,
	$author$project$View$GotTimeZone,
	A2(
		$elm$core$Task$onError,
		function (_v0) {
			return $elm$core$Task$succeed(
				_Utils_Tuple2('UTC', $elm$time$Time$utc));
		},
		$justinmimbs$timezone_data$TimeZone$getZone));
var $author$project$View$init = function (_v0) {
	return _Utils_Tuple2(
		{
			j: $krisajenkins$remotedata$RemoteData$NotAsked,
			N: '',
			W: _Utils_Tuple2('UTC', $elm$time$Time$utc)
		},
		$author$project$View$getTimeZone);
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$View$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$View$HttpError = function (a) {
	return {$: 0, a: a};
};
var $krisajenkins$remotedata$RemoteData$Failure = function (a) {
	return {$: 2, a: a};
};
var $author$project$View$JsonError = function (a) {
	return {$: 1, a: a};
};
var $krisajenkins$remotedata$RemoteData$Loading = {$: 1};
var $author$project$View$Response = function (a) {
	return {$: 3, a: a};
};
var $krisajenkins$remotedata$RemoteData$Success = function (a) {
	return {$: 3, a: a};
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 4, a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$NetworkError = {$: 2};
var $elm$http$Http$Timeout = {$: 1};
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 0:
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 1:
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 2:
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 3:
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.ch));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$elm$http$Http$resolve(
				function (string) {
					return A2(
						$elm$core$Result$mapError,
						$elm$json$Json$Decode$errorToString,
						A2($elm$json$Json$Decode$decodeString, decoder, string));
				}));
	});
var $krisajenkins$remotedata$RemoteData$fromResult = function (result) {
	if (result.$ === 1) {
		var e = result.a;
		return $krisajenkins$remotedata$RemoteData$Failure(e);
	} else {
		var x = result.a;
		return $krisajenkins$remotedata$RemoteData$Success(x);
	}
};
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {bv: reqs, bI: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (!cmd.$) {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 1) {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.bM;
							if (_v4.$ === 1) {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.bv));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.bI)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (!cmd.$) {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					bX: r.bX,
					bZ: r.bZ,
					b2: A2(_Http_mapExpect, func, r.b2),
					aZ: r.aZ,
					b9: r.b9,
					ck: r.ck,
					bM: r.bM,
					K: r.K
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{bX: false, bZ: r.bZ, b2: r.b2, aZ: r.aZ, b9: r.b9, ck: r.ck, bM: r.bM, K: r.K}));
};
var $elm$http$Http$get = function (r) {
	return $elm$http$Http$request(
		{bZ: $elm$http$Http$emptyBody, b2: r.b2, aZ: _List_Nil, b9: 'GET', ck: $elm$core$Maybe$Nothing, bM: $elm$core$Maybe$Nothing, K: r.K});
};
var $author$project$View$isUrl = function (string) {
	var _v0 = _Utils_Tuple2(
		$elm$url$Url$fromString(string),
		$elm$url$Url$fromString('https://' + string));
	if (!_v0.a.$) {
		return true;
	} else {
		if (!_v0.b.$) {
			return true;
		} else {
			var _v1 = _v0.a;
			var _v2 = _v0.b;
			return false;
		}
	}
};
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $author$project$View$newData = function (value) {
	return {C: $elm$core$Set$empty, D: $elm$core$Set$empty, P: '', ak: value};
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Data$Root$Root = F4(
	function (atContext, organization, productions, version) {
		return {aE: atContext, bg: organization, br: productions, bO: version};
	});
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm_community$json_extra$Json$Decode$Extra$fromResult = function (result) {
	if (!result.$) {
		var successValue = result.a;
		return $elm$json$Json$Decode$succeed(successValue);
	} else {
		var errorMessage = result.a;
		return $elm$json$Json$Decode$fail(errorMessage);
	}
};
var $author$project$Data$Root$HttpsColonSlashSlashschemaDotorg = 0;
var $author$project$Data$Root$parseAtContext = function (atContext) {
	if (atContext === 'https://schema.org') {
		return $elm$core$Result$Ok(0);
	} else {
		return $elm$core$Result$Err('Unknown atContext type: ' + atContext);
	}
};
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Data$Root$atContextDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parseAtContext, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Root$Organization = F3(
	function (atType, address, name) {
		return {U: address, e: atType, l: name};
	});
var $author$project$Data$Root$Address = F4(
	function (atType, addressLocality, postalCode, streetAddress) {
		return {aD: addressLocality, e: atType, bk: postalCode, bH: streetAddress};
	});
var $author$project$Data$Root$PostalAddressType = 0;
var $author$project$Data$Root$parseAddressAttype = function (addressAttype) {
	if (addressAttype === 'PostalAddress') {
		return $elm$core$Result$Ok(0);
	} else {
		return $elm$core$Result$Err('Unknown addressAttype type: ' + addressAttype);
	}
};
var $author$project$Data$Root$addressAttypeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parseAddressAttype, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$nullable = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
			]));
};
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder = F3(
	function (path, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return $elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						decoder,
						$elm$json$Json$Decode$null(fallback)
					]));
		};
		var handleResult = function (input) {
			var _v0 = A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$at, path, $elm$json$Json$Decode$value),
				input);
			if (!_v0.$) {
				var rawValue = _v0.a;
				var _v1 = A2(
					$elm$json$Json$Decode$decodeValue,
					nullOr(valDecoder),
					rawValue);
				if (!_v1.$) {
					var finalResult = _v1.a;
					return $elm$json$Json$Decode$succeed(finalResult);
				} else {
					return A2(
						$elm$json$Json$Decode$at,
						path,
						nullOr(valDecoder));
				}
			} else {
				return $elm$json$Json$Decode$succeed(fallback);
			}
		};
		return A2($elm$json$Json$Decode$andThen, handleResult, $elm$json$Json$Decode$value);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder,
				_List_fromArray(
					[key]),
				valDecoder,
				fallback),
			decoder);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $author$project$Data$Root$addressDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'streetAddress',
	$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
	$elm$core$Maybe$Nothing,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'postalCode',
		$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
		$elm$core$Maybe$Nothing,
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'addressLocality',
			$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
			$elm$core$Maybe$Nothing,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'@type',
				$author$project$Data$Root$addressAttypeDecoder,
				$elm$json$Json$Decode$succeed($author$project$Data$Root$Address)))));
var $author$project$Data$Root$OrganizationType = 0;
var $author$project$Data$Root$parseOrganizationAttype = function (organizationAttype) {
	if (organizationAttype === 'Organization') {
		return $elm$core$Result$Ok(0);
	} else {
		return $elm$core$Result$Err('Unknown organizationAttype type: ' + organizationAttype);
	}
};
var $author$project$Data$Root$organizationAttypeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parseOrganizationAttype, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Root$organizationDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'name',
	$elm$json$Json$Decode$string,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'address',
		$elm$json$Json$Decode$nullable($author$project$Data$Root$addressDecoder),
		$elm$core$Maybe$Nothing,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'@type',
			$author$project$Data$Root$organizationAttypeDecoder,
			$elm$json$Json$Decode$succeed($author$project$Data$Root$Organization))));
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Data$Root$Production = function (atType) {
	return function (_abstract) {
		return function (accessModeSufficient) {
			return function (accessibilityHazard) {
				return function (accessibilitySummary) {
					return function (additionalInfo) {
						return function (creator) {
							return function (description) {
								return function (events) {
									return function (genre) {
										return function (name) {
											return function (subtitle) {
												return {ax: _abstract, ay: accessModeSufficient, az: accessibilityHazard, aA: accessibilitySummary, aC: additionalInfo, e: atType, V: creator, aM: description, aS: events, aX: genre, l: name, bJ: subtitle};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Data$Root$AuditoryAccessModeSufficient = 0;
var $author$project$Data$Root$TactileAccessModeSufficient = 1;
var $author$project$Data$Root$TextualAccessModeSufficient = 2;
var $author$project$Data$Root$VisualAccessModeSufficient = 3;
var $author$project$Data$Root$parseAccessModeSufficientItem = function (accessModeSufficientItem) {
	switch (accessModeSufficientItem) {
		case 'auditory':
			return $elm$core$Result$Ok(0);
		case 'tactile':
			return $elm$core$Result$Ok(1);
		case 'textual':
			return $elm$core$Result$Ok(2);
		case 'visual':
			return $elm$core$Result$Ok(3);
		default:
			return $elm$core$Result$Err('Unknown accessModeSufficientItem type: ' + accessModeSufficientItem);
	}
};
var $author$project$Data$Root$accessModeSufficientItemDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parseAccessModeSufficientItem, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Root$accessModeSufficientDecoder = $elm$json$Json$Decode$list($author$project$Data$Root$accessModeSufficientItemDecoder);
var $author$project$Data$Root$FlashingHazardAccessibilityHazard = 2;
var $author$project$Data$Root$MotionSimulationHazardAccessibilityHazard = 3;
var $author$project$Data$Root$NoFlashingHazardAccessibilityHazard = 5;
var $author$project$Data$Root$NoMotionSimulationHazardAccessibilityHazard = 6;
var $author$project$Data$Root$NoSoundHazardAccessibilityHazard = 7;
var $author$project$Data$Root$NoneAccessibilityHazard = 0;
var $author$project$Data$Root$SoundHazardAccessibilityHazard = 4;
var $author$project$Data$Root$UnknownAccessibilityHazard = 1;
var $author$project$Data$Root$UnknownFlashingHazardAccessibilityHazard = 8;
var $author$project$Data$Root$UnknownMotionSimulationHazardAccessibilityHazard = 9;
var $author$project$Data$Root$UnknownSoundHazardAccessibilityHazard = 10;
var $author$project$Data$Root$parseAccessibilityHazardItem = function (accessibilityHazardItem) {
	switch (accessibilityHazardItem) {
		case 'none':
			return $elm$core$Result$Ok(0);
		case 'unknown':
			return $elm$core$Result$Ok(1);
		case 'flashingHazard':
			return $elm$core$Result$Ok(2);
		case 'motionSimulationHazard':
			return $elm$core$Result$Ok(3);
		case 'soundHazard':
			return $elm$core$Result$Ok(4);
		case 'noFlashingHazard':
			return $elm$core$Result$Ok(5);
		case 'noMotionSimulationHazard':
			return $elm$core$Result$Ok(6);
		case 'noSoundHazard':
			return $elm$core$Result$Ok(7);
		case 'unknownFlashingHazard':
			return $elm$core$Result$Ok(8);
		case 'unknownMotionSimulationHazard':
			return $elm$core$Result$Ok(9);
		case 'unknownSoundHazard':
			return $elm$core$Result$Ok(10);
		default:
			return $elm$core$Result$Err('Unknown accessibilityHazardItem type: ' + accessibilityHazardItem);
	}
};
var $author$project$Data$Root$accessibilityHazardItemDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parseAccessibilityHazardItem, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Root$accessibilityHazardDecoder = $elm$json$Json$Decode$list($author$project$Data$Root$accessibilityHazardItemDecoder);
var $author$project$Data$Root$CreatorItem = F3(
	function (atType, creator, roleName) {
		return {e: atType, V: creator, bz: roleName};
	});
var $author$project$Data$Root$CreatorRoleType = 0;
var $author$project$Data$Root$parseCreatorAttype = function (creatorAttype) {
	if (creatorAttype === 'Role') {
		return $elm$core$Result$Ok(0);
	} else {
		return $elm$core$Result$Err('Unknown creatorAttype type: ' + creatorAttype);
	}
};
var $author$project$Data$Root$creatorAttypeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parseCreatorAttype, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Root$Creator = F2(
	function (atType, name) {
		return {e: atType, l: name};
	});
var $author$project$Data$Root$creatorPersonDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'name',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'@type',
		$author$project$Data$Root$creatorAttypeDecoder,
		$elm$json$Json$Decode$succeed($author$project$Data$Root$Creator)));
var $author$project$Data$Root$creatorItemDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'roleName',
	$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
	$elm$core$Maybe$Nothing,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'creator',
		$author$project$Data$Root$creatorPersonDecoder,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'@type',
			$author$project$Data$Root$creatorAttypeDecoder,
			$elm$json$Json$Decode$succeed($author$project$Data$Root$CreatorItem))));
var $author$project$Data$Root$creatorDecoder = $elm$json$Json$Decode$list($author$project$Data$Root$creatorItemDecoder);
var $author$project$Data$Root$Event = function (atType) {
	return function (duration) {
		return function (endDate) {
			return function (eventStatus) {
				return function (location) {
					return function (offers) {
						return function (performer) {
							return function (previousStartDate) {
								return function (startDate) {
									return function (url) {
										return {e: atType, aN: duration, aP: endDate, aR: eventStatus, a7: location, bf: offers, X: performer, bl: previousStartDate, bG: startDate, K: url};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Data$Root$EventType = 0;
var $author$project$Data$Root$parseEventsAttype = function (eventsAttype) {
	if (eventsAttype === 'Event') {
		return $elm$core$Result$Ok(0);
	} else {
		return $elm$core$Result$Err('Unknown eventsAttype type: ' + eventsAttype);
	}
};
var $author$project$Data$Root$eventsAttypeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parseEventsAttype, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Root$EventCancelledEvents = 1;
var $author$project$Data$Root$EventMovedOnlineEvents = 2;
var $author$project$Data$Root$EventPostponedEvents = 3;
var $author$project$Data$Root$EventRescheduledEvents = 4;
var $author$project$Data$Root$EventScheduledEvents = 0;
var $author$project$Data$Root$parseEventsEventStatus = function (eventsEventStatus) {
	switch (eventsEventStatus) {
		case 'EventScheduled':
			return $elm$core$Result$Ok(0);
		case 'EventCancelled':
			return $elm$core$Result$Ok(1);
		case 'EventMovedOnline':
			return $elm$core$Result$Ok(2);
		case 'EventPostponed':
			return $elm$core$Result$Ok(3);
		case 'EventRescheduled':
			return $elm$core$Result$Ok(4);
		default:
			return $elm$core$Result$Err('Unknown eventsEventStatus type: ' + eventsEventStatus);
	}
};
var $author$project$Data$Root$eventsEventStatusDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parseEventsEventStatus, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$Data$Root$Physical = function (a) {
	return {$: 0, a: a};
};
var $author$project$Data$Root$Virtual = function (a) {
	return {$: 1, a: a};
};
var $author$project$Data$Root$AddressLocation = F6(
	function (atType, address, latitude, longitude, name, wheelChairPlaces) {
		return {U: address, e: atType, a6: latitude, a8: longitude, l: name, bQ: wheelChairPlaces};
	});
var $author$project$Data$Root$PlaceType = 0;
var $author$project$Data$Root$parseAddressLocationAttype = function (addressLocationAttype) {
	if (addressLocationAttype === 'Place') {
		return $elm$core$Result$Ok(0);
	} else {
		return $elm$core$Result$Err('Unknown addressLocationAttype type: ' + addressLocationAttype);
	}
};
var $author$project$Data$Root$addressLocationAttypeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parseAddressLocationAttype, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $author$project$Data$Root$WheelChairPlaces = F3(
	function (count, hasSpaceForAssistant, wheelchairUserCapacity) {
		return {aJ: count, aY: hasSpaceForAssistant, bR: wheelchairUserCapacity};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$Data$Root$wheelChairPlacesDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'wheelchairUserCapacity',
	$elm$json$Json$Decode$nullable($elm$json$Json$Decode$int),
	$elm$core$Maybe$Nothing,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'hasSpaceForAssistant',
		$elm$json$Json$Decode$nullable($elm$json$Json$Decode$bool),
		$elm$core$Maybe$Nothing,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'count',
			$elm$json$Json$Decode$int,
			$elm$json$Json$Decode$succeed($author$project$Data$Root$WheelChairPlaces))));
var $author$project$Data$Root$addressLocationDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'wheelChairPlaces',
	$elm$json$Json$Decode$nullable($author$project$Data$Root$wheelChairPlacesDecoder),
	$elm$core$Maybe$Nothing,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'name',
		$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
		$elm$core$Maybe$Nothing,
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'longitude',
			$elm$json$Json$Decode$nullable($elm$json$Json$Decode$float),
			$elm$core$Maybe$Nothing,
			A4(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
				'latitude',
				$elm$json$Json$Decode$nullable($elm$json$Json$Decode$float),
				$elm$core$Maybe$Nothing,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'address',
					$author$project$Data$Root$addressDecoder,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'@type',
						$author$project$Data$Root$addressLocationAttypeDecoder,
						$elm$json$Json$Decode$succeed($author$project$Data$Root$AddressLocation)))))));
var $author$project$Data$Root$VirtualLocation = F3(
	function (atType, name, url) {
		return {e: atType, l: name, K: url};
	});
var $author$project$Data$Root$VirtualLocationType = 0;
var $author$project$Data$Root$parseVirtualLocationAttype = function (virtualLocationAttype) {
	if (virtualLocationAttype === 'VirtualLocation') {
		return $elm$core$Result$Ok(0);
	} else {
		return $elm$core$Result$Err('Unknown virtualLocationAttype type: ' + virtualLocationAttype);
	}
};
var $author$project$Data$Root$virtualLocationAttypeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parseVirtualLocationAttype, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Root$virtualLocationDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'url',
	$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
	$elm$core$Maybe$Nothing,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'name',
		$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
		$elm$core$Maybe$Nothing,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'@type',
			$author$project$Data$Root$virtualLocationAttypeDecoder,
			$elm$json$Json$Decode$succeed($author$project$Data$Root$VirtualLocation))));
var $author$project$Data$Root$locationItemDecoder = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2($elm$json$Json$Decode$map, $author$project$Data$Root$Physical, $author$project$Data$Root$addressLocationDecoder),
			A2($elm$json$Json$Decode$map, $author$project$Data$Root$Virtual, $author$project$Data$Root$virtualLocationDecoder)
		]));
var $author$project$Data$Root$locationDecoder = $elm$json$Json$Decode$list($author$project$Data$Root$locationItemDecoder);
var $author$project$Data$Root$Offer = F4(
	function (atType, name, priceSpecification, url) {
		return {e: atType, l: name, bn: priceSpecification, K: url};
	});
var $author$project$Data$Root$OfferType = 0;
var $author$project$Data$Root$parseOffersAttype = function (offersAttype) {
	if (offersAttype === 'Offer') {
		return $elm$core$Result$Ok(0);
	} else {
		return $elm$core$Result$Err('Unknown offersAttype type: ' + offersAttype);
	}
};
var $author$project$Data$Root$offersAttypeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parseOffersAttype, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Root$PriceSpecification = F4(
	function (atType, maxPrice, minPrice, priceCurrency) {
		return {e: atType, a9: maxPrice, ba: minPrice, bm: priceCurrency};
	});
var $author$project$Data$Root$PriceSpecificationType = 0;
var $author$project$Data$Root$parsePriceSpecificationAttype = function (priceSpecificationAttype) {
	if (priceSpecificationAttype === 'PriceSpecification') {
		return $elm$core$Result$Ok(0);
	} else {
		return $elm$core$Result$Err('Unknown priceSpecificationAttype type: ' + priceSpecificationAttype);
	}
};
var $author$project$Data$Root$priceSpecificationAttypeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parsePriceSpecificationAttype, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Root$priceSpecificationDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'priceCurrency',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'minPrice',
		$elm$json$Json$Decode$float,
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'maxPrice',
			$elm$json$Json$Decode$nullable($elm$json$Json$Decode$float),
			$elm$core$Maybe$Nothing,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'@type',
				$author$project$Data$Root$priceSpecificationAttypeDecoder,
				$elm$json$Json$Decode$succeed($author$project$Data$Root$PriceSpecification)))));
var $author$project$Data$Root$offerDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'url',
	$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
	$elm$core$Maybe$Nothing,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'priceSpecification',
		$author$project$Data$Root$priceSpecificationDecoder,
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'name',
			$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
			$elm$core$Maybe$Nothing,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'@type',
				$author$project$Data$Root$offersAttypeDecoder,
				$elm$json$Json$Decode$succeed($author$project$Data$Root$Offer)))));
var $author$project$Data$Root$offersDecoder = $elm$json$Json$Decode$list($author$project$Data$Root$offerDecoder);
var $author$project$Data$Root$PerformerItem = F3(
	function (atType, characterName, performer) {
		return {e: atType, aH: characterName, X: performer};
	});
var $author$project$Data$Root$PerformanceRoleType = 0;
var $author$project$Data$Root$parsePerformerAttype = function (performerAttype) {
	if (performerAttype === 'PerformanceRole') {
		return $elm$core$Result$Ok(0);
	} else {
		return $elm$core$Result$Err('Unknown performerAttype type: ' + performerAttype);
	}
};
var $author$project$Data$Root$performerAttypeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parsePerformerAttype, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Root$Performer = F2(
	function (atType, name) {
		return {e: atType, l: name};
	});
var $author$project$Data$Root$PerformerPersonType = 0;
var $author$project$Data$Root$parsePerformerPersonAttype = function (performerAttype) {
	if (performerAttype === 'Person') {
		return $elm$core$Result$Ok(0);
	} else {
		return $elm$core$Result$Err('Unknown performerAttype type: ' + performerAttype);
	}
};
var $author$project$Data$Root$performerPersonAttypeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parsePerformerPersonAttype, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Root$performerPersonDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'name',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'@type',
		$author$project$Data$Root$performerPersonAttypeDecoder,
		$elm$json$Json$Decode$succeed($author$project$Data$Root$Performer)));
var $author$project$Data$Root$performerItemDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'performer',
	$author$project$Data$Root$performerPersonDecoder,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'characterName',
		$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
		$elm$core$Maybe$Nothing,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'@type',
			$author$project$Data$Root$performerAttypeDecoder,
			$elm$json$Json$Decode$succeed($author$project$Data$Root$PerformerItem))));
var $author$project$Data$Root$performerDecoder = $elm$json$Json$Decode$list($author$project$Data$Root$performerItemDecoder);
var $author$project$Data$Root$eventDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'url',
	$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
	$elm$core$Maybe$Nothing,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'startDate',
		$elm$json$Json$Decode$string,
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'previousStartDate',
			$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
			$elm$core$Maybe$Nothing,
			A4(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
				'performer',
				$elm$json$Json$Decode$nullable($author$project$Data$Root$performerDecoder),
				$elm$core$Maybe$Nothing,
				A4(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
					'offers',
					$elm$json$Json$Decode$nullable($author$project$Data$Root$offersDecoder),
					$elm$core$Maybe$Nothing,
					A4(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
						'location',
						$elm$json$Json$Decode$nullable($author$project$Data$Root$locationDecoder),
						$elm$core$Maybe$Nothing,
						A4(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
							'eventStatus',
							$elm$json$Json$Decode$nullable($author$project$Data$Root$eventsEventStatusDecoder),
							$elm$core$Maybe$Nothing,
							A4(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
								'endDate',
								$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
								$elm$core$Maybe$Nothing,
								A4(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
									'duration',
									$elm$json$Json$Decode$nullable($elm$json$Json$Decode$int),
									$elm$core$Maybe$Nothing,
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'@type',
										$author$project$Data$Root$eventsAttypeDecoder,
										$elm$json$Json$Decode$succeed($author$project$Data$Root$Event)))))))))));
var $author$project$Data$Root$eventsDecoder = $elm$json$Json$Decode$list($author$project$Data$Root$eventDecoder);
var $author$project$Data$Root$CreativeWorkType = 0;
var $author$project$Data$Root$PlayType = 1;
var $author$project$Data$Root$parseProductionsAttype = function (productionsAttype) {
	switch (productionsAttype) {
		case 'CreativeWork':
			return $elm$core$Result$Ok(0);
		case 'Play':
			return $elm$core$Result$Ok(1);
		default:
			return $elm$core$Result$Err('Unknown productionsAttype type: ' + productionsAttype);
	}
};
var $author$project$Data$Root$productionsAttypeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parseProductionsAttype, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Root$AudiowalkProductions = 0;
var $author$project$Data$Root$BallettProductions = 1;
var $author$project$Data$Root$DigitaltheaterProductions = 2;
var $author$project$Data$Root$FigurentheaterProductions = 3;
var $author$project$Data$Root$GameTheaterProductions = 4;
var $author$project$Data$Root$HoerspielProductions = 5;
var $author$project$Data$Root$ImprotheaterProductions = 6;
var $author$project$Data$Root$InstallationProductions = 7;
var $author$project$Data$Root$KabarettComedyProductions = 8;
var $author$project$Data$Root$KammerkonzertProductions = 9;
var $author$project$Data$Root$KonzertProductions = 10;
var $author$project$Data$Root$LecturePerformanceProductions = 11;
var $author$project$Data$Root$LesungProductions = 12;
var $author$project$Data$Root$MusicalProductions = 13;
var $author$project$Data$Root$MusiktheaterProductions = 14;
var $author$project$Data$Root$ObjekttheaterProductions = 15;
var $author$project$Data$Root$OperProductions = 16;
var $author$project$Data$Root$OperetteProductions = 17;
var $author$project$Data$Root$PerformanceProductions = 18;
var $author$project$Data$Root$PhysicalTheatreProductions = 19;
var $author$project$Data$Root$PodcastProductions = 20;
var $author$project$Data$Root$PuppentheaterProductions = 21;
var $author$project$Data$Root$SinfoniekonzertProductions = 22;
var $author$project$Data$Root$SprechtheaterProductions = 23;
var $author$project$Data$Root$SzenischeLesungProductions = 24;
var $author$project$Data$Root$SzenischesKonzertProductions = 25;
var $author$project$Data$Root$TanzProductions = 26;
var $author$project$Data$Root$TheaterImOeffentlichenRaumProductions = 27;
var $author$project$Data$Root$WorkshopProductions = 28;
var $author$project$Data$Root$ZeitgenoessischerTanzProductions = 29;
var $author$project$Data$Root$parseProductionsGenre = function (productionsGenre) {
	switch (productionsGenre) {
		case 'audiowalk':
			return $elm$core$Result$Ok(0);
		case 'ballett':
			return $elm$core$Result$Ok(1);
		case 'digitaltheater':
			return $elm$core$Result$Ok(2);
		case 'figurentheater':
			return $elm$core$Result$Ok(3);
		case 'game-theater':
			return $elm$core$Result$Ok(4);
		case 'hoerspiel':
			return $elm$core$Result$Ok(5);
		case 'improtheater':
			return $elm$core$Result$Ok(6);
		case 'installation':
			return $elm$core$Result$Ok(7);
		case 'kabarett-comedy':
			return $elm$core$Result$Ok(8);
		case 'kammerkonzert':
			return $elm$core$Result$Ok(9);
		case 'konzert':
			return $elm$core$Result$Ok(10);
		case 'lecture-performance':
			return $elm$core$Result$Ok(11);
		case 'lesung':
			return $elm$core$Result$Ok(12);
		case 'musical':
			return $elm$core$Result$Ok(13);
		case 'musiktheater':
			return $elm$core$Result$Ok(14);
		case 'objekttheater':
			return $elm$core$Result$Ok(15);
		case 'oper':
			return $elm$core$Result$Ok(16);
		case 'operette':
			return $elm$core$Result$Ok(17);
		case 'performance':
			return $elm$core$Result$Ok(18);
		case 'physical-theatre':
			return $elm$core$Result$Ok(19);
		case 'podcast':
			return $elm$core$Result$Ok(20);
		case 'puppentheater':
			return $elm$core$Result$Ok(21);
		case 'sinfoniekonzert':
			return $elm$core$Result$Ok(22);
		case 'sprechtheater':
			return $elm$core$Result$Ok(23);
		case 'szenische-lesung':
			return $elm$core$Result$Ok(24);
		case 'szenisches-konzert':
			return $elm$core$Result$Ok(25);
		case 'tanz':
			return $elm$core$Result$Ok(26);
		case 'theater-im-oeffentlichen-raum':
			return $elm$core$Result$Ok(27);
		case 'workshop':
			return $elm$core$Result$Ok(28);
		case 'zeitgenoessischer-tanz':
			return $elm$core$Result$Ok(29);
		default:
			return $elm$core$Result$Err('Unknown productionsGenre type: ' + productionsGenre);
	}
};
var $author$project$Data$Root$productionsGenreDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parseProductionsGenre, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Root$productionDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'subtitle',
	$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
	$elm$core$Maybe$Nothing,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'name',
		$elm$json$Json$Decode$string,
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'genre',
			$elm$json$Json$Decode$nullable($author$project$Data$Root$productionsGenreDecoder),
			$elm$core$Maybe$Nothing,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'events',
				$author$project$Data$Root$eventsDecoder,
				A4(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
					'description',
					$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
					$elm$core$Maybe$Nothing,
					A4(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
						'creator',
						$elm$json$Json$Decode$nullable($author$project$Data$Root$creatorDecoder),
						$elm$core$Maybe$Nothing,
						A4(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
							'additionalInfo',
							$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
							$elm$core$Maybe$Nothing,
							A4(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
								'accessibilitySummary',
								$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
								$elm$core$Maybe$Nothing,
								A4(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
									'accessibilityHazard',
									$elm$json$Json$Decode$nullable($author$project$Data$Root$accessibilityHazardDecoder),
									$elm$core$Maybe$Nothing,
									A4(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
										'accessModeSufficient',
										$elm$json$Json$Decode$nullable($author$project$Data$Root$accessModeSufficientDecoder),
										$elm$core$Maybe$Nothing,
										A4(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
											'abstract',
											$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
											$elm$core$Maybe$Nothing,
											A3(
												$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
												'@type',
												$author$project$Data$Root$productionsAttypeDecoder,
												$elm$json$Json$Decode$succeed($author$project$Data$Root$Production)))))))))))));
var $author$project$Data$Root$productionsDecoder = $elm$json$Json$Decode$list($author$project$Data$Root$productionDecoder);
var $author$project$Data$Root$V1 = 0;
var $author$project$Data$Root$parseVersion = function (version) {
	if (version === 'v1') {
		return $elm$core$Result$Ok(0);
	} else {
		return $elm$core$Result$Err('Unknown version type: ' + version);
	}
};
var $author$project$Data$Root$versionDecoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $author$project$Data$Root$parseVersion, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$string);
var $author$project$Data$Root$rootDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'version',
	$author$project$Data$Root$versionDecoder,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'productions',
		$author$project$Data$Root$productionsDecoder,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'organization',
			$author$project$Data$Root$organizationDecoder,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'@context',
				$author$project$Data$Root$atContextDecoder,
				$elm$json$Json$Decode$succeed($author$project$Data$Root$Root)))));
var $author$project$View$fetchData = F2(
	function (model, inputString) {
		if ($author$project$View$isUrl(inputString)) {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{j: $krisajenkins$remotedata$RemoteData$Loading}),
				$elm$http$Http$get(
					{
						b2: A2(
							$elm$http$Http$expectJson,
							A2($elm$core$Basics$composeR, $krisajenkins$remotedata$RemoteData$fromResult, $author$project$View$Response),
							$author$project$Data$Root$rootDecoder),
						K: inputString
					}));
		} else {
			var _v0 = A2($elm$json$Json$Decode$decodeString, $author$project$Data$Root$rootDecoder, inputString);
			if (!_v0.$) {
				var jsonValue = _v0.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							j: $krisajenkins$remotedata$RemoteData$Success(
								$author$project$View$newData(jsonValue))
						}),
					$elm$core$Platform$Cmd$none);
			} else {
				var parsingError = _v0.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							j: $krisajenkins$remotedata$RemoteData$Failure(
								$author$project$View$JsonError(parsingError))
						}),
					$elm$core$Platform$Cmd$none);
			}
		}
	});
var $krisajenkins$remotedata$RemoteData$map = F2(
	function (f, data) {
		switch (data.$) {
			case 3:
				var value = data.a;
				return $krisajenkins$remotedata$RemoteData$Success(
					f(value));
			case 1:
				return $krisajenkins$remotedata$RemoteData$Loading;
			case 0:
				return $krisajenkins$remotedata$RemoteData$NotAsked;
			default:
				var error = data.a;
				return $krisajenkins$remotedata$RemoteData$Failure(error);
		}
	});
var $krisajenkins$remotedata$RemoteData$mapError = F2(
	function (f, data) {
		switch (data.$) {
			case 3:
				var x = data.a;
				return $krisajenkins$remotedata$RemoteData$Success(x);
			case 2:
				var e = data.a;
				return $krisajenkins$remotedata$RemoteData$Failure(
					f(e));
			case 1:
				return $krisajenkins$remotedata$RemoteData$Loading;
			default:
				return $krisajenkins$remotedata$RemoteData$NotAsked;
		}
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$remove, key, dict);
	});
var $author$project$View$toggleEventCard = F3(
	function (remoteData, index, isOpen) {
		var _v0 = _Utils_Tuple2(remoteData, isOpen);
		if (_v0.a.$ === 3) {
			if (_v0.b) {
				var data = _v0.a.a;
				return $krisajenkins$remotedata$RemoteData$Success(
					_Utils_update(
						data,
						{
							C: A2($elm$core$Set$remove, index, data.C)
						}));
			} else {
				var data = _v0.a.a;
				return $krisajenkins$remotedata$RemoteData$Success(
					_Utils_update(
						data,
						{
							C: A2($elm$core$Set$insert, index, data.C)
						}));
			}
		} else {
			return remoteData;
		}
	});
var $author$project$View$toggleProductionCard = F3(
	function (remoteData, index, isOpen) {
		var _v0 = _Utils_Tuple2(remoteData, isOpen);
		if (_v0.a.$ === 3) {
			if (_v0.b) {
				var data = _v0.a.a;
				return $krisajenkins$remotedata$RemoteData$Success(
					_Utils_update(
						data,
						{
							D: A2($elm$core$Set$remove, index, data.D)
						}));
			} else {
				var data = _v0.a.a;
				return $krisajenkins$remotedata$RemoteData$Success(
					_Utils_update(
						data,
						{
							D: A2($elm$core$Set$insert, index, data.D)
						}));
			}
		} else {
			return remoteData;
		}
	});
var $author$project$View$updateNameFilter = F2(
	function (remoteData, filter) {
		if (remoteData.$ === 3) {
			var data = remoteData.a;
			return $krisajenkins$remotedata$RemoteData$Success(
				_Utils_update(
					data,
					{P: filter}));
		} else {
			return remoteData;
		}
	});
var $author$project$View$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var input = msg.a;
				return A2($author$project$View$fetchData, model, input);
			case 1:
				var text = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{j: $krisajenkins$remotedata$RemoteData$NotAsked, N: text}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var zone = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{W: zone}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var response = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							j: A2(
								$krisajenkins$remotedata$RemoteData$map,
								$author$project$View$newData,
								A2($krisajenkins$remotedata$RemoteData$mapError, $author$project$View$HttpError, response))
						}),
					$elm$core$Platform$Cmd$none);
			case 4:
				var index = msg.a;
				var isOpen = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							j: A3($author$project$View$toggleProductionCard, model.j, index, isOpen)
						}),
					$elm$core$Platform$Cmd$none);
			case 5:
				var index = msg.a;
				var isOpen = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							j: A3($author$project$View$toggleEventCard, model.j, index, isOpen)
						}),
					$elm$core$Platform$Cmd$none);
			default:
				var filter = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							j: A2($author$project$View$updateNameFilter, model.j, filter)
						}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$View$section = function (content) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container')
					]),
				content)
			]));
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$View$EventCardClicked = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$View$ProductionCardClicked = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm$html$Html$i = _VirtualDom_node('i');
var $elm$core$Basics$not = _Basics_not;
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$View$card = F4(
	function (title, content, isOpen, clickHandler) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-header has-background-primary is-clickable'),
							$elm$html$Html$Events$onClick(clickHandler)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('card-header-title has-text-white')
								]),
							_List_fromArray(
								[
									title,
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em')
										]),
									_List_Nil),
									A2(
									$elm$html$Html$i,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('fas  has-text-white'),
											$elm$html$Html$Attributes$classList(
											_List_fromArray(
												[
													_Utils_Tuple2('fa-angle-down', isOpen),
													_Utils_Tuple2('fa-angle-right', !isOpen)
												]))
										]),
									_List_Nil)
								]))
						])),
					isOpen ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-content')
						]),
					_List_fromArray(
						[content])) : $elm$html$Html$text('')
				]));
	});
var $author$project$View$NameFilterChanged = function (a) {
	return {$: 6, a: a};
};
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$View$filterInput = function (filter) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('field')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('label')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Filter results by title:')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('control')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Events$onInput($author$project$View$NameFilterChanged),
								$elm$html$Html$Attributes$value(filter),
								$elm$html$Html$Attributes$placeholder('Title'),
								$elm$html$Html$Attributes$class('input')
							]),
						_List_Nil)
					]))
			]));
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$core$String$toLower = _String_toLower;
var $author$project$View$productionNameMatches = F2(
	function (filter, production) {
		return A2(
			$elm$core$String$contains,
			$elm$core$String$toLower(filter),
			$elm$core$String$toLower(production.l));
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$View$maybeTableRow = F2(
	function (name, value) {
		return A2(
			$elm$html$Html$tr,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$th,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(name)
						])),
					A2(
					$elm$html$Html$td,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('preserve-newlines')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2($elm$core$Maybe$withDefault, '', value))
						]))
				]));
	});
var $author$project$Data$Root$productionsGenreToString = function (productionsGenre) {
	switch (productionsGenre) {
		case 0:
			return 'audiowalk';
		case 1:
			return 'ballett';
		case 2:
			return 'digitaltheater';
		case 3:
			return 'figurentheater';
		case 4:
			return 'game-theater';
		case 5:
			return 'hoerspiel';
		case 6:
			return 'improtheater';
		case 7:
			return 'installation';
		case 8:
			return 'kabarett-comedy';
		case 9:
			return 'kammerkonzert';
		case 10:
			return 'konzert';
		case 11:
			return 'lecture-performance';
		case 12:
			return 'lesung';
		case 13:
			return 'musical';
		case 14:
			return 'musiktheater';
		case 15:
			return 'objekttheater';
		case 16:
			return 'oper';
		case 17:
			return 'operette';
		case 18:
			return 'performance';
		case 19:
			return 'physical-theatre';
		case 20:
			return 'podcast';
		case 21:
			return 'puppentheater';
		case 22:
			return 'sinfoniekonzert';
		case 23:
			return 'sprechtheater';
		case 24:
			return 'szenische-lesung';
		case 25:
			return 'szenisches-konzert';
		case 26:
			return 'tanz';
		case 27:
			return 'theater-im-oeffentlichen-raum';
		case 28:
			return 'workshop';
		default:
			return 'zeitgenoessischer-tanz';
	}
};
var $elm$html$Html$table = _VirtualDom_node('table');
var $author$project$View$tableRow = F2(
	function (name, value) {
		return A2(
			$elm$html$Html$tr,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$th,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(name)
						])),
					A2(
					$elm$html$Html$td,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('preserve-newlines')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(value)
						]))
				]));
	});
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $elm$html$Html$li = _VirtualDom_node('li');
var $author$project$View$viewCreator = function (creator) {
	return A2(
		$elm$html$Html$li,
		_List_Nil,
		_List_fromArray(
			[
				$elm$html$Html$text(
				A2(
					$elm$core$String$join,
					':',
					A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						_List_fromArray(
							[
								creator.bz,
								$elm$core$Maybe$Just(creator.V.l)
							]))))
			]));
};
var $author$project$View$viewCreators = function (creators) {
	if (creators.$ === 1) {
		return $elm$html$Html$text('');
	} else {
		var list = creators.a;
		return A2(
			$elm$html$Html$ul,
			_List_Nil,
			A2($elm$core$List$map, $author$project$View$viewCreator, list));
	}
};
var $author$project$View$productionTable = function (production) {
	return A2(
		$elm$html$Html$table,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('table is-hoverable')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$tbody,
				_List_Nil,
				_List_fromArray(
					[
						A2($author$project$View$tableRow, 'Title', production.l),
						A2($author$project$View$maybeTableRow, 'Subtitle', production.bJ),
						A2($author$project$View$maybeTableRow, 'Description', production.aM),
						A2($author$project$View$maybeTableRow, 'Teaser', production.ax),
						A2($author$project$View$maybeTableRow, 'Additional info', production.aC),
						A2(
						$author$project$View$maybeTableRow,
						'Genre',
						A2($elm$core$Maybe$map, $author$project$Data$Root$productionsGenreToString, production.aX)),
						A2(
						$elm$html$Html$tr,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Participants')
									])),
								A2(
								$elm$html$Html$td,
								_List_Nil,
								_List_fromArray(
									[
										$author$project$View$viewCreators(production.V)
									]))
							]))
					]))
			]));
};
var $ryannhg$date_format$DateFormat$DayOfMonthFixed = {$: 7};
var $ryannhg$date_format$DateFormat$dayOfMonthFixed = $ryannhg$date_format$DateFormat$DayOfMonthFixed;
var $ryannhg$date_format$DateFormat$Language$Language = F6(
	function (toMonthName, toMonthAbbreviation, toWeekdayName, toWeekdayAbbreviation, toAmPm, toOrdinalSuffix) {
		return {cm: toAmPm, cn: toMonthAbbreviation, co: toMonthName, J: toOrdinalSuffix, cp: toWeekdayAbbreviation, cq: toWeekdayName};
	});
var $ryannhg$date_format$DateFormat$Language$toEnglishAmPm = function (hour) {
	return (hour > 11) ? 'pm' : 'am';
};
var $ryannhg$date_format$DateFormat$Language$toEnglishMonthName = function (month) {
	switch (month) {
		case 0:
			return 'January';
		case 1:
			return 'February';
		case 2:
			return 'March';
		case 3:
			return 'April';
		case 4:
			return 'May';
		case 5:
			return 'June';
		case 6:
			return 'July';
		case 7:
			return 'August';
		case 8:
			return 'September';
		case 9:
			return 'October';
		case 10:
			return 'November';
		default:
			return 'December';
	}
};
var $ryannhg$date_format$DateFormat$Language$toEnglishSuffix = function (num) {
	var _v0 = A2($elm$core$Basics$modBy, 100, num);
	switch (_v0) {
		case 11:
			return 'th';
		case 12:
			return 'th';
		case 13:
			return 'th';
		default:
			var _v1 = A2($elm$core$Basics$modBy, 10, num);
			switch (_v1) {
				case 1:
					return 'st';
				case 2:
					return 'nd';
				case 3:
					return 'rd';
				default:
					return 'th';
			}
	}
};
var $ryannhg$date_format$DateFormat$Language$toEnglishWeekdayName = function (weekday) {
	switch (weekday) {
		case 0:
			return 'Monday';
		case 1:
			return 'Tuesday';
		case 2:
			return 'Wednesday';
		case 3:
			return 'Thursday';
		case 4:
			return 'Friday';
		case 5:
			return 'Saturday';
		default:
			return 'Sunday';
	}
};
var $ryannhg$date_format$DateFormat$Language$english = A6(
	$ryannhg$date_format$DateFormat$Language$Language,
	$ryannhg$date_format$DateFormat$Language$toEnglishMonthName,
	A2(
		$elm$core$Basics$composeR,
		$ryannhg$date_format$DateFormat$Language$toEnglishMonthName,
		$elm$core$String$left(3)),
	$ryannhg$date_format$DateFormat$Language$toEnglishWeekdayName,
	A2(
		$elm$core$Basics$composeR,
		$ryannhg$date_format$DateFormat$Language$toEnglishWeekdayName,
		$elm$core$String$left(3)),
	$ryannhg$date_format$DateFormat$Language$toEnglishAmPm,
	$ryannhg$date_format$DateFormat$Language$toEnglishSuffix);
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.at, posixMinutes) < 0) {
					return posixMinutes + era.b;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$time$Time$toHour = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			24,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60));
	});
var $ryannhg$date_format$DateFormat$amPm = F3(
	function (language, zone, posix) {
		return language.cm(
			A2($elm$time$Time$toHour, zone, posix));
	});
var $elm$core$Basics$ge = _Utils_ge;
var $elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2($elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		aK: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		bc: month,
		bV: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).aK;
	});
var $ryannhg$date_format$DateFormat$dayOfMonth = $elm$time$Time$toDay;
var $elm$time$Time$Tue = 1;
var $elm$time$Time$Wed = 2;
var $ryannhg$date_format$DateFormat$days = _List_fromArray(
	[6, 0, 1, 2, 3, 4, 5]);
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$time$Time$toWeekday = F2(
	function (zone, time) {
		var _v0 = A2(
			$elm$core$Basics$modBy,
			7,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60 * 24));
		switch (_v0) {
			case 0:
				return 3;
			case 1:
				return 4;
			case 2:
				return 5;
			case 3:
				return 6;
			case 4:
				return 0;
			case 5:
				return 1;
			default:
				return 2;
		}
	});
var $ryannhg$date_format$DateFormat$dayOfWeek = F2(
	function (zone, posix) {
		return function (_v1) {
			var i = _v1.a;
			return i;
		}(
			A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2(0, 6),
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (_v0) {
							var day = _v0.b;
							return _Utils_eq(
								day,
								A2($elm$time$Time$toWeekday, zone, posix));
						},
						A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, day) {
									return _Utils_Tuple2(i, day);
								}),
							$ryannhg$date_format$DateFormat$days)))));
	});
var $ryannhg$date_format$DateFormat$isLeapYear = function (year_) {
	return (!(!A2($elm$core$Basics$modBy, 4, year_))) ? false : ((!(!A2($elm$core$Basics$modBy, 100, year_))) ? true : ((!(!A2($elm$core$Basics$modBy, 400, year_))) ? false : true));
};
var $ryannhg$date_format$DateFormat$daysInMonth = F2(
	function (year_, month) {
		switch (month) {
			case 0:
				return 31;
			case 1:
				return $ryannhg$date_format$DateFormat$isLeapYear(year_) ? 29 : 28;
			case 2:
				return 31;
			case 3:
				return 30;
			case 4:
				return 31;
			case 5:
				return 30;
			case 6:
				return 31;
			case 7:
				return 31;
			case 8:
				return 30;
			case 9:
				return 31;
			case 10:
				return 30;
			default:
				return 31;
		}
	});
var $ryannhg$date_format$DateFormat$months = _List_fromArray(
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).bc;
		switch (_v0) {
			case 1:
				return 0;
			case 2:
				return 1;
			case 3:
				return 2;
			case 4:
				return 3;
			case 5:
				return 4;
			case 6:
				return 5;
			case 7:
				return 6;
			case 8:
				return 7;
			case 9:
				return 8;
			case 10:
				return 9;
			case 11:
				return 10;
			default:
				return 11;
		}
	});
var $ryannhg$date_format$DateFormat$monthPair = F2(
	function (zone, posix) {
		return A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(0, 0),
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var i = _v0.a;
						var m = _v0.b;
						return _Utils_eq(
							m,
							A2($elm$time$Time$toMonth, zone, posix));
					},
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (a, b) {
								return _Utils_Tuple2(a, b);
							}),
						$ryannhg$date_format$DateFormat$months))));
	});
var $ryannhg$date_format$DateFormat$monthNumber_ = F2(
	function (zone, posix) {
		return 1 + function (_v0) {
			var i = _v0.a;
			var m = _v0.b;
			return i;
		}(
			A2($ryannhg$date_format$DateFormat$monthPair, zone, posix));
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).bV;
	});
var $ryannhg$date_format$DateFormat$dayOfYear = F2(
	function (zone, posix) {
		var monthsBeforeThisOne = A2(
			$elm$core$List$take,
			A2($ryannhg$date_format$DateFormat$monthNumber_, zone, posix) - 1,
			$ryannhg$date_format$DateFormat$months);
		var daysBeforeThisMonth = $elm$core$List$sum(
			A2(
				$elm$core$List$map,
				$ryannhg$date_format$DateFormat$daysInMonth(
					A2($elm$time$Time$toYear, zone, posix)),
				monthsBeforeThisOne));
		return daysBeforeThisMonth + A2($ryannhg$date_format$DateFormat$dayOfMonth, zone, posix);
	});
var $ryannhg$date_format$DateFormat$quarter = F2(
	function (zone, posix) {
		return (A2($ryannhg$date_format$DateFormat$monthNumber_, zone, posix) / 4) | 0;
	});
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $ryannhg$date_format$DateFormat$toFixedLength = F2(
	function (totalChars, num) {
		var numStr = $elm$core$String$fromInt(num);
		var numZerosNeeded = totalChars - $elm$core$String$length(numStr);
		var zeros = A2(
			$elm$core$String$join,
			'',
			A2(
				$elm$core$List$map,
				function (_v0) {
					return '0';
				},
				A2($elm$core$List$range, 1, numZerosNeeded)));
		return _Utils_ap(zeros, numStr);
	});
var $elm$time$Time$toMillis = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			1000,
			$elm$time$Time$posixToMillis(time));
	});
var $elm$time$Time$toMinute = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2($elm$time$Time$toAdjustedMinutes, zone, time));
	});
var $ryannhg$date_format$DateFormat$toNonMilitary = function (num) {
	return (!num) ? 12 : ((num <= 12) ? num : (num - 12));
};
var $elm$time$Time$toSecond = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				1000));
	});
var $elm$core$String$toUpper = _String_toUpper;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$core$Basics$round = _Basics_round;
var $ryannhg$date_format$DateFormat$millisecondsPerYear = $elm$core$Basics$round((((1000 * 60) * 60) * 24) * 365.25);
var $ryannhg$date_format$DateFormat$firstDayOfYear = F2(
	function (zone, time) {
		return $elm$time$Time$millisToPosix(
			$ryannhg$date_format$DateFormat$millisecondsPerYear * A2($elm$time$Time$toYear, zone, time));
	});
var $ryannhg$date_format$DateFormat$weekOfYear = F2(
	function (zone, posix) {
		var firstDay = A2($ryannhg$date_format$DateFormat$firstDayOfYear, zone, posix);
		var firstDayOffset = A2($ryannhg$date_format$DateFormat$dayOfWeek, zone, firstDay);
		var daysSoFar = A2($ryannhg$date_format$DateFormat$dayOfYear, zone, posix);
		return (((daysSoFar + firstDayOffset) / 7) | 0) + 1;
	});
var $ryannhg$date_format$DateFormat$year = F2(
	function (zone, time) {
		return $elm$core$String$fromInt(
			A2($elm$time$Time$toYear, zone, time));
	});
var $ryannhg$date_format$DateFormat$piece = F4(
	function (language, zone, posix, token) {
		switch (token.$) {
			case 0:
				return $elm$core$String$fromInt(
					A2($ryannhg$date_format$DateFormat$monthNumber_, zone, posix));
			case 1:
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.J(num));
				}(
					A2($ryannhg$date_format$DateFormat$monthNumber_, zone, posix));
			case 2:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2($ryannhg$date_format$DateFormat$monthNumber_, zone, posix));
			case 3:
				return language.cn(
					A2($elm$time$Time$toMonth, zone, posix));
			case 4:
				return language.co(
					A2($elm$time$Time$toMonth, zone, posix));
			case 17:
				return $elm$core$String$fromInt(
					1 + A2($ryannhg$date_format$DateFormat$quarter, zone, posix));
			case 18:
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.J(num));
				}(
					1 + A2($ryannhg$date_format$DateFormat$quarter, zone, posix));
			case 5:
				return $elm$core$String$fromInt(
					A2($ryannhg$date_format$DateFormat$dayOfMonth, zone, posix));
			case 6:
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.J(num));
				}(
					A2($ryannhg$date_format$DateFormat$dayOfMonth, zone, posix));
			case 7:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2($ryannhg$date_format$DateFormat$dayOfMonth, zone, posix));
			case 8:
				return $elm$core$String$fromInt(
					A2($ryannhg$date_format$DateFormat$dayOfYear, zone, posix));
			case 9:
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.J(num));
				}(
					A2($ryannhg$date_format$DateFormat$dayOfYear, zone, posix));
			case 10:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					3,
					A2($ryannhg$date_format$DateFormat$dayOfYear, zone, posix));
			case 11:
				return $elm$core$String$fromInt(
					A2($ryannhg$date_format$DateFormat$dayOfWeek, zone, posix));
			case 12:
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.J(num));
				}(
					A2($ryannhg$date_format$DateFormat$dayOfWeek, zone, posix));
			case 13:
				return language.cp(
					A2($elm$time$Time$toWeekday, zone, posix));
			case 14:
				return language.cq(
					A2($elm$time$Time$toWeekday, zone, posix));
			case 19:
				return $elm$core$String$fromInt(
					A2($ryannhg$date_format$DateFormat$weekOfYear, zone, posix));
			case 20:
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.J(num));
				}(
					A2($ryannhg$date_format$DateFormat$weekOfYear, zone, posix));
			case 21:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2($ryannhg$date_format$DateFormat$weekOfYear, zone, posix));
			case 15:
				return A2(
					$elm$core$String$right,
					2,
					A2($ryannhg$date_format$DateFormat$year, zone, posix));
			case 16:
				return A2($ryannhg$date_format$DateFormat$year, zone, posix);
			case 22:
				return $elm$core$String$toUpper(
					A3($ryannhg$date_format$DateFormat$amPm, language, zone, posix));
			case 23:
				return $elm$core$String$toLower(
					A3($ryannhg$date_format$DateFormat$amPm, language, zone, posix));
			case 24:
				return $elm$core$String$fromInt(
					A2($elm$time$Time$toHour, zone, posix));
			case 25:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2($elm$time$Time$toHour, zone, posix));
			case 26:
				return $elm$core$String$fromInt(
					$ryannhg$date_format$DateFormat$toNonMilitary(
						A2($elm$time$Time$toHour, zone, posix)));
			case 27:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					2,
					$ryannhg$date_format$DateFormat$toNonMilitary(
						A2($elm$time$Time$toHour, zone, posix)));
			case 28:
				return $elm$core$String$fromInt(
					1 + A2($elm$time$Time$toHour, zone, posix));
			case 29:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					2,
					1 + A2($elm$time$Time$toHour, zone, posix));
			case 30:
				return $elm$core$String$fromInt(
					A2($elm$time$Time$toMinute, zone, posix));
			case 31:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2($elm$time$Time$toMinute, zone, posix));
			case 32:
				return $elm$core$String$fromInt(
					A2($elm$time$Time$toSecond, zone, posix));
			case 33:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2($elm$time$Time$toSecond, zone, posix));
			case 34:
				return $elm$core$String$fromInt(
					A2($elm$time$Time$toMillis, zone, posix));
			case 35:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					3,
					A2($elm$time$Time$toMillis, zone, posix));
			default:
				var string = token.a;
				return string;
		}
	});
var $ryannhg$date_format$DateFormat$formatWithLanguage = F4(
	function (language, tokens, zone, time) {
		return A2(
			$elm$core$String$join,
			'',
			A2(
				$elm$core$List$map,
				A3($ryannhg$date_format$DateFormat$piece, language, zone, time),
				tokens));
	});
var $ryannhg$date_format$DateFormat$format = $ryannhg$date_format$DateFormat$formatWithLanguage($ryannhg$date_format$DateFormat$Language$english);
var $ryannhg$date_format$DateFormat$MonthFixed = {$: 2};
var $ryannhg$date_format$DateFormat$monthFixed = $ryannhg$date_format$DateFormat$MonthFixed;
var $ryannhg$date_format$DateFormat$Text = function (a) {
	return {$: 36, a: a};
};
var $ryannhg$date_format$DateFormat$text = $ryannhg$date_format$DateFormat$Text;
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0;
		return function (s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				var _v2 = callback(a);
				var parseB = _v2;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
				}
			}
		};
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $elm$parser$Parser$ExpectingEnd = {$: 10};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {aI: col, b$: contextStack, bo: problem, bA: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.bA, s.aI, x, s.c));
	});
var $elm$parser$Parser$Advanced$end = function (x) {
	return function (s) {
		return _Utils_eq(
			$elm$core$String$length(s.a),
			s.b) ? A3($elm$parser$Parser$Advanced$Good, false, 0, s) : A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.a);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.b, offset) < 0,
					0,
					{aI: col, c: s0.c, d: s0.d, b: offset, bA: row, a: s0.a});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.b, s.bA, s.aI, s);
	};
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					A2(
						func,
						A3($elm$core$String$slice, s0.b, s1.b, s0.a),
						a),
					s1);
			}
		};
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $elm$parser$Parser$Problem = function (a) {
	return {$: 12, a: a};
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return function (s) {
		return A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $elm$core$String$toFloat = _String_toFloat;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$fractionsOfASecondInMs = A2(
	$elm$parser$Parser$andThen,
	function (str) {
		if ($elm$core$String$length(str) <= 9) {
			var _v0 = $elm$core$String$toFloat('0.' + str);
			if (!_v0.$) {
				var floatVal = _v0.a;
				return $elm$parser$Parser$succeed(
					$elm$core$Basics$round(floatVal * 1000));
			} else {
				return $elm$parser$Parser$problem('Invalid float: \"' + (str + '\"'));
			}
		} else {
			return $elm$parser$Parser$problem(
				'Expected at most 9 digits, but got ' + $elm$core$String$fromInt(
					$elm$core$String$length(str)));
		}
	},
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$chompWhile($elm$core$Char$isDigit)));
var $rtfeldman$elm_iso8601_date_strings$Iso8601$fromParts = F6(
	function (monthYearDayMs, hour, minute, second, ms, utcOffsetMinutes) {
		return $elm$time$Time$millisToPosix((((monthYearDayMs + (((hour * 60) * 60) * 1000)) + (((minute - utcOffsetMinutes) * 60) * 1000)) + (second * 1000)) + ms);
	});
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (!_v1.$) {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $elm$parser$Parser$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$core$String$append = _String_append;
var $elm$parser$Parser$UnexpectedChar = {$: 11};
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return function (s) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.b, s.a);
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{aI: 1, c: s.c, d: s.d, b: s.b + 1, bA: s.bA + 1, a: s.a}) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{aI: s.aI + 1, c: s.c, d: s.d, b: newOffset, bA: s.bA, a: s.a}));
		};
	});
var $elm$parser$Parser$chompIf = function (isGood) {
	return A2($elm$parser$Parser$Advanced$chompIf, isGood, $elm$parser$Parser$UnexpectedChar);
};
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0;
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (!step.$) {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return function (s) {
			return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
		};
	});
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					func(a),
					s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$toAdvancedStep = function (step) {
	if (!step.$) {
		var s = step.a;
		return $elm$parser$Parser$Advanced$Loop(s);
	} else {
		var a = step.a;
		return $elm$parser$Parser$Advanced$Done(a);
	}
};
var $elm$parser$Parser$loop = F2(
	function (state, callback) {
		return A2(
			$elm$parser$Parser$Advanced$loop,
			state,
			function (s) {
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$toAdvancedStep,
					callback(s));
			});
	});
var $rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt = function (quantity) {
	var helper = function (str) {
		if (_Utils_eq(
			$elm$core$String$length(str),
			quantity)) {
			var _v0 = $elm$core$String$toInt(str);
			if (!_v0.$) {
				var intVal = _v0.a;
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$Done,
					$elm$parser$Parser$succeed(intVal));
			} else {
				return $elm$parser$Parser$problem('Invalid integer: \"' + (str + '\"'));
			}
		} else {
			return A2(
				$elm$parser$Parser$map,
				function (nextChar) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$String$append, str, nextChar));
				},
				$elm$parser$Parser$getChompedString(
					$elm$parser$Parser$chompIf($elm$core$Char$isDigit)));
		}
	};
	return A2($elm$parser$Parser$loop, '', helper);
};
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 8, a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.b, s.bA, s.aI, s.a);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{aI: newCol, c: s.c, d: s.d, b: newOffset, bA: newRow, a: s.a});
	};
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$epochYear = 1970;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay = function (day) {
	return $elm$parser$Parser$problem(
		'Invalid day: ' + $elm$core$String$fromInt(day));
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$isLeapYear = function (year) {
	return (!A2($elm$core$Basics$modBy, 4, year)) && ((!(!A2($elm$core$Basics$modBy, 100, year))) || (!A2($elm$core$Basics$modBy, 400, year)));
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$leapYearsBefore = function (y1) {
	var y = y1 - 1;
	return (((y / 4) | 0) - ((y / 100) | 0)) + ((y / 400) | 0);
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$msPerDay = 86400000;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$msPerYear = 31536000000;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$yearMonthDay = function (_v0) {
	var year = _v0.a;
	var month = _v0.b;
	var dayInMonth = _v0.c;
	if (dayInMonth < 0) {
		return $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth);
	} else {
		var succeedWith = function (extraMs) {
			var yearMs = $rtfeldman$elm_iso8601_date_strings$Iso8601$msPerYear * (year - $rtfeldman$elm_iso8601_date_strings$Iso8601$epochYear);
			var days = ((month < 3) || (!$rtfeldman$elm_iso8601_date_strings$Iso8601$isLeapYear(year))) ? (dayInMonth - 1) : dayInMonth;
			var dayMs = $rtfeldman$elm_iso8601_date_strings$Iso8601$msPerDay * (days + ($rtfeldman$elm_iso8601_date_strings$Iso8601$leapYearsBefore(year) - $rtfeldman$elm_iso8601_date_strings$Iso8601$leapYearsBefore($rtfeldman$elm_iso8601_date_strings$Iso8601$epochYear)));
			return $elm$parser$Parser$succeed((extraMs + yearMs) + dayMs);
		};
		switch (month) {
			case 1:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(0);
			case 2:
				return ((dayInMonth > 29) || ((dayInMonth === 29) && (!$rtfeldman$elm_iso8601_date_strings$Iso8601$isLeapYear(year)))) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(2678400000);
			case 3:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(5097600000);
			case 4:
				return (dayInMonth > 30) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(7776000000);
			case 5:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(10368000000);
			case 6:
				return (dayInMonth > 30) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(13046400000);
			case 7:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(15638400000);
			case 8:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(18316800000);
			case 9:
				return (dayInMonth > 30) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(20995200000);
			case 10:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(23587200000);
			case 11:
				return (dayInMonth > 30) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(26265600000);
			case 12:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(28857600000);
			default:
				return $elm$parser$Parser$problem(
					'Invalid month: \"' + ($elm$core$String$fromInt(month) + '\"'));
		}
	}
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$monthYearDayInMs = A2(
	$elm$parser$Parser$andThen,
	$rtfeldman$elm_iso8601_date_strings$Iso8601$yearMonthDay,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F3(
						function (year, month, day) {
							return _Utils_Tuple3(year, month, day);
						})),
				$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(4)),
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed($elm$core$Basics$identity),
							$elm$parser$Parser$symbol('-')),
						$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
						$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)
					]))),
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed($elm$core$Basics$identity),
						$elm$parser$Parser$symbol('-')),
					$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
					$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)
				]))));
var $rtfeldman$elm_iso8601_date_strings$Iso8601$utcOffsetInMinutes = function () {
	var utcOffsetMinutesFromParts = F3(
		function (multiplier, hours, minutes) {
			return (multiplier * (hours * 60)) + minutes;
		});
	return A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$map,
					function (_v0) {
						return 0;
					},
					$elm$parser$Parser$symbol('Z')),
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							$elm$parser$Parser$succeed(utcOffsetMinutesFromParts),
							$elm$parser$Parser$oneOf(
								_List_fromArray(
									[
										A2(
										$elm$parser$Parser$map,
										function (_v1) {
											return 1;
										},
										$elm$parser$Parser$symbol('+')),
										A2(
										$elm$parser$Parser$map,
										function (_v2) {
											return -1;
										},
										$elm$parser$Parser$symbol('-'))
									]))),
						$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								A2(
								$elm$parser$Parser$keeper,
								A2(
									$elm$parser$Parser$ignorer,
									$elm$parser$Parser$succeed($elm$core$Basics$identity),
									$elm$parser$Parser$symbol(':')),
								$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
								$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2),
								$elm$parser$Parser$succeed(0)
							]))),
					A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(0),
					$elm$parser$Parser$end)
				])));
}();
var $rtfeldman$elm_iso8601_date_strings$Iso8601$iso8601 = A2(
	$elm$parser$Parser$andThen,
	function (datePart) {
		return $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$keeper,
								A2(
									$elm$parser$Parser$keeper,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$succeed(
											$rtfeldman$elm_iso8601_date_strings$Iso8601$fromParts(datePart)),
										$elm$parser$Parser$symbol('T')),
									$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
								$elm$parser$Parser$oneOf(
									_List_fromArray(
										[
											A2(
											$elm$parser$Parser$keeper,
											A2(
												$elm$parser$Parser$ignorer,
												$elm$parser$Parser$succeed($elm$core$Basics$identity),
												$elm$parser$Parser$symbol(':')),
											$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
											$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)
										]))),
							$elm$parser$Parser$oneOf(
								_List_fromArray(
									[
										A2(
										$elm$parser$Parser$keeper,
										A2(
											$elm$parser$Parser$ignorer,
											$elm$parser$Parser$succeed($elm$core$Basics$identity),
											$elm$parser$Parser$symbol(':')),
										$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
										$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2),
										$elm$parser$Parser$succeed(0)
									]))),
						$elm$parser$Parser$oneOf(
							_List_fromArray(
								[
									A2(
									$elm$parser$Parser$keeper,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$succeed($elm$core$Basics$identity),
										$elm$parser$Parser$symbol('.')),
									$rtfeldman$elm_iso8601_date_strings$Iso8601$fractionsOfASecondInMs),
									$elm$parser$Parser$succeed(0)
								]))),
					A2($elm$parser$Parser$ignorer, $rtfeldman$elm_iso8601_date_strings$Iso8601$utcOffsetInMinutes, $elm$parser$Parser$end)),
					A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						A6($rtfeldman$elm_iso8601_date_strings$Iso8601$fromParts, datePart, 0, 0, 0, 0, 0)),
					$elm$parser$Parser$end)
				]));
	},
	$rtfeldman$elm_iso8601_date_strings$Iso8601$monthYearDayInMs);
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {aI: col, bo: problem, bA: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.bA, p.aI, p.bo);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0;
		var _v1 = parse(
			{aI: 1, c: _List_Nil, d: 1, b: 0, bA: 1, a: src});
		if (!_v1.$) {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (!_v0.$) {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $rtfeldman$elm_iso8601_date_strings$Iso8601$toTime = function (str) {
	return A2($elm$parser$Parser$run, $rtfeldman$elm_iso8601_date_strings$Iso8601$iso8601, str);
};
var $elm$core$String$trim = _String_trim;
var $ryannhg$date_format$DateFormat$YearNumber = {$: 16};
var $ryannhg$date_format$DateFormat$yearNumber = $ryannhg$date_format$DateFormat$YearNumber;
var $author$project$View$formatDate = F2(
	function (isoString, _v0) {
		var timezone = _v0.b;
		var _v1 = $rtfeldman$elm_iso8601_date_strings$Iso8601$toTime(isoString);
		if (!_v1.$) {
			var result = _v1.a;
			return A3(
				$ryannhg$date_format$DateFormat$format,
				_List_fromArray(
					[
						$ryannhg$date_format$DateFormat$dayOfMonthFixed,
						$ryannhg$date_format$DateFormat$text('.'),
						$ryannhg$date_format$DateFormat$monthFixed,
						$ryannhg$date_format$DateFormat$text('.'),
						$ryannhg$date_format$DateFormat$yearNumber
					]),
				timezone,
				result);
		} else {
			return ($elm$core$String$trim(isoString) === '') ? '' : ('Invalid date (' + (isoString + ')'));
		}
	});
var $author$project$View$formatDuration = function (duration) {
	var minutes = A2($elm$core$Basics$modBy, 60, duration);
	var hours = (duration / 60) | 0;
	return (minutes >= 10) ? ($elm$core$String$fromInt(hours) + (':' + ($elm$core$String$fromInt(minutes) + 'h'))) : ((minutes > 0) ? ($elm$core$String$fromInt(hours) + (':0' + ($elm$core$String$fromInt(minutes) + 'h'))) : ($elm$core$String$fromInt(hours) + (':00' + 'h')));
};
var $ryannhg$date_format$DateFormat$HourMilitaryFixed = {$: 25};
var $ryannhg$date_format$DateFormat$hourMilitaryFixed = $ryannhg$date_format$DateFormat$HourMilitaryFixed;
var $ryannhg$date_format$DateFormat$MinuteFixed = {$: 31};
var $ryannhg$date_format$DateFormat$minuteFixed = $ryannhg$date_format$DateFormat$MinuteFixed;
var $author$project$View$formatTime = F2(
	function (isoString, _v0) {
		var name = _v0.a;
		var timezone = _v0.b;
		var _v1 = $rtfeldman$elm_iso8601_date_strings$Iso8601$toTime(isoString);
		if (!_v1.$) {
			var result = _v1.a;
			return A3(
				$ryannhg$date_format$DateFormat$format,
				_List_fromArray(
					[
						$ryannhg$date_format$DateFormat$hourMilitaryFixed,
						$ryannhg$date_format$DateFormat$text(':'),
						$ryannhg$date_format$DateFormat$minuteFixed,
						$ryannhg$date_format$DateFormat$text(' (' + (name + ')'))
					]),
				timezone,
				result);
		} else {
			return ($elm$core$String$trim(isoString) === '') ? '' : ('Invalid time (' + (isoString + ')'));
		}
	});
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $author$project$View$maybeLink = function (url) {
	if (!url.$) {
		var link = url.a;
		return A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$href(link),
					$elm$html$Html$Attributes$target('_blank')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(link)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $elm$html$Html$Attributes$colspan = function (n) {
	return A2(
		_VirtualDom_attribute,
		'colspan',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$em = _VirtualDom_node('em');
var $author$project$View$locationRow = function (location) {
	if (!location.$) {
		var place = location.a;
		return A2(
			$elm$html$Html$tr,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2($elm$core$Maybe$withDefault, '', place.l))
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('')
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2($elm$core$Maybe$withDefault, '', place.U.bH))
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2($elm$core$Maybe$withDefault, '', place.U.bk))
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2($elm$core$Maybe$withDefault, '', place.U.aD))
						]))
				]));
	} else {
		var info = location.a;
		return A2(
			$elm$html$Html$tr,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2($elm$core$Maybe$withDefault, '', info.l))
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$author$project$View$maybeLink(info.K)
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('')
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('')
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('')
						]))
				]));
	}
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $author$project$View$isOfflineEvent = function (locations) {
	var isPhysicalLocation = function (location) {
		if (!location.$) {
			return true;
		} else {
			return false;
		}
	};
	return A2($elm$core$List$any, isPhysicalLocation, locations);
};
var $author$project$View$isOnlineEvent = function (locations) {
	var isVirtualLocation = function (location) {
		if (!location.$) {
			return false;
		} else {
			return true;
		}
	};
	return A2($elm$core$List$any, isVirtualLocation, locations);
};
var $author$project$View$locationTag = function (locations) {
	var _v0 = _Utils_Tuple2(
		$author$project$View$isOnlineEvent(locations),
		$author$project$View$isOfflineEvent(locations));
	if (_v0.a) {
		if (_v0.b) {
			return A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('tag is-info ml-2 has-tooltip-arrow has-tooltip-multiline'),
						A2($elm$html$Html$Attributes$attribute, 'data-tooltip', 'This is a hybrid event that takes place both online and offline')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Hybrid')
					]));
		} else {
			return A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('tag is-info ml-2 has-tooltip-arrow has-tooltip-multiline'),
						A2($elm$html$Html$Attributes$attribute, 'data-tooltip', 'This is an online event')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Online')
					]));
		}
	} else {
		return $elm$html$Html$text('');
	}
};
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $author$project$View$viewLocations = function (locations) {
	if (locations.$ === 1) {
		return A2(
			$elm$html$Html$em,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('The data does not contain a location for this event')
				]));
	} else {
		if (!locations.a.b) {
			return A2(
				$elm$html$Html$em,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('The data does not contain a location for this event')
					]));
		} else {
			var list = locations.a;
			return A2(
				$elm$html$Html$table,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('table')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$thead,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$th,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$colspan(5)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Locations'),
										$author$project$View$locationTag(list)
									]))
							])),
						A2(
						$elm$html$Html$tbody,
						_List_Nil,
						A2(
							$elm$core$List$cons,
							A2(
								$elm$html$Html$tr,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$th,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Name')
											])),
										A2(
										$elm$html$Html$th,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Link')
											])),
										A2(
										$elm$html$Html$th,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Address')
											])),
										A2(
										$elm$html$Html$th,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Postal code')
											])),
										A2(
										$elm$html$Html$th,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('City')
											]))
									])),
							A2($elm$core$List$map, $author$project$View$locationRow, list)))
					]));
		}
	}
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$View$viewOffer = function (offer) {
	var formattedPrice = A2(
		$elm$core$String$join,
		' - ',
		A2(
			$elm$core$List$map,
			function (price) {
				return $elm$core$String$fromFloat(price) + (' ' + offer.bn.bm);
			},
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						$elm$core$Maybe$Just(offer.bn.ba),
						offer.bn.a9
					]))));
	return A2(
		$elm$html$Html$tr,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						A2($elm$core$Maybe$withDefault, '', offer.l))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(formattedPrice)
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$author$project$View$maybeLink(offer.K)
					]))
			]));
};
var $author$project$View$viewOffers = function (offers) {
	if (offers.$ === 1) {
		return A2(
			$elm$html$Html$table,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('table')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$thead,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$tr,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$th,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Ticketing')
										]))
								]))
						])),
					A2(
					$elm$html$Html$tbody,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$tr,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$td,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$em,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('The data does not contain any ticketing information for this event')
												]))
										]))
								]))
						]))
				]));
	} else {
		var list = offers.a;
		return A2(
			$elm$html$Html$table,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('table')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$thead,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$tr,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$th,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$colspan(3)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Ticketing')
										]))
								]))
						])),
					A2(
					$elm$html$Html$tbody,
					_List_Nil,
					A2(
						$elm$core$List$cons,
						A2(
							$elm$html$Html$tr,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$th,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Name')
										])),
									A2(
									$elm$html$Html$th,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Price')
										])),
									A2(
									$elm$html$Html$th,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Link')
										]))
								])),
						A2($elm$core$List$map, $author$project$View$viewOffer, list)))
				]));
	}
};
var $author$project$View$viewEvent = F2(
	function (zone, event) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('box')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('columns')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$table,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('table')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tbody,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$author$project$View$tableRow,
													'Start date',
													A2($author$project$View$formatDate, event.bG, zone)),
													A2(
													$author$project$View$tableRow,
													'Start time',
													A2($author$project$View$formatTime, event.bG, zone)),
													A2(
													$author$project$View$tableRow,
													'End date',
													A2(
														$author$project$View$formatDate,
														A2($elm$core$Maybe$withDefault, '', event.aP),
														zone)),
													A2(
													$author$project$View$tableRow,
													'End time',
													A2(
														$author$project$View$formatTime,
														A2($elm$core$Maybe$withDefault, '', event.aP),
														zone)),
													A2(
													$author$project$View$tableRow,
													'Duration',
													A2(
														$elm$core$Maybe$withDefault,
														'',
														A2($elm$core$Maybe$map, $author$project$View$formatDuration, event.aN))),
													A2(
													$elm$html$Html$tr,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$elm$html$Html$th,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('Link')
																])),
															A2(
															$elm$html$Html$td,
															_List_Nil,
															_List_fromArray(
																[
																	$author$project$View$maybeLink(event.K)
																]))
														]))
												]))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column')
								]),
							_List_fromArray(
								[
									$author$project$View$viewLocations(event.a7)
								]))
						])),
					$author$project$View$viewOffers(event.bf)
				]));
	});
var $author$project$View$viewEvents = F2(
	function (events, zone) {
		return A2(
			$elm$core$List$map,
			$author$project$View$viewEvent(zone),
			events);
	});
var $author$project$View$viewData = F2(
	function (data, zone) {
		var productionOpen = function (index) {
			return !A2($elm$core$Set$member, index, data.D);
		};
		var eventOpen = function (index) {
			return !A2($elm$core$Set$member, index, data.C);
		};
		var viewProduction = F2(
			function (index, production) {
				return A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('sticky-header')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h1,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('is-size-1')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(production.l)
										]))
								])),
							A4(
							$author$project$View$card,
							$elm$html$Html$text('Info'),
							$author$project$View$productionTable(production),
							productionOpen(index),
							A2(
								$author$project$View$ProductionCardClicked,
								index,
								!productionOpen(index))),
							A4(
							$author$project$View$card,
							$elm$html$Html$text('Events'),
							A2(
								$elm$html$Html$div,
								_List_Nil,
								A2($author$project$View$viewEvents, production.aS, zone)),
							eventOpen(index),
							A2(
								$author$project$View$EventCardClicked,
								index,
								!eventOpen(index)))
						]));
			});
		return $author$project$View$section(
			_List_fromArray(
				[
					$author$project$View$filterInput(data.P),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					A2(
						$elm$core$List$indexedMap,
						viewProduction,
						A2(
							$elm$core$List$filter,
							$author$project$View$productionNameMatches(data.P),
							data.ak.br)))
				]));
	});
var $author$project$View$Submit = function (a) {
	return {$: 0, a: a};
};
var $author$project$View$TextChange = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $author$project$View$isJson = function (string) {
	var _v0 = A2($elm$json$Json$Decode$decodeString, $elm$json$Json$Decode$value, string);
	if (!_v0.$) {
		return true;
	} else {
		return false;
	}
};
var $author$project$View$looksLikeJson = function (string) {
	return (A2($elm$core$String$startsWith, '{', string) || A2($elm$core$String$startsWith, '[', string)) && (!$elm$core$String$isEmpty(string));
};
var $author$project$View$looksLikeUrl = function (string) {
	return (A2($elm$core$String$startsWith, 'http', string) || (A2($elm$core$String$startsWith, 'www', string) || (!$author$project$View$looksLikeJson(string)))) && (!$elm$core$String$isEmpty(string));
};
var $author$project$View$viewInput = F2(
	function (inputString, buttonEnabled) {
		var invalidUrl = $author$project$View$looksLikeUrl(inputString) && (!$author$project$View$isUrl(inputString));
		var invalidJson = $author$project$View$looksLikeJson(inputString) && (!$author$project$View$isJson(inputString));
		var invalid = invalidUrl || invalidJson;
		var controlAttrs = invalidUrl ? _List_fromArray(
			[
				A2($elm$html$Html$Attributes$attribute, 'data-tooltip', 'Not a valid link')
			]) : (invalidJson ? _List_fromArray(
			[
				A2($elm$html$Html$Attributes$attribute, 'data-tooltip', 'Not valid JSON')
			]) : _List_Nil);
		return $author$project$View$section(
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('field')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('label is-size-3')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Enter the URL of your endpoint OR copy & paste your data')
								])),
							A2(
							$elm$html$Html$div,
							A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$class('control has-icons-right has-tooltip-arrow'),
								controlAttrs),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('text'),
											$elm$html$Html$Events$onInput($author$project$View$TextChange),
											$elm$html$Html$Attributes$value(inputString),
											$elm$html$Html$Attributes$class('input'),
											$elm$html$Html$Attributes$classList(
											_List_fromArray(
												[
													_Utils_Tuple2('is-danger', invalid)
												]))
										]),
									_List_Nil),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('icon is-right')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$i,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('fas has-text-danger'),
													$elm$html$Html$Attributes$classList(
													_List_fromArray(
														[
															_Utils_Tuple2('fa-xmark', invalid)
														]))
												]),
											_List_Nil)
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('control')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$View$Submit(inputString)),
									$elm$html$Html$Attributes$disabled(
									(!buttonEnabled) || (invalid || $elm$core$String$isEmpty(inputString))),
									$elm$html$Html$Attributes$class('button is-primary')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('View data')
								]))
						]))
				]));
	});
var $elm$html$Html$p = _VirtualDom_node('p');
var $author$project$View$viewIntroduction = $author$project$View$section(
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('is-size-1')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Use Case 3 - Data Viewer')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Use this tool to view the data returned by your repertoire endpoint.')
				]))
		]));
var $author$project$View$viewJsonError = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$elm$html$Html$text('Unfortunately, it looks like your data is not valid.'),
			A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('title is-size-5 mt-5')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Here is what you can do:')
				])),
			A2(
			$elm$html$Html$ul,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$li,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('This error likely means that something needs to be changed in your endpoint.')
						])),
					A2(
					$elm$html$Html$li,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Please contact the maintainer of your endpoint and ask them to make sure that the endpoint returns valid data.')
						])),
					A2(
					$elm$html$Html$li,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('They can use the '),
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href('../validate')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Validator Tool')
								])),
							$elm$html$Html$text(' to make sure the data is valid.')
						]))
				]))
		]));
var $elm$html$Html$ol = _VirtualDom_node('ol');
var $author$project$View$viewNetworkError = function (url) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$elm$html$Html$text('I encountered an error while trying to fetch data from this link.'),
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('title is-size-5 mt-5')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Here is what you can do:')
					])),
				A2(
				$elm$html$Html$ol,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Open the link in your browser: '),
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href(url),
										$elm$html$Html$Attributes$target('_blank')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(url)
									]))
							])),
						A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Copy the data that is displayed')
							])),
						A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Paste the data into the input field above')
							]))
					]))
			]));
};
var $author$project$View$viewRequestError = F2(
	function (url, error) {
		return $author$project$View$section(
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('notification is-danger')
						]),
					_List_fromArray(
						[
							function () {
							switch (error.$) {
								case 0:
									var invalidUrl = error.a;
									return $elm$html$Html$text('Unfortunately, it looks like ' + (invalidUrl + ' is not a valid URL.'));
								case 1:
									return $elm$html$Html$text('Unfortunately, the request to your endpoint timed out.');
								case 2:
									return $author$project$View$viewNetworkError(url);
								case 3:
									var code = error.a;
									return $elm$html$Html$text(
										'Unfortunately, your endpoint returned an unsuccessful status code (' + ($elm$core$String$fromInt(code) + '), so I could not check whether your JSON is valid or not. Please check your browser\'s console logs for more information.'));
								default:
									return $author$project$View$viewJsonError;
							}
						}()
						]))
				]));
	});
var $author$project$View$view = function (model) {
	var enableButton = function () {
		var _v1 = model.j;
		if (_v1.$ === 1) {
			return false;
		} else {
			return true;
		}
	}();
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container')
			]),
		_List_fromArray(
			[
				$author$project$View$viewIntroduction,
				A2($author$project$View$viewInput, model.N, enableButton),
				function () {
				var _v0 = model.j;
				switch (_v0.$) {
					case 0:
						return $elm$html$Html$text('');
					case 1:
						return $elm$html$Html$text('');
					case 2:
						if (!_v0.a.$) {
							var error = _v0.a.a;
							return A2($author$project$View$viewRequestError, model.N, error);
						} else {
							return $author$project$View$section(
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('notification is-danger')
											]),
										_List_fromArray(
											[$author$project$View$viewJsonError]))
									]));
						}
					default:
						var data = _v0.a;
						return A2($author$project$View$viewData, data, model.W);
				}
			}()
			]));
};
var $author$project$View$main = $elm$browser$Browser$element(
	{b7: $author$project$View$init, cj: $author$project$View$subscriptions, cr: $author$project$View$update, cs: $author$project$View$view});
_Platform_export({'View':{'init':$author$project$View$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));