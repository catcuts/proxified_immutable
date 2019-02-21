const util = require('util');
const Immutable = require('immutable');

const proxified = immutableObject => {
	if (!Immutable.isImmutable(immutableObject)) throw new Error('object to be proxifed is not immutable');
	let handler = {
		get: (target, name) => {
            let immutable = target.__i;

            // 如果是函数则直接返回该函数的封装
            // 比如 封装(Map.set/setIn/mergeDeepIn/...)
            if (util.isFunction(immutable[name])) return (...arguments) => {
                let result = immutable[name](...arguments);  // 它总是返回一个新的 immutable 对象
                return new Proxy({ __i: result }, handler);  // 代理新的 immutable 对象
            };

            // 否则
			let result = target.__i.get(name);
			if (Immutable.isImmutable(result)) {
                // 返回值（对象）的代理
				return new Proxy({ __i: result }, handler);
			} else {
                // 或返回值（非对象）
				return result;
			}
		},
		set: (obj, prop, value) => {
			obj.__i.set(prop, value);
			return true; // support Object.assign
		},
	};
	return new Proxy({ __i: immutableObject }, handler);
};

module.exports = proxified;
