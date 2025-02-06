window.element_creator = function (
  element,
  options,
  parent,
  position_options = null,
) {
  const el = document.createElement(element);
  for (opt in options) {
    if (opt.startsWith("data-")) {
      const data_key = opt.replace("data-", "");
      el.dataset[data_key] = options[opt];
    } else {
      el[opt] = options[opt];
    }
  }

  if (position_options) {
    if (position_options.position === "before")
      parent.insertBefore(el, position_options.relative);
  } else {
    parent.appendChild(el);
  }

  return el;
};
