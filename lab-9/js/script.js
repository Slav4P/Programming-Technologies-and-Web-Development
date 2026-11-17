const photos = [
    {
        id: 1,
        image: "img/morein.jpg",
        title: "Озеро Морейн",
        description: "Бирюзовое озеро среди величественных Скалистых гор.",
        country: "canada", category: "nature", date: "2026-10-15", favorite: false
    },
    {
        id: 2,
        image: "img/santorini.jpg",
        title: "Санторини",
        description: "Белоснежные дома и синие купола на берегу Эгейского моря.",
        country: "greece", category: "cities", date: "2026-09-10", favorite: false
    },
    {
        id: 3,
        image: "img/kioto.jpg",
        title: "Улицы Киото",
        description: "Традиционная архитектура и тихие улочки старого города.",
        country: "japan", category: "culture", date: "2026-08-20", favorite: false
    },
    {
        id: 4,
        image: "img/venevia.jpg",
        title: "Каналы Венеции",
        description: "Город мостов, каналов и старинных фасадов.",
        country: "italy", category: "cities", date: "2026-07-12", favorite: false
    },
    {
        id: 5,
        image: "img/norvey.jpg",
        title: "Норвежский фьорд",
        description: "Спокойная вода, горы и небольшие домики у берега.",
        country: "norway", category: "nature", date: "2026-05-18", favorite: false
    },
    {
        id: 6,
        image: "img/parije.jpg",
        title: "Париж",
        description: "Знакомство с архитектурой и атмосферой французской столицы.",
        country: "france", category: "cities", date: "2025-11-02", favorite: false
    },
    {
        id: 7,
        image: "img/more.jpg",
        title: "Морское побережье",
        description: "Шум волн и просторный горизонт.",
        country: "greece", category: "nature", date: "2025-06-22", favorite: false
    },
    {
        id: 8,
        image: "img/sobaka.jpg",
        title: "Путешественник",
        description: "Маленькая встреча с местным четвероногим жителем.",
        country: "italy", category: "animals", date: "2025-03-14", favorite: false
    }
];

const countryNames = {
    canada: "Канада", greece: "Греция", japan: "Япония",
    italy: "Италия", norway: "Норвегия", france: "Франция"
};

const categoryNames = {
    nature: "Природа", cities: "Города",
    culture: "Культура", animals: "Животные"
};

const elements = {
    placesList: document.getElementById("placesList"),
    country: document.getElementById("countryFilter"),
    category: document.getElementById("categoryFilter"),
    period: document.getElementById("periodFilter"),
    sort: document.getElementById("sortFilter"),
    search: document.getElementById("searchInput"),
    count: document.getElementById("resultsCount"),
    empty: document.getElementById("emptyState"),
    pagination: document.getElementById("pagination"),
    favoritesCount: document.getElementById("favoritesCount"),
    photoDialog: document.getElementById("photoDialog"),
    addDialog: document.getElementById("addPhotoDialog"),
    photoImage: document.getElementById("photoImage"),
    photoTitle: document.getElementById("viewerTitle"),
    photoDescription: document.getElementById("photoDescription"),
    viewerLocation: document.getElementById("viewerLocation"),
    favoriteButton: document.getElementById("favoriteButton"),
    prevButton: document.getElementById("prevButton"),
    nextButton: document.getElementById("nextButton"),
    addForm: document.getElementById("addPhotoForm"),
    addMessage: document.getElementById("addPhotoMessage")
};

const itemsPerPage = 4; 
let currentPhotos = [];
let currentIndex = 0;
let currentPage = 1;
let currentView = "all";

function getFilteredPhotos() {
    const country = elements.country.value;
    const category = elements.category.value;
    const period = elements.period.value;
    const search = elements.search.value.trim().toLowerCase();
    const now = new Date();

    let result = photos.filter((photo) => {
        const matchesCountry = country === "all" || photo.country === country;
        const matchesCategory = category === "all" || photo.category === category;
        const matchesView = currentView !== "favorites" || photo.favorite;

        const searchableText = `${photo.title} ${photo.description} ${countryNames[photo.country]} ${photo.tags || ""}`.toLowerCase();
        const matchesSearch = searchableText.includes(search);

        const photoDate = new Date(`${photo.date}T00:00:00`);
        let matchesPeriod = true;

        if (period === "month") {
            const monthAgo = new Date(now);
            monthAgo.setMonth(now.getMonth() - 1);
            matchesPeriod = photoDate >= monthAgo && photoDate <= now;
        } else if (period === "year") {
            const yearAgo = new Date(now);
            yearAgo.setFullYear(now.getFullYear() - 1);
            matchesPeriod = photoDate >= yearAgo && photoDate <= now;
        }

        return matchesCountry && matchesCategory && matchesView && matchesSearch && matchesPeriod;
    });

    result.sort((a, b) => {
        const difference = new Date(b.date) - new Date(a.date);
        return elements.sort.value === "newest" ? difference : -difference;
    });

    return result;
}

