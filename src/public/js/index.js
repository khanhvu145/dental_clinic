const body = document.getElementsByTagName('body')[0]

function collapseSidebar() {
	body.classList.toggle('sidebar-expand')
}

window.onclick = function(event) {
	openCloseDropdown(event)
}

function closeAllDropdown() {
	var dropdowns = document.getElementsByClassName('dropdown-expand')
	for (var i = 0; i < dropdowns.length; i++) {
		dropdowns[i].classList.remove('dropdown-expand')
	}
}

function openCloseDropdown(event) {
	if (!event.target.matches('.dropdown-toggle')) {
		// 
		// Close dropdown when click out of dropdown menu
		// 
		closeAllDropdown()
	} else {
		var toggle = event.target.dataset.toggle
		var content = document.getElementById(toggle)
		if (content.classList.contains('dropdown-expand')) {
			closeAllDropdown()
		} else {
			closeAllDropdown()
			content.classList.add('dropdown-expand')
		}
	}
}

var tabs = document.querySelectorAll(".tabs ul li");
var tab_wraps = document.querySelectorAll(".tab-wrap");

tabs.forEach(function(tab, tab_index){
	tab.addEventListener("click", function(){
		tabs.forEach(function(tab){
			tab.classList.remove("active");
		})
		tab.classList.add("active");

		tab_wraps.forEach(function(content, content_index){
			if(content_index == tab_index){
				content.style.display = "block";
			}
			else{
				content.style.display = "none";
			}
		})

	})
})

//Xử lý chọn ảnh
const UPLOAD_BUTTON = document.querySelector(".avatar__btn");
const FILE_INPUT = document.querySelector(".upload__file-img");
const AVATAR = document.querySelector(".avatar__content-img");
UPLOAD_BUTTON.addEventListener("click", () => FILE_INPUT.click());
FILE_INPUT.addEventListener("change", function (e) {
	const file = e.target.files[0];
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onloadend = () => {
		AVATAR.setAttribute("src", reader.result);
	};
});


