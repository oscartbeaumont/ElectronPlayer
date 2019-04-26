/*
This script renders the main menu ui.
*/

let servicesElem = document.querySelector(".services");

services.forEach(function (service) {
  // create service element
  let elem = document.createElement("a");
  elem.setAttribute("href", "#");
  elem.classList.add("service");

  // create img element
  let img = document.createElement("img");
  img.setAttribute("src", service.logo);
  img.setAttribute("alt", service.name);
  img.setAttribute("id", service.name);
  img.style = service.style;

  // append img to service element
  elem.appendChild(img);

  // create h3 element
  let h3 = document.createElement("h3");
  h3.appendChild(document.createTextNode(service.name));

  // append h3 element to service element
  elem.appendChild(h3);

  // append service element to services
  servicesElem.appendChild(elem);

  elem.addEventListener("click", (e) => {
    if (servicesElem.classList.contains("loading"))
      return;

    let loader = document.createElement("div");
    loader.classList.add("loader");
    loader.style.top = `${img.getBoundingClientRect().top}px`;
    loader.style.left = `${img.getBoundingClientRect().left}px`;
    loader.style.margin = "0";

    let ripple = document.createElement("div");
    ripple.classList.add("ripple");
    ripple.style.backgroundColor = service.color;
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
  if (servicesElem.classList.contains("loading"))
    return;

  let img = document.getElementById(service.name);

  let loader = document.createElement("div");
  loader.classList.add("loader");
  loader.style.left = "50%";
  loader.style.transform = "translate(-50%, -50%)";
  loader.style.margin = "0";

  let ripple = document.createElement("div");
  ripple.classList.add("ripple");
  ripple.style.backgroundColor = service.color;
  loader.appendChild(ripple);

  loader.appendChild(img.cloneNode());

  document.body.appendChild(loader);

  servicesElem.classList.add("loading");

  console.log(`Switching to service ${service.name}} at the URL ${service.url}`);
});
