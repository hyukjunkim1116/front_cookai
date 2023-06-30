// 네비게이션 바 불러오기,
async function injectNavbar() {
	let navbarHtml = await fetch("/navbar.html");
	let data = await navbarHtml.text();
	const original = document.querySelector("body").innerHTML;
	document.querySelector("body").innerHTML = original + data;
	const payload = localStorage.getItem("payload");
	if (payload) {
		const loginUser = await getLoginUser();
		if (loginUser.avatar !== "") {
			const avatar = document.getElementById("avatar");
			avatar.setAttribute("src", `${loginUser.avatar}`);
			avatar.style.visibility = "visible";
		} else {
			avatar.setAttribute("src", "static/img/no_avatar.png");
			avatar.style.visibility = "visible";
		}
		const intro = document.getElementById("intro");
		intro.innerText = `${loginUser.username}님`;
	}
	// 여기서 부터 동적인 부분 작성하면 됩니다.
}
//푸터 불러오기
async function injectfooter() {
	let footer = await fetch("/footer.html");
	let data = await footer.text();
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
// 비로그인 상태에서 페이지 접속 시 홈으로 이동하는 함수
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
	alert("setThumbnail");
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
	alert("setRecipeThumbnail");
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
async function goMypage() {
	// 인자값이 존재한다면 해당 인자값의 유저 프로필로 이동
	const payload = localStorage.getItem("payload");
	if (payload == null) {
		window.location.replace(`${FRONT_BASE_URL}/login.html`);
	}
	const payload_parse = JSON.parse(payload);
	console.log(payload_parse);
	user_id = payload_parse.user_id;
	window.location.href = `${FRONT_BASE_URL}/mypage.html?user_id=${user_id}`;
}

injectNavbar();
injectfooter();
