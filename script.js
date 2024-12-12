const API_KEY = "8151a635e9ac4e13b137872023469356";
const url = "https://newsapi.org/v2/everything?q=";

// Remove the window load event and fetch news directly
fetchNews("India");

function reload() {
    fetchNews("India");
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        if (!res.ok) {
            throw new Error('Failed to fetch data from the server.');
        }
        const data = await res.json();
        bindData(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    if (!articles || articles.length === 0) {
        console.error('No articles found.');
        return;
    }

    // Sort articles by publication date in descending order
    articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-us", {
        timeZone: "Asia/Kolkata",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

window.onload = () => {
    const darkMode = JSON.parse(localStorage.getItem("darkMode"));
    if (darkMode) {
        document.body.classList.add("dark-mode");
    }
};

// function addCategory() {
//     const categoryName = prompt("Enter new category name:");
//     if (!categoryName) return;

//     const categoryList = document.querySelector(".nav-links ul");
//     const newCategory = document.createElement("li");
//     newCategory.textContent = categoryName;
//     newCategory.className = "hover-link nav-item";
//     newCategory.onclick = () => onNavItemClick(categoryName);
//     categoryList.appendChild(newCategory);
// }

// function addToBookmarks(article) {
//     const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
//     bookmarks.push(article);
//     localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
//     alert("Article added to bookmarks!");
// }

// function loadBookmarks() {
//     const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
//     const container = document.getElementById("cards-container");
//     container.innerHTML = ""; 
//     bookmarks.forEach((news) => {
//         const cardTemplate = document.getElementById("template-news-card").content.cloneNode(true);
//         cardTemplate.querySelector("#news-title").textContent = news.title;
//         cardTemplate.querySelector("#news-source").textContent = news.source;
//         cardTemplate.querySelector("#news-desc").textContent = news.description;
//         cardTemplate.querySelector("#news-img").src = news.imageUrl || "https://via.placeholder.com/400x200";
//         container.appendChild(cardTemplate);
//     });
// }

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    if (curSelectedNav) {
        curSelectedNav.classList.remove("active");
    }
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    if (curSelectedNav) {
        curSelectedNav.classList.remove("active");
        curSelectedNav = null;
    }
});