function createPhotoCard(photo, index) {
    const item = document.createElement("li");
    item.className = "photo-card";

    const image = document.createElement("img");
    image.className = "photo-card-image";
    image.src = photo.image;
    image.alt = photo.title;
    image.loading = "lazy";
    image.dataset.photoId = String(photo.id);
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `Открыть фотографию: ${photo.title}`);

    const body = document.createElement("div");
    body.className = "photo-card-body";

    const meta = document.createElement("div");
    meta.className = "photo-card-meta";

    const country = document.createElement("span");
    country.textContent = countryNames[photo.country] || "Другая страна";

    const date = document.createElement("time");
    date.dateTime = photo.date;
    date.textContent = new Date(`${photo.date}T00:00:00`).toLocaleDateString("ru-RU");

    meta.append(country, date);

    const title = document.createElement("h3");
    title.textContent = photo.title;

    const description = document.createElement("p");
    description.textContent = photo.description || "Описание не добавлено.";

    const bottom = document.createElement("div");
    bottom.className = "photo-card-bottom";

    const category = document.createElement("span");
    category.className = "category-chip";
    category.textContent = categoryNames[photo.category] || "Без категории";

    const favorite = document.createElement("button");
    favorite.type = "button";
    favorite.className = `favorite-card${photo.favorite ? " is-favorite" : ""}`;
    favorite.dataset.favoriteId = String(photo.id);
    favorite.textContent = photo.favorite ? "♥" : "♡";
    favorite.setAttribute("aria-label", photo.favorite ? "Убрать из избранного" : "Добавить в избранное");
    favorite.setAttribute("aria-pressed", String(photo.favorite));

    bottom.append(category, favorite);
    body.append(meta, title, description, bottom);
    item.append(image, body);

    return item;
}

function renderGallery() {
    currentPhotos = getFilteredPhotos();

    const totalPages = Math.max(1, Math.ceil(currentPhotos.length / itemsPerPage));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * itemsPerPage;
    const pagePhotos = currentPhotos.slice(start, start + itemsPerPage);

    elements.placesList.replaceChildren();
    pagePhotos.forEach((photo, index) => {
        elements.placesList.appendChild(createPhotoCard(photo, start + index));
    });

    elements.empty.hidden = currentPhotos.length !== 0;
    elements.placesList.hidden = currentPhotos.length === 0;
    elements.pagination.hidden = totalPages <= 1;
    elements.count.textContent = `Найдено фотографий: ${currentPhotos.length}`;
    elements.favoritesCount.textContent = photos.filter(photo => photo.favorite).length;

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    elements.pagination.replaceChildren();

    const addPageButton = (label, page, disabled = false, active = false) => {
        const li = document.createElement("li");
        li.className = `page-item${active ? " active" : ""}${disabled ? " disabled" : ""}`;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "page-link";
        button.textContent = label;
        button.disabled = disabled;
        button.addEventListener("click", () => {
            currentPage = page;
            renderGallery();
        });

        li.appendChild(button);
        elements.pagination.appendChild(li);
    };

    addPageButton("←", currentPage - 1, currentPage === 1);

    for (let page = 1; page <= totalPages; page += 1) {
        addPageButton(String(page), page, false, page === currentPage);
    }

    addPageButton("→", currentPage + 1, currentPage === totalPages);
}

function resetFilters() {
    elements.country.value = "all";
    elements.category.value = "all";
    elements.period.value = "all";
    elements.sort.value = "newest";
    elements.search.value = "";
    currentView = "all";
    currentPage = 1;
    updateViewButtons();
    renderGallery();
}

