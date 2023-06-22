async function loadUserDetail() {
	const response = await getUserDetail();
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
	newUserFollowingList.innerText = `//내가 팔로우 한 사람 : ${response[0].username}`;
	userFollowingList.appendChild(newUserFollowingList);
}
async function loadUserFollower() {
	const response = await getUserFollower();
	console.log(response);
	const userFollowingList = document.getElementById("user-detail");
	const newUserFollowingList = document.createElement("span");
	newUserFollowingList.innerText = `//나를 팔로우 한 사람 : ${response[0].username}`;
	userFollowingList.appendChild(newUserFollowingList);
}
window.onload = async function () {
	loadUserDetail();
	console.log(await getUserComment());
	console.log(await getUserArticle());
	console.log(await getUserArticleLikes());
	console.log(await getUserCommentLikes());
	console.log(await getUserArticleBookmarks());
};
