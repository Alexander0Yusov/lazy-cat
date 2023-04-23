class EyeEl {
  constructor(left, top) {
    // white part eye
    this.El = window.document.createElement("div");
    this.El.style.cssText = `position: absolute; left: ${left}px; top: ${top}px;display: flex;justify-content: end;align-items: center;height: 27px;width: 27px;  border-radius: 50%;background-color: white;`;
    // black part eye
    this.ElInner = window.document.createElement("div");
    this.ElInner.style.cssText =
      "width: 18px;height: 24px;border: 1px solid green;border-radius: 50%;display: block;background-color: black;";
    this.El.append(this.ElInner);
  }

  print() {
    return this.El;
  }

  whereMe() {
    const { left, top, width, height } = this.El.getBoundingClientRect();
    return { eyeX: left + width / 2, eyeY: top + height / 2 };
  }

  quartDetect({ eyeX, eyeY }, { mouseX, mouseY }) {
    if (mouseX - eyeX > 0 && mouseY - eyeY > 0) {
      return 1;
    }

    if (mouseX - eyeX < 0 && mouseY - eyeY > 0) {
      return 2;
    }

    if (mouseX - eyeX < 0 && mouseY - eyeY < 0) {
      return 3;
    }

    if (mouseX - eyeX > 0 && mouseY - eyeY < 0) {
      return 4;
    }
  }

  arcTan(cathetusFront, cathetusAdjoin) {
    return Math.round(Math.atan(cathetusFront / cathetusAdjoin) * (180 / 3.14));
  }

  angleCalculate({ mouseX, mouseY }) {
    const { eyeX, eyeY } = this.whereMe();

    switch (this.quartDetect({ eyeX, eyeY }, { mouseX, mouseY })) {
      case 1:
        return this.arcTan(mouseY - eyeY, mouseX - eyeX);

      case 2:
        return this.arcTan(eyeX - mouseX, mouseY - eyeY) + 90;

      case 3:
        return this.arcTan(eyeY - mouseY, eyeX - mouseX) + 180;

      case 4:
        return this.arcTan(mouseX - eyeX, eyeY - mouseY) + 270;

      default:
        break;
    }
  }

  rotate(angle) {
    this.El.style.transform = `rotate(${angle}deg)`;
  }
}

class ButtonCatClose {
  constructor() {
    this.El = window.document.createElement("button");
    this.El.style.cssText = ` height: 56px;width: 56px;margin: 16px 16px;border-radius: 50%; border: 1px solid gray;background-color: transparent;cursor: pointer;`;

    // this.El.addEventListener("mouseover", function () {
    //   this.El.style.backgroundColor = crimson;
    //   "border-width': 2px; 'background-color': crimson;";
    //   https://qna.habr.com/q/608621
    // });
  }

  print() {
    return this.El;
  }
}

const startPointDelta = {};
const eyeLeft = new EyeEl(173, 50);
const eyeRight = new EyeEl(135, 59);
const buttonCatClose = new ButtonCatClose();

const body = document.querySelector("body");
const main = document.querySelector(".cat");
main.append(eyeLeft.print(), eyeRight.print());
main.addEventListener("mousedown", onMainClickDown);
main.addEventListener("mouseup", onMainClickUp);
document.addEventListener("mousemove", onMouseMove);

function onMouseMove(event) {
  // console.log(event.pageX + " : " + event.pageY);
  const { clientX, clientY } = event;

  const angleLeft = eyeLeft.angleCalculate({
    mouseX: clientX,
    mouseY: clientY,
  });
  eyeLeft.rotate(angleLeft);

  const angleRight = eyeRight.angleCalculate({
    mouseX: clientX,
    mouseY: clientY,
  });
  eyeRight.rotate(angleRight);
}

function onMainClickDown(e) {
  document.removeEventListener("mousemove", onMouseMove);
  body.addEventListener("mousemove", onMainMove);

  const { left, top } = main.getBoundingClientRect();
  startPointDelta.x = Math.round(e.pageX - left);
  startPointDelta.y = Math.round(e.pageY - top - window.pageYOffset);
}

function onMainMove(e) {
  main.style.left = e.pageX - startPointDelta.x + "px";
  main.style.top = e.pageY - startPointDelta.y + "px";
}

function onMainClickUp(e) {
  document.addEventListener("mousemove", onMouseMove);
  body.removeEventListener("mousemove", onMainMove);
}