function updateViewButtons() {
    document.querySelectorAll(".tab-button").forEach(button => {
        const isActive = button.dataset.view === currentView;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

// открывает фотографию по её индексу 
function openPhoto(index) {
    if (index < 0 || index >= currentPhotos.length) return;

    currentIndex = index;
    const photo = currentPhotos[currentIndex];

    elements.photoImage.src = photo.image;
    elements.photoImage.alt = photo.title;
    elements.photoTitle.textContent = photo.title;
    elements.photoDescription.textContent = photo.description || "Описание не добавлено.";
    elements.viewerLocation.textContent = `${countryNames[photo.country] || ""} · ${categoryNames[photo.category] || ""}`;
    updateViewerControls();

    if (!elements.photoDialog.open) {
        elements.photoDialog.showModal();
    }
}

function updateViewerControls() {
    const photo = currentPhotos[currentIndex];
    if (!photo) return;

    elements.favoriteButton.textContent = photo.favorite ? "♥ В избранном" : "♡ В избранное";
    elements.favoriteButton.setAttribute("aria-pressed", String(photo.favorite));
    elements.prevButton.disabled = currentIndex === 0;
    elements.nextButton.disabled = currentIndex === currentPhotos.length - 1;
}

function changePhoto(step) {
    const nextIndex = currentIndex + step;
    if (nextIndex < 0 || nextIndex >= currentPhotos.length) return;
    openPhoto(nextIndex);
}

function toggleFavorite(photoId) {
    const photo = photos.find(item => item.id === photoId);
    if (!photo) return;

    photo.favorite = !photo.favorite;
    renderGallery();

    const openedPhoto = currentPhotos[currentIndex];
    if (elements.photoDialog.open && openedPhoto && openedPhoto.id === photoId) {
        updateViewerControls();
    }
}

// фильтры
[elements.country, elements.category, elements.period, elements.sort].forEach(control => {
    control.addEventListener("change", () => {
        currentPage = 1;
        renderGallery();
    });
});

elements.search.addEventListener("input", () => {
    currentPage = 1;
    renderGallery();
});

document.getElementById("resetFilters").addEventListener("click", resetFilters);
document.getElementById("emptyReset").addEventListener("click", resetFilters);

document.querySelectorAll(".tab-button").forEach(button => {
    button.addEventListener("click", () => {
        currentView = button.dataset.view;
        currentPage = 1;
        updateViewButtons();
        renderGallery();
    });
});

elements.placesList.addEventListener("click", event => {
    const favoriteButton = event.target.closest("[data-favorite-id]");
    if (favoriteButton) {
        toggleFavorite(Number(favoriteButton.dataset.favoriteId));
        return;
    }

    const image = event.target.closest("[data-photo-id]");
    if (image) {
        const index = currentPhotos.findIndex(photo => photo.id === Number(image.dataset.photoId));
        openPhoto(index);
    }
});

elements.placesList.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-photo-id]")) {
        event.preventDefault();
        const index = currentPhotos.findIndex(photo => photo.id === Number(event.target.dataset.photoId));
        openPhoto(index);
    }
});


elements.favoriteButton.addEventListener("click", () => {
    const photo = currentPhotos[currentIndex];
    if (photo) toggleFavorite(photo.id);
});

elements.prevButton.addEventListener("click", () => changePhoto(-1));
elements.nextButton.addEventListener("click", () => changePhoto(1));

document.querySelectorAll("[data-close-dialog]").forEach(button => {
    button.addEventListener("click", () => {
        const dialog = document.getElementById(button.dataset.closeDialog);
        if (dialog && dialog.open) dialog.close();
    });
});

[elements.photoDialog, elements.addDialog].forEach(dialog => {
    dialog.addEventListener("click", event => {
        if (event.target === dialog) dialog.close();
    });
});

document.getElementById("openAddPhoto").addEventListener("click", () => {
    elements.addMessage.textContent = "";
    elements.addDialog.showModal();
});

elements.addForm.addEventListener("submit", event => {
    event.preventDefault();
    elements.addMessage.textContent = "";

    const fileInput = document.getElementById("newPhotoFile");
    const file = fileInput.files[0];

    if (!file || !file.type.startsWith("image/")) {
        elements.addMessage.textContent = "Выбери файл изображения.";
        return;
    }

    const title = document.getElementById("newPhotoTitle").value.trim();
    const country = document.getElementById("newPhotoCountry").value;
    const category = document.getElementById("newPhotoCategory").value;
    const date = document.getElementById("newPhotoDate").value;
    const description = document.getElementById("newPhotoDescription").value.trim();

    if (!title || !country || !category || !date) {
        elements.addMessage.textContent = "Заполни обязательные поля.";
        return;
    }

    const newPhoto = {
        id: Date.now(),
        image: URL.createObjectURL(file),
        title,
        description,
        country,
        category,
        date,
        favorite: false
    };

    photos.unshift(newPhoto);
    elements.addForm.reset();
    elements.addDialog.close();

    resetFilters();
    document.getElementById("gallery").scrollIntoView({ behavior: "smooth" });
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const menuOverlay = document.getElementById("menuOverlay");
const menuClose = document.getElementById("menuClose");

function openSideMenu() {
    mainNav.classList.add("is-open");
    menuOverlay.classList.add("is-visible");
    document.body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
}

function closeSideMenu() {
    mainNav.classList.remove("is-open");
    menuOverlay.classList.remove("is-visible");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", openSideMenu);
menuClose.addEventListener("click", closeSideMenu);
menuOverlay.addEventListener("click", closeSideMenu);

mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeSideMenu);
});

document.getElementById("openAddPhoto").addEventListener("click", () => {
    closeSideMenu();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeSideMenu();
});

renderGallery();
