const createElement = (tag, id) => {
  const elem = document.createElement(tag);
  if (!!id) {
    elem.id = id;
  }
  return elem;
};

function debounce(callback, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  }

}

const response_display = document.getElementById('response');



const input_box = document.getElementById('card_number');

input_box.oninput = (e) => {
  if ((e.target.value.length) >= 6) {
    debounce(cardInfo(), 1500);
  }
}

// input_box.addEventListener(
//   "keyup",
//   console.log(input_box.value)
// );

// input_box.addEventListener(
//   "keyup",
//   debounce(cardInfo, 1500)
// );



function cardInfo() {
  const url = "http://localhost:8080/create";
  const options = {
    method: "POST",
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      let order_id = (data.id);
      const card_number = document.getElementById("card_number").value;
      let inaiInstance = window.inai.create({
        token: "sbx_ci_7kCbmGnJBYmC4TwUz1FA3FsWPnRKQG3gzCX4R87VDTsS",
        orderId: order_id,
        countryCode: "USA",
      });
      inaiInstance.getCardInfo(card_number)
        .then((res) => {
          response_display.textContent = (JSON.stringify(res));
        }).catch((error) => {
          response_display.textContent = (JSON.stringify(error));
        });
    });
}