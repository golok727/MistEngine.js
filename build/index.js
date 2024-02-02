var gt = Object.defineProperty;
var mt = (n, e, t) => e in n ? gt(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var o = (n, e, t) => (mt(n, typeof e != "symbol" ? e + "" : e, t), t);
class U {
  constructor() {
    o(this, "__listeners__");
  }
  addEventListener(e, t) {
    this.__listeners__ === void 0 && (this.__listeners__ = {});
    const r = this.__listeners__;
    r[e] === void 0 && (r[e] = /* @__PURE__ */ new Set()), r[e].add(t);
  }
  hasEventListener(e, t) {
    if (this.__listeners__ === void 0)
      return !1;
    const r = this.__listeners__;
    return r[e] !== void 0 && r[e].has(t);
  }
  removeEventListener(e, t) {
    if (this.__listeners__ === void 0)
      return;
    this.__listeners__[e].delete(t);
  }
  dispatchEvent(e) {
    if (this.__listeners__ === void 0)
      return;
    const r = this.__listeners__[e.type];
    r !== void 0 && new Set(r).forEach((i) => i.call(this, e));
  }
  destroyDispatcher() {
    this.__listeners__ = {};
  }
  makeEvent(e, t) {
    const r = t;
    return Object.defineProperty(r, "type", {
      value: e
    }), r;
  }
}
var st = /* @__PURE__ */ ((n) => (n.Backspace = "Backspace", n.Tab = "Tab", n.Enter = "Enter", n.Shift = "Shift", n.Control = "Control", n.Meta = "Meta", n.Alt = "Alt", n.CapsLock = "CapsLock", n.Escape = "Escape", n.Space = " ", n.PageUp = "PageUp", n.PageDown = "PageDown", n.End = "End", n.Home = "Home", n.ArrowLeft = "ArrowLeft", n.ArrowUp = "ArrowUp", n.ArrowRight = "ArrowRight", n.ArrowDown = "ArrowDown", n.Insert = "Insert", n.Delete = "Delete", n.A = "A", n.B = "B", n.C = "C", n.D = "D", n.E = "E", n.F = "F", n.G = "G", n.H = "H", n.I = "I", n.J = "J", n.K = "K", n.L = "L", n.M = "M", n.N = "N", n.O = "O", n.P = "P", n.Q = "Q", n.R = "R", n.S = "S", n.T = "T", n.U = "U", n.V = "V", n.W = "W", n.X = "X", n.Y = "Y", n.Z = "Z", n.a = "a", n.b = "b", n.c = "c", n.d = "d", n.e = "e", n.f = "f", n.g = "g", n.h = "h", n.i = "i", n.j = "j", n.k = "k", n.l = "l", n.m = "m", n.n = "n", n.o = "o", n.p = "p", n.q = "q", n.r = "r", n.s = "s", n.t = "t", n.u = "u", n.v = "v", n.w = "w", n.x = "x", n.y = "y", n.z = "z", n.Num0 = "0", n.Num1 = "1", n.Num2 = "2", n.Num3 = "3", n.Num4 = "4", n.Num5 = "5", n.Num6 = "6", n.Num7 = "7", n.Num8 = "8", n.Num9 = "9", n))(st || {});
const A = class A extends U {
  constructor(t) {
    super();
    o(this, "state");
    o(this, "onWheelHandleConstructor", () => {
      let t;
      return (r) => {
        t !== void 0 && clearTimeout(t), this.state.mouse.wheel.isActive = !0;
        const { deltaX: s, deltaY: i } = r;
        this.state.mouse.wheel.deltaX = s, this.state.mouse.wheel.deltaY = i, this.state.mouse.wheel.dirX = Math.sign(s), this.state.mouse.wheel.dirY = Math.sign(i), this.dispatchEvent({
          type: MistEventType.MouseWheel,
          deltaX: this.state.mouse.wheel.deltaX,
          deltaY: this.state.mouse.wheel.deltaY,
          dirX: this.state.mouse.wheel.dirX,
          dirY: this.state.mouse.wheel.dirY,
          native: r,
          target: this,
          preventDefault: r.preventDefault.bind(r)
        }), t = setTimeout(() => {
          this.state.mouse.wheel.isActive = !1;
        }, 100);
      };
    });
    o(this, "onMouseDown", (t) => {
      this.state.mouse.mouseX = t.offsetX, this.state.mouse.mouseY = t.offsetY, this.state.mouse.isDown = !0, this.state.mouse.button.left = t.button === 0, this.state.mouse.button.middle = t.button === 1, this.state.mouse.button.right = t.button === 2, this.state.mouse.button.b4 = t.button === 4, this.state.mouse.button.b5 = t.button === 5, this.dispatchEvent({
        type: MistEventType.MouseDown,
        button: this.state.mouse.button,
        native: t,
        target: this,
        x: t.offsetX,
        y: t.offsetY,
        preventDefault: t.preventDefault.bind(t)
      });
    });
    o(this, "onMouseMove", (t) => {
      this.state.mouse.mouseX = t.offsetX, this.state.mouse.mouseY = t.offsetY, this.dispatchEvent({
        type: MistEventType.MouseMove,
        isDown: this.state.mouse.isDown,
        button: this.state.mouse.button,
        native: t,
        target: this,
        x: t.offsetX,
        y: t.offsetY,
        preventDefault: t.preventDefault.bind(t)
      });
    });
    o(this, "onMouseUp", (t) => {
      this.state.mouse.isDown = !1, this.state.mouse.button.left = !1, this.state.mouse.button.middle = !1, this.state.mouse.button.right = !1, this.state.mouse.button.b4 = !1, this.state.mouse.button.b5 = !1, this.dispatchEvent({
        type: MistEventType.MouseUp,
        button: this.state.mouse.button,
        native: t,
        target: this,
        x: t.offsetX,
        y: t.offsetY,
        preventDefault: t.preventDefault.bind(t)
      });
    });
    this.state = {
      mouse: {
        mouseX: 0,
        mouseY: 0,
        isDown: !1,
        button: {
          left: !1,
          middle: !1,
          right: !1,
          b4: !1,
          b5: !1
        },
        wheel: {
          isActive: !1,
          deltaX: 0,
          deltaY: 0,
          dirX: 1,
          dirY: 1
        }
      }
    }, this.addEventListeners(t);
  }
  /*	
  	Destroys the input for the element initialized with
  */
  destroy() {
    this.state.destroyFn && this.state.destroyFn(), this.reset(), this.destroyDispatcher();
  }
  /** Returns if a key is pressed or not */
  isPressed(t) {
    return A.GlobalInputState.inputMap[t];
  }
  isKeyDown() {
    return A.GlobalInputState.isKeyDown;
  }
  arePressed(...t) {
    return t.every((r) => A.GlobalInputState.inputMap[r]);
  }
  anyPressed(...t) {
    return t.some((r) => A.GlobalInputState.inputMap[r]);
  }
  /* Getters START */
  get mouseX() {
    return this.state.mouse.mouseX;
  }
  get mouseY() {
    return this.state.mouse.mouseY;
  }
  get isMouseDown() {
    return this.state.mouse.isDown;
  }
  get wheel() {
    return this.state.mouse.wheel;
  }
  get mouseBtn() {
    return this.state.mouse.button;
  }
  /* Getters END */
  /* Instance Methods */
  addEventListeners(t) {
    t.addEventListener("mousedown", this.onMouseDown), t.addEventListener("mousemove", this.onMouseMove), t.addEventListener("mouseup", this.onMouseUp), t.addEventListener("mouseleave", this.onMouseUp);
    const r = this.onWheelHandleConstructor();
    t.addEventListener("wheel", r), this.state.destroyFn = () => {
      t.removeEventListener("mousedown", this.onMouseDown), t.removeEventListener("mousemove", this.onMouseMove), t.removeEventListener("mouseup", this.onMouseUp), t.removeEventListener("mouseleave", this.onMouseUp), t.removeEventListener("wheel", r);
    };
  }
  reset() {
    this.state = {
      mouse: {
        mouseX: 0,
        mouseY: 0,
        isDown: !1,
        button: {
          left: !1,
          middle: !1,
          right: !1,
          b4: !1,
          b5: !1
        },
        wheel: {
          isActive: !1,
          deltaX: 0,
          deltaY: 0,
          dirX: 1,
          dirY: 1
        }
      }
    };
  }
  /* Instance Methods END */
  /* Static Input Methods START */
  /**
   * Initializes the global input
   * Does nothing if already initialized
   */
  static Init() {
    if (this._isInitialized)
      return;
    const t = {};
    for (const r of Object.keys(st))
      t[r] = !1;
    this.GlobalInputState = { ...this.GlobalInputState }, Object.assign(this.GlobalInputState, { inputMap: t }), this.addGlobalEventListeners(), this._isInitialized = !0;
  }
  // Returns if the input is already initialized
  static isInitialized() {
    return this.isInitialized;
  }
  static Reset() {
    this._isInitialized = !1, this.GlobalInputState = { inputMap: {}, isKeyDown: !1 };
  }
  // Destroy Global Inputs
  static Destroy() {
    this._isInitialized && (this.GlobalInputState.destroyFn && this.GlobalInputState.destroyFn(), this.Reset(), this.globalDispatch.destroyDispatcher());
  }
  static isKeyDown() {
    return this.GlobalInputState.isKeyDown;
  }
  static isPressed(t) {
    return this.GlobalInputState.inputMap[t];
  }
  static arePressed(...t) {
    return t.every((r) => this.GlobalInputState.inputMap[r]);
  }
  static anyPressed(...t) {
    return t.some((r) => A.GlobalInputState.inputMap[r]);
  }
  static addGlobalEventListeners() {
    this._isInitialized = !0, window.addEventListener("keydown", this.onGlobalKeyDown), window.addEventListener("keyup", this.onGlobalKeyUp), this.GlobalInputState.destroyFn = () => {
      window.removeEventListener("keydown", this.onGlobalKeyDown), window.removeEventListener("keyup", this.onGlobalKeyUp);
    };
  }
  /* Static Input Methods END */
};
o(A, "globalDispatch", new U()), o(A, "_isInitialized", !1), o(A, "GlobalInputState"), o(A, "onGlobalKeyDown", (t) => {
  A.GlobalInputState.inputMap[t.key] = !0, A.GlobalInputState.isKeyDown = !0, A.globalDispatch.dispatchEvent({
    type: MistEventType.KeyDown,
    key: t.key,
    native: t,
    target: A,
    preventDefault: t.preventDefault.bind(t)
  });
}), o(A, "onGlobalKeyUp", (t) => {
  A.GlobalInputState.inputMap[t.key] = !1, A.GlobalInputState.isKeyDown = !1, A.globalDispatch.dispatchEvent({
    type: MistEventType.KeyUp,
    key: t.key,
    native: t,
    target: A,
    preventDefault: t.preventDefault.bind(t)
  });
});
let F = A;
window.__MIST__ === void 0 && (window.__MIST__ = {});
window.MistEventType = Object.freeze({
  AppReady: "AppReady",
  AppStart: "AppStart",
  AppShutDown: "AppShutDown",
  AppRestart: "AppRestart",
  RendererResize: "RendererResize",
  MouseDown: "MouseDown",
  MouseMove: "MouseMove",
  MouseUp: "MouseUp",
  KeyDown: "KeyDown",
  KeyUp: "KeyUp",
  MouseWheel: "MouseWheel"
});
function wt(n) {
  return n.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function* yt() {
  let n = 0;
  for (; ; )
    yield (n++).toString();
}
yt();
async function xt(n) {
  return new Promise((e, t) => {
    const r = new Image();
    r.onload = () => {
      e(r);
    }, r.onerror = (s) => {
      t(s);
    }, r.src = n;
  });
}
function Et() {
  console.log(
    `%c
	        *     (    (                     )          (        )       
      (  \`    )\\ ) )\\ )  *   )        ( /(  (       )\\ )  ( /(       
      )\\))(  (()/((()/(\` )  /(   (    )\\()) )\\ )   (()/(  )\\()) (    
     ((_)()\\  /(_))/(_))( )(_))  )\\  ((_) (()/(    /(_))((_)  )\\   
     (_()((_)(_)) (_)) (_(_())  ((_)  _((_) /(_))_ (_))   _((_)((_)  
     |  \\/  ||_ _|/ __||_   _|  | __|| \\| |(_)) __||_ _| | \\| || __| 
     | |\\/| | | | \\__ \\  | |    | _| | .\` |  | (_ | | |  | .\` || _|  
     |_|  |_||___||___/  |_|    |___||_|\\_|   \\___||___| |_|\\_||___| 
                       
	`,
    "font-weight: bold;  color: transparent; background: linear-gradient(to right, orange, red); padding: 5px; background-clip: text;"
  );
}
var ht = /* @__PURE__ */ ((n) => (n.Message = "%s", n.LevelShort = "%L", n.LevelText = "%l", n.LoggerName = "%n", n.Year4Digits = "%Y", n.Year2Digits = "%y", n.MonthNumber = "%m", n.MonthText = "%M", n.ShortDate = "%D", n.WeekDayDigit = "%w", n.WeekDayText = "%W", n.PerformanceNow = "%p", n))(ht || {});
const c = class c {
  /**
  	  # Format
  		|flag | meaning								| example	|
  		|-----|:---------------------:|--------|
  		|%s   | Text to log 					|  				|
  		|%n 	| Logger Name 					|   			|
  		|%Y 	| Year in 4 digits			|   			|
  	  |%y 	| Year in 2 digits			|  				|
  		|%m 	| Month in number (1-12)|   			|
  		|%M 	| Month in text		 			|   			|
  		|%D 	| Short MM/DD/YY date		|  				|
  		|%d 	| week-day in 1-6       |  				|
  		|%p 	| current performance   |  				|
  		|%L 	| Emoji of level       	|  				|
  		|%l 	| Level in text       	|  				|
  
  	// 
  	*/
  constructor(e) {
    o(this, "options");
    o(this, "parsedPatterns");
    this.options = Object.assign({}, c.defaultOptions, e), this.recalculatePlaceholders();
  }
  setPattern(e) {
    this.options.pattern = e, this.recalculatePlaceholders();
  }
  // Normal logging
  log(e, ...t) {
    const [r, s] = this.createLog(
      e,
      c.LogLevel.LOG,
      t
    );
    this._consoleLog(r, s);
  }
  // Info
  info(e, ...t) {
    const [r, s] = this.createLog(
      e,
      c.LogLevel.INFO,
      t
    );
    this._consoleLog(r, s);
  }
  // Warnings
  warn(e, ...t) {
    const [r, s] = this.createLog(
      e,
      c.LogLevel.WARN,
      t
    );
    this._consoleLog(r, s);
  }
  // Errors
  error(e, ...t) {
    const [r, s] = this.createLog(
      e,
      c.LogLevel.ERROR,
      t
    );
    this._consoleLog(r, s);
  }
  /*
  	Parses the templated string provided by the user and fills with the data provided
  	template arg == {index} eg: {0}-{1}-{0}
  	Index is the index of the data in the args
   */
  _consoleLog(e, t) {
    this.options.styled ? console.log(e, ...t) : console.log(e);
  }
  /*
  	Creates a formatted log with given level template and data for the placeholder as args
  */
  createLog(e, t, r) {
    const s = this.parseTemplatedMessage(e, r);
    return this.replaceFormattersWithData(s, t);
  }
  parseTemplatedMessage(e, t) {
    var s;
    const r = e.matchAll(c.MessageTemplateRegex);
    for (const i of r) {
      const a = i[0];
      if (!i.groups)
        throw new Error("Invalid number of arguments");
      const h = parseInt(i.groups.index);
      if (isNaN(h))
        throw new Error(
          "Placeholder should have a valid number index to the arguments"
        );
      if (h < 0 || h >= t.length)
        throw new Error("Index out of bounds");
      let l = !!((s = i.groups) != null && s.fPretty), u = this.getArgDataReplacement(t[h], l);
      e = e.replace(a, `${u}`);
    }
    return e;
  }
  getArgDataReplacement(e, t = !1) {
    return typeof e == "object" && e !== null ? t ? JSON.stringify(e, null, 2) : JSON.stringify(e) : e.toString();
  }
  wrapTokenWithStyles(e) {
    return this.options.styled ? "%c" + e.replace(c.ConsoleColorStopRegex, "") + "%c" : e;
  }
  /* 
  	Replaces the formatters with actual data
  */
  replaceFormattersWithData(e, t) {
    let { pattern: r } = this.options;
    const s = [];
    for (const i of this.parsedPatterns)
      switch (i) {
        case c.Formatters.Message.pattern: {
          const [a, h] = this.replaceFormatterMessageToken(
            e,
            r,
            t
          );
          r = a, s.push(...h);
          break;
        }
        case c.Formatters.LevelText.pattern: {
          const [a, h] = this.replaceFormatterLogLevelTextToken(
            r,
            t
            // requires the level
          );
          r = a, s.push(...h);
          break;
        }
        case c.Formatters.LevelShort.pattern: {
          const [a, h] = this.replaceFormatterLogLevelShortToken(
            r,
            t
            // requires the level
          );
          r = a, s.push(...h);
          break;
        }
        default: {
          const a = c.FormatterMap[i].name, { regex: h, getValue: l, stylesProps: u } = c.Formatters[a], p = c.makeConsoleStyles(u);
          r = r.replace(
            h,
            this.wrapTokenWithStyles(l(this.options))
          ), s.push(p, "");
          break;
        }
      }
    return [r, s];
  }
  // Formatters["Message"]
  replaceFormatterMessageToken(e, t, r) {
    const { regex: s, getValue: i, stylesProps: a } = c.Formatters.Message, h = c.makeConsoleStyles({
      ...a,
      color: this.getColorForLogLevel(r)
    });
    return t = t.replace(
      s,
      this.wrapTokenWithStyles(i({ ...this.options, message: e }))
    ), [t, [h, ""]];
  }
  // Formatters["LevelText"]
  replaceFormatterLogLevelTextToken(e, t) {
    const { regex: r, getValue: s, stylesProps: i } = c.Formatters.LevelText, a = c.makeConsoleStyles({
      ...i,
      color: this.getColorForLogLevel(t),
      fontWeight: "bold"
    });
    return e = e.replace(
      r,
      this.wrapTokenWithStyles(s({ ...this.options, level: t }))
    ), [e, [a, ""]];
  }
  replaceFormatterLogLevelShortToken(e, t) {
    const { regex: r, getValue: s, stylesProps: i } = c.Formatters.LevelShort, a = c.makeConsoleStyles({
      ...i
    });
    return e = e.replace(
      r,
      this.wrapTokenWithStyles(s({ ...this.options, level: t }))
    ), [e, [a, ""]];
  }
  getColorForLogLevel(e) {
    switch (e) {
      case c.LogLevel.ERROR:
        return "red";
      case c.LogLevel.WARN:
        return "yellow";
      case c.LogLevel.INFO:
        return "cyan";
      case c.LogLevel.LOG:
        return "orange";
    }
  }
  // Placeholders
  recalculatePlaceholders() {
    this.parsedPatterns = this.parseFormatterFromPattern(this.options.pattern);
  }
  parseFormatterFromPattern(e) {
    let t = c.FormatterRegex;
    const r = [];
    for (const s of e.matchAll(t)) {
      const i = s[0];
      if (c.FormatterMap[i] === void 0)
        throw new Error(`Invalid formatter '${i}'`);
      r.push(i);
    }
    return r;
  }
  static createFormatterMap() {
    const e = {};
    for (const [t, r] of Object.entries(ht))
      e[r] = { name: t, regex: new RegExp(r) };
    return e;
  }
  static makeConsoleStyles(e) {
    let t = "";
    for (const [r, s] of Object.entries(e))
      t += `${wt(r)}: ${s}; `;
    return t;
  }
};
o(c, "DefaultPattern", `%n: [ %l ] ( %D ) %p 
	 %s `), o(c, "defaultOptions", {
  pattern: c.DefaultPattern,
  name: "MistLog",
  styled: !0
}), /**
  Parse the templated message and replace it with the data provided in the args
 */
o(c, "MessageTemplateRegex", /{(?<fPretty>:)?(?<index>\d+)}/g), /*
	Wraps the tokens with color stop codes
 */
o(c, "ConsoleColorStopRegex", /%c/g), o(c, "FormatterRegex", /%\w/g), o(c, "LogLevel", {
  INFO: "Info",
  WARN: "Warning",
  ERROR: "Error",
  LOG: "Log"
}), o(c, "FormatterMap", c.createFormatterMap()), o(c, "Formatters", {
  Message: {
    pattern: "%s",
    stylesProps: { fontStyle: "italic" },
    regex: c.FormatterMap[
      "%s"
      /* Message */
    ].regex,
    getValue(e) {
      if (e.message === void 0)
        throw new Error("message not provided");
      return e.message;
    }
  },
  LevelText: {
    pattern: "%l",
    stylesProps: {},
    regex: c.FormatterMap[
      "%l"
      /* LevelText */
    ].regex,
    getValue(e) {
      if (!e.level)
        throw new Error("Level was not provided");
      return e.level;
    }
  },
  LevelShort: {
    pattern: "%L",
    stylesProps: {},
    regex: c.FormatterMap[
      "%L"
      /* LevelShort */
    ].regex,
    getValue: function(e) {
      if (!e.level)
        throw new Error("Level was not provided");
      let t = "";
      switch (e.level) {
        case c.LogLevel.LOG:
          t = "🚀";
          break;
        case c.LogLevel.INFO:
          t = "🚄";
          break;
        case c.LogLevel.ERROR:
          t = "💔";
          break;
        case c.LogLevel.WARN:
          t = "⚠️";
          break;
      }
      return t;
    }
  },
  LoggerName: {
    pattern: "%n",
    stylesProps: {
      color: "transparent",
      fontWeight: "bold",
      fontSize: "1.4em",
      background: "linear-gradient(to right, orange, red)",
      padding: "5px",
      backgroundClip: "text"
    },
    regex: c.FormatterMap[
      "%n"
      /* LoggerName */
    ].regex,
    getValue(e) {
      return e.name;
    }
  },
  PerformanceNow: {
    pattern: "%p",
    stylesProps: {
      color: "pink"
    },
    regex: c.FormatterMap[
      "%p"
      /* PerformanceNow */
    ].regex,
    getValue() {
      return `${performance.now().toFixed(2)}ms`;
    }
  },
  Year4Digits: {
    pattern: "%Y",
    stylesProps: {},
    regex: c.FormatterMap[
      "%Y"
      /* Year4Digits */
    ].regex,
    getValue() {
      return c.Date.Year4Digit;
    }
  },
  Year2Digits: {
    pattern: "%y",
    stylesProps: {},
    regex: c.FormatterMap[
      "%y"
      /* Year2Digits */
    ].regex,
    getValue() {
      return c.Date.Year2Digit;
    }
  },
  MonthNumber: {
    pattern: "%m",
    stylesProps: {},
    regex: c.FormatterMap[
      "%m"
      /* MonthNumber */
    ].regex,
    getValue() {
      return c.Date.MonthDigit;
    }
  },
  MonthText: {
    pattern: "%M",
    stylesProps: {},
    regex: c.FormatterMap[
      "%M"
      /* MonthText */
    ].regex,
    getValue() {
      return c.Date.MonthText;
    }
  },
  ShortDate: {
    pattern: "%D",
    stylesProps: {
      color: "lightgreen"
    },
    regex: c.FormatterMap[
      "%D"
      /* ShortDate */
    ].regex,
    getValue() {
      return (/* @__PURE__ */ new Date()).toLocaleDateString();
    }
  },
  WeekDayDigit: {
    pattern: "%w",
    stylesProps: {
      color: "slateblue",
      fontStyle: "italic"
    },
    regex: c.FormatterMap[
      "%w"
      /* WeekDayDigit */
    ].regex,
    getValue() {
      return c.Date.WeekDayDigit;
    }
  },
  WeekDayText: {
    pattern: "%W",
    stylesProps: {
      color: "slateblue",
      fontStyle: "italic"
    },
    regex: c.FormatterMap[
      "%W"
      /* WeekDayText */
    ].regex,
    getValue() {
      return c.Date.WeekDayText;
    }
  }
}), o(c, "MonthFormatter", new Intl.DateTimeFormat("en", {
  month: "long"
}).format), o(c, "DayFormatter", new Intl.DateTimeFormat("en", {
  weekday: "long"
}).format), o(c, "Date", (() => {
  const e = /* @__PURE__ */ new Date(), t = e.getFullYear().toString(), r = e.getFullYear().toString().slice(2), s = e.getMonth().toString(), i = c.MonthFormatter(e), a = e.getDay().toString(), h = c.DayFormatter(e);
  return {
    Year4Digit: t,
    Year2Digit: r,
    MonthDigit: s,
    MonthText: i,
    WeekDayDigit: a,
    WeekDayText: h
  };
})());
let et = c;
class rt {
  /**
   * This API is fairly new which will be changed later
   * @param url Url of the image to load
   */
  static AddTextureFromElement(e, t) {
    t.onload = () => {
      this.preloadedImages.set(e, t);
    };
  }
  static async PreloadImage(e) {
    try {
      const t = await xt(e);
      this.preloadedImages.set(e, t);
    } catch {
      console.error(
        `Mist.TextureLibrary.PreloadTexture(): Error loading image from '${e}'`
      );
    }
  }
  /**
   *
   * @param tImageUrl  the name or url in which the image is loaded as
   * @description Creates the api specific texture from the given image url for the app
   */
  static async Create(e, t) {
    const r = this.mistTextures.get(t);
    if (this.preloadedImages.get(t) || await this.PreloadImage(t), r)
      return r;
    const s = ft.Create(t, e.getRenderer());
    return this.mistTextures.set(t, s), s;
  }
  /**
   * Returns the `Mist.Texture` loaded
   */
  static Get(e) {
    const t = this.mistTextures.get(e);
    if (!t)
      throw new Error("Mist.TextureLibrary.Get(): Texture is not loaded ");
    return t;
  }
  static GetImageForTexture(e) {
    return this.preloadedImages.get(e);
  }
}
o(rt, "preloadedImages", /* @__PURE__ */ new Map()), o(rt, "mistTextures", /* @__PURE__ */ new Map());
class _ {
  static getCurrent() {
    return this.currentInstance;
  }
  static isAnyActive() {
    return this.currentInstance !== null;
  }
  static detach() {
    this.currentInstance = null;
  }
  static setCurrent(e) {
    this.currentInstance = e;
  }
}
o(_, "currentInstance", null);
var S = /* @__PURE__ */ ((n) => (n.WebGL2 = "WebGL2", n.WebGPU = "WebGPU", n.None = "None", n))(S || {});
class ct {
  constructor(e) {
    o(this, "canvas");
    o(this, "context");
    this.canvas = e;
    const t = this.canvas.getContext("webgl2");
    if (!t)
      throw new Error("Error getting WebGL2 context");
    this.context = t;
    const r = t;
    r.enable(r.BLEND), r.blendFunc(r.SRC_ALPHA, r.ONE_MINUS_SRC_ALPHA);
  }
  get inner() {
    return this.context;
  }
  SetClearColor(e, t, r, s) {
    this.context.clearColor(e, t, r, s);
  }
  Clear() {
    const e = this.context;
    e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT);
  }
  DrawIndexed(e) {
    const t = this.context;
    t.drawElements(
      t.TRIANGLES,
      e.getIndexBuffer().getCount(),
      t.UNSIGNED_INT,
      0
    );
  }
  SetViewport(e, t, r, s) {
    this.context.viewport(e, t, r, s);
  }
}
function W(n) {
  const e = n.GetRenderAPI();
  if (!(e instanceof ct))
    throw new Error(
      "This buffer should be used within the WebGL2 rendering context"
    );
  return e.inner;
}
class nt {
  constructor(e, t, r) {
    o(this, "_gl");
    o(this, "program");
    o(this, "uniformCache");
    this.uniformCache = /* @__PURE__ */ new Map(), this._gl = W(e);
    const s = this.createShader("VERTEX", t), i = this.createShader("FRAGMENT", r);
    this.program = this.createProgram(s, i);
  }
  /*
   This is only for cheating typescript before i fully abstract the API
   */
  is() {
    return this instanceof nt;
  }
  use() {
    this._gl.useProgram(this.program);
  }
  detach() {
    this._gl.useProgram(null);
  }
  delete() {
    this._gl.deleteProgram(this.program);
  }
  setUniform1i(e, t) {
    const r = this.getUniformLocation(e);
    this._gl.uniform1i(r, t);
  }
  setUniform3f(e, t, r, s) {
    const i = this.getUniformLocation(e);
    this._gl.uniform3f(i, t, r, s);
  }
  setUniformMat4(e, t) {
    const r = this.getUniformLocation(e), s = new Float32Array(t.toArray());
    this._gl.uniformMatrix4fv(r, !1, s);
  }
  getUniformLocation(e) {
    const t = this.uniformCache.get(e);
    if (t !== void 0)
      return t;
    const r = this._gl.getUniformLocation(this.program, e);
    return this.uniformCache.set(e, r), r;
  }
  createProgram(...e) {
    const { _gl: t } = this, r = t.createProgram();
    if (!r)
      throw new Error("Error Creating Shader Program");
    if (e.forEach((s) => {
      t.attachShader(r, s);
    }), t.linkProgram(r), !t.getProgramParameter(r, t.LINK_STATUS)) {
      const s = t.getProgramInfoLog(r);
      throw t.deleteProgram(r), e.forEach((i) => {
        t.deleteShader(i);
      }), new Error(`Error linking program :${s}`);
    }
    return e.forEach((s) => {
      t.deleteShader(s);
    }), r;
  }
  createShader(e, t) {
    const r = this.getGLShaderType(e), { _gl: s } = this, i = s.createShader(r);
    if (!i)
      throw new Error(`Error creating Shader ${e}`);
    if (s.shaderSource(i, t), s.compileShader(i), !s.getShaderParameter(i, s.COMPILE_STATUS)) {
      const a = s.getShaderInfoLog(i);
      throw s.deleteShader(i), new Error(`Error compiling shader ${e}:
${a}`);
    }
    return i;
  }
  getGLShaderType(e) {
    switch (e) {
      case "VERTEX":
        return this._gl.VERTEX_SHADER;
      case "FRAGMENT":
        return this._gl.FRAGMENT_SHADER;
      default:
        return -1;
    }
  }
}
class lt {
  static Create(e, t, r) {
    var s;
    if (r = r || ((s = _.getCurrent()) == null ? void 0 : s.getRenderer()), !r)
      throw new Error(
        "Mist.Shader Create called without an active context. Please use this inside a Mist.App or Mist.Layer or provide a Mist.Renderer as arg[3] for context"
      );
    switch (r.GetApiType()) {
      case S.WebGL2:
        return new nt(
          r,
          this.cleanShaderCode(e),
          this.cleanShaderCode(t)
        );
      case S.WebGL2:
        throw new Error(
          `Renderer API ${r.GetApiType()} is under construction`
        );
      default:
        throw new Error(
          `Renderer API ${r.GetApiType()} is not supported`
        );
    }
  }
  // Strip the first line of if the first line is empty
  static cleanShaderCode(e) {
    return e.replace(/^\s*\n/g, "");
  }
}
const bt = ut("");
function ut(n, e = !1) {
  const t = e ? "" : "\\w+";
  return new RegExp(
    `^@(?<decorator>Mist${n}(?:${t})?)\\s*?\\((?<value>.+)?\\)\\s*;*\\s*$`
  );
}
const At = ut("Shader"), z = {
  MistShaderVersion: 1,
  MistShaderBegin: 2,
  MistShaderEnd: 3,
  MistShaderType: 4
};
class St {
  constructor(e) {
    o(this, "parsed");
    o(this, "currentShaderType", "NONE");
    o(this, "currentShaderName", null);
    o(this, "currentLineNumber", 0);
    o(this, "isVersionSet", !1);
    this.source = e, this.parsed = {
      version: null,
      shaders: {}
    };
  }
  reset() {
    this.currentShaderName = null, this.currentLineNumber = 0, this.isVersionSet = !1, this.parsed = {
      version: null,
      shaders: {}
    };
  }
  parse(e) {
    return e && (this.source = e), new Promise((t, r) => {
      try {
        this.parseMistShader();
        const s = Object.keys(this.parsed.shaders).map(
          (i) => {
            const a = this.parsed.shaders[i];
            return {
              name: i,
              vertex: a.vertex,
              fragment: a.fragment
            };
          }
        );
        t(s);
      } catch (s) {
        r(s);
      }
    });
  }
  matchDecorator(e) {
    const t = e.match(At);
    if (t) {
      this.setShaderDecoratorValue(t);
      return;
    }
    throw new Error(`Invalid MistDecorator: ${e}`);
  }
  appendToCurrentShader(e) {
    if (this.currentShaderName !== null && this.currentShaderType !== "NONE" && this.parsed.shaders[this.currentShaderName] !== void 0) {
      const t = this.parsed.shaders[this.currentShaderName], r = this.currentShaderType;
      t[r] += e + `
`;
    }
  }
  parseMistShader() {
    const e = this.source.split(`
`);
    for (const t of e)
      if (this.currentLineNumber++, t !== "") {
        if (bt.test(t)) {
          this.matchDecorator(t);
          continue;
        }
        this.appendToCurrentShader(t);
      }
  }
  setShaderDecoratorValue(e) {
    if (!e.groups)
      throw new Error("Error parsing shader...");
    const t = e.groups.decorator, r = e.groups.value;
    switch (z[t]) {
      case z.MistShaderVersion: {
        if (this.isVersionSet)
          throw new Error("Mist.MistShaderParser: Version Already set");
        const s = parseInt(r);
        if (isNaN(s))
          throw new Error(
            `Mist.MistShaderParser: Version is not valid
 version: ${r}`
          );
        this.isVersionSet = !0, this.parsed.version = s;
        break;
      }
      case z.MistShaderBegin: {
        if (this.currentShaderName !== null)
          throw new Error(
            "Mist.MistShaderParser: Please End a shader before beginning a new shader"
          );
        if (this.parsed.shaders[r] !== void 0)
          throw new Error(
            `Mist.MistShaderParser: Shader with name '${r}' already exists`
          );
        this.currentShaderName = r, this.parsed.shaders[this.currentShaderName] = {
          vertex: this.getDefaultVertexShader(),
          fragment: this.getDefaultFragmentShader()
        };
        break;
      }
      case z.MistShaderType: {
        if (this.currentShaderName === null)
          throw new Error(
            "Please Begin a new Shader before setting the shader type"
          );
        switch (r) {
          case "vertex":
            this.currentShaderType = "vertex";
            break;
          case "fragment":
          case "pixel":
            this.currentShaderType = "fragment";
            break;
        }
        break;
      }
      case z.MistShaderEnd: {
        if (r != this.currentShaderName)
          throw new Error(
            `Mist.MistShaderParse: Error ending shader. shader ${r} haven't begin`
          );
        this.currentShaderType = "NONE", this.currentShaderName = null;
        break;
      }
      default:
        throw new Error(`Unknown shader decorator '${t}' `);
    }
  }
  getDefaultVertexShader() {
    return `#version 300 es
    uniform mat4 u_Transform;
    uniform mat4 u_ViewProjection;`;
  }
  getDefaultFragmentShader() {
    return `#version 300 es
    precision highp float; 
    `;
  }
}
class dt {
  /**
  	 * @param url  Preloaded url of the shader file preloaded_filepath#shaderName\
  	 * For example, if you used `Mist.ShaderLibrary.Preload('your-app', 'myShader.mist.glsl')`
  	to load a shader and you named your shader `basicShader` with `@MistShaderBegin(basicShader)`  then you would access the shader file like this
  
  	@example
  
  	```ts
  	Mist.ShaderLibrary.Load('myShader.mist.glsl/#basicShader');
  	// preloaded_filepath/#shaderName
  ```
  
  	 */
  static Load(e) {
    e = e.trim();
    const t = this.loadedShaders.get(e);
    if (!t)
      throw new Error(
        `MistShaderLibrary.Load: Shader not found '${e}'
Please preload the shader to the shader library or add a shader to the library`
      );
    return t;
  }
  static Add(e, t) {
    this.loadedShaders.set(e.trim(), t);
  }
  static async Preload(e, t) {
    const s = await (await fetch(t)).text(), a = await new St(s).parse(), h = e.getRenderer();
    for (const l of a) {
      const u = lt.Create(
        l.vertex,
        l.fragment,
        h
      ), p = t + "/";
      this.Add(`${p}#${l.name}`, u);
    }
  }
}
o(dt, "loadedShaders", /* @__PURE__ */ new Map());
const N = class N {
  get componentCount() {
    return this.toArray().length;
  }
  toFloat32() {
    return new Float32Array(this.toArray());
  }
  toArray() {
    return [...this];
  }
  toString() {
    var t, r;
    const e = this.toArray().map((s, i) => `${N.Components[i]}: ${s}`).join(", ");
    return `${(r = (t = Object.getPrototypeOf(this)) == null ? void 0 : t.constructor) == null ? void 0 : r.name} [ ${e} ]`;
  }
  *[Symbol.iterator]() {
    "x" in this && (yield this.x), "y" in this && (yield this.y), "z" in this && (yield this.z), "w" in this && (yield this.w);
  }
};
o(N, "Components", ["x", "y", "z", "w"]), o(N, "ConstructVectorFromArguments", (e, t) => {
  let [r, s, i, a] = t;
  t.length === 1 && (r = s = i = a = t[0]), "x" in e && (e.x = r ?? 0), "y" in e && (e.y = s ?? 0), "z" in e && (e.z = i ?? 0), "w" in e && (e.w = a ?? 0);
});
let R = N;
class k extends R {
  constructor(...t) {
    super();
    o(this, "x");
    o(this, "y");
    R.ConstructVectorFromArguments(this, t);
  }
  static new(...t) {
    return new k(...t);
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  set(...t) {
    this.x = t[0], this.y = t[1];
  }
  clone() {
    return new k(...this.toArray());
  }
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this;
  }
  // Math
  add(t) {
    const [r, s] = this.parseArgs(t);
    return this.x += r, this.y += s, this;
  }
  sub(t) {
    const [r, s] = this.parseArgs(t);
    return this.x -= r, this.y -= s, this;
  }
  mul(t) {
    if (typeof t == "number")
      return this.x *= t, this.y *= t, this;
    const [r, s] = this.parseArgs(t);
    return this.x *= r, this.y *= s, this;
  }
  div(t) {
    const [r, s] = this.parseArgs(t);
    if (r === 0 || s === 0)
      throw new Error("Division by zero");
    return this.x /= r, this.y /= s, this;
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
  }
  mag() {
    return Math.hypot(this.x, this.y);
  }
  magSq() {
    return this.x * this.x + this.y * this.y;
  }
  heading() {
    return Math.atan2(this.y, this.x);
  }
  normalize() {
    const t = this.mag();
    return t !== 0 ? this.div(k.new(t)) : this;
  }
  dot(t) {
    const [r, s] = this.parseArgs(t);
    return this.x * r + this.y * s;
  }
  cross(t) {
    const [r, s] = this.parseArgs(t);
    return this.x * r - this.y * s;
  }
  limit(t) {
    return this.magSq() > t * t ? this.normalize().mul(t) : this;
  }
  // Set the vector's magnitude to a specific value
  setMag(t) {
    return this.normalize().mul(t);
  }
  // Rotate the vector by an angle (in radians)
  rotate(t) {
    const r = Math.cos(t), s = Math.sin(t), i = this.x * r - this.y * s, a = this.x * s + this.y * r;
    return this.x = i, this.y = a, this;
  }
  parseArgs(t) {
    return t instanceof k ? t.toArray() : t;
  }
}
const $t = (...n) => new k(...n);
class T extends R {
  constructor(...t) {
    super();
    o(this, "x");
    o(this, "y");
    o(this, "z");
    R.ConstructVectorFromArguments(this, t);
  }
  static new(...t) {
    return new T(...t);
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setZ(t) {
    return this.z = t, this;
  }
  set(...t) {
    this.x = t[0], this.y = t[1], this.z = t[2];
  }
  clone() {
    return new T(...this.toArray());
  }
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this;
  }
  add(t) {
    const [r, s, i] = this.parseArgs(t);
    return this.x += r, this.y += s, this.z += i, this;
  }
  sub(t) {
    const [r, s, i] = this.parseArgs(t);
    return this.x -= r, this.y -= s, this.z -= i, this;
  }
  mul(t) {
    if (typeof t == "number")
      return this.x *= t, this.y *= t, this.z *= t, this;
    const [r, s, i] = this.parseArgs(t);
    return this.x *= r, this.y *= s, this.z *= i, this;
  }
  div(t) {
    let [r, s, i] = this.parseArgs(t);
    if (r === 0 || s === 0 || i === 0)
      throw new Error("Division by zero");
    return this.x /= r, this.y /= s, this.z /= i, this;
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
  }
  mag() {
    return Math.hypot(this.x, this.y, this.z);
  }
  magSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  normalize() {
    const t = this.mag();
    return t !== 0 ? this.div(T.new(t)) : this;
  }
  dot(t) {
    const [r, s, i] = this.parseArgs(t);
    return this.x * r + this.y * s + this.z * i;
  }
  cross(t) {
    const [r, s, i] = this.parseArgs(t);
    return new T(
      this.y * i - this.z * s,
      this.z * r - this.x * i,
      this.x * s - this.y * r
    );
  }
  limit(t) {
    return this.magSq() > t * t ? this.normalize().mul(t) : this;
  }
  setMag(t) {
    return this.normalize().mul(t);
  }
  rotate(t, r) {
    const [s, i, a] = this.parseArgs(r), h = Math.cos(t), l = Math.sin(t), u = this.x * (h + (1 - h) * s ** 2) + this.y * ((1 - h) * s * i - l * a) + this.z * ((1 - h) * s * a + l * i), p = this.x * ((1 - h) * s * i + l * a) + this.y * (h + (1 - h) * i ** 2) + this.z * ((1 - h) * i * a - l * s), f = this.x * ((1 - h) * s * a - l * i) + this.y * ((1 - h) * i * a + l * s) + this.z * (h + (1 - h) * a ** 2);
    return this.x = u, this.y = p, this.z = f, this;
  }
  parseArgs(t) {
    return t instanceof T ? t.toArray() : t;
  }
}
const jt = (...n) => new T(...n);
class G extends R {
  constructor(...t) {
    super();
    o(this, "x");
    o(this, "y");
    o(this, "z");
    o(this, "w");
    R.ConstructVectorFromArguments(this, t);
  }
  static new(...t) {
    return new G(...t);
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setZ(t) {
    return this.z = t, this;
  }
  setW(t) {
    return this.w = t, this;
  }
  set(...t) {
    this.x = t[0], this.y = t[1], this.z = t[2], this.w = t[3];
  }
  clone() {
    return new G(...this.toArray());
  }
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w, this;
  }
  add(t) {
    const [r, s, i, a] = this.parseArgs(t);
    return this.x += r, this.y += s, this.z += i, this.w += a, this;
  }
  sub(t) {
    const [r, s, i, a] = this.parseArgs(t);
    return this.x -= r, this.y -= s, this.z -= i, this.w -= a, this;
  }
  mul(t) {
    if (typeof t == "number")
      return this.x *= t, this.y *= t, this.z *= t, this.w *= t, this;
    const [r, s, i, a] = this.parseArgs(t);
    return this.x *= r, this.y *= s, this.z *= i, this.w *= a, this;
  }
  div(t) {
    const [r, s, i, a] = this.parseArgs(t);
    if (r === 0 || s === 0 || i === 0 || a === 0)
      throw new Error("Division by zero");
    return this.x /= t.x, this.y /= t.y, this.z /= t.z, this.w /= t.w, this;
  }
  dot(t) {
    const [r, s, i, a] = this.parseArgs(t);
    return this.x * r + this.y * s + this.z * i + this.w * a;
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
  }
  mag() {
    return Math.hypot(this.x, this.y, this.z, this.w);
  }
  magSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  normalize() {
    const t = this.mag();
    return t !== 0 ? this.div(G.new(t)) : this;
  }
  parseArgs(t) {
    return t instanceof G ? t.toArray() : t;
  }
}
const Xt = (...n) => new G(...n);
class v {
  constructor(...e) {
    o(this, "elements");
    this.elements = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ], e.length && this.set(...e);
  }
  static Ortho(...e) {
    const t = new v();
    return t.makeOrthographic(...e), t;
  }
  /**
   * Returns a Translation Matrix
   */
  static Translate(e) {
    const t = new v();
    return t.setPosition(e), t;
  }
  /**
   * Returns a Scale Matrix
   */
  static Scale(e) {
    const t = new v();
    return t.toScaleMat(e), t;
  }
  /**
   * Returns a translation matrix
   */
  static Rotate(e, t) {
    const r = new v(), s = Math.cos(e), i = Math.sin(e), a = 1 - s, h = t.x, l = t.y, u = t.z, p = a * h, f = a * l;
    return r.set(
      p * h + s,
      p * l - i * u,
      p * u + i * l,
      0,
      p * l + i * u,
      f * l + s,
      f * u - i * h,
      0,
      p * u - i * l,
      f * u + i * h,
      a * u * u + s,
      0,
      0,
      0,
      0,
      1
    ), r;
  }
  static PrettyPrint(e) {
    let t = "";
    for (let r = 0; r < 4; r++) {
      for (let s = 0; s < 4; s++)
        t += e.elements[r * 4 + s] + "	";
      t += `
`;
    }
    console.log(t);
  }
  // prettier-ignore
  set(...e) {
    const t = this.elements;
    return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], this;
  }
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  multiply(e) {
    return this.multiplyAndApply(this, e);
  }
  multiplyMat(...e) {
    for (const t of e)
      this.multiply(t);
    return this;
  }
  // prettier-ignore
  multiplyAndApply(e, t) {
    const r = e.elements, s = t.elements, i = this.elements, a = r[0], h = r[4], l = r[8], u = r[12], p = r[1], f = r[5], m = r[9], d = r[13], w = r[2], y = r[6], x = r[10], E = r[14], L = r[3], P = r[7], D = r[11], M = r[15], I = s[0], b = s[4], O = s[8], B = s[12], V = s[1], Y = s[5], $ = s[9], j = s[13], X = s[2], H = s[6], q = s[10], Z = s[14], J = s[3], Q = s[7], K = s[11], tt = s[15];
    return i[0] = a * I + h * V + l * X + u * J, i[4] = a * b + h * Y + l * H + u * Q, i[8] = a * O + h * $ + l * q + u * K, i[12] = a * B + h * j + l * Z + u * tt, i[1] = p * I + f * V + m * X + d * J, i[5] = p * b + f * Y + m * H + d * Q, i[9] = p * O + f * $ + m * q + d * K, i[13] = p * B + f * j + m * Z + d * tt, i[2] = w * I + y * V + x * X + E * J, i[6] = w * b + y * Y + x * H + E * Q, i[10] = w * O + y * $ + x * q + E * K, i[14] = w * B + y * j + x * Z + E * tt, i[3] = L * I + P * V + D * X + M * J, i[7] = L * b + P * Y + D * H + M * Q, i[11] = L * O + P * $ + D * q + M * K, i[15] = L * B + P * j + D * Z + M * tt, this;
  }
  // prettier-ignore
  multiplyScalar(e) {
    const t = this.elements;
    return t[0] *= e, t[4] *= e, t[8] *= e, t[12] *= e, t[1] *= e, t[5] *= e, t[9] *= e, t[13] *= e, t[2] *= e, t[6] *= e, t[10] *= e, t[14] *= e, t[3] *= e, t[7] *= e, t[11] *= e, t[15] *= e, this;
  }
  setPosition(...e) {
    const t = this.elements;
    return e.length === 1 ? (t[12] = e[0].x, t[13] = e[0].y, t[14] = e[0].z) : (t[12] = e[0], t[13] = e[1], t[14] = e[2]), this;
  }
  toScaleMat(...e) {
    let t, r, s;
    return e.length === 1 ? { x: t, y: r, z: s } = e[0] : [t, r, s] = e, this.set(
      t,
      0,
      0,
      0,
      0,
      r,
      0,
      0,
      0,
      0,
      s,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  // prettier-ignore
  scale(e) {
    const t = this.elements;
    return t[0] *= e.x, t[1] *= e.x, t[2] *= e.x, t[3] *= e.x, t[4] *= e.y, t[5] *= e.y, t[6] *= e.y, t[7] *= e.y, t[8] *= e.z, t[9] *= e.z, t[10] *= e.z, t[11] *= e.z, this;
  }
  setFromArray(e) {
    for (let t = 0; t < 16; t++)
      this.elements[t] = e[t];
    return this;
  }
  // prettier-ignore
  copyFrom(e) {
    const t = this.elements, r = e.elements;
    return t[0] = r[0], t[1] = r[1], t[2] = r[2], t[3] = r[3], t[4] = r[4], t[5] = r[5], t[6] = r[6], t[7] = r[7], t[8] = r[8], t[9] = r[9], t[10] = r[10], t[11] = r[11], t[12] = r[12], t[13] = r[13], t[14] = r[14], t[15] = r[15], this;
  }
  clone() {
    const e = new v();
    return e.copyFrom(this), e;
  }
  copyPosition(e) {
    const t = this.elements, r = e.elements;
    return t[12] = r[12], t[13] = r[13], t[14] = r[14], this;
  }
  // prettier-ignore
  makeOrthographic(e, t, r, s, i, a) {
    const h = 1 / (t - e), l = 1 / (s - r), u = 1 / (a - i), p = (t + e) * h, f = (r + s) * l, m = (a + i) * u, d = this.elements;
    return d[0] = 2 * h, d[1] = 0, d[2] = 0, d[3] = -p, d[4] = 0, d[5] = 2 * l, d[6] = 0, d[7] = -f, d[8] = 0, d[9] = 0, d[10] = -2 * u, d[11] = -m, d[12] = 0, d[13] = 0, d[14] = 0, d[15] = 1, this;
  }
  // prettier-ignore
  invert() {
    const e = this.elements, t = e[0], r = e[1], s = e[2], i = e[3], a = e[4], h = e[5], l = e[6], u = e[7], p = e[8], f = e[9], m = e[10], d = e[11], w = e[12], y = e[13], x = e[14], E = e[15], L = f * x * u - y * m * u + y * l * d - h * x * d - f * l * E + h * m * E, P = w * m * u - p * x * u - w * l * d + a * x * d + p * l * E - a * m * E, D = p * y * u - w * f * u + w * h * d - a * y * d - p * h * E + a * f * E, M = w * f * l - p * y * l - w * h * m + a * y * m + p * h * x - a * f * x, I = t * L + r * P + s * D + i * M;
    if (I === 0)
      return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const b = 1 / I;
    return e[0] = L * b, e[1] = (y * m * i - f * x * i - y * s * d + r * x * d + f * s * E - r * m * E) * b, e[2] = (h * x * i - y * l * i + y * s * u - r * x * u - h * s * E + r * l * E) * b, e[3] = (f * l * i - h * m * i - f * s * u + r * m * u + h * s * d - r * l * d) * b, e[4] = P * b, e[5] = (p * x * i - w * m * i + w * s * d - t * x * d - p * s * E + t * m * E) * b, e[6] = (w * l * i - a * x * i - w * s * u + t * x * u + a * s * E - t * l * E) * b, e[7] = (a * m * i - p * l * i + p * s * u - t * m * u - a * s * d + t * l * d) * b, e[8] = D * b, e[9] = (w * f * i - p * y * i - w * r * d + t * y * d + p * r * E - t * f * E) * b, e[10] = (a * y * i - w * h * i + w * r * u - t * y * u - a * r * E + t * h * E) * b, e[11] = (p * h * i - a * f * i - p * r * u + t * f * u + a * r * d - t * h * d) * b, e[12] = M * b, e[13] = (p * y * s - w * f * s + w * r * m - t * y * m - p * r * x + t * f * x) * b, e[14] = (w * h * s - a * y * s - w * r * l + t * y * l + a * r * x - t * h * x) * b, e[15] = (a * f * s - p * h * s + p * r * l - t * f * l - a * r * m + t * h * m) * b, this;
  }
  toArray() {
    return [...this.elements];
  }
}
const g = class g {
  static degToRad(e) {
    return e * this.DEG_TO_RAD;
  }
  static radToDeg(e) {
    return e * this.RAD_TO_DEG;
  }
  static lerp(e, t, r) {
    return e + (t - e) * r;
  }
  static map(e, t, r, s, i, a = !1) {
    return a && (e = this.clamp(e, t, r)), (e - t) * ((i - s) / (r - t)) + s;
  }
  static clamp(e, t, r) {
    return this.min(r, this.max(t, e));
  }
  static isBetween(e, t, r) {
    return e >= t && e <= r;
  }
};
o(g, "PI", Math.PI), o(g, "TAU", g.PI * 2), o(g, "HALF_PI", g.PI / 2), o(g, "DEG_TO_RAD", g.PI / 180), o(g, "RAD_TO_DEG", 180 / g.PI), o(g, "min", Math.min), o(g, "max", Math.max), o(g, "floor", Math.floor), o(g, "random", Math.random), o(g, "ceil", Math.ceil), o(g, "round", Math.round), o(g, "cos", Math.cos), o(g, "sin", Math.sin), o(g, "tan", Math.tan), o(g, "atan", Math.atan), o(g, "atan2", Math.atan2), o(g, "sqrt", Math.sqrt), o(g, "pow", Math.pow), o(g, "log", Math.log), o(g, "sign", Math.sign);
let ot = g;
class it extends U {
  constructor(t) {
    super();
    o(this, "canvas");
    o(this, "API");
    o(this, "renderAPI");
    o(this, "currentViewProjection");
    this.canvas = t, this.API = S.WebGL2, this.renderAPI = new ct(this.canvas);
  }
  get width() {
    return this.canvas.width;
  }
  get aspect() {
    return this.canvas.width / this.canvas.height;
  }
  get height() {
    return this.canvas.height;
  }
  get canvasWidth() {
    return this.canvas.clientWidth;
  }
  get canvasHeight() {
    return this.canvas.clientHeight;
  }
  Is() {
    return this instanceof it;
  }
  BeginScene(t) {
    this.currentViewProjection = t.viewProjection;
  }
  Submit(t, r, s) {
    this.currentViewProjection === void 0 && console.warn("Please Begin a scene before submitting to the Renderer");
    const i = this.GetRenderAPI(), a = r;
    a.use(), a.setUniformMat4(
      "u_ViewProjection",
      this.currentViewProjection || new v()
    ), a.setUniformMat4("u_Transform", s), t.use(), i.DrawIndexed(t);
  }
  EndScene() {
    this.currentViewProjection = void 0;
  }
  Resize() {
    const t = this.canvas, r = window.devicePixelRatio || 1, s = Math.round(t.clientWidth * r), i = Math.round(t.clientHeight * r);
    (s !== t.width || i !== t.height) && (t.width = s, t.height = i, this.dispatchEvent({
      type: MistEventType.RendererResize,
      width: t.width,
      height: t.height,
      target: this
    }));
  }
  getNativeContext() {
    return this.GetRenderAPI().inner;
  }
  GetRenderAPI() {
    return this.renderAPI;
  }
  GetApiType() {
    return this.API;
  }
}
class vt {
  constructor(e, t) {
    o(this, "buffer");
    o(this, "layout");
    o(this, "_gl");
    const r = W(e);
    this._gl = r;
    const s = r.createBuffer();
    if (!s)
      throw new Error("Error creating vertex buffer");
    r.bindBuffer(r.ARRAY_BUFFER, s), r.bufferData(r.ARRAY_BUFFER, t, r.STATIC_DRAW), this.buffer = s;
  }
  setLayout(e) {
    this.layout = e;
  }
  getLayout() {
    return this.layout;
  }
  delete() {
    this._gl.deleteBuffer(this.buffer);
  }
  use() {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.buffer);
  }
  detach() {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
  }
}
class _t {
  constructor(e, t) {
    o(this, "buffer");
    o(this, "_gl");
    o(this, "count");
    const r = W(e);
    this._gl = r, this.count = t.length;
    const s = r.createBuffer();
    if (!s)
      throw new Error("Error creating index buffer");
    r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, s), r.bufferData(r.ELEMENT_ARRAY_BUFFER, t, r.STATIC_DRAW), this.buffer = s;
  }
  getCount() {
    return this.count;
  }
  use() {
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this.buffer);
  }
  detach() {
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, null);
  }
  delete() {
    this._gl.deleteBuffer(this.buffer);
  }
}
var pt = /* @__PURE__ */ ((n) => (n[n.Float = 0] = "Float", n[n.Bool = 1] = "Bool", n[n.Float2 = 2] = "Float2", n[n.Float3 = 3] = "Float3", n[n.Float4 = 4] = "Float4", n[n.Int = 5] = "Int", n[n.Int2 = 6] = "Int2", n[n.Int3 = 7] = "Int3", n[n.Int4 = 8] = "Int4", n[n.Mat3 = 9] = "Mat3", n[n.Mat4 = 10] = "Mat4", n))(pt || {});
class Tt {
  constructor({ name: e, type: t, location: r, normalized: s }) {
    o(this, "name");
    o(this, "type");
    o(this, "location");
    o(this, "offset");
    o(this, "componentCount");
    o(this, "size");
    o(this, "normalized");
    this.name = e, this.type = t, this.location = r, this.offset = 0, this.componentCount = Dt(t), this.size = Mt(t), this.normalized = !!s;
  }
}
class Rt {
  constructor(e) {
    o(this, "bufferElements");
    o(this, "_stride", 0);
    if (e.length === 0)
      throw new Error("Layout cannot be empty");
    this.bufferElements = this.constructBufferElements(e), this.calculateOffsetsAndStrides();
  }
  calculateOffsetsAndStrides() {
    let e = 0;
    this.bufferElements.forEach((t) => {
      t.offset = e, e += t.size, this._stride += t.size;
    });
  }
  get stride() {
    return this._stride;
  }
  get elements() {
    return this.bufferElements;
  }
  constructBufferElements(e) {
    const t = /* @__PURE__ */ new Set();
    return e.map((r) => {
      if (t.has(r.location))
        throw console.error(
          `Location '${location}' is already set in layout`,
          r
        ), "";
      return t.add(r.location), new Tt(r);
    });
  }
  [Symbol.iterator]() {
    let e = 0;
    return {
      next: () => e < this.elements.length ? { value: this.elements[e++], done: !1 } : { value: void 0, done: !0 }
    };
  }
}
class Lt {
  /**
   * Creates a vertex buffer based on the given renderer API
   */
  static Create(e, t) {
    var r;
    if (t = t || ((r = _.getCurrent()) == null ? void 0 : r.getRenderer()), !t)
      throw new Error(
        "Mist.VertexBuffer Create called without an active context. Please use this inside a Mist.App or Mist.Layer or provide a Mist.Renderer as arg[2] for context"
      );
    switch (t.GetApiType()) {
      case S.WebGL2:
        return new vt(t, e);
      case S.WebGPU:
        throw new Error(
          `Renderer API ${t.GetApiType()} is under construction`
        );
      default:
        throw new Error(
          `Renderer API ${t.GetApiType()} is not supported`
        );
    }
  }
}
class Pt {
  /**
   * Creates a index buffer based on the given renderer API
   */
  static Create(e, t) {
    var r;
    if (t = t || ((r = _.getCurrent()) == null ? void 0 : r.getRenderer()), !t)
      throw new Error(
        "Mist.IndexBuffer Create called without an active context. Please use this inside a Mist.App or Mist.Layer or provide a Mist.Renderer as arg[2] for context"
      );
    switch (t.GetApiType()) {
      case S.WebGL2:
        return new _t(t, e);
      case S.WebGPU:
        throw new Error(
          `Renderer API ${t.GetApiType()} is under construction`
        );
      default:
        throw new Error(
          `Renderer API ${t.GetApiType()} is not supported`
        );
    }
  }
}
function Dt(n) {
  switch (n) {
    case 0:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 1;
    case 6:
      return 2;
    case 7:
      return 3;
    case 8:
      return 4;
    case 9:
      return 3 * 3;
    case 10:
      return 4 * 4;
    case 1:
      return 1;
    default:
      throw new Error("Unsupported shader data type");
  }
}
function Mt(n) {
  switch (n) {
    case 0:
      return 4;
    case 2:
      return 4 * 2;
    case 3:
      return 4 * 3;
    case 4:
      return 4 * 4;
    case 5:
      return 4;
    case 6:
      return 4 * 2;
    case 7:
      return 4 * 3;
    case 8:
      return 4 * 4;
    case 9:
      return 4 * 3 * 3;
    case 10:
      return 4 * 4 * 4;
    case 1:
      return 1;
    default:
      throw new Error("Unknown shader data type");
  }
}
var C;
((n) => {
  n.BYTE = 5120, n.UNSIGNED_BYTE = 5121, n.SHORT = 5122, n.UNSIGNED_SHORT = 5123, n.INT = 5124, n.UNSIGNED_INT = 5125, n.FLOAT = 5126, n.BOOL = 35670;
})(C || (C = {}));
function It(n) {
  switch (n) {
    case 0:
    case 2:
    case 3:
    case 4:
    case 9:
    case 10:
      return C.FLOAT;
    case 5:
    case 6:
    case 7:
    case 8:
      return C.INT;
    case 1:
      return C.BOOL;
    default:
      throw new Error("Unknown shader data type");
  }
}
class Ft {
  constructor(e) {
    o(this, "_gl");
    o(this, "vao");
    o(this, "indexBuffer");
    o(this, "vertexBuffers");
    this._gl = W(e), this.vertexBuffers = [];
    const t = this._gl.createVertexArray();
    if (!t)
      throw new Error("Error creating WebGL Vertex Array");
    this.vao = t, this._gl.bindVertexArray(t);
  }
  use() {
    this._gl.bindVertexArray(this.vao);
  }
  detach() {
    this._gl.bindVertexArray(null);
  }
  delete() {
    this._gl.deleteVertexArray(this.vao);
  }
  getVertexBuffers() {
    return this.vertexBuffers;
  }
  getIndexBuffer() {
    return this.indexBuffer;
  }
  addVertexBuffer(e) {
    const t = this._gl;
    t.bindVertexArray(this.vao), e.use();
    const r = e.getLayout();
    if (r === void 0)
      throw new Error("Vertex buffer has no layout set");
    for (const s of r)
      t.enableVertexAttribArray(s.location), t.vertexAttribPointer(
        s.location,
        s.componentCount,
        It(s.type),
        s.normalized,
        r.stride,
        s.offset
      );
    this.vertexBuffers.push(e);
  }
  setIndexBuffer(e) {
    this._gl.bindVertexArray(this.vao), e.use(), this.indexBuffer = e;
  }
}
class kt {
  static Create(e) {
    var t;
    if (e = e || ((t = _.getCurrent()) == null ? void 0 : t.getRenderer()), !e)
      throw new Error(
        "Mist.VertexArray Create called without an active context. Please use this inside a Mist.App or Mist.Layer or provide a Mist.Renderer as arg[1] for context"
      );
    switch (e.GetApiType()) {
      case S.WebGL2:
        return new Ft(e);
      case S.WebGPU:
        throw new Error("VertexArray for WEBGL2 is not implemented yet");
      default:
        throw new Error(
          `Unsupported Renderer Api '${e.GetApiType()}' for creating VertexArray`
        );
    }
  }
}
function at(n) {
  return (n & n - 1) == 0;
}
class Gt {
  constructor(e, t) {
    o(this, "_gl");
    o(this, "texture");
    o(this, "isLoaded");
    this._gl = W(e);
    let r = rt.GetImageForTexture(t);
    if (this.isLoaded = !!r, r)
      this.setup(r);
    else {
      const s = new Image();
      s.onload = () => {
        this.isLoaded = !0, this.setup(s);
      }, s.src = t;
    }
  }
  setup(e) {
    const t = this._gl, r = t.createTexture();
    if (!r)
      throw new Error("Error creating texture");
    this.texture = r, t.bindTexture(t.TEXTURE_2D, r), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e), at(e.width) && at(e.height) ? t.generateMipmap(t.TEXTURE_2D) : (t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR));
  }
  use(e) {
    if (this.isLoaded) {
      e = e ?? 0;
      const t = this._gl;
      t.activeTexture(t.TEXTURE0 + e), t.bindTexture(t.TEXTURE_2D, this.texture);
    }
  }
  detach() {
    const e = this._gl;
    e.bindTexture(e.TEXTURE_2D, null);
  }
  delete() {
    this._gl.deleteTexture(this.texture);
  }
}
class ft {
  /**
   * @param renderer
   * @param name The preloaded file name
   */
  static Create(e, t) {
    var r;
    if (t = t || ((r = _.getCurrent()) == null ? void 0 : r.getRenderer()), !t)
      throw new Error(
        "Mist.Texture Create called without an active context. Please use this inside a Mist.App or Mist.Layer or provide a Mist.Renderer as arg[2] for context"
      );
    switch (t.GetApiType()) {
      case S.WebGL2:
        return new Gt(t, e);
      case S.WebGL2:
        throw new Error(
          `Renderer API ${t.GetApiType()} is under construction`
        );
      default:
        throw new Error(
          `Renderer API ${t.GetApiType()} is not supported`
        );
    }
  }
}
class zt {
  constructor() {
    o(this, "layerStack");
    this.layerStack = [];
  }
  pushLayer(e) {
    this.layerStack.unshift(e);
  }
  pushOverlay(e) {
    this.layerStack.push(e);
  }
  popLayer(e) {
    const t = this.layerStack.findIndex((r) => r === e);
    t >= 0 && this.layerStack.splice(t, 1);
  }
  popOverlay(e) {
    const t = this.layerStack.findIndex((r) => r === e);
    t >= 0 && this.layerStack.splice(t, 1);
  }
  [Symbol.iterator]() {
    let e = 0;
    return {
      next: () => e < this.layerStack.length ? { value: this.layerStack[e++], done: !1 } : { value: null, done: !0 }
    };
  }
  reversed() {
    let e = this.layerStack.length - 1;
    return {
      next: () => e >= 0 ? { value: this.layerStack[e--], done: !1 } : { value: void 0, done: !0 },
      [Symbol.iterator]: function() {
        return this;
      }
    };
  }
}
const Ct = new et({ name: "App" });
class Nt extends U {
  constructor({ name: t, canvas: r, rendererAPI: s }) {
    super();
    o(this, "_allowPerformanceMetrics");
    o(this, "appName");
    o(this, "input");
    o(this, "layerStack");
    o(this, "renderer");
    o(this, "isRunning");
    o(this, "lastTime");
    o(this, "currentFrameId");
    o(this, "onInputKeyDown", (t) => {
      for (const r of this.layerStack.reversed())
        r.onKeyDown && r.onKeyDown(t);
    });
    o(this, "onInputKeyUp", (t) => {
      for (const r of this.layerStack.reversed())
        r.onKeyUp && r.onKeyUp(t);
    });
    o(this, "onInputMouseDown", (t) => {
      for (const r of this.layerStack.reversed())
        r.onMouseDown && r.onMouseDown(t);
    });
    o(this, "onInputMouseUp", (t) => {
      for (const r of this.layerStack.reversed())
        r.onMouseUp && r.onMouseUp(t);
    });
    o(this, "onInputMouseMove", (t) => {
      for (const r of this.layerStack.reversed())
        r.onMouseMove && r.onMouseMove(t);
    });
    o(this, "onInputMouseWheel", (t) => {
      for (const r of this.layerStack.reversed())
        r.onMouseWheel && r.onMouseWheel(t);
    });
    this._allowPerformanceMetrics = !1, this.appName = t, this.layerStack = new zt(), this.input = new F(r), this.isRunning = !1, this.lastTime = 0, this.initRenderer(s, r), this.initPerformanceMatrices(), F.Init(), this.addInputEventListeners();
  }
  get name() {
    return this.appName;
  }
  get performance() {
    const t = this;
    return !t || !this._allowPerformanceMetrics ? { averageFps: 0 } : { averageFps: t.__performance__.averageFPS };
  }
  getRenderer() {
    return this.renderer;
  }
  getRenderingAPI() {
    return this.renderer.GetRenderAPI();
  }
  setRunning(t) {
    this.isRunning = t;
  }
  Run() {
    this._run();
  }
  /*
   Pauses a Mist Application
   */
  Pause() {
    this._stop();
  }
  /*
   Completely kills the App and remove alls the input events. Global keyboard events are preserved 
   */
  ShutDown() {
    this._stop(), this.dispatchEvent({ type: MistEventType.AppShutDown, target: this }), this.input.destroy();
  }
  /*
    Stops and restarts the app 
   */
  Restart() {
    this._restartApp();
  }
  onAttach() {
    throw new Error("MistAppBase: onAttach should be overridden");
  }
  onTick(t) {
    throw new Error("MistAppBase: onTick Method should be overridden");
  }
  onDetach() {
    throw new Error("MistAppBase: onDetach should be overridden");
  }
  loop(t) {
    if (!this.isRunning)
      return;
    const r = t - this.lastTime;
    this._allowPerformanceMetrics && this.updatePerformanceMatrices(r), this.lastTime || (this.lastTime = t), _.setCurrent(this), this.renderer.Resize(), this.onTick(r), this.lastTime = t, this.currentFrameId = requestAnimationFrame(this.loop.bind(this));
  }
  updatePerformanceMatrices(t, r = 1e3) {
    if (!t)
      return;
    const s = 1e3 / t, i = this;
    if (!i)
      return;
    i.__performance__.fpsReadings.push(s);
    const a = performance.now(), h = i.__performance__.performanceLastTime;
    if (a - h > r) {
      const l = i.__performance__.fpsReadings, u = l.reduce((p, f) => f + p, 0) / l.length;
      i.__performance__.averageFPS = u, i.__performance__.fpsReadings = [], i.__performance__.performanceLastTime = a;
    }
  }
  _run() {
    if (this.isRunning)
      throw new Error(`App: '${this.appName}' is already running!`);
    this.dispatchEvent({ type: MistEventType.AppStart, target: this }), _.setCurrent(this), this.onAttach(), this.setRunning(!0), Ct.log("Using {0}", this.renderer.GetApiType()), this.currentFrameId = requestAnimationFrame(this.loop.bind(this));
  }
  _stop() {
    this.currentFrameId && cancelAnimationFrame(this.currentFrameId), this.setRunning(!1), this.currentFrameId = void 0, _.setCurrent(this);
    for (const t of this.layerStack.reversed())
      t.onDetach();
  }
  _restartApp() {
    this._stop(), this.dispatchEvent({ type: MistEventType.AppRestart, target: this }), this.Run();
  }
  initRenderer(t, r) {
    switch (t) {
      case S.WebGL2:
        this.renderer = new it(r);
        break;
      case S.WebGPU:
        throw new Error("Implement WebGPU Renderer");
      default:
        throw new Error(`Renderer Api ${t} is not supported!`);
    }
  }
  pushLayer(t, ...r) {
    const s = new t(...r);
    this.provideContextToLayer(s), this.layerStack.pushLayer(s);
  }
  pushOverlay(t, ...r) {
    const s = new t(...r);
    this.provideContextToLayer(s), this.layerStack.pushOverlay(s);
  }
  provideContextToLayer(t) {
    const r = {
      App: this,
      RenderAPI: this.renderer.GetRenderAPI(),
      Renderer: this.renderer,
      Input: this.input
    };
    Object.defineProperty(t, "__context__", {
      value: r,
      writable: !1
    });
  }
  initPerformanceMatrices() {
    this._allowPerformanceMetrics && Object.assign(this, {
      __performance__: {
        averageFPS: 0,
        fpsReadings: [],
        performanceLastTime: 0
      }
    });
  }
  // prettier-ignore
  addInputEventListeners() {
    F.globalDispatch.addEventListener(MistEventType.KeyDown, this.onInputKeyDown), F.globalDispatch.addEventListener(MistEventType.KeyUp, this.onInputKeyUp), this.input.addEventListener(MistEventType.MouseDown, this.onInputMouseDown), this.input.addEventListener(MistEventType.MouseMove, this.onInputMouseMove), this.input.addEventListener(MistEventType.MouseUp, this.onInputMouseUp), this.input.addEventListener(MistEventType.MouseWheel, this.onInputMouseWheel);
  }
}
const Ut = new et({ name: "App" });
class Wt extends Nt {
  constructor(e) {
    super(e), _.setCurrent(this);
  }
  onAttach() {
    for (const e of this.layerStack.reversed())
      e.onAttach();
  }
  onTick(e) {
    for (const t of this.layerStack.reversed())
      t.onUpdate(e);
  }
  onDetach() {
    for (const e of this.layerStack.reversed())
      e.onDetach();
  }
}
const Ot = async (n) => {
  Et();
  let e = n(), t;
  e instanceof Promise ? t = await e : t = e, t.dispatchEvent({ type: MistEventType.AppReady, target: t }), t.Run(), Ut.log(`{0}
	 {1}`, "Radha Vallabh Shri Harivansh", "Radhey Shyam");
};
class Bt {
  constructor(e) {
    o(this, "_name");
    this._name = e;
  }
  get name() {
    return this._name;
  }
  getContext() {
    return this.__context__;
  }
  onAttach() {
  }
  onUpdate(e) {
  }
  onDetach() {
  }
}
class Vt extends U {
  constructor(t, r, s, i, a = -1, h = 1) {
    super();
    o(this, "projectionMatrix");
    o(this, "viewMatrix");
    o(this, "viewProjectionMatrix");
    o(this, "_position");
    o(this, "_rotation");
    this.projectionMatrix = v.Ortho(t, r, s, i, a, h), this.viewMatrix = new v(), this._position = new T(0), this._rotation = 0, this.viewProjectionMatrix = new v();
  }
  get position() {
    return this._position;
  }
  get viewProjection() {
    return this.viewProjectionMatrix;
  }
  get view() {
    return this.viewMatrix;
  }
  get projection() {
    return this.projectionMatrix;
  }
  setPosition(t) {
    this._position = t, this.recalculateViewProjection();
  }
  setRotation(t) {
    this._rotation = t, this.recalculateViewProjection();
  }
  updateProjection(t, r, s, i, a = -1, h = 1) {
    this.projection.makeOrthographic(t, r, s, i, a, h), this.recalculateViewProjection();
  }
  recalculateViewProjection() {
    const t = v.Translate(this._position).multiply(
      v.Rotate(this._rotation, new T(0, 0, 1))
    );
    this.viewMatrix = t.invert(), this.viewProjectionMatrix = new v().multiplyMat(
      this.projectionMatrix,
      this.viewMatrix
    );
  }
}
const Ht = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Application: Wt,
  BufferLayout: Rt,
  CreateApp: Ot,
  IndexBuffer: Pt,
  Key: st,
  Layer: Bt,
  MistInput: F,
  OrthographicCamera: Vt,
  RendererAPI: S,
  Shader: lt,
  ShaderDataType: pt,
  ShaderLibrary: dt,
  Texture: ft,
  TextureLibrary: rt,
  VertexArray: kt,
  VertexBuffer: Lt
}, Symbol.toStringTag, { value: "Module" }));
export {
  v as Matrix4,
  Ht as Mist,
  ot as MthX,
  k as Vector2,
  T as Vector3,
  G as Vector4,
  $t as vec2,
  jt as vec3,
  Xt as vec4
};
