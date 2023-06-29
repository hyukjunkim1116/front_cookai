checkNotLogin();
async function loadUserDetail() {
	const response = await getUserDetail();
	console.log(response);
	const userDetailList = document.getElementById("mypage");
	const newUserDetail = document.createElement("span");
	newUserDetail.innerText = ` 유저네임 : ${response.username}`;
	userDetailList.appendChild(newUserDetail);
}
async function loadUserFridge() {
	const response = await getUserFridge();
	console.log(response);
	if (response !== []) {
		const userFridgeTitle = document.getElementById("fridge-title");
		const newUserFridgeList = document.createElement("ui");
		response.forEach((fridge) => {
			const newUserFridge = document.createElement("li");
			const deleteUserFridgeBtn = document.createElement(null);
			deleteUserFridgeBtn.innerHTML = `
		<button type="button" class="sign-btn btn btn-outline-primary" onclick="deleteUserFridge(${fridge.id})"
                            id="delete-fridge-btn">삭제</button>`;
			newUserFridge.innerText = `${fridge.ingredient}`;
			newUserFridge.setAttribute("class", "fridge");
			newUserFridge.setAttribute("id", `fridge-${fridge.id}`);
			newUserFridge.appendChild(deleteUserFridgeBtn);
			newUserFridgeList.appendChild(newUserFridge);
		});
		userFridgeTitle.appendChild(newUserFridgeList);
	}
}
async function loadUserFollowing() {
	const response = await getUserFollowing();
	console.log(response);
	if (response !== []) {
		const userFollowingTitle = document.getElementById("following-title");
		const userFollowingList = document.createElement("ui");
		response.forEach((following) => {
			console.log(following.id);
			const userFollowing = document.createElement("li");
			const deleteUserFollowingBtn = document.createElement(null);
			deleteUserFollowingBtn.innerHTML = `
		<button type="button" class="sign-btn btn btn-outline-primary" onclick="userFollowing(${following.id})"
                            id="following-btn">언팔로우</button>`;
			userFollowing.innerText = `${following.username}`;
			userFollowing.setAttribute("class", "following");
			userFollowing.setAttribute("id", `following-${following.id}`);
			userFollowing.appendChild(deleteUserFollowingBtn);
			userFollowingList.appendChild(userFollowing);
		});
		userFollowingTitle.appendChild(userFollowingList);
	}
}
async function loadUserFollower() {
	const response = await getUserFollower();
	console.log(response);
	if (response !== []) {
		const userFollowingTitle = document.getElementById("follower-title");
		const userFollowingList = document.createElement("ul");
		response.forEach((follower) => {
			const userFollowing = document.createElement("li");
			userFollowing.innerText = `${follower.username}`;
			userFollowingList.appendChild(userFollowing);
		});
		userFollowingTitle.appendChild(userFollowingList);
	}
}
function goDeleteUser() {
	// 인자값이 존재한다면 해당 인자값의 유저 프로필로 이동
	const payload = localStorage.getItem("payload");
	if (payload == null) {
		window.location.replace(`${FRONT_BASE_URL}/login.html`);
	}
	const payload_parse = JSON.parse(payload);
	console.log(payload_parse);
	const loginType = payload_parse.login_type;
	if (loginType !== "normal") {
		window.location.replace(`${FRONT_BASE_URL}/`);
	}
	user_id = payload_parse.user_id;
	window.location.href = `${FRONT_BASE_URL}/users/user_delete.html?user_id=${user_id}`;
}
function goUpdateUser() {
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
window.onload = async function () {
	await loadUserDetail();
	await loadUserFollowing();
	await loadUserFollower();
	await loadUserFridge();
};
