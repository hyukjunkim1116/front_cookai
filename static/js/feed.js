async function renderList(recommendType,response_json){
    
    const newCardBox = document.getElementById(`list_${recommendType}`)
	for (const article of response_json) {
        // 새로운 div 요소를 생성하고, class 속성을 "card"로 설정합니다.
        // 또한, 클릭 이벤트 핸들러와 id 속성을 게시물의 고유 식별자(pk)로 설정합니다.
        // 이렇게 생성한 카드를 newCardBox에 추가합니다.
		const newCard = document.createElement("div");
		newCard.setAttribute("class", "card h-100");
		newCard.setAttribute("onclick", `location.href="${FRONT_BASE_URL}/articles/article_detail.html?article_id=${article.id}"`);
		newCard.setAttribute("id", article.id);
		
		const image = response_json.image

        // 게시물의 대표 이미지를 생성하고, 생성한 이미지를 카드에 추가합니다.
        // 게시물의 photos 배열에서 첫 번째 요소의 file 속성을 가져와서 이미지의 src 속성으로 설정합니다.
        // articlePhoto가 존재하지 않는다면, 기본 이미지 주소를 src 속성으로 설정합니다.
		const articleimage = document.createElement("img");
		articleimage.setAttribute("class", "img-fluid card-img-top");
		if (image) {
			articleimage.setAttribute("src", `${image}`);
		} else {
			articleimage.setAttribute(
				"src",
				"https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2"
			);
		}
		newCard.appendChild(articleimage);

        // 카드의 본문 생성.
		const newCardBody = document.createElement("div");
		newCardBody.setAttribute("class", "card-body");

		

        // 카드의 제목 생성. 
		const newCardTitle = document.createElement("h6");
		newCardTitle.setAttribute("class", "card-title");
		const newStrong = document.createElement("strong");
		if (article.title.length > 10) {
			newStrong.innerText = `${article.title.substr(0, 9)} ···`;
		} else {
			newStrong.innerText = article.title;
		}
		newCardTitle.appendChild(newStrong);
		newCardBody.appendChild(newCardTitle);
        
        // 카드에 생성일을 표시하는 요소를 생성.
		
		const newCardAuthor = document.createElement("p");
		newCardAuthor.setAttribute("class", "card-text");
		newCardAuthor.innerHTML = `작성자:<br>${article.user}`;
        if(article.user.length>10){
            newCardAuthor.innerHTML = `작성자:<br>${article.user.substr(0,9)}···`;
        }
		newCardBody.appendChild(newCardAuthor);
		const newCardtime = document.createElement("small");
		newCardtime.setAttribute("class", "card-text");
		newCardtime.innerText = article.created_at.split(".")[0].slice(2,-3).replace("T"," ");
		newCardBody.appendChild(newCardtime);
		newCard.appendChild(newCardBody);
        const col= document.createElement("div")
        col.setAttribute("class","col-7")
        col.appendChild(newCard)
		newCardBox.appendChild(col);
		
	}
}


async function loadCollavorativeRecommend(){
    const response = await getRecommend(0)
    const response_json = await response.json()
    if (response.status == 200){
        console.log(response_json)
        await renderList(0,response_json)
    }else if(response.status == 401){alert("로그인해주세요!")}
	else{
		{alert(response.status)}
	}
    
}
async function loadContentRecommend(){
    const response = await getRecommend(1)
    const response_json = await response.json()
    if (response.status == 200){
        console.log(response_json)
        await renderList(1,response_json)
    }else{}
}

