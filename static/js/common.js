
//드롭다운 불러오기
async function handleNavbarMode(loginUser) {
    const loggedInItems = document.querySelectorAll('.logged-in-item');
    const loggedOutItems = document.querySelectorAll('.logged-out-item');
    const navbarToggler = document.querySelector(".navbar-toggler");
	const loginButton = document.getElementById("nav-login"); // 로그인 버튼 추가

    if (loginUser) {
        // 로그인시 드롭다운 및 버튼 표시
        loggedInItems.forEach(item => item.style.display = 'block');
        loggedOutItems.forEach(item => item.style.display = 'none');
        navbarToggler.style.display = "inline-block";
		loginButton.style.display = "none"; // 로그인 버튼 숨기기
    } else {
        // 미로그인시 드롭다운 및 버튼 숨김
        loggedInItems.forEach(item => item.style.display = 'none');
        loggedOutItems.forEach(item => item.style.display = 'block');
        navbarToggler.style.display = "none";
		loginButton.style.display = "block"; // 로그인 버튼 보이기
    }
}

// 네비게이션 바 불러오기,
async function injectNavbar() {
	let navbarHtml = await fetch("/navbar.html");
	let data = await navbarHtml.text();
	const original = document.querySelector("body").innerHTML;
	document.querySelector("body").innerHTML = original + data;
	const payload = localStorage.getItem("payload");
	if (payload) {
		const loginUser = await getLoginUser();
		if (
			loginUser.avatar &&
			loginUser.avatar !== "" &&
			loginUser.avatar !== "null"
		) {
			const avatar = document.getElementById("avatar");
			avatar.setAttribute("src", `${loginUser.avatar}`);
			avatar.style.visibility = "visible";
		} else {
			const avatar = document.getElementById("avatar");
			avatar.setAttribute("src", "/static/img/no_avatar.png");
			avatar.style.visibility = "visible";
		}
		const intro = document.getElementById("intro");
		intro.innerText = `${loginUser.username}님`;

		// 로그인 사용자 정보가 설정된 후 handleNavbarMode() 호출
		await handleNavbarMode(loginUser);
	} else {
		// 사용자가 로그인하지 않은 경우
		await handleNavbarMode(null);
	}
	const my=document.getElementById("my")
	if (payload == null){
		my.innerHTML = "Login"
	}
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

// 로그아웃
function handleLogout() {
	localStorage.removeItem("access");
	localStorage.removeItem("refresh");
	localStorage.removeItem("payload");
	window.location.replace(`${FRONT_BASE_URL}/login.html`);
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
		document.getElementById("image_container").innerHTML = "";
		document.getElementById("image_container").appendChild(img);
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
		img.setAttribute("class", "img-thumbnail");
		img.setAttribute("style", "max-height: 120px;"); // 높이 제한 120px
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

async function goUserUpdatePage() {
	// 인자값이 존재한다면 해당 인자값의 유저 프로필로 이동
	const payload = localStorage.getItem("payload");
	if (payload == null) {
		window.location.replace(`${FRONT_BASE_URL}/login.html`);
	}
	const payload_parse = JSON.parse(payload);
	console.log(payload_parse);
	user_id = payload_parse.user_id;
	window.location.href = `${FRONT_BASE_URL}/users/user_update.html?user_id=${user_id}`;
}
async function goUserDeletePage() {
	// 인자값이 존재한다면 해당 인자값의 유저 프로필로 이동
	const payload = localStorage.getItem("payload");
	if (payload == null) {
		window.location.replace(`${FRONT_BASE_URL}/login.html`);
	}
	const payload_parse = JSON.parse(payload);
	console.log(payload_parse);
	user_id = payload_parse.user_id;
	window.location.href = `${FRONT_BASE_URL}/users/user_delete.html?user_id=${user_id}`;
}