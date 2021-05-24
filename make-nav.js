// Array.from(document.querySelectorAll("pre")).forEach(elem => {

// });

setTimeout(() => {
    if (window.hljs) hljs.highlightAll();
});

let nav = document.getElementById("section-nav");
let siteNav = document.getElementById("site-nav");

[nav, siteNav].forEach(elem => {
    let prevTouch;
    let prevTime = Date.now();
    elem.addEventListener("touchmove", e => {
        if (e.touches.length == 1) {
            let touch = e.touches[0];
            let time = Date.now();

            if (prevTouch) {
                let deltaX = (touch.clientX - prevTouch.clientX) / (time - prevTime) * 1000;
                let threshold = window.innerWidth / 2;
                if (elem === nav) {
                    if (deltaX > threshold) {
                        elem.className = "hover";
                    }
                    if (deltaX < threshold) {
                        elem.className = "";
                    }
                } else {
                    if (deltaX > threshold) {
                        elem.className = "";
                    }
                    if (deltaX < threshold) {
                        elem.className = "hover";
                    }
                }
            }


            prevTime = time;
            prevTouch = e.touches[0];
        }
    }, { passive: true });
})

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
            currentParent = currentParent.parentElement.parentElement;
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
    <li><a data-href="/table-of-contents.html">Table of Contents</a></li>
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
    <li><a data-href="/quick-reference.html">Quick Reference (by day)</a></li>
    `; 
    siteNav.innerHTML = siteNavContent;
    siteNav.id = "site-nav";
    let rootDir = siteNav.dataset.rootDir;

    Array.from(document.querySelectorAll("#site-nav a")).forEach(a => {
        a.href = rootDir + a.dataset.href;
    });
}

function addSettings() {
    let settings = document.createElement("div");
    settings.className = "site-settings";
    document.body.prepend(settings);

    let darkModeButton = document.createElement("button");
    darkModeButton.innerText = "Toggle Dark/Light Theme";
    darkModeButton.onclick = toggleTheme;
    settings.appendChild(darkModeButton);

    settings.appendChild(document.createElement("br"));

    let tableOfContentsLink = document.createElement("a");
    tableOfContentsLink.innerText = "Table of Contents";
    tableOfContentsLink.href = document.getElementById("site-nav").dataset.rootDir + "/table-of-contents.html";
    settings.appendChild(tableOfContentsLink);
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

function toggleTheme() {
    let theme = localStorage.getItem("theme");
    if (theme == "light") {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
    updateTheme();
}

function updateTheme() {
    let theme = localStorage.getItem("theme");
    if (theme == "dark") {
        document.body.className = "dark";
    } else if (theme == null) {
        if (matchMedia("(prefers-color-scheme: dark)").matches) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
        updateTheme();
    } else {
        document.body.className = "";
    }
}

addSiteNav();
addSettings();

updateTheme();

loop();