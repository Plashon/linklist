let carriageCount = 0;
let dragged;

document.addEventListener("DOMContentLoaded", (event) => {
  const train = document.getElementById("train");

  window.addCarriage = function () {
    if (carriageCount >= 7) {
      // ถ้า carriageCount เกิน 10 ไม่สร้างโบกี้เพิ่ม
      alert("ไม่สามารถเพิ่มโบกี้ได้อีกแล้ว เกินขีดจำกัด");
      return;
    }
    carriageCount++;
    const newCarriage = document.createElement("div");
    newCarriage.className = "carriage";
    newCarriage.setAttribute("draggable", true);
    newCarriage.id = "carriage" + carriageCount;
    newCarriage.textContent = "โบกี้ " + carriageCount;
    train.appendChild(newCarriage);
    addDragEvents(newCarriage);
  };

  const addDragEvents = (item) => {
    item.addEventListener("dragstart", (e) => {
      dragged = item;
      e.dataTransfer.setData("text/plain", item.id);
    });

    item.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    item.addEventListener("drop", (e) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData("text/plain");
      const draggedElement = document.getElementById(draggedId);
      const dropTarget = e.target;
      if (dropTarget.classList.contains("carriage")) {
        // แสดงข้อมูลเมื่อโบกี้ถูกวางทับ
        showOverlay(draggedElement, dropTarget);
      }
    });
  };

  // ฟังก์ชันแสดงข้อมูลเมื่อโบกี้ถูกวางทับ
  function showOverlay(draggedElement, dropTarget) {
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.textContent =
      " " +
      draggedElement.textContent +
      " ถูกวางทับอยู่หน้า " +
      dropTarget.textContent;
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.remove(); // ลบ overlay หลังจากแสดงข้อมูลไปเป็นเวลาสั้นๆ
    }, 20000); // เวลาในการแสดง overlay (milliseconds)
  }

  // จัดการกับการลากและวาง
  // (เพิ่มเหตุการณ์ dragover และ drop ตามตัวอย่างก่อนหน้า)
  train.addEventListener("dragover", (e) => {
    e.preventDefault(); // อนุญาตให้วาง
  });

  train.addEventListener("drop", (e) => {
    e.preventDefault();
    if (dragged && e.target.className === "carriage") {
      // หาโบกี้ที่อยู่ใกล้ที่สุดและวางโบกี้ที่ลากมาก่อนหรือหลัง
      const afterElement = getDragAfterElement(train, e.clientX);
      if (afterElement == null) {
        train.appendChild(dragged);
      } else {
        train.insertBefore(dragged, afterElement);
      }
    }
  });

  // ฟังก์ชันหาโบกี้ที่ควรจะวางโบกี้ที่ลากมาต่อหน้าหรือหลัง
  function getDragAfterElement(container, x) {
    const draggableElements = [
      ...container.querySelectorAll(".carriage:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

});

// เหตุการณ์ dragover และ drop สามารถเพิ่มตามตัวอย่างก่อนหน้า
