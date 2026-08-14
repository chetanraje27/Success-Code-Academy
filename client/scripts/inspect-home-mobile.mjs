const port = process.argv[2] || "9223";
const pages = await fetch(`http://localhost:${port}/json`).then((response) => response.json());
const page = pages.find((item) => item.type === "page" && item.url === "http://localhost:3000/");

if (!page) {
  throw new Error("Home page target not found");
}

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));

let requestId = 0;
const pendingRequests = new Map();

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  const pending = pendingRequests.get(message.id);
  if (!pending) return;
  pendingRequests.delete(message.id);
  if (message.error) pending.reject(new Error(JSON.stringify(message.error)));
  else pending.resolve(message.result);
});

function request(method, params = {}) {
  requestId += 1;
  socket.send(JSON.stringify({ id: requestId, method, params }));
  return new Promise((resolve, reject) => {
    pendingRequests.set(requestId, { resolve, reject });
  });
}

const width = Number(process.argv[3] || "380");
await request("Emulation.setDeviceMetricsOverride", {
  width,
  height: 900,
  deviceScaleFactor: 1,
  mobile: true,
});
await request("Page.reload", { ignoreCache: true });

const expression = `new Promise((resolve) => setTimeout(() => {
  const rect = (element) => {
    if (!element) return null;
    const bounds = element.getBoundingClientRect();
    return Object.fromEntries(
      ["x", "y", "width", "height", "right", "bottom"].map((key) => [key, Math.round(bounds[key] * 10) / 10]),
    );
  };

  resolve(JSON.stringify({
    viewport: {
      width: innerWidth,
      height: innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
    },
    header: rect(document.querySelector(".stars-header")),
    button: rect(document.querySelector(".results-button")),
    featured: rect(document.querySelector(".featured-card")),
    support: [...document.querySelectorAll(".support-card")].map(rect),
    years: [...document.querySelectorAll(".support-year")].map((element) => ({
      text: element.textContent,
      rect: rect(element),
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
      whiteSpace: getComputedStyle(element).whiteSpace,
    })),
    copies: [...document.querySelectorAll(".support-copy")].map(rect),
    images: [...document.querySelectorAll(".support-student-image")].map(rect),
  }));
}, 3500))`;

const evaluated = await request("Runtime.evaluate", {
  expression,
  awaitPromise: true,
  returnByValue: true,
});
const result = JSON.parse(evaluated.result.value);

console.log(JSON.stringify(result, null, 2));
socket.close();
