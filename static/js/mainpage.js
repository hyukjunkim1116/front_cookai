function setPageContent(content) {
    const container = document.getElementById("content");
    container.innerHTML = content;
}

function loadHtmlContent(file) {
    fetch(file)
        .then(Response => Response.text())
        .then(html => {
            setPageContent(html);
        })
        .catch(error => console.warn("에러 발생: ", error));
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("explorationPage").addEventListener("click", function () {
        loadHtmlContent("exploration.html");
    });
  
    document.getElementById("mainPage").addEventListener("click", function () {
        loadHtmlContent("main.html");
    });
  
    document.getElementById("myPage").addEventListener("click", function () {
        loadHtmlContent("mypage.html");
    });

});
