

async function postUserFridge(ingredient) {
  await checkTokenExp();

	let token = localStorage.getItem("access");
	const response = await fetch(`${BACKEND_BASE_URL}/users/fridge/`, {
		headers: await getHeader(),
		body: JSON.stringify({
			"ingredient": ingredient
		}),
		method: "POST"
	});
}
async function postUserFridgeObjDetection(){
    var result = document.getElementById("ingredient").value
    var list_result= result.split(',')

    list_result.forEach(async(e) => {
      if(e != ""){
        postUserFridge(e)

      }
    });
}


async function loaderFunction(){
  await checkTokenExp();

  const image_form = document.getElementById('image_form')
  const token= localStorage.getItem("access")
  image_form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(image_form)
    const response=await fetch(`${BACKEND_BASE_URL}/ai_process/upload/`, {
      method: 'POST',
      headers: await getHeader(json=false),
      body: formData
    })
    const response_json= await response.json()
    if ( response.status==201){
      const resultBox= document.getElementById("resultBox")
      resultBox.innerHTML=``
      var temp_html = ``
      response_json.results.forEach((e) => {
          temp_html +=`${e},`
      });
      resultBox.innerHTML += `<input id="ingredient" class="form-control" value="${temp_html}">`
      resultBox.innerHTML += ` <button class="btn btn-outline-dark" onclick="location.href='${FRONT_BASE_URL}/articles/article_list.html?search=2&selector=${temp_html}'">검색</button> <button class="btn btn-outline-dark" onclick="postUserFridgeObjDetection()">재료 저장</button>`
      document.getElementById("explain").innerHTML += `<h4>위의 내용이 인식 결과입니다.</h4><p>부정확 할 경우 직접 입력을 통해 정정할 수 있습니다.</p>`
    }
  })
}