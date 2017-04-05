export default (subject) => {
  const events = subject.events || {};

  if (subject && subject === subject.window) {
    return {
      0: subject,
      load: (handler) => subject.addEventListener('load', handler, false),
      bind: (event, handler) => subject.addEventListener(event, handler, false),
      unbind: (event, handler) => subject.removeEventListener(event, handler, false)
    };
  }

  return {
    0: subject,

    unbind(event, handler) {
      let handlers = events[event] || [];

      if (handler) {
        const idx = handlers.indexOf(handler);
        if (idx !== -1) {
          handlers.splice(idx, 1);
        }
      } else {
        handlers = [];
      }

      events[event] = handlers;
      subject.events = events;
    },

    bind(event, handler) {
      const current = events[event] || [];
      events[event] = current.concat(handler)
      subject.events = events;
    },

    triggerHandler(event, args) {
      const handlers = events[event] || [];
      handlers.forEach(fn => {
        if (args === undefined) {
          args = { type: event };
        }
        if (!Array.isArray(args)) {
          args = [args];
        }
        if (args && args[0] && args[0].type === undefined) {
          args = [{
            type: event
          }].concat(args || []);
        } else {
          args = args || [];
        }

        fn.apply(this, args);
      });
    },

    param(a) {
      var prefix,
        s = [],
        add = function (key, valueOrFunction) {
          var value = typeof valueOrFunction === 'function' ?
            valueOrFunction() :
            valueOrFunction;

          s[s.length] = encodeURIComponent(key) + "=" +
            encodeURIComponent(value == null ? "" : value);
        };

      for (let p of a) {
        add(p.name, p.value);
      }

      return s.join("&");
    }

  };
};
