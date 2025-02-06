import { renderJSON } from "./jsonRenderer.js";
import { addData, deleteDatabase, getAllData, getData } from "./indexdb.js";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const api_world = window.api;

const response_container = $("#server_response");
const request_options = $("#request_options");
const request_list = $("#request_list");
const request_params = $("#request_params");
let current_request = null;
const tabs = $$(".tab");
let current_tab = $(".tab.active");

function decodeUrl(url) {
  let i = 0;
  for (i = 0; i < url.length; i++) {
    const ascii = url.charCodeAt(i);
    if (ascii > 90) break;
  }
  return [url.slice(0, i), url.slice(i)];
}

window.addEventListener("DOMContentLoaded", () => {
  getAllData().then((res) => {
    if (res.length) {
      for (let i = 0; i < res.length; i++) {
        const item = res[i];
        const new_item = window.element_creator(
          "li",
          {
            textContent: item.name ?? item.id,
            className: "request-item",
          },
          request_list,
        );
        new_item.id = item.id;
        if (i === 0) current_request = { element: new_item };
      }
    }
  });
});

request_options.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const formData = new FormData(request_options);
  const request_params_form_data = new FormData(request_params);

  const request_params_data = Object.fromEntries(request_params_form_data);
  const data = Object.fromEntries(formData);

  const tmp_id = data.method + data.url;
  const db_data = await getData(tmp_id);

  console.log(db_data);
  if (!db_data) {
    window.element_creator(
      "li",
      {
        textContent: request_params_data.request_name ?? tmp_id,
        className: "request-item",
        id: tmp_id,
        ["data-name"]: request_params_data.request_name,
      },
      request_list,
    );
  } else {
    const items = $$(".request-item");
    const item = Array.prototype.find.call(
      items,
      (item) => item.id === db_data.id,
    );
    item.click();
    item.active = true;
    return;
  }
  const response = await api_world.request(data);

  let div = $(".json-container");
  if (!div) {
    div = window.element_creator(
      "div",
      { className: "json-container" },
      response_container,
    );
  } else {
    div.innerHTML = "";
  }

  if (current_request) {
    console.log(current_request, "and", request_params_data);
    current_request.element.style.backgroundColor = "transparent";
    current_request.element.id = data.method + data.url;
    current_request.element.textContent =
      request_params_data.request_name ??
      `${data.method}: ${new URL(data.url).hostname}`;
    current_request.response = response;
    addData({
      id: data.method + data.url,
      name: request_params_data.request_name,
      response,
    });
  }

  renderJSON(response, div);
});

request_list.addEventListener("click", (evt) => {
  const id = evt.target.id;
  const [method_input, url_input] = [$(".method-select"), $(".url-input")];

  if (current_request) {
    current_request.element.style.backgroundColor = "transparent";
  }

  current_request = { element: evt.target, id };

  evt.target.style.backgroundColor = "#fff";

  getData(id).then((res) => {
    let div = $(".json-container");
    if (!div) {
      div = window.element_creator(
        "div",
        { className: "json-container" },
        response_container,
      );
    } else {
      div.innerHTML = "";
    }

    const [method, url] = decodeUrl(id);
    method_input.value = method;
    url_input.value = url;

    if (res?.response) {
      renderJSON(res.response, div);
    }
  });
});

tabs.forEach((tab_el) =>
  tab_el.addEventListener("click", (evt) => {
    const tab = evt.target.dataset["tab"];
    if (tab === current_tab.dataset["tab"]) return;
    const container = $(`.content-area[data-tab=${tab}]`);
    const current_container = $(
      `.content-area[data-tab=${current_tab.dataset["tab"]}]`,
    );

    current_container.style.display = "none";
    container.style.display = "flex";

    current_tab.classList.remove("active");
    current_tab = evt.target;
    current_tab.classList.add("active");
  }),
);

const request_headers = $("#request_headers");
const request_header_add_btn = $("#header_adder");
request_header_add_btn.addEventListener("click", () => {
  window.element_creator(
    "input",
    { className: "input-param", type: "text", name: "whatevs" },
    request_headers,
    { position: "before", relative: request_header_add_btn },
  );
});

window.addEventListener("beforeunload", () => {
  deleteDatabase();
});
