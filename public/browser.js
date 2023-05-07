function itemTemplate(item) {
   return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
   <span class="item-text">${item.text}</span>
   <div>
     <a data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1"><i class="fa-regular fa-pen-to-square"></i></a>
     <a data-id="${item._id}" class="delete-me btn btn-danger btn-sm"><i class="fa-solid fa-trash"></i></a>
   </div>
 </li>`
}

// Initial Page Load Render
let theHTML = items.map(function(item) {
     return itemTemplate(item)
   }).join("")
document.getElementById("item-list").insertAdjacentHTML("beforeend", theHTML)


// Create Feature
let createField = document.getElementById('create-field')

document.getElementById("create-form").addEventListener("submit", function(e) {
   e.preventDefault()
   axios.post('/create-item', {text: createField.value}).then(function(response) {
    // create the HTML for a new item 
   document.getElementById('item-list').insertAdjacentHTML('beforeend', itemTemplate(response.data))
      createField.value = ''
      createField.focus()
}).catch(function() {
       console.log('please try again later.')
    })
})

document.addEventListener("click", function(e) {
   // Delete Feature
   if (e.target.classList.contains('delete-me')) {
      if (confirm("do you really want to delete it?")) {
         axios.post('/delete-item', {id: e.target.getAttribute("data-id")}).then(function() {
            e.target.parentElement.parentElement.remove()
          }).catch(function() {
             console.log('please try again later.')
          })
      }
   }

   // Update Feature
    if (e.target.classList.contains('edit-me')) {
     let userInput = prompt("Enter your desired new text", e.target.parentElement.parentElement.querySelector('.item-text').innerHTML)
     // console.log(userInput)
     if (userInput) {
       axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(function() {
         e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
       }).catch(function() {
          console.log('please try again later.')
       })
     }
    }
})


