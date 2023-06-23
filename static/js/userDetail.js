async function loadUserDetail() {
	const response = await getUserDetail();
	const userDetailList = document.getElementById("user-detail");
	const newUserDetailList = document.createElement("span");
	newUserDetailList.innerText = response.username;
	userDetailList.appendChild(newUserDetailList);
}
async function loadUserFridge() {
	const response = await getUserFridge();
	console.log(response);
	const userFridgeTitle = document.getElementById("fridge-title");
	const newUserFridgeList = document.createElement("span");
	newUserFridgeList.innerText = ` : ${response[0].ingredient}`;
	userFridgeTitle.appendChild(newUserFridgeList);
}
async function loadUserFollowing() {
	const response = await getUserFollowing();
	console.log(response);
	const userFollowingList = document.getElementById("user-detail");
	const newUserFollowingList = document.createElement("span");
	newUserFollowingList.innerText = `//내가 팔로우 한 사람 : ${response[0]?.username}`;
	userFollowingList.appendChild(newUserFollowingList);
}
async function loadUserFollower() {
	const response = await getUserFollower();
	console.log(response);
	const userFollowingList = document.getElementById("user-detail");
	const newUserFollowingList = document.createElement("span");
	newUserFollowingList.innerText = `//나를 팔로우 한 사람 : ${response[0]?.username}`;
	userFollowingList.appendChild(newUserFollowingList);
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
window.onload = async function () {
	await loadUserDetail();
	await loadUserFollowing();
	await loadUserFollower();
	await loadUserFridge();
};
