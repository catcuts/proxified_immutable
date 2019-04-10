const util = require('util');
const Immutable = require('immutable');

const proxified = immutableObject => {
	if (!Immutable.isImmutable(immutableObject)) throw new Error('object to be proxifed is not immutable');
	let handler = {
		get: (target, name) => {
			let result;
            let immutable = target.__i;

            // 如果是函数则直接返回该函数的封装
            // 比如 封装(Map.set/setIn/mergeDeepIn/...)
            if (util.isFunction(immutable[name])) return (..._arguments) => {
                result = immutable[name](..._arguments);  // 它总是返回一个新的 immutable 对象
                // 代理新的 immutable 对象
				if (Immutable.isImmutable(result)) {
					// 返回值（对象）的代理
					return new Proxy({ __i: result }, handler);
				} else {
					// 或返回值（非对象）
					return result;
				}
            };

            // 否则
			try {
				result = target.__i.get(name);  // name === Symbol(util.inspect.custom) when invoke console confusing immutable.List.warpIndex for converting index
			} catch (e) {
				return target[name];
            }
			if (Immutable.isImmutable(result)) {
                // 返回值（对象）的代理
				return new Proxy({ __i: result }, handler);
			} else {
                // 或返回值（非对象）如果不存在则返回 immutable 内部属性
				return result === undefined ? target.__i[name] : result;
			}
		},
		set: (obj, prop, value) => {
			obj.__i.set(prop, value);
			return true; // support Object.assign
		},
		has: (target, key) => {
			return target.__i.has(key);
		},
		ownKeys: (target, key) => {
			return Object.keys(target.__i.toJS());
		},
		getOwnPropertyDescriptor: (target, key) => {
			 return { enumerable: true, configurable: true };
		}
	};
	return new Proxy({ __i: immutableObject }, handler);
};

module.exports = proxified;