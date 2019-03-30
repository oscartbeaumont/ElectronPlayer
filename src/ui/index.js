/*
This script renders the main menu ui.
It uses React which is imported via
the preload script.
*/

const e = React.createElement;

// Create The App Interface
class App extends React.Component {
  click(e) {
    var target = e.target;
    if (!target.alt) {
      console.log(e.target.childNodes);
      target = e.target.childNodes[0];
    }

    var targetUrl = target.getAttribute("targeturl");
    console.log(
      "Switching To Service " + target.alt + " At The URL " + targetUrl
    );
    ipc.send("open-url", targetUrl);
  }

  render() {
    return React.createElement(
      "div",
      {
        className: "services"
      },
      services.map((service, index) => {
        return React.createElement(
          "div",
          {
            className: "service",
            key: index,
            onClick: this.click
          },
          React.createElement("img", {
            src: service.logo,
            alt: service.name,
            targeturl: service.url,
            style: {
              width: service.width,
              height: service.height,
              padding: service.padding
            }
          }),
          React.createElement("h3", null, service.name)
        );
      })
    );
  }
}

// Render The Interface To the DOM
ReactDOM.render(
  React.createElement(App, null, null),
  document.getElementById("root")
);