async function loadFeedArticles(queryType,page=1){
	const payload = localStorage.getItem("payload");
	if (payload == null) {
		window.location.replace(`${FRONT_BASE_URL}/login.html`);
	}
	const payload_parse = JSON.parse(payload);
	console.log(payload_parse);
	user_id = payload_parse.user_id;
	const response = await getUserFeedArticles(user_id,queryType,page)
	const newCardBox = document.getElementById(`list_${queryType}`)
	const response_json = await response.json()
	for (const article of response_json.results) {
        // 새로운 div 요소를 생성하고, class 속성을 "card"로 설정합니다.
        // 또한, 클릭 이벤트 핸들러와 id 속성을 게시물의 고유 식별자(pk)로 설정합니다.
        // 이렇게 생성한 카드를 newCardBox에 추가합니다.
		const newCard = document.createElement("div");
		newCard.setAttribute("class", "card");
		newCard.setAttribute("onclick", `location.href="${FRONT_BASE_URL}/articles/article_detail.html?article_id=${article.id}"`);
		newCard.setAttribute("id", article.id);
		
		const image = response_json.image

        // 게시물의 대표 이미지를 생성하고, 생성한 이미지를 카드에 추가합니다.
        // 게시물의 photos 배열에서 첫 번째 요소의 file 속성을 가져와서 이미지의 src 속성으로 설정합니다.
        // articlePhoto가 존재하지 않는다면, 기본 이미지 주소를 src 속성으로 설정합니다.
		const articleimage = document.createElement("img");
		articleimage.setAttribute("class", "card-img-top");
		if (image) {
			articleimage.setAttribute("src", `${image}`);
		} else {
			articleimage.setAttribute(
				"src",
				"https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2"
			);
		}
		newCard.appendChild(articleimage);

        // 카드의 본문 생성.
		const newCardBody = document.createElement("div");
		newCardBody.setAttribute("class", "card-body");

		

        // 카드의 제목 생성. 
		const newCardTitle = document.createElement("h6");
		newCardTitle.setAttribute("class", "card-title");
		const newStrong = document.createElement("strong");
		if (article.title.length > 10) {
			newStrong.innerText = `${article.title.substr(0, 10)} ···`;
		} else {
			newStrong.innerText = article.title;
		}
		newCardTitle.appendChild(newStrong);
		newCardBody.appendChild(newCardTitle);
        
        // 카드에 생성일을 표시하는 요소를 생성.
		
		const newCardAuthor = document.createElement("p");
		newCardAuthor.setAttribute("class", "card-text");
		newCardAuthor.innerText = `작성자: ${article.user}`;
		newCardBody.appendChild(newCardAuthor);
		const newCardtime = document.createElement("small");
		newCardtime.setAttribute("class", "card-text");
		newCardtime.innerText = article.created_at.split(".")[0].slice(2,-3).replace("T"," ");
		newCardBody.appendChild(newCardtime);
		newCard.appendChild(newCardBody);
		newCardBox.appendChild(newCard);
		
	};
	
	const formerNextPageBtn=document.getElementById(`nextpage${queryType}`)
	if (formerNextPageBtn){
		formerNextPageBtn.remove()
	}
	const nextPageBtn= document.createElement("button")
	nextPageBtn.setAttribute("class","btn btn-outline-success col-12")
	nextPageBtn.setAttribute("type","button")
	nextPageBtn.setAttribute("id",`nextpage${queryType}`)
	if(response_json.next){
		nextPageBtn.innerText="+ 더보기"
		nextPageBtn.setAttribute("onclick",`loadFeedArticles(${queryType},${page+1})`)
	}else{
		nextPageBtn.setAttribute("class","btn btn-outline-secondary col-12")
		nextPageBtn.setAttribute("disabled","true")
		nextPageBtn.innerText="더이상 결과가 없습니다."
	}
	newCardBox.appendChild(nextPageBtn)

}
async function tabs(id){
	for(var i =0 ;i<3;i ++){
		if(i==id){
			document.getElementById(`${i}`).hidden=false
		}else{
			document.getElementById(`${i}`).hidden=true
		}
	}

}
async function loaderFunction() {
	checkNotLogin();
	await loadCollavorativeRecommend();
	await loadContentRecommend();
	await loadFeedArticles(3);
	await loadFeedArticles(2);
}
