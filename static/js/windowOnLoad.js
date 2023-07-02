window.onload = async function (){
	checkTokenExp();
	await injectNavbar()
	await injectfooter()
	await loaderFunction()
	if(window.location.pathname.includes("article_update.html")){
		await loaderFunction_()
	}
	// 스크롤 초기화(맨위로)버튼
	// const floatingTopBtn = document.getElementById("scrollTopBtn");
	
	// window.addEventListener("scroll", () => {
	// 	console.log(".")
	//   if (window.scrollY > 100) { // 100px 이하로 스크롤되면 버튼이 사라집니다. 여기서 숫자를 조정하여 위치를 변경하세요.
	// 	floatingTopBtn.style.display = "block";
	// 	console.log("asdfasdfasdf")
	//   } else {
	// 	floatingTopBtn.style.display = "none";
	// 	console.log("zczxvzxcvzxcvzx")
	//   }
	// });
	
	// floatingTopBtn.addEventListener("click", () => {
	//   window.scrollTo({ top: 0, behavior: "smooth" });
	// });
	  
}