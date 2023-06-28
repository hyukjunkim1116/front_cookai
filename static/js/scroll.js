document.addEventListener("DOMContentLoaded", () => {
    const floatingTopBtn = document.getElementById("scrollTopBtn");
  
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 100) { // 100px 이하로 스크롤되면 버튼이 사라집니다. 여기서 숫자를 조정하여 위치를 변경하세요.
        floatingTopBtn.style.display = "block";
      } else {
        floatingTopBtn.style.display = "none";
      }
    });
  
    floatingTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
  