checkNotLogin();
async function loadUserDetail() {
	const response = await getUserDetail();
	console.log(response);
	const mypageList = document.getElementById("mypage");
	const avatar = document.getElementById("mypage-avatar");
	const username = document.getElementById("username");
	username.innerText = `${response.username}`;
	avatar.setAttribute(
		"src",
		`${response.avatar}` ? `${response.avatar}` : "static/img/no_avatar.png"
	);
	mypageList.appendChild(username);
	const following = document.getElementById("following");
	following.innerText = `팔로잉 : ${response.total_followings}`;
	const follower = document.getElementById("follower");
	follower.innerText = `팔로워 : ${response.total_followers}`;
	const bookmark = document.getElementById("bookmark-article");
	bookmark.innerText = `북마크한 게시글 : ${response.total_bookmark_articles}`;
	const likeArticle = document.getElementById("like-article");
	likeArticle.innerText = `좋아요 누른 게시글 : ${response.total_like_articles}`;
	const likeComment = document.getElementById("like-comment");
	likeComment.innerText = `좋아요 누른 댓글 : ${response.total_like_comments}`;
	const totalArticles = document.getElementById("total_articles");
	totalArticles.innerText = `게시글 : ${response.total_articles}`;
	const totalComments = document.getElementById("total_comments");
	totalComments.innerText = `댓글 : ${response.total_comments}`;

	// const likeArticles = document.getElementById("like-article");
	// likeArticles.innerText = `좋아요 누른 게시글 수 : ${response.total_like_articles}`;
	// const likeComments = document.getElementById("like-comment");
	// likeComments.innerText = `좋아요 누른 댓글 수 : ${response.total_like_comments}`;
}
async function loadUserFridge() {
	const response = await getUserFridge();
	console.log(response);
	const userFridgeContent = document.getElementById("fridge-content");
	if (response !== []) {
		response.forEach((fridge) => {
			const newUserFridge = document.createElement("div");
			newUserFridge.setAttribute("class", "fridge-ingredient");
			newUserFridge.setAttribute("id", `fridge-${fridge.id}`);
			newUserFridge.innerHTML = `${fridge.ingredient} <div onclick="deleteUserFridge(${fridge.id})"><i style="cursor:pointer;" class="bi bi-x"></i></div>`;
			userFridgeContent.appendChild(newUserFridge);
		});
	}
}
async function loadUserArticle() {
	const response = await getUserArticle();
	console.log("article", response);
	const articleContainer = document.getElementById("article");
	response.results.forEach((result) => {
		const articleContent = document.createElement(null);
		const articleImage = result.avatar
			? `${result.avatar}`
			: "https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2";
		articleContent.innerHTML = `
		<div id="article-container" class="article-container" onclick="location.href='${FRONT_BASE_URL}/articles/article_detail.html?article_id=${result.id}'" style="cursor:pointer">
					<img id="article-image" class="article-image" src=${articleImage}/>
                    <div id="article-content" class="article-content">
                        <div id="article-content__title" class="article-content__title">${result.title}</div>
                        <div id="article-content__user" class="article-content__user">${result.user}</div>
                        <div id="article-content-count" class="article-content-count">
                            <div id="article-content__likes_count" class="article-content__likes_count"><i class="bi bi-heart-fill"></i> ${result.likes_count}</div>
                            <div id="article-content__comments_count" class="article-content__comments_count">댓글 수: ${result.comments_count}</div>
                            <div id="article-content__edit" class="article-content__edit" onclick="location.href='${FRONT_BASE_URL}/articles/article_update.html?article_id=${result.id}'" style="cursor:pointer">수정하기</div>
                        </div>
                    </div>
					</div>
		`;
		articleContainer.appendChild(articleContent);
	});
}
async function loadUserComment() {
	const response = await getUserComment();
	console.log("comment", response);

	const commentContainer = document.getElementById("comment");
	response.results.forEach((result) => {
		const commentContent = document.createElement(null);
		commentContent.innerHTML = `
				<div class="comment-container" id="comment-container">
                    <div class="comment-text" id="comment-text">내용 : ${result.comment.slice(
											0,
											25
										)}...
					</div>
                    <div class="comment-detail" id="comment-detail">
                        <div class="comment-article" id="comment-article" onclick="location.href='${FRONT_BASE_URL}/articles/article_detail.html?article_id=${
			result.article
		}'" style="cursor:pointer">게시글 보러 가기</div>
                        <div class="comment-updated" id="comment-updated">
						${result.updated_at.slice(0, 10)}
                        </div>
                        <div class="comment-like" id="comment-like">
                            <i class="bi bi-hand-thumbs-up"></i> ${
															result.likes_count
														}
                        </div>
                    </div>
                </div>
	`;
		commentContainer.appendChild(commentContent);
	});
}
// async function loadUserFollowing() {
// 	const response = await getUserFollowing();
// 	console.log(response);
// 	if (response !== []) {
// 		const userFollowingTitle = document.getElementById("following-title");
// 		const userFollowingList = document.createElement("ui");
// 		response.forEach((following) => {
// 			console.log(following.id);
// 			const userFollowing = document.createElement("li");
// 			const deleteUserFollowingBtn = document.createElement(null);
// 			deleteUserFollowingBtn.innerHTML = `
// 		<button type="button" class="sign-btn btn btn-outline-primary" onclick="userFollowing(${following.id})"
//                             id="following-btn">언팔로우</button>`;
// 			userFollowing.innerText = `${following.username}`;
// 			userFollowing.setAttribute("class", "following");
// 			userFollowing.setAttribute("id", `following-${following.id}`);
// 			userFollowing.appendChild(deleteUserFollowingBtn);
// 			userFollowingList.appendChild(userFollowing);
// 		});
// 		userFollowingTitle.appendChild(userFollowingList);
// 	}
// }
// async function loadUserFollower() {
// 	const response = await getUserFollower();
// 	console.log(response);
// 	if (response !== []) {
// 		const userFollowingTitle = document.getElementById("follower-title");
// 		const userFollowingList = document.createElement("ul");
// 		response.forEach((follower) => {
// 			const userFollowing = document.createElement("li");
// 			userFollowing.innerText = `${follower.username}`;
// 			userFollowingList.appendChild(userFollowing);
// 		});
// 		userFollowingTitle.appendChild(userFollowingList);
// 	}
// }
// await loadUserFollowing();
// await loadUserFollower();
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
	await loadUserFridge();
	await loadUserArticle();
	await loadUserComment();
};
