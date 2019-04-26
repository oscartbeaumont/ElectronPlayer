/*
This script renders the main menu ui.
*/

let servicesElem = document.querySelector(".services");

function isLoading() {
  return servicesElem.classList.contains("loading");
}

function createElement(tag, initialClass = null, style = null) {
  let elem = document.createElement(tag);
  if (initialClass && initialClass.trim().length > 0)
    elem.classList.add(initialClass);
  if (style) {
    Object.keys(style).forEach(function (key) {
      elem.style[key] = style[key];
    })
  }
  return elem;
}

services.forEach(function (service) {
  // create service element
  let elem = createElement("a", "service");
  elem.setAttribute("href", "#");

  // create img element
  let img = createElement("img", null, service.style);
  img.setAttribute("src", service.logo);
  img.setAttribute("alt", service.name);
  img.setAttribute("id", service.name);

  // append img to service element
  elem.appendChild(img);

  // create h3 element
  let h3 = document.createElement("h3");
  h3.appendChild(document.createTextNode(service.name));

  // append h3 element to service element
  elem.appendChild(h3);

  // append service element to services
  servicesElem.appendChild(elem);

  elem.addEventListener("click", () => {
    if (isLoading())
      return;

    let loader = createElement("div", "loader", {
      top: `${img.getBoundingClientRect().top}px`,
      left: `${img.getBoundingClientRect().left}px`
    });

    let ripple = createElement("div", "ripple", {
      backgroundColor: service.color
    });

    loader.appendChild(ripple);
    loader.appendChild(img.cloneNode());

    document.body.appendChild(loader);

    servicesElem.classList.add("loading");

    requestAnimationFrame(() => {
      loader.style.top = "50%";
      loader.style.left = "50%";
      loader.style.transform = "translate(-50%, -50%)";
    });

    console.log(`Switching to service ${service.name}} at the URL ${service.url}`);
    ipc.send('open-url', service);
  });
});

ipc.on("run-loader", (e, service) => {
  if (isLoading())
    return;

  let img = document.getElementById(service.name);

  let loader = createElement("div", "loader", {
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)"
  });

  let ripple = createElement("div", "ripple", {
    backgroundColor: service.color
  });

  loader.appendChild(ripple);
  loader.appendChild(img.cloneNode());

  document.body.appendChild(loader);

  servicesElem.classList.add("loading");

  console.log(`Switching to service ${service.name}} at the URL ${service.url}`);
});
