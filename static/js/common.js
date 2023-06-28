// 네비게이션 바 불러오기, 
async function injectNavbar(){
    
    let navbarHtml = await fetch("/navbar.html")
    let data = await navbarHtml.text()
	const original=document.querySelector("body").innerHTML
    document.querySelector("body").innerHTML = original+data;

	// 여기서 부터 동적인 부분 작성하면 됩니다.


	}
//푸터 불러오기
async function injectfooter(){
    
    let footer = await fetch("/footer.html")
    let data = await footer.text()
	document.querySelector("footer").innerHTML = data;

	// 여기서 부터 동적인 부분 작성하면 됩니다.


	}
// 로그인 상태에서 로그인, 회원가입 페이지 접속 시 홈으로 이동하는 함수
function checkLogin() {
	const payload = localStorage.getItem("payload");
	if (payload) {
		window.location.replace(`${FRONT_BASE_URL}/`);
	}
}
// 비로그인 상태에서 글쓰기 페이지 접속 시 홈으로 이동하는 함수
function checkNotLogin() {
	const payload = localStorage.getItem("payload");
	if (payload == null) {
		window.location.replace(`${FRONT_BASE_URL}/`);
	}
}
// 강제 로그아웃
function forceLogout() {
	const payload = localStorage.getItem("payload");
	let current_time = String(new Date().getTime()).substring(0, 10);
	if (payload) {
		const payload_parse = JSON.parse(payload).exp;
		if (payload_parse < current_time) {
			handleLogout();
		} else {
			return;
		}
	}
}
// 로그아웃
function handleLogout() {
	localStorage.removeItem("access");
	localStorage.removeItem("refresh");
	localStorage.removeItem("payload");
	window.location.replace(`${FRONT_BASE_URL}/`);
}
function setThumbnail(event) {
	let reader = new FileReader();

	reader.onload = function (event) {
		let img = document.createElement("img");
		img.setAttribute("src", event.target.result);

		// 썸네일 크기 조절
		img.setAttribute("style", "max-height: 300px;"); // 높이 제한 300px
		img.style.width = "80px"; // 너비 200px로 설정
		img.style.height = "auto"; // 높이 자동 설정
		// 썸네일 리셋 후 미리보기 보여주기
		document.querySelector("div#image_container").innerHTML = "";
		document.querySelector("div#image_container").appendChild(img);
	};
	reader.readAsDataURL(event.target.files[0]);
}
function setRecipeThumbnail(id, event) {
	let reader = new FileReader();

	reader.onload = function (event) {
		let img = document.createElement("img");
		img.setAttribute("src", event.target.result);
		img.setAttribute("id", `recipe-${id}-thumbnail`);

		// 썸네일 크기 조절
		img.setAttribute("style", "max-height: 300px;"); // 높이 제한 300px
		img.style.width = "80px"; // 너비 200px로 설정
		img.style.height = "auto"; // 높이 자동 설정
		// 썸네일 리셋 후 미리보기 보여주기
		document.querySelector(`div#recipe-image-${id}-container`).innerHTML = "";
		document.querySelector(`div#recipe-image-${id}-container`).appendChild(img);
	};
	reader.readAsDataURL(event.target.files[0]);
}

 injectNavbar()
 injectfooter()