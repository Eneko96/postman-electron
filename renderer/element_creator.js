window.element_creator = function(element, options, parent) {
  const el = document.createElement(element);
  for (opt in options) {
    if (opt.startsWith("data-")) {
      const data_key = opt.replace("data-", "");
      el.dataset[data_key] = options[opt];
    } else {
      el[opt] = options[opt];
    }
  }

  parent.appendChild(el);

  return el;
};
