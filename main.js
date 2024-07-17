const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorBtns = document.querySelectorAll(".color-tool .option");
const colorPicker = document.querySelector("#color-picker");
const clearCanvas = document.querySelector("#clear");
const saveImg = document.querySelector("#save");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let selectedTool = "brush";
let brushWidth = 1;
let prevMouseX, prevMouseY, snapshot;
let selectedColor = "#000";

const brush = document.querySelector("#brush");


const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}



window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});


const drawRectangle = (e) => {
    if(!fillColor.checked)  {
        // ctx.strokeRect(x-coordinate, y-coordinate, width, height)
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }

    return ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}


const drawCircle = (e) => {
    ctx.beginPath();    // creating new path to draw circle
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}


const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);       // creating first line according to mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);      // creating bottom line of triangle
    ctx.closePath();        // closing path of triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke();
}


const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();    // creating new path to draw
    ctx.lineWidth = brushWidth;

    // passing color value
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;

    // getImageData method returns an ImageData object that copies the pixel data
    // copying canvas data & passing as snapshot value....  this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing)  return;

    // putImageData() method puts the image data back onto the canvas
    // adding copied canvas data on to this canvas
    ctx.putImageData(snapshot, 0, 0);

    if(selectedTool === "brush" || selectedTool === "eraser")    {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        //& lineTo() method creates a new line ... ctx.lineTo(x-coordinate, y-coordinate)
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();    // drawing / filling line with color
    }
    else if(selectedTool === "rectangle")   {
        drawRectangle(e);
    }
    else if(selectedTool === "circle")  {
        drawCircle(e);
    }
    else if(selectedTool === "triangle")    {
        drawTriangle(e);
    }

}


toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = `${btn.id}`;
        console.log(selectedTool);
    })
})


sizeSlider.addEventListener("change", () => {
    brushWidth = sizeSlider.value;
    console.log(brushWidth);
});

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        console.log(btn);
        // console.log(window.getComputedStyle(btn).getPropertyValue("background-color"));
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});


colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});


clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();

    document.querySelector("#clear").classList.remove("active");
    brush.classList.add("active");
    selectedTool = "brush";
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();     // toDataURL() method returns a of the image
    link.click();

    document.querySelector("#save").classList.remove("active");
    brush.classList.add("active");
    selectedTool = "brush";
});


canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mousemove", drawing);