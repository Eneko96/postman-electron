window.element_creator = function (element, options, parent) {
  const el = document.createElement(element);
  for (opt in options) {
    el[opt] = options[opt];
  }

  parent.appendChild(el);

  return el;
};
