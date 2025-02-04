import { renderJSON } from "./jsonRenderer.js";
import { addData, deleteDatabase, getAllData, getData } from "./indexdb.js";
const $ = (selector) => document.querySelector(selector);
const api_world = window.api;

const response_container = $("#server_response");
const request_options = $("#request_options");
const request_creator = $("#request_creator");
const request_list = $("#request_list");
let current_request = null;

window.addEventListener("DOMContentLoaded", () => {
  getAllData().then((res) => {
    if (res.length) {
      for (let i = 0; i < res.length; i++) {
        const item = res[i];
        const new_item = window.element_creator(
          "li",
          { textContent: item.id },
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
  const data = Object.fromEntries(formData);

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
    current_request.element.style.background = "none";
    current_request.element.id = data.method + data.url;
    current_request.element.textContent = `${data.method}: ${new URL(data.url).hostname}`;
    current_request.response = response;
    addData({ id: data.method + data.url, response });
  }

  renderJSON(response, div);
});

request_creator.addEventListener("click", () => {
  const new_item = window.element_creator(
    "li",
    { textContent: "New request" },
    request_list,
  );
  current_request = { element: new_item };
});

request_list.addEventListener("click", (evt) => {
  const id = evt.target.id;

  current_request.element.style.background = "none";

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
    console.log(id);
    renderJSON(res.response, div);
  });
});

window.addEventListener("beforeunload", () => {
  deleteDatabase();
});
