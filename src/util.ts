/**
 * util
 * @author vfasky<vfasky@gmail.com>
 * 
 **/
'use strict'

const rbracket = /\[\]$/

function buildParams(prefix: string, obj, add: Function) {
    let name

    if (Array.isArray(obj)) {

        // Serialize array item.
        obj.forEach((v, i) => {

            if (rbracket.test(prefix)) {
                // Treat each array item as a scalar.
                add(prefix, v)

            } else {

                // Item is non-scalar (array or object), encode its numeric index.
                buildParams(
                    prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]",
                    v,
                    add
                )
            }
        })

    } else if (typeof obj === "object") {

        // Serialize object item.
        for (name in obj) {
            buildParams(prefix + "[" + name + "]", obj[name], add)
        }

    } else {

        // Serialize scalar item.
        add(prefix, obj)
    }
}

export function setOptonsDefault(options: { [key: string]: any } = {}, defaultVals: { [key: string]: any } = {}) {
    Object.keys(defaultVals).forEach((key) => {
        if (!options.hasOwnProperty(key)) {
            options[key] = defaultVals[key]
        }
    })

    return options
}

export function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply)
}


export function param(a: { [key: string]: any } = {}) {
    let prefix
    let s = []
    let add = function (key, valueOrFunction) {
        // If value is a function, invoke it and use its return value
        var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction

        s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value)
    }

    for (prefix in a) {
        buildParams(prefix, a[prefix], add)
    }
    // Return the resulting serialization
    return s.join("&");
}
