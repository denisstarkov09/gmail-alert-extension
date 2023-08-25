// If your extension doesn't need a content script, just leave this file empty

// This is an example of a script that will run on every page. This can alter pages
// Don't forget to change `matches` in manifest.json if you want to only change specific webpages
printAllPageLinks();

// This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig
export function printAllPageLinks() {
  const allLinks = Array.from(document.querySelectorAll('a')).map(
    link => link.href
  );

  console.log('-'.repeat(30));
  console.log(
    `These are all ${allLinks.length} links on the current page that have been printed by the Sample Create React Extension`
  );
  console.log(allLinks);
  console.log('-'.repeat(30));
}

const closeModal = () => {
  alert("Hello World")
  var elements = document.getElementsByClassName("emailModal")[0].remove()
  for (let i = 0; i < elements.length; i++) {
    elements[i].remove()
  }
}

window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "New Email is received!") {
    console.log("Received message:" + request.message)
    var divElement = document.createElement('div');
    divElement.classList.add('rusemailModal')

    let height = document.body.offsetHeight
    let scrollHeight = document.body.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

    const content = `
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; position: absolute; top: ${scrollHeight}px; left: 0; z-index: 100000; width: 100vw; height: 100vh; background-color: rgba(0,0,0,0.729);">
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 12px 24px; width: 25%; height: 70vh; border: 1px solid white; border-radius: 4px; background-color: white;">
        <h1 style="color: black; font-size: 25px; font-weight: bold">New Email is Received!</h1>
        <button id="ruscloseModal" style="background-color: black; color: white; border-radius: 4px; padding: 8px 24px; margin-top: 48px;">Close a modal</button>
      </div>  
    </div>
    `
    divElement.innerHTML = content;
    let num = document.getElementById('ruscloseModal')
    if (num == null) {
      document.body.appendChild(divElement);
    }
    document.getElementById('ruscloseModal').addEventListener('click', function () {
      var elements = document.getElementsByClassName("rusemailModal")
      for (let i = 0; i < elements.length; i++) {
        elements[i].remove()
      }
    });
  }
})



