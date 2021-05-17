let nav = document.getElementById("section-nav");

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

async function addSiteNav() {
    let siteNavContent = `<li><a data-href="/index.html">Home</a></li>
    <li>Days
        <ul>
            <li><a data-href="/days/day1.html">Day 1 - HTML</a></li>
            <li><a data-href="/days/day2.html">Day 2 - Variables, Math, Comparison, If/Else, Functions</a></li>
            <li><a data-href="/days/day3.html">Day 3 - || and &&, DRY, Objects, DOM, Events</a></li>
            <li><a data-href="/days/day4.html">Day 4</a></li>
            <li><a data-href="/days/day5.html">Day 5</a></li>
            <li><a data-href="/days/day6.html">Day 6</a></li>
            <li><a data-href="/days/day7.html">Day 7</a></li>
            <li><a data-href="/days/day8.html">Day 8</a></li>
            <li><a data-href="/days/day9.html">Day 9</a></li>
            <li><a data-href="/days/day10.html">Day 10</a></li>
        </ul>
    </li>
    `; 
    let siteNav = document.getElementById("site-nav");
    siteNav.innerHTML = siteNavContent;
    siteNav.id = "site-nav";
    let rootDir = siteNav.dataset.rootDir;

    Array.from(document.querySelectorAll("#site-nav a")).forEach(a => {
        a.href = rootDir + a.dataset.href;
    });
}

function loop() {
    ys = getHeaderYPositions();
    let smallest = ys.reduce((previous, current) => Math.abs(previous.y) < Math.abs(current.y) ? previous : current, ys[0]);
    let currentHighlighted = navListItems[smallest.index];
    if (prevHighlighted && prevHighlighted !== currentHighlighted) prevHighlighted.children[0].className = "";
    currentHighlighted.children[0].className = "nav-highlighted";
    prevHighlighted = currentHighlighted;
    setTimeout(loop, 200);
}

addSiteNav();

loop();