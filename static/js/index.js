// 로그인 되어있다면(localstorage에 토큰이 있다면) 로그인 되어있으므로 pass
// 토큰이 없고, url에 파라미터가 있다면, 해당 값을 판별해서 해당하는 함수를 호출
// 각각 해당하는 url로 데이터를 실어서 요청을 보내고 액세스 토큰을 받아오는 함수
async function getKakaoToken(kakao_code) {
	const response = await fetch(`${BACKEND_BASE_URL}/users/oauth/kakao/`, {
		headers: {
			"Content-Type": "application/json"
		},
		method: "POST",
		body: JSON.stringify({ code: kakao_code })
	});
	response_json = await response.json();
	setLocalStorage(response);
}
async function getGoogleToken(google_token) {
	const response = await fetch(`${BACKEND_BASE_URL}/users/oauth/google/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ access_token: google_token })
	});
	response_json = await response.json();
	setLocalStorage(response);
}

async function getNaverToken(naver_code, state) {
	const response = await fetch(`${BACKEND_BASE_URL}/users/oauth/naver/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ naver_code: naver_code, state: state })
	});
	response_json = await response.json();
	setLocalStorage(response);
}

// 받아온 토큰을 로컬 스토리지에 저장
// 에러 발생 시, 에러 문구를 띄워주고 이전 페이지(로그인페이지)로
function setLocalStorage(response) {
	if (response.status === 200) {
		localStorage.setItem("access", response_json.access);
		localStorage.setItem("refresh", response_json.refresh);
		const base64Url = response_json.access.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map(function (c) {
					return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join("")
		);
		localStorage.setItem("payload", jsonPayload);
		window.location.reload();
	} else {
		alert(response_json["error"]);
		window.history.back();
	}
}
// const goLoginBtn = document.getElementById("show-login-btn");
// goLoginBtn.addEventListener("click", () => {
// 	window.location.href = `${FRONT_BASE_URL}/users/login.html`;
// });

// const aiObjBtn = document.getElementById("ai-obj-btn");
// aiObjBtn.addEventListener("click", () => {
// 	window.location.href=`${FRONT_BASE_URL}/image_upload.html`;
// });
// const aiRecommBtn = document.getElementById("ai-recomm-btn");
// aiRecommBtn.addEventListener("click", () => {
// 	window.location.href=`${FRONT_BASE_URL}/users/feed.html`;
// });

async function loadBest(idx){
	const idxToStr={5:"이번주",6:"오늘"}
	const bestBox = document.getElementById(`best${idx}`)
	const response=await getArticleList(`?search=${idx}&order=1`)
	const response_json = await response.json()
	var listofArticle=[].concat(response_json.results)
	if(response_json.next){
		const response2=await getArticleList(`?search=${idx}&order=1`,2)
		const response2_json = await response2.json()
		listofArticle =listofArticle.concat(response2_json.results)
	}
	var count = 0	
	var col = document.createElement("div")
	col.setAttribute("class","col-9")
	console.log(listofArticle)
	if (listofArticle.length ==0){
		const nextPageBtn = document.createElement("button");
		nextPageBtn.setAttribute("class", "btn btn-outline-success col-12 mt-4");
		nextPageBtn.setAttribute("type", "button");
		nextPageBtn.setAttribute("class", "btn btn-outline-secondary col-12");
		nextPageBtn.setAttribute("disabled", "true");
		nextPageBtn.innerText = `아직 ${idxToStr[idx]}의 베스트 레시피가 없습니다!`;
		bestBox.appendChild(nextPageBtn);
	}
	listofArticle.forEach(article => {
			

			// 새로운 div 요소를 생성하고, class 속성을 "card"로 설정합니다.
			// 또한, 클릭 이벤트 핸들러와 id 속성을 게시물의 고유 식별자(pk)로 설정합니다.
			// 이렇게 생성한 카드를 newCardBox에 추가합니다.
			const tempHtml = `<div id="article-container" class="article-container" onclick="location.href='${FRONT_BASE_URL}/articles/article_detail.html?article_id=${
				article.id
			}'" style="cursor:pointer">
			<div id="article-image" class="article-image" style="background-image: url('${
				[null, undefined].includes(article.image)
					? "https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2/"
					: article.image
			}');"></div>
			<div id="article-content" class="article-content">
				<div id="article-content__title" class="article-content__title">${
					article.title.length<=10?article.title:article.title.substr(0,9)+"⋯"
				}</div>
				<div id="article-content__user" class="article-content__user">${
					article.user
				}</div>
				<div id="article-content-count" class="article-content-count">
					<div id="article-content__likes_count" class="article-content__likes_count"><i class="bi bi-heart-fill"></i> ${
						article.likes_count
					}</div>
				</div>
			</div>
			</div>`;
			col.innerHTML += tempHtml;
			if(count%2){
				col=document.createElement('div')
				col.setAttribute("class","col-9")
			}else{
				bestBox.appendChild(col)
			}
			count ++;

	});

}
async function loadRecommendation(){
	const recomm=document.getElementById("recomm")
	var listofRecomm =[]
	var listofRecommId=[]
	const buttonBox = document.createElement("div")
	buttonBox.setAttribute("class","col-9 d-flex flex-column p-4")
	const moreBtn = document.createElement("button")
	moreBtn.innerText="more:피드로 이동"
	moreBtn.setAttribute("class","block btn btn-outline-primary w-80 h-100")
	moreBtn.setAttribute("onclick",`location.href="${FRONT_BASE_URL}/users/feed.html"`)
	buttonBox.appendChild(moreBtn)
	if(!isLogin()){
		document.getElementById("recomm-description").innerText="당신만을 위한 추천레시피를 원하시면 로그인 해주세요!"
		const response = await getRecommend(0)
		const response_json = await response.json()
		listofRecomm =listofRecomm.concat(response_json)
		listofRecomm=listofRecomm.slice(0,4)
		const loginBtn = document.createElement("button")
		loginBtn.setAttribute("class","block btn btn-outline-secondary w-80 h-100 mt-5")
		loginBtn.setAttribute("onclick",`location.href="${FRONT_BASE_URL}/login.html"`)
		loginBtn.innerText="로그인"
		buttonBox.appendChild(loginBtn)


		
	}else{
		document.getElementById("recomm-description").innerText="당신만을 위한 추천레시피들 입니다."
		const response = await getRecommend(0)
		const response2 = await getRecommend(1)
		const response_json = await response.json()
		const response2_json = await response2.json()
		listofRecomm =listofRecomm.concat(response_json.slice(0,2))
		
		response_json.forEach(element => {
			listofRecommId +=[element.id]
		});
		for(var i = 0 ; i < response2_json.length; i++) {
			if(!listofRecommId.includes(response2_json[i].id)) {
				listofRecomm=listofRecomm.concat([response2_json[i]]);
			}
			if(listofRecomm.length ==4) break;
		};
	}
	var count = 0	
	var col = document.createElement("div")
	col.setAttribute("class","col-9")
	listofRecomm.forEach(article => {
			

		// 새로운 div 요소를 생성하고, class 속성을 "card"로 설정합니다.
		// 또한, 클릭 이벤트 핸들러와 id 속성을 게시물의 고유 식별자(pk)로 설정합니다.
		// 이렇게 생성한 카드를 newCardBox에 추가합니다.
		const tempHtml = `<div id="article-container" class="article-container" onclick="location.href='${FRONT_BASE_URL}/articles/article_detail.html?article_id=${
			article.id
		}'" style="cursor:pointer">
		<div id="article-image" class="article-image" style="background-image: url('${
			[null, undefined].includes(article.image)
				? "https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2/"
				: article.image
		}');"></div>
		<div id="article-content" class="article-content">
			<div id="article-content__title" class="article-content__title">${
				article.title.length<=10?article.title:article.title.substr(0,9)+"⋯"
			}</div>
			<div id="article-content__user" class="article-content__user">${
				article.user
			}</div>
			<div id="article-content-count" class="article-content-count">
				<div id="article-content__likes_count" class="article-content__likes_count"><i class="bi bi-heart-fill"></i> ${
					article.likes_count
				}</div>
			</div>
		</div>
		</div>`;
		col.innerHTML += tempHtml;
		if(count%2){
			col=document.createElement('div')
			col.setAttribute("class","col-9")
		}else{
			recomm.appendChild(col)
		}
		count ++;

	});
	recomm.appendChild(buttonBox)
}
		
async function loaderFunction(){
	if (localStorage.getItem("payload")) {
	} else if (location.href.split("=")[1]) {
		let code = new URLSearchParams(window.location.search).get("code");
		let state = new URLSearchParams(window.location.search).get("state");
		let hashParams = new URLSearchParams(window.location.hash.substr(1));
		let google_token = hashParams.get("access_token");
		if (code) {
			if (state) {
				getNaverToken(code, state);
			} else {
				getKakaoToken(code);
			}
		} else if (google_token) {
			getGoogleToken(google_token);
		}
	}
	await loadBest(5)
	await loadBest(6)
	await loadRecommendation()
	const allTitle = document.querySelectorAll(".article-content__title")
	allTitle.forEach((e) => {
		e.innerText=e.innerHTML
	});
	const allUser = document.querySelectorAll(".article-content__user")
	allUser.forEach((e) => {
		e.innerText=e.innerHTML
	});
}
