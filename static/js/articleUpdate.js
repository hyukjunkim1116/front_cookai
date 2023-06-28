//아티클 업데이트 하기
console.log("articleUpdate.js 로드됨");

const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get("article_id");

async function generateUpdateFormFields(articleData) {
    // 재료 처리
    articleData.recipeingredient_set.forEach((ingredientData) => {
        handleAddIngredient();
        const lastIndex = ingredientNumber - 1;
        document.getElementById(`ingredient-title-${lastIndex}`).value = ingredientData.ingredient_id;
        document.getElementById(`ingredient-amount-${lastIndex}`).value = ingredientData.ingredient_quantity;
        document.getElementById(`ingredient-unit-${lastIndex}`).value = ingredientData.ingredient_unit;
    });

    // 레시피 처리
    const recipeSteps = articleData.recipe.split(",").length;
    for (let i = 0; i < recipeSteps; i++) {
        handleAddRecipe();
    }

    

    const recipeContainer = document.getElementById("recipe_container");
    const recipeHTML = articleData.recipe;
    recipeContainer.innerHTML = recipeHTML;

    // 태그 처리
    const tagInput = document.getElementById("article_tag");
    tagInput.value = articleData.tags.join(', ');
}

window.onload = async function loadUpdatePost() {
    // 수정창에 기존 내용 보이게
    checkNotLogin();
    
    // articleId 값이 제대로 설정되었는지 확인
    console.log('Article ID:', articleId);

    const exist_post = await getArticle(articleId);

    console.log("Existing article data:", exist_post);
    
    const updateTitle = document.getElementById("article_title");
    updateTitle.value = exist_post.title;

    const updateContent = document.getElementById("article_content");
    updateContent.value = exist_post.content;

    await generateUpdateFormFields(exist_post);

    // 레시피와 재료를 다루기 위한 코드
    const ingredientsContainer = document.getElementById("ingredient_wrapper");
    const recipeContainer = document.getElementById("recipe");

    exist_post.recipeingredient_set.forEach((ingredientObject) => {
        const input = document.createElement("input");
        input.value = ingredientObject.name;
        ingredientsContainer.appendChild(input);
    });

    // 레시피를 처리하기 위한 코드
    const dummyElement = document.createElement('div');
    dummyElement.innerHTML = exist_post.recipe;
    
    const recipeSteps = dummyElement.querySelectorAll("textarea");
    
    recipeSteps.forEach((step) => {
        const textarea = document.createElement("textarea");
        textarea.value = step.value;
        recipeContainer.appendChild(textarea);
    });

    // 업데이트 버튼 이벤트 리스너
    const updateButton = document.getElementById("update_article");
    updateButton.addEventListener("click", async () => {
        // 기존 작성한 내용과 새로 작성한 내용을 함께 생성된 필드에 할당하게 함
        const newArticleData = {
        title: updateTitle.value,
        content: updateContent.value,
        category: document.getElementById("category").value,
        ingredients: Array.from(ingredientsContainer.getElementsByTagName("input")).map(
            (input) => input.value
        ),
        recipe: Array.from(recipeContainer.getElementsByTagName("textarea")).map(
            (textarea) => textarea.value
        ),
        };
        await putApiUpdateArticle(articleId, newArticleData);
    });
};



// 아티클 사진 삭제
async function articlePhotoDelete() {
	const exist_post = await getArticleDetail(articleId);
	if (exist_post.photos[0]) {
		const response = await fetch(
			`${backend_base_url}/api/medias/photos/${exist_post.photos[0]?.pk}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);
		if (response.status == 200) {
			alert("사진이 삭제되었습니다!");
		} else {
			alert("사진 삭제 권한이 없습니다.");
		}
	} else {
		alert("등록된 사진이 없습니다!");
	}
	location.reload();
}

//아티클 업데이트 페이지 들어가면 실행되는 함수. file input은 설정 불가

async function articleUpdate() {
	const updateBtn = document.getElementById("submit-btn");
	updateBtn.innerText = "";
	const span = document.createElement("span");
	span.setAttribute("id", "spinner-span");
	span.setAttribute("class", "spinner-border spinner-border-sm");
	span.setAttribute("role", "status");
	span.setAttribute("aria-hidden", "true");
	updateBtn.appendChild(span);

	const exist_post = await getArticle(articleId);
	const title = document.getElementById("article_title").value;
	const content = document.getElementById("article_content").value;
	const file = document.getElementById("file").files[0];

	const formdata = new FormData();
	formdata.append("title", title);
	formdata.append("content", content);

    const response = await fetch(
        `${backend_base_url}/api/articles/${articleId}/`,
        {
        headers: {
        Authorization: `Bearer ${token}`
        },
        body: formdata,
        method: "PUT"
    }
    );

	if (file) {
		const responseURL = await fetch(
			`${backend_base_url}/api/medias/photos/get-url/`,
			{
				method: "POST"
			}
		);
		const dataURL = await responseURL.json();

		//실제로 클라우드플레어에 업로드
		const formData = new FormData();
		formData.append("file", file);
		const responseRealURL = await fetch(`${dataURL["uploadURL"]}`, {
			body: formData,
			method: "POST"
		});
		const results = await responseRealURL.json();
		const realFileURL = results.result.variants[0];

		// 아티클 사진 백엔드로 업로드
		if (exist_post.photos[0]) {
			const responseUpload = await fetch(
				`${backend_base_url}/api/medias/photos/${exist_post.photos[0].pk}/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"content-type": "application/json"
					},
					body: JSON.stringify({
						file: realFileURL
					}),
					method: "PUT"
				}
			);
		} else {
			// 아티클 사진 백엔드로 업로드
			const response = await fetch(
				`${backend_base_url}/api/articles/${article_id}/photos/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"content-type": "application/json"
					},
					body: JSON.stringify({
						file: realFileURL
					}),
					method: "POST"
				}
			);
		}
	}
	if (response.status == 200) {
		alert("글 수정 완료!");
	} else {
		alert("글 수정 실패!");
	}
	history.back();
}
