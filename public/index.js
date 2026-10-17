/* eslint-disable no-undef */
//pass your public key from tap's dashboard

/* eslint-disable no-unused-expressions */
var currencycode = null,
  objectToQueryString = function (t, e) {
    var n,
      i,
      o = [];
    for (var r in t)
      t.hasOwnProperty(r) &&
        ((n = ~r.indexOf("[")
          ? e
            ? e +
              "[" +
              r.substring(0, r.indexOf("[")) +
              "]" +
              r.substring(r.indexOf("["))
            : r
          : e
          ? e + "[" + r + "]"
          : r),
        (i = t[r]),
        o.push(
          "object" == typeof i
            ? objectToQueryString(i, n)
            : n + "=" + encodeURIComponent(i)
        ));
    return o.join("&");
  },
  lock = !1;

function detect_details() {
  return new Promise(function (t, e) {
    var n = new XMLHttpRequest();
    (n.onreadystatechange = function () {
      if (4 == this.readyState && 200 == this.status)
        return t({ ip: JSON.parse(this.responseText).ip });
    }),
      n.open(
        "GET",
        "https://partners.payments.tap.company/api/v1.3/iploc.aspx",
        !0
      ),
      n.send();
  });
}

function Tapjsli(t, e = null) {
  var n = null;
  if (0 === t.indexOf("sk_"))
    throw new Error(
      "You should not use your secret key with Tapjsli.js.\n        Please pass a publishable key instead."
    );
  if (0 === t.indexOf("pk_live_") && "http:" == window.location.protocol)
    throw new Error(
      "Live Tapjsli.js integrations must use HTTPS. live public key implementations should use ssl implementation, while sandbox public key can be used over http protocol implementation."
    );
  if (0 !== t.indexOf("pk_")) throw new Error("Invalid Public key given");
  0 === t.indexOf("pk_test_") && (n = "sandbox-card.payments.tap.company"),
    0 === t.indexOf("pk_live_") && (n = "secure.gosell.io");
  var i = n + "/tappaymentwidget/public/";
  if ("" === t)
    throw new Error(
      "Please call Tapjsli() with your publishable key. You used an empty string."
    );
  !(function (t) {
    if ("http:" == window.location.protocol && 0 === t.indexOf("pk_live"))
      throw new Error(
        "Live Tapjsli.js integrations must use HTTPS. live public key implementations should use ssl implementation, while sandbox public key can be used over http protocol implementation."
      );
    var e = window.location.protocol;
    ["https:", "file:"].indexOf(e),
      ["localhost", "127.0.0.1", "0.0.0.0"].indexOf(window.location.hostname);
  })(t);
  try {
    (this._apiKey = t), (this._mid = e), (this._encryption_key = "sdfds");
  } catch (t) {}
  return (
    (this.tds = ""),
    (this.getInfo = function () {
      return this;
    }),
    (this.statusFocus = function (t, e) {}),
    (this.createToken = function (t, e) {
      if (1 != lock)
        return (
          (lock = !0),
          new Promise(function (t, e) {
            document.getElementById("myFrame").contentWindow.postMessage(
              {
                action: "submit",
                key: this._apiKey,
                encryption_key: this._encryption_key,
              },
              window.location.protocol + "//" + i + "/tap_payment_widget_ui"
            ),
              window.addEventListener(
                "message",
                function (e) {
                  if (this.card) var n = this.card._iframe;
                  else var n = document.getElementById("myFrame");
                  0 === n.src.indexOf(e.origin) &&
                    (e.data.error && ((lock = !1), t(e.data)),
                    "token" == e.data.type &&
                      e.data.data &&
                      ((lock = !1), t(e.data.data.result)),
                    "token" == e.data.type && ((lock = !1), t(e.data)));
                },
                !1
              );
          })
        );
    }),
    (this.elements = function (n) {
      return (
        (this.elements.card = {}),
        (this.elements.card.getCurrency = function () {
          return currencyCode;
        }),
        (this.elements.card.currency = function (t) {
          return new Promise(function (e, n) {
            null != document.getElementById("myFrame") &&
              ((currencyCode = t),
              document
                .getElementById("myFrame")
                .contentWindow.postMessage(
                  { action: "currency", key: this._apiKey, currency: t },
                  window.location.protocol + "//" + i + "/tap_payment_widget_ui"
                ));
          });
        }),
        (this.elements.card.clearForm = function () {
          return new Promise(function (t, e) {
            null != document.getElementById("myFrame") &&
              document
                .getElementById("myFrame")
                .contentWindow.postMessage(
                  { action: "clearForm", key: this._apiKey },
                  window.location.protocol + "//" + i + "/tap_payment_widget_ui"
                );
          });
        }),
        (this.elements.card.blurForm = function () {
          return new Promise(function (t, e) {
            null != document.getElementById("myFrame") &&
              document
                .getElementById("myFrame")
                .contentWindow.postMessage(
                  { action: "blurForm", key: this._apiKey },
                  window.location.protocol + "//" + i + "/tap_payment_widget_ui"
                );
          });
        }),
        (this.elements.card.mount = function (t) {
          var e = document.querySelector(t),
            n = document.createElement("div");

          n.setAttribute("id", "privateTapElement"),
            n.setAttribute(
              "style",
              "height:inherit;margin: 0px !important; padding: 0px !important; border: medium none !important; display: block !important; background: transparent none repeat scroll 0% 0% !important; position: relative !important; opacity: 1 !important; width:100%;"
            ),
            e.appendChild(n),
            n.appendChild(this._iframe);
        }),
        (this.elements.card.addEventListener = function (t, e) {
          if (
            (window.addEventListener(
              "message",
              function (t) {
                if (0 === n.src.indexOf(t.origin)) {
                  if (t.data.layout) {
                    var o = document.getElementById("myFrame");
                    o.setAttribute("height", t.data.layout.height),
                      e({ loaded: !0 }),
                      detect_details().then(function (t) {
                        var e =
                          document.getElementById("myFrame").contentWindow;
                        e.postMessage(
                          {
                            action: "client_ip",
                            key: this._apiKey,
                            client_ip: t.ip,
                          },
                          window.location.protocol +
                            "//" +
                            i +
                            "/tap_payment_widget"
                        );
                      });
                  }
                  1 == t.data.success && t.data.BIN && "token" != t.data.type
                    ? ((this.tds = t.data), e(t.data))
                    : e(t.data);
                }
              },
              !1
            ),
            this.card)
          )
            var n = this.card._iframe;
          else n = document.getElementById("myFrame");
        }),
        (this.elements.create = function (n, o, r) {
          this.card.type = n;
          var a = document.createElement("IFRAME");
          return (
            a.setAttribute("id", "myFrame"),
            a.setAttribute("name", "myFrame"),
            a.setAttribute("title", "Secure payment input"),
            a.setAttribute("allowpaymentrequest", "true"),
            a.setAttribute(
              "style",
              "border: none !important;margin: 0px !important;padding: 0px !important;min-width: 100% !important;overflow: hidden !important;display: block !important;"
            ),
            a.setAttribute(
              "src",
              window.location.protocol +
                "//" +
                i +
                "/tap_payment_widget_ui?" +
                objectToQueryString(o) +
                "&mid=" +
                e +
                "&key=" +
                t +
                "&" +
                objectToQueryString(r)
            ),
            (this.card._iframe = a),
            (currencyCode = r.currencyCode),
            this.card
          );
        }),
        (this.elements.options = n),
        this.elements
      );
    }),
    this
  );
}

var tap = Tapjsli("pk_test_OZL80X7EvjRmtKASaQzTN1ei");

var elements = tap.elements({});
var style = {
  base: {
    color: "#535353",
    lineHeight: "18px",
    fontFamily: "sans-serif",
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "rgba(0, 0, 0, 0.26)",
      fontSize: "15px",
    },
  },
  invalid: {
    color: "red",
  },
};
// input labels/placeholders
var labels = {
  cardNumber: "Card Number",
  expirationDate: "MM/YY",
  cvv: "CVV",
  cardHolder: "Card Holder Name",
};
//payment options
var paymentOptions = {
  currencyCode: ["KWD", "USD", "SAR"],
  labels: labels,
  TextDirection: "ltr",
};
//create element, pass style and payment options
var card = elements.create("card", { style: style }, paymentOptions);
//mount element

card.mount("#element-container");

//card change event listener
