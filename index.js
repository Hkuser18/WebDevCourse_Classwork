//page to navigate to when clicking menu item
//page: from HTML clicl EXAMPLE /page/01_Home/index.html
function loadPage(page) {
    //gets reference to iframe element by id
    //content frame is iframe element type
    let iframeElement = document.getElementById("contentFrame");
    //give the iframe the html address
    iframeElement.src = page;

    // Close sidebar on mobile
    document.getElementById("sidebar").classList.remove("show");
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("show");
}