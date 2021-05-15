let nav = document.getElementById("nav-sections");

let headers = Array.from(document.querySelectorAll("h1:not(.no-nav), h2:not(.no-nav), h3:not(.no-nav), h4:not(.no-nav), h5:not(.no-nav), h6:not(.no-nav)"));

let lastLevel = 0;

let currentParent = nav;
let lastElement = nav;

function getHeaderYPositions() {
    return headers.map((header, i) => { return { y: header.getBoundingClientRect().y, header: header, index: i } });
}

let ys = [];


let navListItems = [];

let prevHighlighted = undefined;

headers.forEach(header => {
    let id = header.innerText.toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, "");
    header.id = id;
    let level = Number(header.tagName.slice(1));
    if (level > lastLevel) {
        currentParent = lastElement;
    } else {
        let levels = lastLevel - level;
        for (let i = 0; levels > i; i++) {
            currentParent = currentParent.parentElement;
        }
    }
    let listItem = document.createElement("li");
    currentParent.appendChild(listItem);

    navListItems.push(listItem);

    let hyperlink = document.createElement("a");
    listItem.appendChild(hyperlink);
    hyperlink.href = "#" + id;
    hyperlink.innerText = header.innerText;

    let list = document.createElement("ul");
    listItem.appendChild(list);

    lastLevel = level;
    lastElement = list;
});

function loop() {
    ys = getHeaderYPositions();
    let smallest = ys.reduce((previous, current) => Math.abs(previous.y) < Math.abs(current.y) ? previous : current, ys[0]);
    let currentHighlighted = navListItems[smallest.index];
    if (prevHighlighted && prevHighlighted !== currentHighlighted) prevHighlighted.children[0].className = "";
    currentHighlighted.children[0].className = "nav-highlighted";
    prevHighlighted = currentHighlighted;
    setTimeout(loop, 200);
}

loop();