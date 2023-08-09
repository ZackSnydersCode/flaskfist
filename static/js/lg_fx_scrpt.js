function vl_frm(event) {
    event.preventDefault();
    const b = document.querySelector('b');
    var nameInput = document.getElementById("name_of_station");
    var passwordInput = document.getElementById("pass_of_station");
    if (nameInput.value.trim() === "" || passwordInput.value.trim() === "") {
        b.innerText = ("Please fill in all the fields.");
        return false;
    } else {
        const frm = document.querySelector('.take_to_the_acc');
        frm.submit();
    }
}