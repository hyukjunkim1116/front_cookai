async function loadUserDetail() {
	const response = await getUserDetail();
	console.log(response);
	const userDetailList = document.getElementById("user-detail");
	const newUserDetailList = document.createElement("span");
	newUserDetailList.innerText = response.username;
	userDetailList.appendChild(newUserDetailList);
}
const putUserBtn = document.getElementById("update-user-btn");
putUserBtn.addEventListener("click", () => {
	putUserDetail();
});
const deleteUserBtn = document.getElementById("delete-user-btn");
deleteUserBtn.addEventListener("click", () => {
	deleteUser();
});
async function loadUserFollowing() {
	const response = await getUserFollowing();
	console.log(response);
	const userFollowingList = document.getElementById("user-detail");
	const newUserFollowingList = document.createElement("span");
	newUserFollowingList.innerText = `//팔로우 한 사람 : ${response["2"].username}`;
	userFollowingList.appendChild(newUserFollowingList);
}
window.onload = async function () {
	loadUserDetail();
	loadUserFollowing();
};
