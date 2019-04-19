/*
This script renders the main menu ui.
It uses React which is imported via
the preload script.
*/

const e = React.createElement;

// Create The App Interface
class App extends React.Component {
  click(url, alt) {
    console.log(
      "Switching To Service " + alt + " At The URL " + url
    );
    ipc.send("open-url", url);
  }

  render() {
    return React.createElement(
      "div",
      {
        className: "services"
      },
      services.map((service, index) => {
        return React.createElement(
          "a",
          {
            className: "service",
            key: index,
            onClick: () => { this.click(service.url, service.name) },
            href: "#"
          },
          React.createElement("img", {
            src: service.logo,
            alt: service.name,
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
