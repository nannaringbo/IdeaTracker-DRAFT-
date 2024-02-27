class Modal {
  constructor(p) {
    this.p = p;
  }

  show() {
    this.p.stroke(5);
    this.p.circle(50, 75, 50);
    this.p.fill(this.p.color(255, 0, 0)); // Example fill color (red)
    console.log("You created a modal");
  }

  hide() {
    // You can add logic here to hide the modal
  }
}

export default Modal;
