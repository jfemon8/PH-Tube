fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then(response => response.json())
    .then(data => {
        const categoryList = document.getElementById("categories");
        const categories = data.categories;
        for (const cat of categories) {
            const categoryButton = `
            <button id="${cat.category_id}" onclick="loadCategoryVideo(${cat.category_id})" class="btn hover:bg-[#FF1F3D] hover:text-white">${cat.category}</button>
            `
            categoryList.innerHTML += categoryButton;
        }
    });

function loadVideo() {
    const buttons = document.getElementsByClassName("active");
    for (let button of buttons) {
        button.classList.remove("active");
    }
    document.getElementById("all").classList.add("active");
    fetch("https://openapi.programming-hero.com/api/phero-tube/videos/")
        .then(response => response.json())
        .then(data => {
            displayVideo(data.videos);
        });
}

loadCategoryVideo = (cat_id) => {
    const url = "https://openapi.programming-hero.com/api/phero-tube/category/" + cat_id;
    const buttons = document.getElementsByClassName("active");
    for (let button of buttons) {
        button.classList.remove("active");
    }
    document.getElementById(cat_id).classList.add("active");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayVideo(data.category);
        });
}

timeCalculation = (time) => {
    const timeDiff = parseInt(time);
    let hours = Math.floor(timeDiff / 3600);
    const minutes = Math.floor((timeDiff % 3600) / 60);
    if (hours >= 24) {
        const day = Math.floor(hours / 3600);
        hours %= 24;
        return `${day} days ${hours} hrs ${minutes} min ago`;
    }
    return `${hours} hrs ${minutes} min ago`;
}

displayVideo = (videos) => {
    const videoContainer = document.getElementById("video_container");
    videoContainer.innerHTML = "";

    if (videos.length === 0) {
        const emptyCard = `
        <div class="col-span-full flex flex-col gap-8 justify-center items-center mt-40">
            <img class="w-36 h-36" src="assests/Icon.png" alt="No-Video">
            <h1 class="font-bold text-3xl">Oops!! Sorry, There is no content here</h1>
        </div>
        `
        videoContainer.innerHTML += emptyCard;
        return;
    }

    videos.forEach(video => {
        const videoCard = `
        <div class="card bg-base-100 shadow-sm">
          <figure class="relative">
            <img
              class="w-full h-40 object-cover"
              src="${video.thumbnail}"
              alt="Thumbnail"
            />
            ${video.others.posted_date === "" ? `` : `<p class="bg-black text-white absolute text-xs p-1 rounded bottom-3 right-3">
                ${timeCalculation(video.others.posted_date)}
            </p>`}
          </figure>
          <div class="p-4 flex gap-4 items-start">
            <div class="avatar">
              <div class="w-12 rounded-full">
                <img src="${video.authors[0].profile_picture}" />
              </div>
            </div>
            <div>
              <h2 class="card-title">${video.title}</h2>
              <p class="flex gap-1 items-center text-sm text-gray-400">
                ${video.authors[0].profile_name}
                <span>
                ${video.authors[0].verified === true ? `<img
                    class="w-4 h-4"
                    src="https://img.icons8.com/?size=96&id=SRJUuaAShjVD&format=png"
                    alt="Verified"/>` : ``}
                </span>
              </p>
              <p class="text-sm text-gray-400">${video.others.views} views</p>
            </div>
          </div>
          <button onclick = "loadVideoDetails('${video.video_id}')"
            class="btn btn-soft btn-info btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">
            Details
          </button>
        </div>
    `
        videoContainer.innerHTML += videoCard;
    });
}

document.getElementById("input").addEventListener("keyup", (event) => {
    const title = event.target.value;
    loadTitleVideo(title);
})

loadTitleVideo = (input = "") => {
    const url = "https://openapi.programming-hero.com/api/phero-tube/videos?title=" + input;
    const buttons = document.getElementsByClassName("active");
    for (let button of buttons) {
        button.classList.remove("active");
    }
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayVideo(data.videos);
        });
}

loadVideoDetails = (id) => {
    const url = "https://openapi.programming-hero.com/api/phero-tube/video/" + id;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            showVideoDetails(data.video)
        });
}

showVideoDetails = (video) => {
    const detailsContainer = document.getElementById("details_container");
    detailsContainer.innerHTML = `
        <figure>
            <img
            src="${video.thumbnail}"
            alt="Thumbnail"
            />
        </figure>
        <div class="card-body">
            <h2 class="card-title">${video.title}</h2>
            <p> ${video.description} </p>
            <p> Authors: ${video.authors[0].profile_name} </p>
            <p> Total views: ${video.others.views} </p>
        </div>
    `
    document.getElementById("video_modal").showModal();
}

loadVideo();
