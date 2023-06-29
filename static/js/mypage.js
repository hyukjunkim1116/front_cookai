// async function goUserDetail(user_id) {
// 	// 인자값이 존재한다면 해당 인자값의 유저 프로필로 이동
// 	if (user_id) {
// 		user_id = user_id;
// 		window.location.href = `${FRONT_BASE_URL}/users/user_detail.html?user_id=${user_id}`;
// 	} else {
// 		// 인자값이 없다면 현재 로그인한 유저의 프로필로 이동
// 		const payload = localStorage.getItem("payload");
// 		const payload_parse = JSON.parse(payload);
// 		console.log(payload_parse);
// 		user_id = payload_parse.user_id;
// 		window.location.href = `${FRONT_BASE_URL}/users/user_detail.html?user_id=${user_id}`;
// 	}
// }
async function loadUserDetail() {
	const response = await getUserDetail();
	const userDetailList = document.getElementById("my-page");
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
const addIngredientBtn = document.getElementById("add-ingredient-btn");
addIngredientBtn.addEventListener("click", () => {
	const response = postUserFridge();
	if (response.status == 200) {
		alert("추가 완료!");
		window.location.reload();
	}
});
const putUserBtn = document.getElementById("update-user-btn");
putUserBtn.addEventListener("click", () => {
	const response = putUserDetail();
	if (response.status == 200) {
		alert("변경 완료!");
		window.location.reload();
	}
});
const deleteUserBtn = document.getElementById("delete-user-btn");
deleteUserBtn.addEventListener("click", async () => {
	const response = await deleteUser();
	if (response.status == 200) {
		alert("탈퇴 완료!");
		handleLogout();
	}
});
const updatePasswordBtn = document.getElementById("update-password-btn");
updatePasswordBtn.addEventListener("click", () => {
	handleUpdatePassword();
});
window.onload = async function () {
	checkNotLogin();
	goUserDetail();
	await loadUserDetail();
	await loadUserFollowing();
	await loadUserFollower();
	await loadUserFridge();
};
