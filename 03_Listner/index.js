let aaa = document.getElementById("aaa");

function onHover() {
    console.log("Hover!!" + Date.now());
    aaa.style.backgroundColor = "red";
}
aaa.addEventListener('mouseover', onHover, false);

//anonymous function
aaa.addEventListener('click', function () {
    aaa.innerText += "123";
},
    false
);

//arrow function 
let onClickArrow = () => {
    console.log("click")
};
function onClick() {
    console.log("click");
}

document.addEventListener(
    "keydown",
    (myEvent) => {
        console.log("You Clicked:", myEvent.key);
        if (myEvent.key == "w") {
            console.log("Move forward");
        }
    }
)