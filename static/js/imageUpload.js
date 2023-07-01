

async function postUserFridge(ingredient) {
	let token = localStorage.getItem("access");
	const response = await fetch(`${BACKEND_BASE_URL}/users/fridge/`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"content-type": "application/json"
		},
		body: JSON.stringify({
			"ingredient": ingredient
		}),
		method: "POST"
	});
}
async function postUserFridgeObjDetection(){
    var result = document.getElementById("ingredient").value
    var list_result= result.split(',')
    console.log(list_result)
    list_result.forEach(async(e) => {
        postUserFridge(e)
    });
}


async function loaderFunction(){
  const image_form = document.getElementById('image_form')
  const token= localStorage.getItem("access")
  image_form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(image_form)
    const response=await fetch(`${BACKEND_BASE_URL}/ai_process/upload/`, {
      method: 'POST',
      headers: {
          "Authorization": `Bearer ${token}`
      },
      body: formData
    })
    const response_json= await response.json()
    if ( response.status==201){
      const resultBox= document.getElementById("result")
      resultBox.innerHTML=``
      var temp_html = ``
      response_json.results.forEach((e) => {
          temp_html +=`${e},`
      });
      resultBox.innerHTML += `<textarea id="ingredient">${temp_html}</textarea>`
      resultBox.innerHTML += ` <button>검색</button> <button onclick="postUserFridgeObjDetection()">재료 저장</button>`
    }
  })
  const goback= document.getElementById("goback")
  goback.setAttribute("onclick",`location.href="${FRONT_BASE_URL}"`)
}